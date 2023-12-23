package extension

import (
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/samber/lo"
	"github.com/spf13/cobra"
	"os"
)

func localCMd() *cobra.Command {
	var cmd = &cobra.Command{
		Use:     "local",
		Aliases: []string{"l"},
		Short:   "List local extensions",
		Run: func(cmd *cobra.Command, args []string) {
			var e = newExtensionManager()
			e.RefreshLocal()

			lo.ForEach(e.ListLocalExtension(), func(item *extension.LocalExtension, index int) {
				fmt.Fprintf(os.Stdout, fmt.Sprintf("%s;%s;%s\n", item.Author, item.Name, item.Description))
			})
		},
	}

	return cmd
}
