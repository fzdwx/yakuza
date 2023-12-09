import {addAppRunCount, getApplications, getIcon} from "./application";
import {getBuiltin} from "./builtin";
import {getLocalExtensions, getRemoteExtensions, installExtension} from "./extension";

export {
    getApplications, addAppRunCount, getIcon
}


export {
    getRemoteExtensions,
    getLocalExtensions,
    installExtension
}

const execCommand = async (command: string, args: string[], terminal?: boolean) => {
    return (await fetch("http://localhost:8080/api/exec/command", {
        method: "POST",
        body: JSON.stringify({command, args, terminal})
    })).text()
}

export {
    getBuiltin,
    execCommand
}


export type {Application, SearchItem, SearchResp, RemoteExtensionResp, RemoteExtension, LocalExtension} from './types'
export * from './types'
