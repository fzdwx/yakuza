//go:build linux

package filepath

import (
	"os"
	"path/filepath"
)

var (
	base = filepath.Join(os.Getenv("HOME"), ".config", "launcher")
)

func init() {
	_ = os.MkdirAll(base, 0755)
}

func RunHistory() string {
	return filepath.Join(base, "run_history.json")
}
