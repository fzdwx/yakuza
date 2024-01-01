package assets

import (
	"bytes"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/cmd/ray/common"
	"github.com/fzdwx/launcher/launcher-native/pkg/fileutil"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"github.com/spf13/cobra"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

func uploadCmd() *cobra.Command {

	var upload = &cobra.Command{
		Use:     "upload",
		Short:   "Upload assets",
		Aliases: []string{"u"},
		Run: func(cmd *cobra.Command, args []string) {
			content, err := io.ReadAll(os.Stdin)
			if err != nil {
				fail(err)
				return
			}

			config, err := getConfig()
			common.CheckIfError(err)

			requestUrl, err := url.Parse(fmt.Sprintf("https://api.github.com/repos/%s/contents/assets/%s", config.Cfg.Repo, newFileName()))
			if err != nil {
				fail(err)
				return
			}

			var req = map[string]any{
				"message": "upload by launcher",
				"content": content,
			}
			var body bytes.Buffer
			err = json.EncodeTo(&body, req)
			if err != nil {
				fail(err)
				return
			}

			resp, err := http.DefaultClient.Do(&http.Request{
				Method: "PUT",
				URL:    requestUrl,
				Header: map[string][]string{
					"Authorization": {"token " + config.Cfg.Token},
					"Content-Type":  {"application/vnd.github.v3.json"},
				},
				Body: io.NopCloser(&body),
			})
			if err != nil {
				fail(err)
				return
			}

			if resp.StatusCode != http.StatusCreated {
				fail(fmt.Errorf("upload failed: %s", resp.Status))
				return
			}

			respBody, err := io.ReadAll(resp.Body)
			if err != nil {
				fail(err)
				return
			}

			var respJson struct {
				Content struct {
					DownloadUrl string `json:"download_url"`
				} `json:"content"`
			}
			err = json.DecodeFrom(bytes.NewReader(respBody), &respJson)
			if err != nil {
				fail(err)
				return
			}
			success(respJson.Content.DownloadUrl)
		},
	}

	return upload
}

func success(url string) {
	var respBody Resp
	respBody.Success = true
	respBody.Url = url
	buffer := bytes.Buffer{}
	json.EncodeTo(&buffer, respBody)
	fmt.Println(buffer.String())
}

func fail(err error) {
	var respBody Resp
	respBody.Success = false
	respBody.Msg = err.Error()
	buffer := bytes.Buffer{}
	json.EncodeTo(&buffer, respBody)
	fmt.Println(buffer.String())
}

type Resp struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
	Url     string `json:"url"`
}

func newFileName() string {
	prefix := time.Now().UnixMicro()

	return strconv.FormatInt(prefix, 10)
}

func getConfig() (*Config, error) {
	f, err := os.Open(fileutil.Assets())
	if err != nil {
		return nil, err
	}

	defer f.Close()
	var cfg Config
	err = json.DecodeFrom(f, &cfg)
	return &cfg, err
}
