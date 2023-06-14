package extensions

import (
	"fmt"
	"path/filepath"
	"testing"
)

func TestInstall(t *testing.T) {
	fmt.Println(Install(Extension{
		GitUrl: "https://github.com/fzdwx/launcher-github-repository-search.git",
		Author: "fzdwx",
	}))
}

func TestQwe(t *testing.T) {
	url := "https://github.com/fzdwx/launcher-github-repository-search.git"
	base := filepath.Base(url)
	fmt.Println(base)
	fmt.Println(filepath.Ext(base))
}

func TestWaik(t *testing.T) {
	fmt.Println(installed)
}
