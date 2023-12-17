package main

import (
	"flag"
	"fmt"
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
	port int
	*ExtensionManager
	*ShortCutsManager
}

func NewServer(port *int) *Server {
	s := &Server{
		port:             *port,
		ExtensionManager: NewExtensionManager(),
		ShortCutsManager: NewShortCutsManager(),
	}

	go s.refreshApplication()
	go s.refreshExtension()

	return s
}

func (s *Server) ListenAndServe() error {
	fmt.Println(fmt.Sprintf("Listening on http://localhost:%d", s.port))
	return http.ListenAndServe(fmt.Sprintf(":%d", s.port), s)
}

func (s *Server) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	if request.URL.Path == "/api/applications" {
		s.ListApplication(writer, request)
		return
	}
	if request.URL.Path == "/api/runHistory" {
		s.AddRunHistory(writer, request)
		return
	}
	if request.URL.Path == "/api/extension/listLocal" {
		s.ListLocalExtension(writer, request)
		return
	}
	if request.URL.Path == "/api/extension/listRemote" {
		s.ListRemoteExtension(writer, request)
		return
	}
	if request.URL.Path == "/api/extension/install" {
		s.InstallExtension(writer, request)
		return
	}
	if request.URL.Path == "/api/exec/command" {
		s.ExecCommand(writer, request)
		return
	}
	if request.URL.Path == "/api/config/set" {
		s.Set(writer, request)
		return
	}
	if request.URL.Path == "/api/config/get" {
		s.Get(writer, request)
		return
	}
	if request.URL.Path == "/api/shortcut/set" {
		s.SetShortCut(writer, request)
		return
	}
	if request.URL.Path == "/api/shortcut/get" {
		s.GetShortCuts(writer, request)
		return
	}

	s.ServeExtension(writer, request)
	return
}
