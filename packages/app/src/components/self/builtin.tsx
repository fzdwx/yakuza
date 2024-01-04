import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useEffect, useMemo, useState} from "react";
import StoreIcon from "@/components/store/storeIcon";
import {FileSystemIcon} from "@/components/icons";
import {Action, UseRegisterActions} from "@/lib/command";
import {LocalExtension} from "@/native";

const storeName = "Store"
const devModeName = "Dev Mode"
const fileSystemName = "File System"

const builtin = [storeName, devModeName, fileSystemName]

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
        default:
            return <></>
    }
}

const {changeView} = useViewEvent();

export const BuiltinKind = "Builtin"
export const useRegisterBuiltin = (useRegisterActions: UseRegisterActions) => {
    const {builtins} = useBuiltin()

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
                        window.launcher.loadDevView()
                    }
                    addBuiltinRunCount(b)
                }
            }),
        );
    }, [builtins]);

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

