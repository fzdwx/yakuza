package assets

import (
	"bytes"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/assets"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/spf13/cobra"
	"io"
	"os"
)

func uploadCmd() *cobra.Command {
	var upload = &cobra.Command{
		Use:     "upload",
		Short:   "Upload assets",
		Aliases: []string{"u"},
		Run: func(cmd *cobra.Command, args []string) {
			content, err := io.ReadAll(os.Stdin)
			if err != nil {
				printUploadResp(assets.ToUploadFail(err))
				return
			}

			config, err := assets.LoadConfig()
			if err != nil {
				printUploadResp(assets.ToUploadFail(err))
				return
			}

			resp := assets.Upload(config, string(content))
			printUploadResp(resp)
		},
	}

	return upload
}

func printUploadResp(resp assets.UploadResp) {
	buffer := bytes.Buffer{}
	json.EncodeTo(&buffer, resp)
	fmt.Print(buffer.String())
}
