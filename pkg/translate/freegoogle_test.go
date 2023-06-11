package translate

import (
	"fmt"
	"testing"
)

type Translation struct {
	Terms       []string
	Definitions []Definition
}

type Definition struct {
	PartOfSpeech string
	Entries      []Entry
}

type Entry struct {
	Definitions []string
	Example     string
}

type TranslationData struct {
}

func TestName(t *testing.T) {
	do, err := Do("hello", "en", "zh")
	fmt.Println(do, err)
}
