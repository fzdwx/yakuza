package main

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/samber/lo"
	"net/http"
	"os"
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
	var (
		req, err = json.DecodeFrom2[ExecCommandReq](r.Body)
		args     []string
		stdout   strings.Builder
		command  = ""
	)
	if err != nil {
		_, _ = w.Write([]byte(err.Error()))
		return
	}

	command = strings.TrimSpace(req.Command)
	if req.Terminal {
		args = append([]string{"-e"}, command)
		command = terminal
	} else {
		execute, err := exec.LookPath(command)
		if err != nil {
			args = append([]string{"-c"}, command)
			command = "/bin/sh"
		} else {
			command = execute
		}
	}

	args = append(args, req.Args...)
	cmd := exec.Command(command, args...)
	if req.Stdin != "" {
		cmd.Stdin = strings.NewReader(req.Stdin)
	}
	cmd.Stdout = &stdout
	cmd.Env = clean(os.Environ())

	err = cmd.Run()
	if err != nil {
		_, _ = w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte(stdout.String()))
}

var exclude = map[string]bool{
	"ARGV0": true,
}

func clean(environ []string) []string {
	return lo.Filter(environ, func(item string, index int) bool {
		return !exclude[strings.Split(item, "=")[0]]
	})
}
