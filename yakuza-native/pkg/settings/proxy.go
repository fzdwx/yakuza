package settings

import "golang.org/x/net/http/httpproxy"

func GetProxy() *httpproxy.Config {
	st := Get()
	if st.Proxy == "" {
		return nil
	}

	return &httpproxy.Config{
		HTTPProxy:  st.Proxy,
		HTTPSProxy: st.Proxy,
		NoProxy:    "",
		CGI:        false,
	}
}
