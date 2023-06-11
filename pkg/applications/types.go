package applications

import "time"

type RunHistory struct {
	Apps  []RunHistoryItem `json:"apps"`
	Shell []RunHistoryItem `json:"shell"`
}

func (h *RunHistory) Add(name string, runType, cmd string) {
	if runType == "shell" {
		h.addShell(name, cmd)
	} else {
		h.addApps(name, cmd)
	}
}

func (h *RunHistory) addApps(name, cmd string) {
	milli := time.Now().UnixMilli()
	for i, item := range h.Apps {
		if item.Name == name && item.Cmd == cmd {
			h.Apps[i].Count++
			h.Apps[i].LastRunTime = milli
			return
		}
	}

	h.Apps = append(h.Apps, RunHistoryItem{
		Name:        name,
		Cmd:         cmd,
		Count:       1,
		LastRunTime: milli,
	})
}

func (h *RunHistory) addShell(name string, cmd string) {
	milli := time.Now().UnixMilli()
	for i, item := range h.Shell {
		if item.Name == name && item.Cmd == cmd {
			h.Shell[i].Count++
			h.Shell[i].LastRunTime = milli
			return
		}
	}

	h.Shell = append(h.Shell, RunHistoryItem{
		Name:        name,
		Cmd:         cmd,
		Count:       1,
		LastRunTime: milli,
	})
}

type RunHistoryItem struct {
	Name        string `json:"name"`
	Cmd         string `json:"cmd"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
}
