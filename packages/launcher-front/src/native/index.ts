import {Shortcut} from "@/native/types";

const execCommand = async (command: string, args?: string[], terminal?: boolean, stdin?: string) => {
    return (await fetch("http://localhost:35677/api/exec/command", {
        method: "POST",
        body: JSON.stringify({command, args: args ? args : [], terminal, stdin})
    })).text()
}

const setConfig = async (key: string, value: string) => {
    return (await fetch("http://localhost:35677/api/config/set", {
        method: "POST",
        body: JSON.stringify({key, value: value})
    })).text()
}

export const exitExt = async () => {
    return await fetch("http://localhost:35677/api/extension/exit")
}

const getConfig = async (key: string) => {
    return (await fetch("http://localhost:35677/api/config/get", {
        method: "POST",
        body: JSON.stringify({key})
    })).text()
}

export const setShortcut = async (shortcut: Shortcut) => {
    return (await fetch("http://localhost:35677/api/shortcut/set", {
        method: "POST",
        body: JSON.stringify(shortcut)
    })).json()
}

export const getShortcut = async () => {
    return (await fetch("http://localhost:35677/api/shortcut/get")).json()
}

export {
    setConfig, getConfig,
    execCommand
}


export type {
    Application, SearchItem, SearchWrapper, RemoteExtensionResp, RemoteExtension, LocalExtension
} from './types'
export * from './types'
