package extension

import (
	"github.com/spf13/cobra"
)

func localCmd() *cobra.Command {
	var cmd = &cobra.Command{
		Use:     "local",
		Aliases: []string{"l"},
		Short:   "Manage local extensions",
		//Run: func(cmd *cobra.Command, args []string) {
		//	var e = newExtensionManager()
		//	e.RefreshLocal()
		//
		//	lo.ForEach(e.ListLocalExtension(), func(item *extension.LocalExtension, index int) {
		//		fmt.Fprintf(os.Stdout, fmt.Sprintf("%s;%s;%s\n", item.Author, item.Name, item.Description))
		//	})
		//},
	}

	cmd.AddCommand(localUpgradeCmd())

	return cmd
}
