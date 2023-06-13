package config

import (
	"context"
	"launcher/pkg/fileutil"
)

func Get(ctx context.Context) (map[string]any, error) {
	path := fileutil.Config()
	config := make(map[string]any)

	err := fileutil.Read(ctx, path, &config)
	if err != nil {
		return nil, err
	}

	return config, nil
}

func Set(ctx context.Context, key string, val any) error {
	config, err := Get(ctx)
	if err != nil {
		return err
	}

	config[key] = val
	path := fileutil.Config()
	return fileutil.Write(ctx, path, config)
}
