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
                item: ext,
                kind: 'Extension'
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
