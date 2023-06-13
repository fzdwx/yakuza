package fileutil

import (
	"context"
	"encoding/json"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

func Read[T any](ctx context.Context, path string, v T) error {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to open run history file: %s", err.Error())
		return err
	}
	defer file.Close()

	bytes, err := os.ReadFile(path)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to read run history: %s", err.Error())
		return err
	}

	if len(bytes) > 0 {
		err = json.Unmarshal(bytes, v)
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to decode run history: %s", err.Error())
			return err
		}
	} else if len(bytes) == 0 {
		return nil
	}

	bytes, err = json.Marshal(v)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to encode run history: %s", err.Error())
		return err
	}

	return nil
}
