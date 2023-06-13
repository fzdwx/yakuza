package fileutil

import (
	"context"
	"encoding/json"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

func Write[T any](ctx context.Context, path string, v T) error {
	bytes, err := json.Marshal(v)
	if err != nil {
		return err
	}
	err = os.WriteFile(path, bytes, os.ModePerm)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to write %s: %s", path, err.Error())
		return err
	}

	return nil
}
