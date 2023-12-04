package fileutil

import (
	"encoding/json"
	"os"
)

func Read[T any](path string, v T) error {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, os.ModePerm)
	if err != nil {
		return err
	}
	defer file.Close()

	bytes, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	if len(bytes) > 0 {
		err = json.Unmarshal(bytes, v)
		if err != nil {
			return err
		}
	} else if len(bytes) == 0 {
		return nil
	}

	bytes, err = json.Marshal(v)
	if err != nil {
		return err
	}

	return nil
}
