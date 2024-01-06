package main

import (
	"flag"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/fzdwx/launcher/launcher-native/pkg/shortcuts"
	"net/http"
)

func main() {
	port := flag.Int("port", 35677, "port to listen on")

	server := NewServer(port)
	err := server.ListenAndServe()
	if err != nil {
		panic(err)
	}
}

type Server struct {
	port            int
	extManager      *extension.Manager
	shortcutsManger *shortcuts.Manager
	handlers        map[string]http.HandlerFunc
	*BridgeHandler
}

func NewServer(port *int) *Server {
	shortcutsManger := shortcuts.NewManager()
	s := &Server{
		port:            *port,
		extManager:      extension.NewManager(shortcutsManger),
		shortcutsManger: shortcutsManger,
		handlers:        make(map[string]http.HandlerFunc),
		BridgeHandler:   &BridgeHandler{},
	}

	s.registerHandlers()

	go s.refreshApplication()
	go s.extManager.RefreshExtension()

	return s
}

func (s *Server) ListenAndServe() error {
	fmt.Println(fmt.Sprintf("Listening on http://localhost:%d", s.port))
	return http.ListenAndServe(fmt.Sprintf(":%d", s.port), s)
}

func (s *Server) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	handler, ok := s.handlers[request.URL.Path]
	if ok {
		handler(writer, request)
		return
	}

	s.ServeExtension(writer, request)
}

func (s *Server) writeErr(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	_, _ = w.Write([]byte(err.Error()))
}

func (s *Server) registerHandlers() {
	s.handlers["/api/applications"] = s.ListApplication
	s.handlers["/api/runHistory"] = s.AddRunHistory
	s.handlers["/api/extension/listLocal"] = s.ListLocalExtension
	s.handlers["/api/extension/exit"] = s.ExitExtension
	s.handlers["/api/extension/listRemote"] = s.ListRemoteExtension
	s.handlers["/api/extension/install"] = s.InstallExtension
	s.handlers["/api/exec/command"] = s.ExecCommand
	s.handlers["/api/config/set"] = s.Set
	s.handlers["/api/config/get"] = s.Get
	s.handlers["/api/shortcut/set"] = s.SetShortCut
	s.handlers["/api/shortcut/get"] = s.GetShortCuts
	s.handlers["/api/fs/search"] = s.SearchFs
	s.handlers["/api/fs/list"] = s.ListFs
	s.handlers["/api/fs/read"] = s.ReadFs
	s.handlers["/api/run/count/builtin"] = s.GetBuiltinHistory
	s.handlers["/api/bridge"] = s.Bridge
	s.handlers["/api/bridge/show"] = func(writer http.ResponseWriter, request *http.Request) {
		s.BridgeHandler.ShowMainWindow()
	}
	s.handlers["/api/bridge/hide"] = func(writer http.ResponseWriter, request *http.Request) {
		s.BridgeHandler.HideMainWindow()
	}
	s.handlers["/api/bridge/toggle"] = func(writer http.ResponseWriter, request *http.Request) {
		s.BridgeHandler.ToggleMainWindow()
	}
	s.handlers["/api/bridge/toggleTheme"] = func(writer http.ResponseWriter, request *http.Request) {
		s.BridgeHandler.ToggleTheme()
	}
}
