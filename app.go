package main

import (
	"context"
	"fmt"
	"github.com/robotn/gohook"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/sys/execabs"
	"launcher/pkg/applications"
	"launcher/pkg/clip"
	"launcher/pkg/config"
	"launcher/pkg/extensions"
	"launcher/pkg/translate"
	"strings"
)

// App struct
type App struct {
	ctx   context.Context
	show  bool
	focus bool
}

var (
	Width  = 900
	Height = 540
)

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.show = true

	go func() {
		shortcut := a.GetShortcut()
		for name, value := range shortcut {
			v := value.(map[string]any)
			key := parseKey(v["shortcuts"].(string))

			if v["type"] == "builtin" {
				hook.Register(hook.KeyDown, key, func(e hook.Event) {
					fmt.Println(name, value)
					a.Show(map[string]string{
						"view": name,
					})

				})
			}
		}

		hook.Register(hook.KeyDown, []string{"space", "alt"}, func(e hook.Event) {
			if a.show {
				a.Hide()
			} else {
				a.Show()
			}
		})
		//hook.Register(hook.KeyDown, []string{"esc"}, func(e hook.Event) {
		//	if a.show {
		//		runtime.WindowHide(a.ctx)
		//		a.show = false
		//	}
		//})
		s := hook.Start()
		<-hook.Process(s)
	}()
}

func (a *App) domReady(ctx context.Context) {
	a.Show()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) Hide() {
	runtime.WindowHide(a.ctx)
	a.show = false
	a.ToBlur()
}

func (a *App) WindowIsShow() bool {
	return a.show
}

func (a *App) Show(data ...any) {
	a.show = true
	runtime.EventsEmit(a.ctx, "show", data)
	runtime.WindowSetSize(a.ctx, Width, Height)
	runtime.WindowShow(a.ctx)
	runtime.WindowCenter(a.ctx)
}

func (a *App) ToFocus() {
	a.focus = true
}

func (a *App) ToBlur() {
	a.focus = false
}

func (a *App) ListApplications() ([]*applications.Application, error) {
	return applications.List(a.ctx)
}

// RunApplication run app, cmd is the command to run, term is whether to run in terminal
func (a *App) RunApplication(name string, runType string, cmd string, term bool) {
	fmt.Println("RunApplication", name, runType, cmd, term)
	applications.AddHistory(a.ctx, name, runType, cmd, term)
	go func() {
		a.Hide()
		cmd = strings.ReplaceAll(cmd, "%u", "") // TODO 支持从 input 获取参数
		cmd = strings.ReplaceAll(cmd, "%F", "")
		if term { // TODO 支持自定义终端
			if _, err := execabs.LookPath("wezterm"); err == nil {
				command := execabs.Command("wezterm", "start", "sh", "-c", cmd)
				command.Run()
				return
			}
			if _, err := execabs.LookPath("konsole"); err == nil {
				execabs.Command("konsole", "-e", cmd).Run()
				return
			}
		}
		execabs.Command("sh", "-c", cmd).Run()
	}()
}

func (a *App) GetRunHistory() (*applications.RunHistory, error) {
	return applications.GetHistory(a.ctx)
}

func (a *App) GetConfig() (map[string]any, error) {
	return config.Get(a.ctx)
}

func (a *App) SetConfig(key string, value any) error {
	return config.Set(a.ctx, key, value)
}

func (a *App) GetClipText() (string, error) {
	return clip.Get()
}

func (a *App) SetClipText(text string) {
	clip.Write(text)
}

func (a *App) GoogleTranslate(text string, from string, to string) (string, error) {
	return translate.Do(text, from, to)
}

func (a *App) ListExtension(req extensions.ListReq) (*extensions.ListResp, error) {
	return extensions.List(a.ctx, req)
}

func (a *App) ListInstalled() []extensions.Extension {
	return extensions.ListInstalled()
}

func (a *App) ChangeExtension(ext extensions.Extension) {
	extensions.ChangeTo(ext)
}

func (a *App) InstallExtension(ext extensions.Extension) (bool, error) {
	return extensions.Install(ext)
}

func (a *App) SetShortcut(key string, value string, typestr string) {
	extensions.SetShortcut(a.ctx, key, value, typestr)
}

func (a *App) GetShortcut() map[string]any {
	return extensions.GetShortcut(a.ctx)
}

func parseKey(val string) []string {
	return strings.Split(val, "+")
}
