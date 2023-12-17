package json

import (
	"encoding/json"
	"io"
)

func Encode[T any](v T) string {
	bytes, err := json.Marshal(v)
	if err != nil {
		return ""
	}
	return string(bytes)
}

func DecodeFrom[T any](read io.Reader, v T) error {
	return json.NewDecoder(read).Decode(v)
}
