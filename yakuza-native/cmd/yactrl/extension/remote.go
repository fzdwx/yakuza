package extension

import (
	"fmt"
	"github.com/fzdwx/infinite"
	"github.com/fzdwx/infinite/components/spinner"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/extension"
	"github.com/samber/lo"
	"github.com/spf13/cobra"
	"os"
)

func remoteCmd() *cobra.Command {
	var cmd = &cobra.Command{
		Use:     "remote",
		Aliases: []string{"r"},
		Short:   "List remote extensions",
		Run: func(cmd *cobra.Command, args []string) {
			var e = newExtensionManager()

			if err := infinite.NewSpinner(
				spinner.WithPrompt(" Loading extension..."),
				spinner.WithDisableOutputResult(),
			).
				Display(func(sp *spinner.Spinner) {
					e.Refresh()
					sp.Finish()
				}); err != nil {
				fmt.Fprint(os.Stderr, err)
				os.Exit(1)
			}

			resps := e.ListRemoteExtension()
			if len(resps) == 0 {
				fmt.Println("No remote extensions found")
				os.Exit(1)
			}
			resps = lo.Filter(resps, func(item *extension.RemoteExtensionResp, index int) bool {
				return !item.Installed
			})
			if len(resps) == 0 {
				fmt.Println("You have installed all remote extensions !")
				return
			}

			lo.ForEach(resps, func(item *extension.RemoteExtensionResp, index int) {
				fmt.Fprintf(os.Stdout, "%s - %s - %s", item.Name, item.Description, item.Author)
			})

		},
	}

	return cmd
}
