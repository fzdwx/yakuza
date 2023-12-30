package main

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/fileutil"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/fzdwx/launcher/launcher-native/pkg/runhistory"
	"net/http"
	"os"
	"strings"
)

type AddRunHistoryReq struct {
	Name     string `json:"name"`
	RunType  string `json:"runType"`
	Cmd      string `json:"cmd"`
	Terminal bool   `json:"terminal"`
}

func (s *Server) AddRunHistory(writer http.ResponseWriter, request *http.Request) {
	var req AddRunHistoryReq
	err := json.DecodeFrom(request.Body, &req)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Cmd) == "" {
		return
	}

	history, err := runhistory.Get()
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	history.Add(req.Name, req.RunType, req.Cmd, req.Terminal)
	file, err := os.OpenFile(fileutil.RunHistory(), os.O_WRONLY|os.O_CREATE|os.O_TRUNC, os.ModePerm)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.EncodeTo(file, history)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (s *Server) GetBuiltinHistory(writer http.ResponseWriter, request *http.Request) {
	maps := runhistory.GetBuiltinHistory()
	err := json.EncodeTo(writer, maps)
	if err != nil {
		s.writeErr(writer, err)
		return
	}
}
