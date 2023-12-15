import { ipcRenderer } from "electron"
import {LocalExtension, SearchItem} from "@/native";

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

// @ts-ignore
window.launcher = {
    hello() {
        return callApiWithRes('hello', {})
    },

    async execCommand(command: string, args?: Array<string>, terminal?: boolean) {
        callApiWithRes('execCommand', {
            command,
            args,
            terminal
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

    async openUrl(url: string) {
        return callApiWithRes('openUrl', {
            url
        })
    },

    //@ts-ignore
    openExtension(ext: LocalExtension) {
        callApi('openExtension', {
            ext
        })
    },

    exitExtension() {
        callApi('exitExtension', {})
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
    },

    set<T>(key: string, value: T): Promise<void> {
        return callApiWithRes('set', {
            key,
            value
        })
    },

    get<T>(key: string): Promise<T> {
        return callApiWithRes('get', {
            key
        })
    }
}
