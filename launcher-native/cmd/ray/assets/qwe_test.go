package assets_test

import (
	"encoding/base64"
	"os"
	"testing"
)

func TestName(t *testing.T) {
	file, err := os.ReadFile("/home/like/workspaces/launcher/.github/img.png")
	if err != nil {
		return
	}
	var out = make([]byte, base64.StdEncoding.EncodedLen(len(file)))
	base64.StdEncoding.Encode(out, file)

	os.WriteFile("/home/like/workspaces/launcher/.github/img.txt", out, 0644)
}
