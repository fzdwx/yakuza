package main

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"io/fs"
	"net/http"
	"os"
	"strings"
)

type ListFileSystemReq struct {
	Initial bool   `json:"initial"`
	Search  string `json:"search"`
}

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

type ListFileSystemResp struct {
	Files []File `json:"files"`
	Path  string `json:"path"`
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

func (m *FsManager) toResp() ListFileSystemResp {
	var files = []File{}
	for _, file := range m.files {
		f := File{
			Name:  file.Name(),
			IsDir: file.IsDir(),
		}
		files = append(files, f)
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

	return ListFileSystemResp{
		Files: files,
		Path:  m.path,
	}
}

var fm = &FsManager{}

func (s *Server) List(w http.ResponseWriter, r *http.Request) {
	var req ListFileSystemReq
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

	err = json.EncodeTo(w, fm.toResp())
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
