package main

import (
	"encoding/json"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"net/http"
	"os"
	"path/filepath"
)

type SetConfigReq struct {
	Key   string `json:"key"`
	Value any    `json:"value"`
}

func (s *Server) Set(w http.ResponseWriter, r *http.Request) {
	var req SetConfigReq
	_ = json.NewDecoder(r.Body).Decode(&req)
	fmt.Println(req.Key, req.Value)

	fullPath := "dev"
	if s.currentExtension != nil {
		fullPath = s.currentExtension.FullPath
	}
	destDir := filepath.Join(fileutil.Config(), fullPath)
	err := os.MkdirAll(destDir, os.ModePerm)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}

	err = os.WriteFile(filepath.Join(destDir, req.Key), []byte(fmt.Sprintf("%v", req.Value)), os.ModePerm)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
}

type ConfigGetReq struct {
	Key string `json:"key"`
}

func (s *Server) Get(w http.ResponseWriter, r *http.Request) {
	var req ConfigGetReq
	_ = json.NewDecoder(r.Body).Decode(&req)

	fullPath := "dev"
	if s.currentExtension != nil {
		fullPath = s.currentExtension.FullPath
	}
	destDir := filepath.Join(fileutil.Config(), fullPath)
	value, err := os.ReadFile(filepath.Join(destDir, req.Key))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}

	fmt.Fprint(w, string(value))
}
