package extension

import (
	"fmt"
	"github.com/fzdwx/infinite"
	"github.com/fzdwx/infinite/components/selection/multiselect"
	"github.com/fzdwx/infinite/components/spinner"
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/samber/lo"
	"github.com/spf13/cobra"
	"os"
)

func listRemoteCmd() *cobra.Command {
	var cmd = &cobra.Command{
		Use:     "remote",
		Aliases: []string{"r"},
		Short:   "List remote extensions",
		Run: func(cmd *cobra.Command, args []string) {
			e := newExtensionManager()

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
				fmt.Println("No remote extensions found")
				os.Exit(1)
			}

			choices := lo.Map(resps, func(item *extension.RemoteExtensionResp, index int) string {
				return fmt.Sprintf("%s - %s - %s", item.Name, item.Description, item.Author)
			})

			var (
				selected []int
				err      error
			)

			if selected, err = infinite.NewMultiSelect(choices,
				multiselect.WithPageSize(10),
			).
				Display("Install extensions"); err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			lo.ForEach(selected, func(item int, index int) {
				fmt.Println(resps[item])
			})
			// todo: install extensions
		},
	}

	return cmd
}
