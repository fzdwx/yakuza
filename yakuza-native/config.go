package main

import (
	"encoding/json"
	"fmt"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/fileutil"
	"net/http"
	"os"
	"path/filepath"
)

type SetConfigReq struct {
	Key          string `json:"key"`
	Value        string `json:"value"`
	LauncherSelf bool   `json:"launcherSelf"`
}

func (s *Server) Set(w http.ResponseWriter, r *http.Request) {
	var (
		req      SetConfigReq
		fullPath = "dev"
	)
	_ = json.NewDecoder(r.Body).Decode(&req)

	if req.LauncherSelf {
		fullPath = "launcher"
	} else if s.extManager.CurrentExt() != nil {
		fullPath = filepath.Base(s.extManager.CurrentExt().FullPath)
	}

	destDir := filepath.Join(fileutil.Config(), fullPath)
	err := os.MkdirAll(destDir, os.ModePerm)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}

	err = os.WriteFile(filepath.Join(destDir, req.Key), []byte(req.Value), os.ModePerm)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
}

type ConfigGetReq struct {
	Key          string `json:"key"`
	LauncherSelf bool   `json:"launcherSelf"`
}

func (s *Server) Get(w http.ResponseWriter, r *http.Request) {
	var (
		req      ConfigGetReq
		fullPath = "dev"
	)
	_ = json.NewDecoder(r.Body).Decode(&req)

	if req.LauncherSelf {
		fullPath = "launcher"
	} else if s.extManager.CurrentExt() != nil {
		fullPath = filepath.Base(s.extManager.CurrentExt().FullPath)
	}

	destDir := filepath.Join(fileutil.Config(), fullPath)
	value, err := os.ReadFile(filepath.Join(destDir, req.Key))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, string(value))
}
