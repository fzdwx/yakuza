import {RemoteExtensionResp, SearchResp, LocalExtension, RemoteExtension} from "@/native";


const getRemoteExtensions = async () => {
    const resp = await fetch("http://localhost:8080/api/extension/listRemote")
    return await resp.json() as RemoteExtensionResp[]
};

const getLocalExtensions = async (searchText: string) => {
    const resp = await fetch(`http://localhost:8080/api/extension/listLocal?searchText=${searchText}`)
    return await resp.json() as SearchResp<LocalExtension>[]
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
