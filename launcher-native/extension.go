package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"github.com/go-git/go-git/v5"
	"github.com/samber/lo"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type RemoteExtension struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Icon        string `json:"icon"`
	GitUrl      string `json:"giturl"`
}

type RemoteExtensionResp struct {
	RemoteExtension
	Installed bool `json:"installed"`
}

type LocalExtension struct {
	RemoteExtension

	FullPath string `json:"fullPath"`
	DirName  string `json:"dirName"`
}

var (
	remoteExtensions []*RemoteExtension
	localExtensions  []*LocalExtension
	currentExtension *LocalExtension
)

func (s *Server) ServeExtension(writer http.ResponseWriter, request *http.Request) {
	fullPath := request.URL.Query().Get("ext")
	if len(fullPath) > 0 {
		changeExtension(fullPath)
	}
	if currentExtension == nil {
		return
	}

	dir := filepath.Join(currentExtension.FullPath, "dist")
	http.FileServer(http.Dir(dir)).ServeHTTP(writer, request)
}

func (s *Server) ListLocalExtension(w http.ResponseWriter, r *http.Request) {
	err := json.NewEncoder(w).Encode(localExtensions)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "encode json:%v", err)
		return
	}
}

func (s *Server) ListRemoteExtension(w http.ResponseWriter, r *http.Request) {
	resps := lo.Map(remoteExtensions, func(extension *RemoteExtension, i int) *RemoteExtensionResp {
		return &RemoteExtensionResp{
			RemoteExtension: *extension,
			Installed: lo.ContainsBy(localExtensions, func(localExtension *LocalExtension) bool {
				return localExtension.Name == extension.Name
			}),
		}
	})

	err := json.NewEncoder(w).Encode(resps)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "encode json:%v", err)
		return
	}
}

func (s *Server) InstallExtension(w http.ResponseWriter, r *http.Request) {
	var remoteExtension RemoteExtension
	err := json.NewDecoder(r.Body).Decode(&remoteExtension)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "decode json:%v", err)
		return
	}

	err = doInstallExtension(remoteExtension)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "install extension:%v", err)
		return
	}
}

func doInstallExtension(extension RemoteExtension) error {
	sum := md5.Sum([]byte(extension.GitUrl + extension.Author + extension.Name))
	dest := filepath.Join(fileutil.Extensions(), hex.EncodeToString(sum[:]))

	_, err := git.PlainClone(dest, false, &git.CloneOptions{
		URL: extension.GitUrl,
	})

	if err != nil {
		file, err := os.Create(filepath.Join(dest, "extension.json"))
		if err != nil {
			return err
		}

		return json.NewEncoder(file).Encode(extension)
	}
	return err
}

func (s *Server) refreshExtension() {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ticker.C:
			s.doRefreshRemote()
			s.doRefreshLocal()
		}
	}
}

func (s *Server) doRefreshRemote() {
	resp, err := http.Get("https://raw.githubusercontent.com/fzdwx/launcher-extension/main/extensions.json")
	if err != nil {
		fmt.Println(err)
		return
	}

	var extensions []*RemoteExtension
	err = json.NewDecoder(resp.Body).Decode(&extensions)
	if err != nil {
		fmt.Println(err)
		return
	}

	remoteExtensions = extensions
}

func (s *Server) doRefreshLocal() {
	dir := fileutil.Extensions()
	entries, err := fs.ReadDir(os.DirFS(dir), ".")
	if err != nil {
		fmt.Println(err)
		return
	}

	var extensions []*LocalExtension
	for i := range entries {
		entry := entries[i]
		fullPath := filepath.Join(dir, entry.Name(), "extension.json")
		file, err := os.Open(fullPath)
		if err != nil {
			fmt.Println(err)
			continue
		}
		var extension LocalExtension
		err = json.NewDecoder(file).Decode(&extension)
		if err != nil {
			fmt.Println(err)
			continue
		}

		extension.FullPath = filepath.Join(dir, entry.Name())
		extension.DirName = entry.Name()
		extensions = append(extensions, &extension)
	}

	localExtensions = extensions
}

func changeExtension(path string) {
	find, _ := lo.Find(localExtensions, func(localExtension *LocalExtension) bool {
		return localExtension.FullPath == path
	})

	currentExtension = find
}
