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

	client := http.DefaultClient
	client.Transport = &http.Transport{
		Proxy: func(req *http.Request) (*url.URL, error) {
			proxyFunc := proxy.ProxyFunc()
			return proxyFunc(req.URL)
		},
	}
	return client
}
