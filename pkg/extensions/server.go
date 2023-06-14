package extensions

import (
	"fmt"
	"launcher/pkg/fileutil"
	"net/http"
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
	server.ext = e
}

type ExtensionServer struct {
	ext Extension
}

func (e *ExtensionServer) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	fp := filepath.Join(fileutil.Extensions(), e.ext.Path, "dist")
	if request.RequestURI == "/" {
		fp = filepath.Join(fp, "index.html")
	} else {
		fp = filepath.Join(fp, request.RequestURI)
	}
	http.ServeFile(writer, request, fp)
}
