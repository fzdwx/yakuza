package fileutil

import (
	"encoding/json"
	"os"
)

func Write[T any](path string, v T) error {
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
