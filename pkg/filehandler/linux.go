//go:build linux

package filehandler

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

type FileLoader struct {
	http.Handler
}

func Handler() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	if strings.HasPrefix(req.URL.Path, "/favicon.ico") {
		var (
			index = strings.Index(req.RequestURI, "/favicon.ico")
			path  = strings.TrimPrefix(req.RequestURI[index:], "/favicon.ico?")
		)

		pattern := []string{
			path,
			strings.TrimPrefix(path, "/"),
			fmt.Sprintf("/usr/share/icons/hicolor/scalable/apps%s.svg", path),
			fmt.Sprintf("/usr/share/icons/hicolor/48x48/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/hicolor/32x32/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/hicolor/16x16/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/hicolor/128x128/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/hicolor/256x256/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/hicolor/512x512/apps%s.png", path),
			fmt.Sprintf("/usr/share/icons/breeze/apps/48%s.png", path),
			fmt.Sprintf("/usr/share/icons/breeze/apps/48%s.svg", path),
			fmt.Sprintf("/usr/share/icons/breeze/apps/16%s.svg", path),
			fmt.Sprintf("/usr/share/pixmaps%s.svg", path),
			fmt.Sprintf("/usr/share/pixmaps%s", path),
			fmt.Sprintf("/usr/share/icons%s.png", path),
			fmt.Sprintf("/usr/share/icons/breeze/actions/16%s.svg", path),
			fmt.Sprintf("/usr/share/icons/breeze/places/16%s.svg", path),
			fmt.Sprintf("/usr/share/icons/breeze/preferences/16%s.svg", path),
			fmt.Sprintf("/usr/share/icons/breeze/devices/16%s.svg", path),
			fmt.Sprintf("/usr/share/icons/breeze/preferences/24%s.svg", path),
			fmt.Sprintf("/usr/share/icons/Adwaita/16x16/legacy%s-symbolic.symbolic.png", path),
		}

		if err := loadArray(pattern, res); err != nil {
			return
		}

		res.WriteHeader(http.StatusNotFound)
	}
}

func loadArray(paths []string, res http.ResponseWriter) error {
	for _, path := range paths {
		if err := load(path, res); err == nil {
			return nil
		}
	}
	return fmt.Errorf("not found")
}

func load(path string, res http.ResponseWriter) error {
	fileData, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	if strings.HasSuffix(path, ".svg") {
		res.Header().Set("Content-Type", "image/svg+xml")
	}
	res.Write(fileData)

	return nil
}
