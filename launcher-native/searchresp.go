package main

type SearchResp[T any] struct {
	Item  T      `json:"item"`
	Score int    `json:"score"`
	Kind  string `json:"kind"`
}

type sortExtension []*SearchResp[*LocalExtension]

func (s sortExtension) String(i int) string {
	return s[i].Item.Name
}

func (s sortExtension) Len() int {
	return len(s)
}

func (s sortExtension) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

type sortApplication []*SearchResp[*Application]

func (s sortApplication) String(i int) string {
	return s[i].Item.Name
}

func (s sortApplication) Len() int {
	return len(s)
}

func (s sortApplication) Less(i, j int) bool {
	return (s[i].Item.Count - s[j].Item.Count) > 0
}

func (s sortApplication) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func LocalToSearchResp(item *LocalExtension, _ int) *SearchResp[*LocalExtension] {
	return &SearchResp[*LocalExtension]{
		Item:  item,
		Score: 0,
		Kind:  "Extension",
	}
}

func AppToSearchResp(item *Application, _ int) *SearchResp[*Application] {
	return &SearchResp[*Application]{
		Item:  item,
		Score: 0,
		Kind:  "Application",
	}
}
