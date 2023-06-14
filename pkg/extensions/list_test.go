package extensions

import (
	"fmt"
	"testing"
)

func TestList(t *testing.T) {
	fmt.Println(List(nil, ListReq{}))
}
