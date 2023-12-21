package shortcuts

import (
	"github.com/fzdwx/launcher/launcher-native/fileutil"
)

type ShortCut struct {
	Kind     string `json:"kind"`
	ShortCut string `json:"shortcut"`
	Name     string `json:"name"`
	Item     any    `json:"item"`
}

func load() []ShortCut {
	var sc []ShortCut
	err := fileutil.Read(fileutil.Shortcuts(), &sc)
	if err != nil {
		return []ShortCut{}
	}
	return sc
}
