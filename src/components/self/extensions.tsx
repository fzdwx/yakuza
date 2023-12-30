import {useEffect, useMemo, useState} from "react";
import {useViewEvent} from "@/hooks/useView";
import {Action} from "@/lib/command";
import {UseRegisterActions} from "@/lib/command";
import {shell} from "electron";
import {LocalExtension, RemoteExtension, RemoteExtensionResp, SearchItem, SearchWrapper} from "@/native";

const {changeView} = useViewEvent()

export const ExtensionKind = "Extension"
export const useRegisterExtensions = (useRegisterActions: UseRegisterActions) => {
    const [extensions, setExtensions] = useState<LocalExtension[]>([])
    const actions = useMemo(() => {
        return extensions?.map(
            (ext): Action => ({
                id: `ext-${ext.name}-${ext.author}`,
                name: ext.name ?? '',
                item: ext,
                kind: ExtensionKind,
                priority: 50,
                icon: <img className="w-4" alt='img' src={ext.icon}/>,
                perform: () => {
                    // @ts-ignore
                    window.launcher.openExtension(ext)
                    changeView('extView')
                }
            }),
        );
    }, [extensions]);

    useRegisterActions(actions, [actions]);
    useEffect(() => {
        getLocalExtensions().then(e => {
            setExtensions(e)
        })
    }, [])
}

export const getRemoteExtensions = async () => {
    const resp = await fetch("http://localhost:35677/api/extension/listRemote")
    return await resp.json() as RemoteExtensionResp[]
};

export const getLocalExtensions = async () => {
    const resp = await fetch(`http://localhost:35677/api/extension/listLocal`)
    return await resp.json() as LocalExtension[]
};

export const installExtension = async (extension: RemoteExtension) => {
    const resp = await fetch("http://localhost:35677/api/extension/install", {
        method: 'POST',
        body: JSON.stringify(extension)
    })
    return await resp.text()
}


export const addExtRunCount = async (ext: LocalExtension) => {
    await fetch("http://localhost:35677/api/runHistory", {
        method: "POST",
        body: JSON.stringify({
            name: ext.name,
            runType: "Extension",
            cmd: ext.action?.command,
            terminal: false,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const extensionActions = (ext: LocalExtension, setCurrentItem: (item: SearchWrapper<SearchItem>) => void) => {
    return [
        {
            id: "open settings",
            name: "Open setting",
            perform: () => {
                // @ts-ignore
                setCurrentItem({
                    kind: ExtensionKind,
                    item: ext
                })
                changeView("Settings")
            }
        },
        {
            id: "open in folder",
            name: "Open in folder",
            perform: () => {
                window.launcher.hide()
                shell.openPath(ext.fullPath)
            }
        }
    ] as Action[]
}
