package extensions

type ListReq struct {
	SearchText string `json:"searchText"`
	//Page  int `json:"page"`
	//Limit int `json:"limit"`
}

type ListResp struct {
	Total int         `json:"total"`
	Items []Extension `json:"items"`
}

type Extension struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Icon        string `json:"icon"`
	GitUrl      string `json:"giturl"`
	Installed   bool   `json:"installed"`
}

type ExtensionSource []Extension

func (e ExtensionSource) String(i int) string {
	return e[i].Name
}

func (e ExtensionSource) Len() int {
	return len(e)
}
