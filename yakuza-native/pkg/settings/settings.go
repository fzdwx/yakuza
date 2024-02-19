package settings

import (
	"github.com/fzdwx/yakuza/yakuza-native/pkg/fileutil"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/json"
	"os"
)

type Settings struct {
	Proxy string `json:"proxy"`
}

func Get() Settings {
	file, err := os.Open(fileutil.Settings())
	if err != nil {
		return Settings{}
	}

	var settings Settings
	err = json.DecodeFrom(file, &settings)
	if err != nil {
		return Settings{}
	}
	return settings
}

func Set(settings Settings) error {
	file, err := os.Create(fileutil.Settings())
	if err != nil {
		return err
	}

	return json.EncodeTo(file, settings)
}
