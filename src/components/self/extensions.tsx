import {useEffect, useMemo, useState} from "react";
import {getLocalExtensions, LocalExtension} from "@/native";
import {useViewEvent} from "@/hooks/useView";
import {Action} from "@/lib/command";
import {UseRegisterActions} from "@/lib/command";
import {shell} from "electron";
import {useSettingsStore} from "@/hooks/useSettingsStore";

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


export const extensionActions = (ext: LocalExtension) => {
    const {setCurrentItem} = useSettingsStore()
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
