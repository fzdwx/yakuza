package extensions

import (
	"encoding/json"
	"github.com/pkg/errors"
	"golang.org/x/sys/execabs"
	"launcher/pkg/fileutil"
	"os"
	"path/filepath"
	"time"
)

var (
	installed = make(map[string]Extension)
)

func init() {
	go func() {
		for {
			_ = walk()
			time.Sleep(5 * time.Second)
		}
	}()
}

func walk() error {
	names, err := fileutil.ListDirNames(fileutil.Extensions())
	if err != nil {
		return err
	}
	for _, name := range names {
		bytes, err := os.ReadFile(filepath.Join(fileutil.Extensions(), name, "package.json"))
		if err != nil {
			return errors.Wrapf(err, "read package.json error, dir: %s", name)
		}

		ext, err := parseExtension(bytes)
		if err != nil {
			return errors.Wrapf(err, "parse package.json error, dir: %s", name)
		}
		installed[ext.Name] = ext
	}
	return nil
}

func Install(ext Extension) (bool, error) {
	extensionDir := filepath.Join(fileutil.Extensions(), ext.Dir())
	if CheckInstalled(ext) {
		return false, errors.New("extension already installed")
	}

	err := execabs.Command("git", "clone", ext.GitUrl, extensionDir).Run()
	if err != nil {
		return false, err
	}
	installed[ext.Name] = ext
	return true, nil
}

func CheckInstalled(ext Extension) bool {
	extensionDir := filepath.Join(fileutil.Extensions(), ext.Dir())
	stat, _ := os.Stat(extensionDir)
	if stat != nil && stat.IsDir() {
		return true
	}
	return false
}

func parseExtension(bytes []byte) (Extension, error) {
	var ext launcher
	err := json.Unmarshal(bytes, &ext)
	if err != nil {
		return ext.Launcher, err
	}
	return ext.Launcher, err
}
