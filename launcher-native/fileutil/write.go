package fileutil

import (
	"context"
	"encoding/json"
	"os"
)

func Write[T any](ctx context.Context, path string, v T) error {
	bytes, err := json.Marshal(v)
	if err != nil {
		return err
	}
	err = os.WriteFile(path, bytes, os.ModePerm)
	if err != nil {
		return err
	}

	return nil
}
