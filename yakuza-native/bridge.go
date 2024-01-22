package main

import (
	"github.com/lxzan/gws"
	"net/http"
)

type BridgeHandler struct {
	currentSocket *gws.Conn
}

func (b *BridgeHandler) OnOpen(socket *gws.Conn) {
	b.currentSocket = socket
}

func (b *BridgeHandler) ShowMainWindow() {
	b.send(show)
}

func (b *BridgeHandler) HideMainWindow() {
	b.send(hide)
}

func (b *BridgeHandler) ToggleMainWindow() {
	b.send(toggle)
}

func (b *BridgeHandler) ToggleTheme() {
	b.send(toggleTheme)
}

func (b *BridgeHandler) send(message string) {
	if b.currentSocket != nil {
		b.currentSocket.WriteString(message)
	}
}

var (
	show        = BridgeMessage{Op: "show"}.String()
	hide        = BridgeMessage{Op: "hide"}.String()
	toggle      = BridgeMessage{Op: "toggle"}.String()
	toggleTheme = BridgeMessage{Op: "toggleTheme"}.String()
)

type BridgeMessage struct {
	Op string `json:"op"`
}

func (b BridgeMessage) String() string {
	return `{"op":"` + b.Op + `"}`
}

func (s *Server) Bridge(writer http.ResponseWriter, request *http.Request) {
	socket, err := s.getUpgrader().Upgrade(writer, request)
	if err != nil {
		return
	}
	go func() {
		socket.ReadLoop() // Blocking prevents the context from being GC.
	}()
}

func (s *Server) getUpgrader() *gws.Upgrader {
	return gws.NewUpgrader(s, &gws.ServerOption{
		ReadAsyncEnabled: true,         // Parallel message processing
		CompressEnabled:  true,         // Enable compression
		Recovery:         gws.Recovery, // Exception recovery
	})
}

func (b *BridgeHandler) OnClose(socket *gws.Conn, err error) {
}

func (b *BridgeHandler) OnPing(socket *gws.Conn, payload []byte) {
}

func (b *BridgeHandler) OnPong(socket *gws.Conn, payload []byte) {
}

func (b *BridgeHandler) OnMessage(socket *gws.Conn, message *gws.Message) {
}
