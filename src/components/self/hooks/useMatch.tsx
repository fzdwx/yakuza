import {Application, getApplications, getLocalExtensions, LocalExtension} from "@/native";
import {useEffect, useMemo, useState} from "react";
import {Action, useRegisterActions} from "@/lib/kbar";
import {useBuiltin} from "@/components/self/item/builtin";

export const useRegisterExtensions = () => {
    const [extensions, setExtensions] = useState<LocalExtension[]>([])
    const actions = useMemo(() => {
        return extensions?.map(
            (ext): Action => ({
                id: `ext-${ext.name}-${ext.author}`,
                name: ext.name ?? '',
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

export const useRegisterApps = () => {
    const [apps, setApps] = useState<Application[]>([])
    const actions = useMemo(() => {
        return apps?.map(
            (app): Action => ({
                id: `app-${app.name}`,
                name: app.name ?? '',
            }),
        );
    }, [apps]);

    useRegisterActions(actions, [actions]);

    useEffect(() => {
        getApplications().then(e => {
            setApps(e)
        })
    }, [])
}

export const useRegisterBuiltin = () => {
    const {builtins} = useBuiltin()
    const actions = useMemo(() => {
        return builtins?.map(
            (b): Action => ({
                id: `builtin-${b}`,
                name: b ?? '',
            }),
        );
    }, [builtins]);

    useRegisterActions(actions, [actions]);
}