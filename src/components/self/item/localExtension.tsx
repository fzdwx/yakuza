import {Command} from "launcher-api";
import {useEffect, useMemo, useState} from "react";
import {Application, getLocalExtensions, LocalExtension} from "@/native";
import {SearchResp} from "@/native/types";
import {useViewEvent} from "@/hooks/useView";
import {useHover} from "@/components/self/hooks";
import {Action, useRegisterActions} from "@/lib/kbar";

const {changeView} = useViewEvent()

const {change} = useHover()

export const useRegisterExtensions = () => {
    const [extensions, setExtensions] = useState<LocalExtension[]>([])
    const actions = useMemo(() => {
        return extensions?.map(
            (ext): Action => ({
                id: `ext-${ext.name}-${ext.author}`,
                name: ext.name ?? '',
                item: ext,
                kind: 'Extension',
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
