import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useEffect, useMemo, useState} from "react";
import StoreIcon from "@/components/store/storeIcon";
import {FileSystemIcon} from "@/components/icons";
import {Action, UseRegisterActions} from "@/lib/command";
import {useTheme} from "@/hooks/useTheme";

const storeName = "Store"
const devModeName = "Dev Mode"
const fileSystemName = "File System"
const settingsName = "Settings"

const builtin = [storeName, devModeName, fileSystemName, settingsName]

interface Builtin {
    name: string
    runCount: number
}

const useBuiltin = () => {
    const [builtins, setBuiltin] = useState<Builtin[]>(builtin.map(b => ({name: b, runCount: 0})))

    useEffect(() => {
        getBuiltinRunCount().then((res: Record<string, { count: number }>) => {
            const newBuiltins = builtin.map(b => ({name: b, runCount: res[b]?.count ?? 0}))
            setBuiltin(newBuiltins)
        })
    }, [])

    return {
        builtins,
    }
}

const getIcon = (item: string) => {
    switch (item) {
        case storeName:
            return <StoreIcon/>
        case devModeName:
            return <span className="w-4">🛠</span>
        case fileSystemName:
            return <FileSystemIcon/>
        case settingsName:
            return <div className="w-4">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" x="80" y="80"
                     alignment-baseline="middle">
                    <path fill="#ffffff"
                          d="M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11.35 11.35 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.48 11.48 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11.35 11.35 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.48 11.48 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.86 8.86 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.36 9.36 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.86 8.86 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.36 9.36 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z"/>
                    <path fill="#ffffff"
                          d="M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4"/>
                </svg>
            </div>
        default:
            return <></>
    }
}

const {changeView} = useViewEvent();

export const BuiltinKind = "Builtin"
export const useRegisterBuiltin = (useRegisterActions: UseRegisterActions) => {
    const {builtins} = useBuiltin()
    const {theme} = useTheme();

    const actions = useMemo(() => {
        return builtins?.map(
            (b): Action => ({
                id: `builtin-${b.name}`,
                name: b.name,
                item: b,
                icon: getIcon(b.name),
                kind: BuiltinKind,
                priority: b.runCount,
                perform: () => {
                    changeView(b.name as ViewName)
                    if (b.name === devModeName) {
                        //@ts-ignore
                        window.launcher.loadDevView({
                            theme: theme
                        })
                    }
                    addBuiltinRunCount(b)
                }
            }),
        );
    }, [builtins, theme]);

    useRegisterActions(actions, [actions]);
}

export const addBuiltinRunCount = async (b: Builtin) => {
    await fetch("http://localhost:35677/api/runHistory", {
        method: "POST",
        body: JSON.stringify({
            name: b.name,
            runType: BuiltinKind,
            cmd: b.name,
            terminal: false,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const getBuiltinRunCount = async () => {
    return await (await fetch("http://localhost:35677/api/run/count/builtin", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })).json()
}

export const builtinActions = (b: string) => {
    return []
}

