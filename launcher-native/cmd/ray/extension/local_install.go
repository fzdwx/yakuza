package extension

import (
	"github.com/fzdwx/launcher/launcher-native/pkg/extension"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/spf13/cobra"
	"io"
	"os"
	"strings"
)

func localInstallCmd() *cobra.Command {
	var (
		input string
		cmd   = &cobra.Command{
			Use:     "install",
			Aliases: []string{"i"},
			Run: func(cmd *cobra.Command, args []string) {
				if input == "-" || input == "" {
					bytes, err := io.ReadAll(os.Stdin)
					CheckIfError(err)
					input = string(bytes)
				}

				var (
					e   = newExtensionManager()
					ext extension.RemoteExtension
				)
				CheckIfError(json.DecodeFrom(strings.NewReader(input), &ext))
				CheckIfError(e.InstallExtension(ext))
			},
		}
	)

	cmd.Flags().StringVarP(&input, "input", "i", "", `extension meta, is json format,like:
{
    "name": "Notes",
    "description": "A markdown note extension",
    "author": "fzdwx",
    "icon": "https://raw.githubusercontent.com/fzdwx/launcher-notes/main/public/logo.svg",
    "github": "https://github.com/fzdwx/launcher-notes"
}

if input - or is empty then read from stdin

eg: xclip -o | ray extension local install
`)

	return cmd
}
