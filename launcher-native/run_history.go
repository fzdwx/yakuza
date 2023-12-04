package main

import (
	"encoding/json"
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"net/http"
	"os"
	"strings"
	"time"
)

type AddRunHistoryReq struct {
	Name     string `json:"name"`
	RunType  string `json:"runType"`
	Cmd      string `json:"cmd"`
	Terminal bool   `json:"terminal"`
}

func (s *Server) AddRunHistory(writer http.ResponseWriter, request *http.Request) {
	var req AddRunHistoryReq
	err := json.NewDecoder(request.Body).Decode(&req)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Cmd) == "" {
		return
	}

	history, err := GetHistory()
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	history.Add(req.Name, req.RunType, req.Cmd, req.Terminal)
	bytes, err := json.Marshal(history)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	err = os.WriteFile(fileutil.RunHistory(), bytes, os.ModePerm)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

func GetHistory() (*RunHistory, error) {
	path := fileutil.RunHistory()
	history := &RunHistory{}

	err := fileutil.Read(path, history)
	if err != nil {
		return nil, err
	}

	return history, nil
}

type RunHistory struct {
	Apps  []RunHistoryItem `json:"apps"`
	Shell []RunHistoryItem `json:"shell"`
}

func (h *RunHistory) Add(name, runType, cmd string, term bool) {
	if runType == "shell" {
		h.addShell(name, cmd, term)
	} else {
		h.addApps(name, cmd, term)
	}
}

func (h *RunHistory) addApps(name, cmd string, term bool) {
	milli := time.Now().UnixMilli()
	for i, item := range h.Apps {
		if item.Name == name && item.Cmd == cmd {
			h.Apps[i].Count++
			h.Apps[i].LastRunTime = milli
			h.Apps[i].Terminal = term
			return
		}
	}

	h.Apps = append(h.Apps, RunHistoryItem{
		Name:        name,
		Cmd:         cmd,
		Terminal:    term,
		Count:       1,
		LastRunTime: milli,
	})
}

func (h *RunHistory) addShell(name string, cmd string, term bool) {
	milli := time.Now().UnixMilli()
	for i, item := range h.Shell {
		if item.Name == name && item.Cmd == cmd {
			h.Shell[i].Count++
			h.Shell[i].LastRunTime = milli
			h.Shell[i].Terminal = term
			return
		}
	}

	h.Shell = append(h.Shell, RunHistoryItem{
		Name:        name,
		Cmd:         cmd,
		Count:       1,
		Terminal:    term,
		LastRunTime: milli,
	})
}

type RunHistoryItem struct {
	Name        string `json:"name"`
	Cmd         string `json:"cmd"`
	Terminal    bool   `json:"terminal"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
}
