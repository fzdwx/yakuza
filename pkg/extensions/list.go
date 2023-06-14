package extensions

import (
	"context"
	"encoding/json"
	"github.com/sahilm/fuzzy"
	"io"
	"net/http"
	"sort"
	"time"
)

var (
	exts []Extension
)

func init() {
	refresh := func() {
		client := http.DefaultClient
		request, err := http.NewRequest(http.MethodGet, "https://raw.githubusercontent.com/fzdwx/launcher-extension/main/extensions.json", nil)
		if err != nil {
			return
		}

		resp, err := client.Do(request)
		if err != nil {
			return
		}

		defer resp.Body.Close()
		bytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return
		}

		var items []Extension
		err = json.Unmarshal(bytes, &items)
		if err != nil {
			return
		}

		exts = items
	}

	go func() {
		for {
			refresh()
			time.Sleep(30 * time.Second)
		}
	}()
}

func List(ctx context.Context, req ListReq) (*ListResp, error) {
	var (
		matchedItems []Extension
		items        ExtensionSource = exts
	)

	if req.SearchText != "" {
		matches := fuzzy.FindFrom(req.SearchText, items)
		sort.Sort(matches)
		for _, match := range matches {
			matchedItems = append(matchedItems, items[match.Index])
		}
	} else {
		matchedItems = exts
	}

	return &ListResp{
		Total: len(exts),
		Items: setInstalled(matchedItems),
	}, nil
}

func setInstalled(items []Extension) []Extension {
	var resp []Extension
	for _, item := range items {
		if _, ok := installed[item.Name]; ok {
			item.Installed = true
		}
		resp = append(resp, item)
	}
	return resp
}
