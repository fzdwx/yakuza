package applications

import "time"

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

type Application struct {
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Exec        string `json:"Exec"`
	Terminal    bool   `json:"terminal"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
}
