package main

import (
	"github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl/assets"
	"github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl/bridge"
	"github.com/fzdwx/yakuza/yakuza-native/cmd/yactrl/extension"
	"github.com/spf13/cobra"
)

func main() {
	if err := rootCmd().Execute(); err != nil {
		panic(err)
	}
}

func rootCmd() *cobra.Command {
	var root = &cobra.Command{
		Use:   "yactrl",
		Short: "Yactrl is a yakuza ctrl cli program",
	}

	root.AddCommand(extension.RootCmd())
	root.AddCommand(assets.RootCmd())
	root.AddCommand(bridge.RootCmd())
	return root
}
