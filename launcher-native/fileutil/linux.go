//go:build linux

package fileutil

import (
	"os"
	"path/filepath"
)

var (
	base = filepath.Join(os.Getenv("HOME"), ".config", "launcher")
)

func init() {
	_ = os.MkdirAll(base, os.ModePerm)
	_ = os.MkdirAll(Extensions(), os.ModePerm)
}

func RunHistory() string {
	return filepath.Join(base, "run_history.json")
}

func Config() string {
	return filepath.Join(base, "config.json")
}

func Extensions() string {
	return filepath.Join(base, "extensions")
}
