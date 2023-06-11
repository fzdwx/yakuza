package translate

import (
	"errors"
	"fmt"
	"golang.org/x/text/language"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

var (
	GoogleHost = "googleapis.com"
)

func Do(text string, from string, to string) (string, error) {
	return translate(text, from, to, true, 2, 0)
}

const (
	defaultNumberOfRetries = 2
)

func translate(text, from, to string, withVerification bool, tries int, delay time.Duration) (string, error) {
	if tries == 0 {
		tries = defaultNumberOfRetries
	}

	if withVerification {
		if _, err := language.Parse(from); err != nil && from != "auto" {
			log.Println("[WARNING], '" + from + "' is a invalid language, switching to 'auto'")
			from = ""
		}
		if _, err := language.Parse(to); err != nil {
			log.Println("[WARNING], '" + to + "' is a invalid language, switching to 'en'")
			to = "en"
		}
	}

	urll := fmt.Sprintf("https://translate.%s/translate_a/single", GoogleHost)

	data := map[string]string{
		"client": "gtx",
		"sl":     from,
		"tl":     to,
		"hl":     to,
		//"dt":     []string{"at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"},
		"ie":   "UTF-8",
		"oe":   "UTF-8",
		"otf":  "1",
		"ssel": "0",
		"tsel": "0",
		"kc":   "7",
		"q":    text,
	}

	u, err := url.Parse(urll)
	if err != nil {
		return "", nil
	}

	parameters := url.Values{}

	for k, v := range data {
		parameters.Add(k, v)
	}
	for _, v := range []string{"at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"} {
		parameters.Add("dt", v)
	}

	u.RawQuery = parameters.Encode()

	var r *http.Response

	for tries > 0 {
		r, err = http.Get(u.String())
		if err != nil {
			if err == http.ErrHandlerTimeout {
				return "", errors.New("timeout")
			}
			return "", err
		}

		if r.StatusCode == http.StatusOK {
			break
		}

		if r.StatusCode == http.StatusForbidden {
			tries--
			time.Sleep(delay)
		}
	}

	raw, err := io.ReadAll(r.Body)
	if err != nil {
		return "", err
	}

	return string(raw), nil
}
