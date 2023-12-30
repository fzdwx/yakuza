package main

import (
	"encoding/json"
	"fmt"
	"github.com/eric-song-nop/desktop"
	"github.com/fzdwx/iter"
	"github.com/fzdwx/iter/stream"
	"github.com/fzdwx/launcher/launcher-native/pkg/runhistory"
	"github.com/samber/lo"
	"net/http"
	"time"
)

type Application struct {
	Name        string `json:"name"`
	Icon        string `json:"icon"`
	Exec        string `json:"exec"`
	Terminal    bool   `json:"terminal"`
	Count       int64  `json:"count"`
	LastRunTime int64  `json:"lastRunTime"`
}

var applications []*Application

func (s *Server) ListApplication(w http.ResponseWriter, r *http.Request) {
	_ = json.NewEncoder(w).Encode(applications)
}

func (s *Server) refreshApplication() {
	go func() {
		s.doRefresh()
	}()
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ticker.C:
			s.doRefresh()
		}
	}
}

func (s *Server) doRefresh() {
	entries, err := desktop.Scan(desktop.DataDirs())
	if err != nil {
		fmt.Println(err)
		return
	}

	history, err := runhistory.Get()
	if err != nil {
		fmt.Println(err)
		return
	}

	array := stream.FlatMap[[]*Application, *Application](
		iter.Stream(stream.FlatMap[[]*desktop.Entry, []*Application](
			iter.Stream(entries),
			func(entries []*desktop.Entry) stream.Iterator[[]*Application] {
				return stream.Map[*desktop.Entry, []*Application](iter.Stream(entries), entryIntoApplications)
			},
		).ToArray()),
		func(apps []*Application) stream.Iterator[*Application] {
			return stream.Map[*Application, *Application](
				iter.Stream(apps),
				mapApplicationToAppWithHistory(history),
			)
		},
	).ToArray()

	newApplications := lo.UniqBy(array, func(item *Application) string {
		return item.Name
	})

	applications = newApplications
}

func entryIntoApplications(entry *desktop.Entry) []*Application {
	var apps []*Application
	apps = append(apps, &Application{
		Name:     entry.Name,
		Icon:     entry.Icon,
		Exec:     entry.Exec,
		Terminal: entry.Terminal,
	})
	for _, action := range entry.ActionEntries {
		var icon string
		if action.Icon == "" {
			icon = entry.Icon
		} else {
			icon = action.Icon
		}
		apps = append(apps, &Application{
			Name:     entry.Name + " " + action.Name,
			Icon:     icon,
			Exec:     action.Exec,
			Terminal: entry.Terminal,
		})
	}
	return apps
}

func mapApplicationToAppWithHistory(history *runhistory.RunHistory) func(entry *Application) *Application {
	var appMap map[string]runhistory.RunHistoryItem = nil
	if len(history.Items) > 0 {
		appMap = iter.Stream(history.Items).Filter(func(item runhistory.RunHistoryItem) bool {
			return item.RunType == "Application"
		}).ToMap(func(item runhistory.RunHistoryItem) string {
			return item.Name
		})
	}

	return func(application *Application) *Application {
		a := &Application{
			Name:     application.Name,
			Exec:     application.Exec,
			Icon:     application.Icon,
			Terminal: application.Terminal,
		}
		if appMap != nil {
			app := appMap[a.Name]
			a.Count = app.Count
			a.LastRunTime = app.LastRunTime
		}
		return a
	}
}
