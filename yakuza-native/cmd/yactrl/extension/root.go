package extension

import (
	"github.com/fzdwx/yakuza/yakuza-native/pkg/extension"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/shortcuts"
	"github.com/spf13/cobra"
)

func RootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:     "extension",
		Aliases: []string{"ext"},
		Short:   "Manage extensions",
	}

	root.AddCommand(remoteCmd())
	root.AddCommand(localCmd())

	return root
}

func newExtensionManager() *extension.Manager {
	return extension.NewManager(shortcuts.NewManager())
}
