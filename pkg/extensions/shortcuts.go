package extensions

import (
	"context"
	"launcher/pkg/config"
)

const key = "shortcuts"

func SetShortcut(ctx context.Context, shortcut string, name string) {
	cfg, err := config.Get(ctx)
	if err != nil {
		return
	}

	val := cfg[key]
	if val == nil {
		val = make(map[string]string)
	}
	// todo 传入类型, 在注册快捷键的时候根据类型进行判断
	// 1. 如果是 application 那么直接执行
	// 2. 如果是 builtin or extension 就打开对应的页面

	m := val.(map[string]string)

	for k := range m {
		if m[k] == name {
			delete(m, k)
		}
	}
	m[shortcut] = name

	_ = config.Set(ctx, key, m)
}

func GetShortcut(ctx context.Context) map[string]any {
	cfg, err := config.Get(ctx)
	if err != nil {
		return nil
	}

	val := cfg[key]
	if val == nil {
		return nil
	}

	return val.(map[string]any)
}
