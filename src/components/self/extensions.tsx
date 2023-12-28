import {useEffect, useMemo, useState} from "react";
import {getLocalExtensions, LocalExtension} from "@/native";
import {useViewEvent} from "@/hooks/useView";
import {Action} from "@/lib/command";
import {UseRegisterActions} from "@/lib/command";

const {changeView} = useViewEvent()

// export const useRegisterExtensions = () => {
//     const [extensions, setExtensions] = useState<LocalExtension[]>([])
//     const actions = useMemo(() => {
//         return extensions?.map(
//             (ext): Action => ({
//                 id: `ext-${ext.name}-${ext.author}`,
//                 name: ext.name ?? '',
//                 item: ext,
//                 kind: 'Extension',
//                 icon: <img className="w-4" alt='img' src={ext.icon}/>,
//                 perform: () => {
//                     // @ts-ignore
//                     window.launcher.openExtension(ext)
//                     changeView('extView')
//                 }
//             }),
//         );
//     }, [extensions]);
//
//     useRegisterActions(actions, [actions]);
//     useEffect(() => {
//         getLocalExtensions().then(e => {
//             setExtensions(e)
//         })
//     }, [])
// }

export const useRegisterExtensions = (useRegisterActions: UseRegisterActions) => {
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

