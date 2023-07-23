package extensions

import (
	"context"
	"launcher/pkg/config"
)

const key = "shortcuts"

func SetShortcut(ctx context.Context, name string, shortcuts string, typeStr string) {
	cfg, err := config.Get(ctx)
	if err != nil {
		return
	}

	val := cfg[key]
	if val == nil {
		val = make(map[string]any)
	}
	// todo 传入类型, 在注册快捷键的时候根据类型进行判断
	// 1. 如果是 application 那么直接执行
	// 2. 如果是 builtin or extension 就打开对应的页面

	m := val.(map[string]any)

	for k := range m {
		info := m[k].(map[string]any)
		if info["shortcuts"] == shortcuts {
			delete(m, k)
		}
	}
	m[name] = map[string]string{
		"shortcuts": shortcuts,
		"type":      typeStr,
	}

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
