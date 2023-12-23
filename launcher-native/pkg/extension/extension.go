package extension

type RemoteExtension struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Author      string         `json:"author"`
	Icon        string         `json:"icon"`
	Github      string         `json:"github"`
	Actions     []RemoteAction `json:"actions"`
}

type RemoteAction struct {
	Name    string `json:"name"`
	Command string `json:"command"`
}

type RemoteExtensionResp struct {
	RemoteExtension
	Installed bool   `json:"installed"`
	FullPath  string `json:"fullPath"`
}

type LocalExtension struct {
	RemoteExtension

	FullPath string       `json:"fullPath"`
	DirName  string       `json:"dirName"`
	Shortcut string       `json:"shortcut"`
	Action   RemoteAction `json:"action"`
}

type Manager struct {
	remoteExtensions []*RemoteExtension
	localExtensions  []*LocalExtension
	currentExtension *LocalExtension
	shortManager     ShortManager
}

func (e *Manager) getRemoteExtension(local *LocalExtension) *RemoteExtension {
	var res *RemoteExtension
	for _, remote := range e.remoteExtensions {
		if remote.Name == local.Name && remote.Author == local.Author {
			res = remote
			break
		}
	}

	return res
}

type ShortManager interface {
	GetShortCut(kind, name string) string
}

func NewManager(shortManager ShortManager) *Manager {
	return &Manager{
		remoteExtensions: []*RemoteExtension{},
		localExtensions:  []*LocalExtension{},
		shortManager:     shortManager,
	}
}
