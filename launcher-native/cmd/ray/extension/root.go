package extension

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/fzdwx/launcher/launcher-native/pkg/shortcuts"
	"github.com/spf13/cobra"
)

func RootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:     "extension",
		Aliases: []string{"ext"},
		Short:   "Manage extensions",
	}

	root.AddCommand(listRemoteCmd())
	root.AddCommand(listLocalCmd())

	return root
}

func newExtensionManager() *extension.Manager {
	return extension.NewManager(shortcuts.NewManager())
}
