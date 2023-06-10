package clip

import (
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
