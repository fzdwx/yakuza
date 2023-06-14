package extensions

import (
	"path/filepath"
	"strings"
)

type ListReq struct {
	SearchText string `json:"searchText"`
	//Page  int `json:"page"`
	//Limit int `json:"limit"`
}

type ListResp struct {
	Total int         `json:"total"`
	Items []Extension `json:"items"`
}

type Extension struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Icon        string `json:"icon"`
	GitUrl      string `json:"giturl"`
	Installed   bool   `json:"installed"`

	//
	Path string `json:"path"`
}

type launcher struct {
	Launcher Extension `json:"launcher"`
}

func (e Extension) Dir() string {
	base := filepath.Base(e.GitUrl)
	return strings.TrimSuffix(base, filepath.Ext(base))
}

type ExtensionSource []Extension

func (e ExtensionSource) String(i int) string {
	return e[i].Name
}

func (e ExtensionSource) Len() int {
	return len(e)
}
