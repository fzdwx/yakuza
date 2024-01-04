package main

import (
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
	Stdin    string   `json:"stdin"`
}

func has(name string) bool {
	_, err := exec.LookPath(name)
	return err == nil
}

func (s *Server) ExecCommand(w http.ResponseWriter, r *http.Request) {
	var req = ExecCommandReq{}
	_ = json.NewDecoder(r.Body).Decode(&req)

	command := strings.TrimSpace(req.Command)
  var args []string
	if req.Terminal {
		args = append([]string{"-e"}, command)
		command = terminal
	} else {
		args = append([]string{"-c"}, command)
		command = "sh"
	}

	var stdout strings.Builder
  
	cmd := exec.Command(command, args...)
	if req.Stdin != "" {
		cmd.Stdin = strings.NewReader(req.Stdin)
	}
	cmd.Stdout = &stdout

	err := cmd.Run()
	if err != nil {
		_, _ = w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte(stdout.String()))
}
