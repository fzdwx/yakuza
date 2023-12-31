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
	var input string

	var cmd = &cobra.Command{
		Use:     "install",
		Aliases: []string{"i"},
		Run: func(cmd *cobra.Command, args []string) {
			if input == "-" || input == "" {
				bytes, err := io.ReadAll(os.Stdin)
				CheckIfError(err)
				input = string(bytes)
			}
			var e = newExtensionManager()
			var ext extension.RemoteExtension
			err := json.DecodeFrom(strings.NewReader(input), &ext)
			CheckIfError(err)
			err = e.InstallExtension(ext)
			CheckIfError(err)
		},
	}

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
