package main

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/sahilm/fuzzy"
	"github.com/samber/lo"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type File struct {
	Name  string    `json:"name"`
	IsDir bool      `json:"isDir"`
	Info  *FileInfo `json:"info"`
}

type FileInfo struct {
	Size    int64  `json:"size"`
	Mode    string `json:"mode"`
	ModTime int64  `json:"modTime"`
}

type FsManager struct {
	files  []fs.DirEntry
	path   string
	search string
}

func (m *FsManager) reset() {
	m.files = []fs.DirEntry{}
	dir, err := os.UserHomeDir()
	if err != nil {
		dir = "/"
	} else {
		dir = dir + "/"
	}
	m.path = dir
	m.search = dir
}

func (m *FsManager) list() {
	var err error
	m.files = nil

	// ReadDir already returns files and dirs sorted by filename.
	files, err := os.ReadDir(m.path)
	if err != nil {
		return
	}

	for _, file := range files {
		m.files = append(m.files, file)
	}
}

func (m *FsManager) toResp(search string) SearchFileSystemResp {
	var output []File
	var input = m.files
	if search != "" {
		names := lo.Map(m.files, func(item fs.DirEntry, index int) string {
			return item.Name()
		})

		matches := fuzzy.Find(search, names)
		input = lo.Map(matches, func(item fuzzy.Match, index int) fs.DirEntry {
			return input[item.Index]
		})
	}

	for _, file := range input {
		if file == nil {
			continue
		}
		f := File{
			Name:  file.Name(),
			IsDir: file.IsDir(),
		}
		output = append(output, f)
		if file.IsDir() == false {
			info, err := file.Info()
			if err != nil {
				continue
			}
			f.Info = &FileInfo{
				Size:    info.Size(),
				Mode:    info.Mode().String(),
				ModTime: info.ModTime().UnixMilli(),
			}
		}
	}

	return SearchFileSystemResp{
		Files: output,
		Path:  m.path,
	}
}

var fm = &FsManager{}

type SearchFileSystemReq struct {
	Initial bool   `json:"initial"`
	Search  string `json:"search"`
}

type SearchFileSystemResp struct {
	Files []File `json:"files"`
	Path  string `json:"path"`
}

func (s *Server) SearchFs(w http.ResponseWriter, r *http.Request) {
	var req SearchFileSystemReq
	err := json.DecodeFrom(r.Body, &req)
	if err != nil {
		s.writeErr(w, err)
		return
	}

	if req.Initial || req.Search == "~/" {
		fm.reset()
		fm.list()
	} else {
		fm.search = req.Search
		if strings.HasSuffix(fm.search, "/") {
			fileInfo, err := os.Stat(fm.search)
			if err == nil && fileInfo.IsDir() {
				fm.path = fm.search
				fm.list()
			}
		} else {
			path := trimLast(fm.search)
			if path != fm.path {
				fm.path = path
				fm.list()
			}
		}
	}

	err = json.EncodeTo(w, fm.toResp(trim(req.Search)))
	if err != nil {
		s.writeErr(w, err)
	}
}

func trim(search string) string {
	if strings.HasSuffix(search, "/") {
		return ""
	}
	return filepath.Base(search)
}

type ListFileSystemReq struct {
	Path string `json:"path"`
}

func (s *Server) ListFs(w http.ResponseWriter, r *http.Request) {
	var fm = &FsManager{}
	var req ListFileSystemReq
	err := json.DecodeFrom(r.Body, &req)
	if err != nil {
		s.writeErr(w, err)
		return
	}
	fm.path = req.Path
	fm.list()
	err = json.EncodeTo(w, fm.toResp(""))
	if err != nil {
		s.writeErr(w, err)
	}
}

type ReadFsReq struct {
	Path string `json:"path"`
}

func (s *Server) ReadFs(w http.ResponseWriter, r *http.Request) {
	var req ReadFsReq
	err := json.DecodeFrom(r.Body, &req)
	if err != nil {
		s.writeErr(w, err)
		return
	}
	file, err := os.Open(req.Path)
	if err != nil {
		s.writeErr(w, err)
		return
	}
	defer file.Close()

	bytes, err := io.ReadAll(io.LimitReader(file, 256*1024)) // prev 256KB
	if err != nil {
		s.writeErr(w, err)
		return
	}

	_, err = w.Write(bytes)
	if err != nil {
		s.writeErr(w, err)
	}
}

func trimLast(search string) string {
	index := strings.LastIndex(search, "/")
	if index == -1 {
		return "/"
	}
	return search[:index+1]
}
