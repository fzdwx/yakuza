import {ipcRenderer} from "electron"

const callApi = (type: string, data: any) => {
    ipcRenderer.send('launcher-api', {
        type,
        data
    })
}

const callApiWithRes = <I, O>(type: string, data: I) => {
    return ipcRenderer.invoke('launcher-api', {
        type,
        data
    }) as O
}

window.launcher = {
    hello() {
        return callApiWithRes('hello', {})
    },

    async execCommand(command: string, args?: Array<string>) {
        callApiWithRes('execCommand', {
            command,
            args
        })
    },

    async spawn(command: string, args?: Array<string>) {
        callApiWithRes('spawn', {
            command,
            args
        })
    },

    async getPath(name: 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps') {
        return callApiWithRes('getPath', {
            name
        })
    },

    async getSelect() {
        return callApiWithRes('getSelect', {})
    },

    async getClipText() {
        return callApiWithRes('getClipText', {})
    },

    setClipText(text: string) {
        callApi('setClipText', {
            text
        })
    },

    hide() {
        callApi('hide', {})
    },

    show() {
        callApi('show', {})
    },

    loadDevView() {
        callApi('loadDevView', {})
    },

    loadMainView() {
        callApi('loadMainView', {})
    }
}
