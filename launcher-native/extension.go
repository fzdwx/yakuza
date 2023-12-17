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
	Github      string `json:"github"`
}

type RemoteExtensionResp struct {
	RemoteExtension
	Installed bool   `json:"installed"`
	FullPath  string `json:"fullPath"`
}

type LocalExtension struct {
	RemoteExtension

	FullPath string `json:"fullPath"`
	DirName  string `json:"dirName"`
	Hotkey   string `json:"hotkey"`
}

type ExtensionManager struct {
	remoteExtensions []*RemoteExtension
	localExtensions  []*LocalExtension
	currentExtension *LocalExtension
}

func NewExtensionManager() *ExtensionManager {
	return &ExtensionManager{
		remoteExtensions: []*RemoteExtension{},
		localExtensions:  []*LocalExtension{},
	}
}

func (e *ExtensionManager) ServeExtension(writer http.ResponseWriter, request *http.Request) {
	fullPath := request.URL.Query().Get("ext")
	if len(fullPath) > 0 {
		e.changeExtension(fullPath)
	}
	if e.currentExtension == nil {
		return
	}

	dir := filepath.Join(e.currentExtension.FullPath, "dist")
	http.FileServer(http.Dir(dir)).ServeHTTP(writer, request)
}

func (e *ExtensionManager) ListLocalExtension(w http.ResponseWriter, r *http.Request) {
	_ = json.NewEncoder(w).Encode(e.localExtensions)
}

func (e *ExtensionManager) ListRemoteExtension(w http.ResponseWriter, r *http.Request) {
	resps := lo.Map(e.remoteExtensions, func(extension *RemoteExtension, i int) *RemoteExtensionResp {
		localExtension, has := lo.Find(e.localExtensions, func(localExtension *LocalExtension) bool {
			return localExtension.Name == extension.Name
		})

		if has {
			return &RemoteExtensionResp{
				RemoteExtension: *extension,
				Installed:       has,
				FullPath:        localExtension.FullPath,
			}
		}
		return &RemoteExtensionResp{RemoteExtension: *extension}
	})

	err := json.NewEncoder(w).Encode(resps)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "encode json:%v", err)
		return
	}
}

func (e *ExtensionManager) InstallExtension(w http.ResponseWriter, r *http.Request) {
	var remoteExtension RemoteExtension
	err := json.NewDecoder(r.Body).Decode(&remoteExtension)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "decode json:%v", err)
		return
	}

	err = e.doInstallExtension(remoteExtension)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "install extension:%v", err)
		return
	}

	fmt.Fprintf(w, "install success")
}

func (e *ExtensionManager) doInstallExtension(extension RemoteExtension) error {
	sum := md5.Sum([]byte(extension.Github + extension.Author + extension.Name))
	dest := filepath.Join(fileutil.Extensions(), hex.EncodeToString(sum[:]))
	err := func() error {
		_, err := git.PlainClone(dest, false, &git.CloneOptions{
			URL: extension.Github,
		})
		if err != nil {
			return err
		}

		file, err := os.Create(filepath.Join(dest, "extension.json"))
		if err != nil {
			return err
		}
		defer file.Close()

		err = json.NewEncoder(file).Encode(extension)
		if err != nil {
			return err
		}

		return nil
	}()
	if err != nil {
		_ = os.RemoveAll(dest)
		return err
	}

	return nil
}

func (e *ExtensionManager) refreshExtension() {
	go func() {
		e.doRefreshLocal()
		e.doRefreshRemote()
	}()

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ticker.C:
			go e.doRefreshRemote()
			go e.doRefreshLocal()
		}
	}
}

func (e *ExtensionManager) doRefreshRemote() {
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

	if len(extensions) == 0 {
		return
	}

	e.remoteExtensions = extensions
}

func (e *ExtensionManager) doRefreshLocal() {
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

	e.localExtensions = extensions
}

func (e *ExtensionManager) changeExtension(path string) {
	find, _ := lo.Find(e.localExtensions, func(localExtension *LocalExtension) bool {
		return localExtension.FullPath == path
	})

	e.currentExtension = find
}
