package runhistory

import (
	"github.com/fzdwx/yakuza/yakuza-native/pkg/fileutil"
	"github.com/samber/lo"
	"time"
)

func Get() (*RunHistory, error) {
	path := fileutil.RunHistory()
	history := &RunHistory{}

	err := fileutil.Read(path, history)
	if err != nil {
		return nil, err
	}

	return history, nil
}

const ExtensionRunType = "Extension"
const BuiltinRunType = "Builtin"

func GetExtensionHistory() map[string]RunHistoryItem {
	return GetByType(ExtensionRunType)
}

func GetBuiltinHistory() map[string]RunHistoryItem {
	return GetByType(BuiltinRunType)
}

func GetByType(t string) map[string]RunHistoryItem {
	history, err := Get()
	if err != nil {
		return map[string]RunHistoryItem{}
	}

	return lo.SliceToMap(lo.Filter(history.Items, func(item RunHistoryItem, index int) bool {
		return item.RunType == t
	}), func(item RunHistoryItem) (string, RunHistoryItem) {
		return item.Name, item
	})
}

type RunHistory struct {
	Items []RunHistoryItem `json:"items"`
}

type RunHistoryItem struct {
	Name        string `json:"name"`
	RunType     string `json:"runType"`
	Cmd         string `json:"cmd"`
	Terminal    bool   `json:"terminal"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
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
