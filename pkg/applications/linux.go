//go:build linux

package applications

import (
	"context"
	"encoding/json"
	"github.com/eric-song-nop/desktop"
	"github.com/fzdwx/iter"
	"github.com/fzdwx/iter/stream"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"launcher/pkg/fileutil"
	"os"
	"strings"
)

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

// List all applications
func List(ctx context.Context) ([]*Application, error) {
	entries, err := desktop.Scan(desktop.DataDirs())
	if err != nil {
		return nil, err
	}

	history, err := GetHistory(ctx)
	if err != nil {
		return nil, err
	}

	applications := stream.FlatMap[[]*desktop.Entry, []*Application](
		iter.Stream(entries),
		func(entries []*desktop.Entry) stream.Iterator[[]*Application] {
			return stream.Map[*desktop.Entry, []*Application](iter.Stream(entries), entryIntoApplications)
		},
	).ToArray()

	return stream.FlatMap[[]*Application, *Application](
		iter.Stream(applications),
		func(apps []*Application) stream.Iterator[*Application] {
			return stream.Map[*Application, *Application](
				iter.Stream(apps),
				mapApplicationToAppwithHistory(history),
			)
		},
	).ToArray(), nil

	// return stream.FlatMap[[]*desktop.Entry, *Application](
	// 	iter.Stream(entries),
	// 	func(entries []*desktop.Entry) stream.Iterator[*Application] {
	// 		return stream.Map[*desktop.Entry, *Application](iter.Stream(entries), mapEntryToApplication(history))
	// 	},
	// ).ToArray(), nil
}

func mapApplicationToAppwithHistory(history *RunHistory) func(entry *Application) *Application {
	var appMap map[string]RunHistoryItem = nil
	if len(history.Apps) > 0 {
		appMap = iter.Stream(history.Apps).ToMap(func(item RunHistoryItem) string {
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

func AddHistory(ctx context.Context, name string, runType string, cmd string, term bool) {
	if strings.TrimSpace(cmd) == "" {
		return
	}

	history, err := GetHistory(ctx)
	if err != nil {
		return
	}

	history.Add(name, runType, cmd, term)
	bytes, err := json.Marshal(history)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to encode run history: %s", err.Error())
	}

	err = os.WriteFile(fileutil.RunHistory(), bytes, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to write run history: %s", err.Error())
		return
	}
}

func GetHistory(ctx context.Context) (*RunHistory, error) {
	path := fileutil.RunHistory()
	history := &RunHistory{}

	err := fileutil.Read(ctx, path, history)
	if err != nil {
		return nil, err
	}

	return history, nil
}

func mapEntryToApplication(history *RunHistory) func(entry *desktop.Entry) *Application {
	var appMap map[string]RunHistoryItem = nil
	if len(history.Apps) > 0 {
		appMap = iter.Stream(history.Apps).ToMap(func(item RunHistoryItem) string {
			return item.Name
		})
	}

	return func(entry *desktop.Entry) *Application {
		a := &Application{
			Name:     entry.Name,
			Exec:     entry.Exec,
			Icon:     entry.Icon,
			Terminal: entry.Terminal,
		}
		if appMap != nil {
			app := appMap[a.Name]
			a.Count = app.Count
			a.LastRunTime = app.LastRunTime
		}
		return a
	}
}
