package bridge

import (
	"github.com/spf13/cobra"
	"net/http"
)

func RootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:     "bridge",
		Aliases: []string{"b"},
		Short:   "Bridge to electron process",
	}

	root.AddCommand(toggleCmd())

	return root
}

func toggleCmd() *cobra.Command {
	var toggle = &cobra.Command{
		Use:     "toggle",
		Aliases: []string{"t"},
		Short:   "Toggle electron window",
		Run: func(cmd *cobra.Command, args []string) {
			http.Get("http://localhost:35677/api/bridge/toggle")
		},
	}

	return toggle
}
