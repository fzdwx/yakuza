//go:build linux

package clip

import (
	"golang.design/x/clipboard"
	"os/exec"
	"strings"
)

func init() {
	err := clipboard.Init()
	if err != nil {
		panic(err)
	}
}

// Get returns the current selection from the clipboard
func Get() (string, error) {
	var (
		command = exec.Command("xclip", "-o")
		out     strings.Builder
	)

	command.Stdout = &out
	if err := command.Run(); err != nil {
		return "", err
	}

	return out.String(), nil
}

func Write(s string) {
	clipboard.Write(clipboard.FmtText, []byte(s))
}
