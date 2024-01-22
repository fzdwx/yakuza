package fileutil

import (
	"errors"
	"os"
)

func IsExist(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false
}

func ListDirNames(path string) ([]string, error) {
	if !IsExist(path) {
		return []string{}, nil
	}

	fs, err := os.ReadDir(path)
	if err != nil {
		return []string{}, err
	}

	sz := len(fs)
	if sz == 0 {
		return []string{}, nil
	}

	var result []string
	for i := 0; i < sz; i++ {
		if fs[i].IsDir() {
			result = append(result, fs[i].Name())
		}
	}

	return result, nil
}
