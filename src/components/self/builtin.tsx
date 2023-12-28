import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useMemo, useState} from "react";
import StoreIcon from "@/components/store/storeIcon";
import {FileSystemIcon} from "@/components/icons";
import {Action, UseRegisterActions} from "@/lib/command";

const storeName = "Store"
const devModeName = "Dev Mode"
const fileSystemName = "File System"

const builtin = [storeName, devModeName, fileSystemName]
const useBuiltin = () => {
    const [loading, setLoading] = useState(true)
    const [builtins, setBuiltin] = useState<string[]>(builtin)

    return {
        builtins,
        loading,
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
export const useRegisterBuiltin = (useRegisterActions: UseRegisterActions) => {
    const {builtins} = useBuiltin()
    const actions = useMemo(() => {
        return builtins?.map(
            (b): Action => ({
                id: `builtin-${b}`,
                name: b ?? '',
                item: b,
                icon: getIcon(b),
                kind: 'Builtin',
                perform: () => {
                    changeView(b as ViewName)
                    if (b === devModeName) {
                        //@ts-ignore
                        window.launcher.loadDevView()
                    }
                }
            }),
        );
    }, [builtins]);

    useRegisterActions(actions, [actions]);
}


