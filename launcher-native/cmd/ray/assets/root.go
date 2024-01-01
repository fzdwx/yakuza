package assets

import (
	"github.com/spf13/cobra"
)

func RootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:     "assets",
		Aliases: []string{"a"},
		Short:   "Manage assets",
	}

	root.AddCommand(initCmd())
	root.AddCommand(checkCmd())
	root.AddCommand(uploadCmd())
	return root
}
