package extension

import (
	"github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl/common"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/extension"
	"github.com/fzdwx/yakuza/yakuza-native/pkg/json"
	"github.com/spf13/cobra"
	"io"
	"os"
	"strings"
)

func localInstallCmd() *cobra.Command {
	var (
		input    string
		override bool
		cmd      = &cobra.Command{
			Use:     "install",
			Aliases: []string{"i"},
			Run: func(cmd *cobra.Command, args []string) {
				if input == "-" || input == "" {
					bytes, err := io.ReadAll(os.Stdin)
					common.CheckIfError(err)
					input = string(bytes)
				}

				var (
					e   = newExtensionManager()
					ext extension.RemoteExtension
				)
				common.CheckIfError(json.DecodeFrom(strings.NewReader(input), &ext))
				common.CheckIfError(e.InstallExtension(ext, override))
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
	cmd.Flags().BoolVarP(&override, "override", "o", false, "override the extension if it exists")

	return cmd
}
