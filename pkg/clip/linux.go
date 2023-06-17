//go:build linux

package clip

import (
	"bytes"
	"os/exec"
	"strings"
)

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
	var (
		command = exec.Command("xclip", "-i", "-selection", "clipboard")
		input   bytes.Buffer
	)
	input.WriteString(s)
	command.Stdin = &input
	if err := command.Run(); err != nil {
		return
	}
}
