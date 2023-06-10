package filehandler

import (
	"net/http"
	"testing"
)

func TestName(t *testing.T) {
	err := http.ListenAndServe(":8080", Handler())
	if err != nil {
		t.Error(err)
	}
}
