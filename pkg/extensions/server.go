package extensions

import (
	"fmt"
	"launcher/pkg/fileutil"
	"net/http"
	"os"
	"path/filepath"
)

var (
	server = &ExtensionServer{}
	port   = 58585
)

func init() {
	go func() {
		_ = http.ListenAndServe(fmt.Sprintf(":%d", port), server)
	}()
}

func ChangeTo(e Extension) {
	fp := filepath.Join(fileutil.Extensions(), e.Path, "dist")
	fs := http.FS(os.DirFS(fp))
	server.fsHandler = http.FileServer(fs)
}

type ExtensionServer struct {
	fsHandler http.Handler
}

func (e *ExtensionServer) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	if e.fsHandler != nil {
		e.fsHandler.ServeHTTP(writer, request)
	}
}
