package extension

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/samber/lo"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

func (e *Manager) ListRemoteExtension() []*RemoteExtensionResp {
	return lo.Map(e.remoteExtensions, func(extension *RemoteExtension, i int) *RemoteExtensionResp {
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
}

func (e *Manager) ListLocalExtensionWithoutAction() []*LocalExtension {
	return lo.Map(e.localExtensions, func(item *LocalExtension, index int) *LocalExtension {
		item.Shortcut = e.shortManager.GetShortCut("Extension", fmt.Sprintf("%s-%s", item.Author, item.Name))
		return item
	})
}

func (e *Manager) ListLocalExtension() []*LocalExtension {
	return lo.FlatMap(lo.Map(e.localExtensions, func(item *LocalExtension, index int) *LocalExtension {
		item.Shortcut = e.shortManager.GetShortCut("Extension", fmt.Sprintf("%s-%s", item.Author, item.Name))
		return item
	}), func(item *LocalExtension, index int) []*LocalExtension {
		var extensions = []*LocalExtension{item}
		extensions = append(extensions, lo.Map(item.Actions, func(action RemoteAction, i int) *LocalExtension {
			ext := &LocalExtension{
				RemoteExtension: item.RemoteExtension,
				FullPath:        item.FullPath,
				DirName:         item.DirName,
				Action:          action,
			}
			ext.Name = action.Name
			ext.Shortcut = e.shortManager.GetShortCut("Extension", fmt.Sprintf("%s-%s", item.Author, item.Name))
			return ext
		})...)
		return extensions
	})
}

func (e *Manager) CurrentExt() *LocalExtension {
	return e.currentExtension
}

func (e *Manager) ChangeExtension(path string) {
	find, _ := lo.Find(e.localExtensions, func(localExtension *LocalExtension) bool {
		return localExtension.FullPath == path
	})

	e.currentExtension = find
}

func (e *Manager) InstallExtension(extension RemoteExtension) error {
	sum := md5.Sum([]byte(extension.Github + extension.Author + extension.Name))
	dest := filepath.Join(fileutil.Extensions(), hex.EncodeToString(sum[:]))
	err := func() error {
		_, err := git.PlainClone(dest, false, &git.CloneOptions{
			URL: extension.Github,
		})
		if err != nil {
			return err
		}

		file, err := os.Create(filepath.Join(dest, ".git", "extension.json"))
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

func (e *Manager) Upgrade(ext *LocalExtension) (*object.Commit, error) {
	err := e.upgradeExtensionJson(ext)
	if err != nil {
		return nil, err
	}

	r, err := git.PlainOpen(ext.FullPath)
	if err != nil {
		return nil, err
	}

	w, err := r.Worktree()
	if err != nil {
		return nil, err
	}

	err = w.Pull(&git.PullOptions{RemoteName: "origin"})
	if err != nil {
		return nil, err
	}

	// Print the latest commit that was just pulled
	ref, err := r.Head()
	if err != nil {
		return nil, err
	}
	commit, err := r.CommitObject(ref.Hash())
	if err != nil {
		return nil, err
	}

	return commit, nil
}

func (e *Manager) upgradeExtensionJson(ext *LocalExtension) error {
	remote := e.getRemoteExtension(ext)
	if remote == nil {
		return fmt.Errorf("remote extension not found")
	}
	extensionFile := filepath.Join(ext.FullPath, ".git", "extension.json")
	f, err := os.OpenFile(extensionFile, os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	if err != nil {
		return err
	}

	return json.NewEncoder(f).Encode(remote)
}

func (e *Manager) RefreshExtension() {
	go func() {
		e.RefreshLocal()
		e.doRefreshRemote()
	}()

	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ticker.C:
			go e.doRefreshRemote()
			go e.RefreshLocal()
		}
	}
}

func (e *Manager) Refresh() {
	e.RefreshLocal()
	e.doRefreshRemote()
}

func (e *Manager) doRefreshRemote() {
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

func (e *Manager) RefreshLocal() {
	dir := fileutil.Extensions()
	entries, err := fs.ReadDir(os.DirFS(dir), ".")
	if err != nil {
		fmt.Println(err)
		return
	}

	var extensions []*LocalExtension
	for i := range entries {
		entry := entries[i]
		fullPath := filepath.Join(dir, entry.Name(), ".git", "extension.json")
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
