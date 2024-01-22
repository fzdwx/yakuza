package main

import (
	"encoding/json"
	"fmt"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/extension"
	"net/http"
	"path/filepath"
)

func (s *Server) ServeExtension(writer http.ResponseWriter, request *http.Request) {
	fullPath := request.URL.Query().Get("ext")
	if len(fullPath) > 0 {
		s.extManager.ChangeExtension(fullPath)
	}
	if s.extManager.CurrentExt() == nil {
		return
	}

	dir := filepath.Join(s.extManager.CurrentExt().FullPath, "dist")
	http.FileServer(http.Dir(dir)).ServeHTTP(writer, request)
}

func (s *Server) ListLocalExtension(w http.ResponseWriter, r *http.Request) {
	_ = json.NewEncoder(w).Encode(s.extManager.ListLocalExtension())
}

func (s *Server) ExitExtension(w http.ResponseWriter, r *http.Request) {
	s.extManager.Exit()
}

func (s *Server) ListRemoteExtension(w http.ResponseWriter, r *http.Request) {
	err := json.NewEncoder(w).Encode(s.extManager.ListRemoteExtension())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "encode json:%v", err)
	}
}

func (s *Server) InstallExtension(w http.ResponseWriter, r *http.Request) {
	var remoteExtension extension.RemoteExtension
	err := json.NewDecoder(r.Body).Decode(&remoteExtension)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "decode json:%v", err)
		return
	}

	err = s.extManager.InstallExtension(remoteExtension, false)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "install extension:%v", err)
		return
	}

	fmt.Fprintf(w, "install success")
}
