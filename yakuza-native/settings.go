package main

import (
	"fmt"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/json"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/shortcuts"
	"net/http"
)

func (s *Server) SetShortCut(w http.ResponseWriter, r *http.Request) {
	var sc shortcuts.ShortCut
	err := json.DecodeFrom(r.Body, &sc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res, err := s.shortcutsManger.SetShortCut(sc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	_, _ = fmt.Fprint(w, json.Encode(&res))
}

func (s *Server) GetShortCuts(w http.ResponseWriter, r *http.Request) {
	s.shortcutsManger.Load()
	_, _ = fmt.Fprint(w, json.Encode(s.shortcutsManger.Shortcuts))
}
