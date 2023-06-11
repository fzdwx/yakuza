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
	"io"
	"os"
)

// List all applications
func List() ([]*desktop.Entry, error) {
	apps, err := desktop.Scan(desktop.DataDirs())
	if err != nil {
		return nil, err
	}

	return stream.FlatMap[[]*desktop.Entry, *desktop.Entry](
		iter.Stream(apps),
		func(entries []*desktop.Entry) stream.Iterator[*desktop.Entry] {
			return iter.Stream(entries)
		},
	).ToArray(), nil
}

func AddHistory(ctx context.Context, name string, runType string, cmd string) {
	path := filepath.RunHistory()

	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to open run history file: %s", err.Error())
		return
	}
	defer file.Close()

	bytes, err := os.ReadFile(path)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to read run history: %s", err.Error())
		return
	}

	history := &RunHistory{}
	if len(bytes) > 0 {
		err = json.Unmarshal(bytes, history)
		if err != nil && err != io.EOF {
			runtime.LogErrorf(ctx, "Failed to decode run history: %s", err.Error())
			return
		}
	}

	history.Add(name, runType, cmd)
	bytes, err = json.Marshal(history)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to encode run history: %s", err.Error())
	}

	err = os.WriteFile(path, bytes, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to write run history: %s", err.Error())
		return
	}
}
