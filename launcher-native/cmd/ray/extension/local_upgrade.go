package extension

import (
	"errors"
	"fmt"
	"github.com/fzdwx/infinite"
	"github.com/fzdwx/infinite/components/spinner"
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/go-git/go-git/v5"
	"github.com/samber/lo"
	"github.com/spf13/cobra"
	"os"
)

func localUpgradeCmd() *cobra.Command {
	var cmd = &cobra.Command{
		Use:     "upgrade",
		Aliases: []string{"u"},
		Short:   "Upgrade local extensions",
		Run: func(cmd *cobra.Command, args []string) {
			var e = newExtensionManager()

			if err := infinite.NewSpinner(
				spinner.WithPrompt(" Upgrading local extensions..."),
				spinner.WithDisableOutputResult(),
			).
				Display(func(sp *spinner.Spinner) {
					e.RefreshLocal()
					lo.ForEach(e.ListLocalExtension(), func(item *extension.LocalExtension, index int) {
						sp.Refreshf(" Upgrading %s", item.Name)

						commit, err := e.Upgrade(item)
						if errors.Is(err, git.NoErrAlreadyUpToDate) {
							sp.Info(fmt.Sprintf("%s is already up-to-date", item.Name))
							return
						}

						sp.Success(fmt.Sprintf("Upgraded %s to %s", item.Name, commit.Hash.String()))
					})

					sp.Finish()
				}); err != nil {
				fmt.Fprint(os.Stderr, err)
				os.Exit(1)
			}
		},
	}

	return cmd
}

func CheckIfError(err error) {
	if err == nil {
		return
	}

	fmt.Printf("\x1b[31;1m%s\x1b[0m\n", fmt.Sprintf("error: %s", err))
	os.Exit(1)
}
