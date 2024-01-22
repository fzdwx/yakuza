package shortcuts

import (
	fileutil2 "github.com/fzdwx/yakuza/yakuza-native/pkg/fileutil"
)

type ShortCut struct {
	Kind     string `json:"kind"`
	ShortCut string `json:"shortcut"`
	Name     string `json:"name"`
	Item     any    `json:"item"`
}

func load() []ShortCut {
	var sc []ShortCut
	err := fileutil2.Read(fileutil2.Shortcuts(), &sc)
	if err != nil {
		return []ShortCut{}
	}
	return sc
}
