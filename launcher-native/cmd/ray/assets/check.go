package assets

import (
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/fileutil"
	"github.com/spf13/cobra"
	"os"
)

func checkCmd() *cobra.Command {
	var check = &cobra.Command{
		Use:     "check",
		Short:   "Check if init",
		Aliases: []string{"c"},
		Run: func(cmd *cobra.Command, args []string) {
			_, err := os.Stat(fileutil.Assets())
			fmt.Println(err == nil)
		},
	}

	return check
}
