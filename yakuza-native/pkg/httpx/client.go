package httpx

import (
	"github.com/fzdwx/yakuza/yakuza-native/pkg/settings"
	"net/http"
	"net/url"
)

func Client() *http.Client {
	proxy := settings.GetProxy()
	if proxy == nil {
		return http.DefaultClient
	}

	http.DefaultClient.Transport = &http.Transport{
		Proxy: func(req *http.Request) (*url.URL, error) {
			return proxy.ProxyFunc()(req.URL)
		},
	}
	return nil
}
