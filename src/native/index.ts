import {addAppRunCount, getApplications, getIcon} from "./application";
import {getLocalExtensions, getRemoteExtensions, installExtension} from "./extension";

export {
    getApplications, addAppRunCount, getIcon
}


export {
    getRemoteExtensions,
    getLocalExtensions,
    installExtension
}


export type {Application, SearchItem, SearchResp, RemoteExtensionResp, RemoteExtension, LocalExtension} from './types'
export * from './types'
