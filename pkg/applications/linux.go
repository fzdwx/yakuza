//go:build linux

package applications

import (
	"changeme/pkg/filepath"
	"code.rocketnine.space/tslocum/desktop"
	"context"
	"encoding/json"
	"github.com/fzdwx/iter"
	"github.com/fzdwx/iter/stream"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

// List all applications
func List(ctx context.Context) ([]*Application, error) {
	apps, err := desktop.Scan(desktop.DataDirs())
	if err != nil {
		return nil, err
	}

	history, err := GetHistory(ctx)
	if err != nil {
		return nil, err
	}

	return stream.FlatMap[[]*desktop.Entry, *Application](
		iter.Stream(apps),
		func(entries []*desktop.Entry) stream.Iterator[*Application] {
			return stream.Map[*desktop.Entry, *Application](iter.Stream(entries), mapEntryToApplication(history))
		},
	).ToArray(), nil
}

func AddHistory(ctx context.Context, name string, runType string, cmd string) {
	history, err := GetHistory(ctx)
	if err != nil {
		return
	}

	history.Add(name, runType, cmd)
	bytes, err := json.Marshal(history)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to encode run history: %s", err.Error())
	}

	err = os.WriteFile(filepath.RunHistory(), bytes, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to write run history: %s", err.Error())
		return
	}
}

func GetHistory(ctx context.Context) (*RunHistory, error) {
	path := filepath.RunHistory()

	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to open run history file: %s", err.Error())
		return nil, err
	}
	defer file.Close()

	bytes, err := os.ReadFile(path)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to read run history: %s", err.Error())
		return nil, err
	}

	history := &RunHistory{}
	if len(bytes) > 0 {
		err = json.Unmarshal(bytes, history)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to decode run history: %s", err.Error())
			return nil, err
		}
	} else if len(bytes) == 0 {
		return history, nil
	}

	bytes, err = json.Marshal(history)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to encode run history: %s", err.Error())
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
