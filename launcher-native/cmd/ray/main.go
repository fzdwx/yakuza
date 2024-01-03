package main

import (
	"github.com/fzdwx/launcher/launcher-native/cmd/ray/assets"
	"github.com/fzdwx/launcher/launcher-native/cmd/ray/bridge"
	"github.com/fzdwx/launcher/launcher-native/cmd/ray/extension"
	"github.com/spf13/cobra"
)

func main() {
	if err := rootCmd().Execute(); err != nil {
		panic(err)
	}
}

func rootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:   "ray",
		Short: "Ray is a launcher ctrl cli program",
	}

	root.AddCommand(extension.RootCmd())
	root.AddCommand(assets.RootCmd())
	root.AddCommand(bridge.RootCmd())
	return root
}
