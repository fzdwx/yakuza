//go:build linux

package fileutil

import (
	"os"
	"path/filepath"
)

var (
	base = filepath.Join(os.Getenv("HOME"), ".config", "yakuza")
)

func init() {
	_ = os.MkdirAll(base, os.ModePerm)
	_ = os.MkdirAll(ExtensionsDir(), os.ModePerm)
	_ = os.MkdirAll(ConfigDir(), os.ModePerm)
}

func RunHistory() string {
	return filepath.Join(base, "run_history.json")
}

func ConfigDir() string {
	return filepath.Join(base, "config")
}

func Assets() string {
	return filepath.Join(base, "assets.json")
}

func Shortcuts() string {
	return filepath.Join(base, "shortcuts.json")
}

func ExtensionsDir() string {
	return filepath.Join(base, "extensions")
}
