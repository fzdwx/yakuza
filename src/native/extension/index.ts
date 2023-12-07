import {Application} from "@/native";

interface RemoteExtension {
    name: string
    description: string
    author: string
    icon: string
    git_url: string
}


interface LocalExtension extends RemoteExtension {
    fullPath: string
    dirName: string
}

interface RemoteExtensionResp extends RemoteExtension {
    installed: boolean
    fullPath: string
}


const getRemoteExtensions = async () => {
    const resp = await fetch("http://localhost:8080/api/extension/listRemote")
    return await resp.json() as RemoteExtensionResp[]
};

const getLocalExtensions = async () => {
    const resp = await fetch("http://localhost:8080/api/extension/listLocal")
    return await resp.json() as LocalExtension[]
};

const installExtension = async (extension: RemoteExtension) => {
    const resp = await fetch("http://localhost:8080/api/extension/install", {
        method: 'POST',
        body: JSON.stringify(extension)
    })
    return await resp.text()
}


export {
    getRemoteExtensions,
    getLocalExtensions,
    installExtension,
}

export type {
    RemoteExtension,
    LocalExtension,
    RemoteExtensionResp
}
