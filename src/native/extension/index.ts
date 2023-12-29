import {RemoteExtensionResp, LocalExtension, RemoteExtension} from "@/native";


const getRemoteExtensions = async () => {
    const resp = await fetch("http://localhost:35677/api/extension/listRemote")
    return await resp.json() as RemoteExtensionResp[]
};

const getLocalExtensions = async () => {
    const resp = await fetch(`http://localhost:35677/api/extension/listLocal`)
    return await resp.json() as LocalExtension[]
};

const installExtension = async (extension: RemoteExtension) => {
    const resp = await fetch("http://localhost:35677/api/extension/install", {
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
