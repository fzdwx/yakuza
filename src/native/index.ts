import {Application, addAppRunCount, getApplications, getIcon} from "./application";
import {getLocalExtensions, getRemoteExtensions, installExtension} from "./extension";

export {
    getApplications, addAppRunCount, getIcon
}


export {
    getRemoteExtensions,
    getLocalExtensions,
    installExtension
}


export type {
    Application
}

export type {
    RemoteExtension,
    LocalExtension,
    RemoteExtensionResp
} from "./extension"
