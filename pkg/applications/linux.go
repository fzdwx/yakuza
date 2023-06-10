//go:build linux

package applications

import (
	"code.rocketnine.space/tslocum/desktop"
	"github.com/fzdwx/iter"
	"github.com/fzdwx/iter/stream"
)

// List all applications
func List() ([]*desktop.Entry, error) {
	apps, err := desktop.Scan(desktop.DataDirs())
	if err != nil {
		return nil, err
	}

	return stream.FlatMap[[]*desktop.Entry, *desktop.Entry](
		iter.Stream(apps),
		func(entries []*desktop.Entry) stream.Iterator[*desktop.Entry] {
			return iter.Stream(entries)
		},
	).ToArray(), nil
}
