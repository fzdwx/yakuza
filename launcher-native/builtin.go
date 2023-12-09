package main

import (
	"encoding/json"
	"github.com/sahilm/fuzzy"
	"github.com/samber/lo"
	"net/http"
)

var builtin = []string{
	"Dev Mode",
	"Store",
}

func (s *Server) ListBuiltin(w http.ResponseWriter, r *http.Request) {
	var resp = sortBuiltin(lo.Map(builtin, func(item string, index int) *SearchResp[string] {
		return &SearchResp[string]{
			Item:  item,
			Kind:  "Builtin",
			Score: 0,
		}
	}))
	text := r.URL.Query().Get("searchText")
	if len(text) > 0 {
		matches := fuzzy.FindFrom(text, resp)
		resp = lo.Map(matches, func(item fuzzy.Match, index int) *SearchResp[string] {
			return &SearchResp[string]{
				Item:  resp[item.Index].Item,
				Kind:  resp[item.Index].Kind,
				Score: item.Score,
			}
		})
	}

	_ = json.NewEncoder(w).Encode(resp)
}
