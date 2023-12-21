package shortcuts

import (
	"github.com/fzdwx/launcher/launcher-native/fileutil"
	"github.com/samber/lo"
	"sync"
)

type Manager struct {
	Shortcuts []ShortCut
	lock      sync.Mutex
}

func NewManager() *Manager {
	return &Manager{
		Shortcuts: load(),
	}
}

func (s *Manager) GetShortCut(kind, name string) string {
	var res string

	for i := range s.Shortcuts {
		if s.Shortcuts[i].Name == name && s.Shortcuts[i].Kind == kind {
			res = s.Shortcuts[i].ShortCut
			break
		}
	}

	return res
}

func (s *Manager) SetShortCut(sc ShortCut) (*ShortCut, error) {
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

	if err := s.Save(); err != nil {
		return nil, err
	}
	return old, nil
}

func (s *Manager) Save() error {
	return fileutil.Write(fileutil.Shortcuts(), s.Shortcuts)
}

func (s *Manager) Load() {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.Shortcuts = load()
}
