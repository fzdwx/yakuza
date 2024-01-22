package main

import (
	"fmt"
	"testing"
)

func TestA(t *testing.T) {
	server := Server{}

	server.doRefreshLocal()
	fmt.Println(localExtensions)
}

func TestServer_InstallExtension(t *testing.T) {
	server := Server{}
	fmt.Println(server.doInstallExtension(RemoteExtension{
		Name:        "Github repository search",
		Description: "Search repositories on Github",
		Author:      "fzdwx",
		Icon:        "https://raw.githubusercontent.com/fzdwx/launcher-github-repository-search/main/public/logo.png",
		GitUrl:      "https://github.com/fzdwx/launcher-github-repository-search.git",
	}))
}
