package assets

import (
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/fileutil"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"os"
)

type Config struct {
	Plat string       `json:"plat"`
	Cfg  GithubConfig `json:"cfg"`
}

type GithubConfig struct {
	Repo  string `json:"repo"`
	Token string `json:"token"`
}

func StoreConfig(config *Config) error {
	f, err := os.Create(fileutil.Assets())
	if err != nil {
		return fmt.Errorf("create file: %w", err)
	}
	defer f.Close()

	err = json.EncodeTo(f, config)
	if err != nil {
		return fmt.Errorf("encode json: %w", err)
	}

	return nil
}

func LoadConfig() (*Config, error) {
	f, err := os.Open(fileutil.Assets())
	if err != nil {
		return nil, fmt.Errorf("open file: %w", err)
	}
	defer f.Close()

	var config Config
	err = json.DecodeFrom(f, &config)
	if err != nil {
		return nil, fmt.Errorf("decode json: %w", err)
	}

	return &config, nil
}
