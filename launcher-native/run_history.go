package main

import (
	"encoding/json"
	"github.com/fzdwx/launcher/launcher-native/pkg/fileutil"
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
	Items []RunHistoryItem `json:"items"`
}

func (h *RunHistory) Add(name, runType, cmd string, term bool) {
	milli := time.Now().UnixMilli()
	for i, item := range h.Items {
		if item.Name == name && item.Cmd == cmd && item.RunType == runType {
			h.Items[i].Count++
			h.Items[i].LastRunTime = milli
			h.Items[i].Terminal = term
			return
		}
	}

	h.Items = append(h.Items, RunHistoryItem{
		Name:        name,
		Cmd:         cmd,
		Terminal:    term,
		RunType:     runType,
		Count:       1,
		LastRunTime: milli,
	})
}

type RunHistoryItem struct {
	Name        string `json:"name"`
	RunType     string `json:"runType"`
	Cmd         string `json:"cmd"`
	Terminal    bool   `json:"terminal"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
}
