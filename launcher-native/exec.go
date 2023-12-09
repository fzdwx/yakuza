package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os/exec"
	"strings"
)

var terminal = "konsole"

func init() {
	var terminalNames = []string{
		"wezterm",
		"kitty",
		"konsole",
		"gnome-terminal",
		"st",
	}

	for _, name := range terminalNames {
		if has(name) {
			terminal = name
			break
		}
	}
}

type ExecCommandReq struct {
	Command  string   `json:"command"`
	Args     []string `json:"args"`
	Terminal bool     `json:"terminal"`
}

func has(name string) bool {
	_, err := exec.LookPath(name)
	return err == nil
}

func (s *Server) ExecCommand(w http.ResponseWriter, r *http.Request) {
	var req = ExecCommandReq{}
	_ = json.NewDecoder(r.Body).Decode(&req)

	stdout := bytes.Buffer{}
	command := strings.TrimSpace(req.Command)
	args := req.Args
	if req.Terminal {
		args = append([]string{"-e", command}, req.Args...)
		command = terminal
	}

	cmd := exec.Command(command, args...)

	cmd.Stdout = &stdout
	err := cmd.Start()
	if err != nil {
		_, _ = w.Write([]byte(err.Error()))
		return
	}
}
