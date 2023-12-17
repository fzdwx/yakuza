package main

import (
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"github.com/fzdwx/launcher/launcher-native/json"
	"github.com/samber/lo"
	"net/http"
	"sync"
)

type ShortCut struct {
	Kind     string `json:"kind"`
	ShortCut string `json:"shortcut"`
	Name     string `json:"name"`
	Item     any    `json:"item"`
}

type ShortCutsManager struct {
	Shortcuts []ShortCut
	lock      sync.Mutex
}

func NewShortCutsManager() *ShortCutsManager {
	return &ShortCutsManager{
		Shortcuts: load(),
	}
}

func (s *ShortCutsManager) SetShortCut(w http.ResponseWriter, r *http.Request) {
	var sc ShortCut
	err := json.DecodeFrom(r.Body, &sc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res := s.setShortCut(sc)
	_, _ = fmt.Fprint(w, json.Encode(&res))
}

func (s *ShortCutsManager) GetShortCuts(w http.ResponseWriter, r *http.Request) {
	s.load()
	_, _ = fmt.Fprint(w, json.Encode(s.Shortcuts))
}

func (s *ShortCutsManager) setShortCut(sc ShortCut) *ShortCut {
	s.lock.Lock()
	defer s.lock.Unlock()

	var old = new(ShortCut)
	var shouldRemove = sc.ShortCut == ""
	if lo.ContainsBy(s.Shortcuts, func(item ShortCut) bool {
		return item.Kind == sc.Kind && item.Name == sc.Name
	}) {
		if shouldRemove {
			s.Shortcuts = lo.Filter(s.Shortcuts, func(item ShortCut, index int) bool {
				is := item.Kind == sc.Kind && item.Name == sc.Name
				if is {
					old = &s.Shortcuts[index]
				}
				return !is
			})
		} else {
			s.Shortcuts = lo.Map(s.Shortcuts, func(item ShortCut, index int) ShortCut {
				if item.Kind == sc.Kind && item.Name == sc.Name {
					old = &s.Shortcuts[index]
					return sc
				}
				return item
			})
		}
	} else {
		s.Shortcuts = append(s.Shortcuts, sc)
	}

	if err := s.save(); err != nil {
		fmt.Printf("error saving shortcuts: %v\n", err)
	}
	return old
}

func (s *ShortCutsManager) save() error {
	return fileutil.Write(fileutil.Shortcuts(), s.Shortcuts)
}

func (s *ShortCutsManager) load() {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.Shortcuts = load()
}

func load() []ShortCut {
	var sc []ShortCut
	err := fileutil.Read(fileutil.Shortcuts(), &sc)
	if err != nil {
		return []ShortCut{}
	}
	return sc
}
