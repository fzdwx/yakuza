package assets

import (
	"bytes"
	"fmt"
	"github.com/fzdwx/launcher/launcher-native/pkg/json"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// Upload assets, the content is base64 encoded
func Upload(config *Config, content string) UploadResp {
	requestUrl, err := url.Parse(fmt.Sprintf(
		"https://api.github.com/repos/%s/contents/assets/%s",
		config.Cfg.Repo,
		nextName(),
	))
	if err != nil {
		return ToUploadFail(err)
	}

	var req = map[string]any{
		"message": "upload by launcher",
		"content": content,
		"committer": map[string]string{
			"name":  "launcher",
			"email": "ray.launcher@gmail.com",
		},
	}
	var body bytes.Buffer
	err = json.EncodeTo(&body, req)
	if err != nil {
		return ToUploadFail(err)
	}

	resp, err := http.DefaultClient.Do(&http.Request{
		Method: "PUT",
		URL:    requestUrl,
		Header: map[string][]string{
			"Authorization": {"token " + config.Cfg.Token},
			"Content-Type":  {"application/json; charset=utf-8"},
		},
		Body: io.NopCloser(&body),
	})
	if err != nil {
		return ToUploadFail(err)
	}

	if resp.StatusCode != http.StatusCreated {
		return ToUploadFail(fmt.Errorf("upload failed: %s", resp.Status))
	}

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return ToUploadFail(err)
	}

	var respJson struct {
		Content struct {
			DownloadUrl string `json:"download_url"`
		} `json:"content"`
	}
	err = json.DecodeFrom(bytes.NewReader(respBody), &respJson)
	if err != nil {
		return ToUploadFail(err)
	}

	return success(respJson.Content.DownloadUrl)
}

type UploadResp struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
	Url     string `json:"url"`
}

func ToUploadFail(err error) UploadResp {
	var respBody UploadResp
	respBody.Success = false
	respBody.Msg = err.Error()
	return respBody
}

func success(url string) UploadResp {
	var respBody UploadResp
	respBody.Success = true
	respBody.Url = url
	return respBody
}

func nextName() string {
	prefix := time.Now().UnixMicro()

	return strconv.FormatInt(prefix, 10)
}
