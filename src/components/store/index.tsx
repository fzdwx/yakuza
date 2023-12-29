import {useKeyPress} from 'ahooks'
import React, {useEffect, useMemo, useState} from 'react'
import StoreIcon from "@/components/store/storeIcon";
import {
    getRemoteExtensions,
    installExtension,
    RemoteExtensionResp,
} from "@/native";
import {useViewEvent} from "@/hooks/useView";
import {
    Action,
    Background,
    Container, Footer,
    Input, RenderItem,
    ResultsRender,
    useActionStore,
    useMatches,
    UseRegisterActions
} from "@/lib/command";
import {sleep} from "ahooks/es/utils/testingHelpers";

const useRegisterRemoteExtensions = (useRegisterActions: UseRegisterActions) => {
    const [extensions, setExtensions] = useState<RemoteExtensionResp[]>([])
    const actions = useMemo(() => {
        return extensions?.map(
            (ext): Action => ({
                id: `remote-ext-${ext.name}-${ext.author}`,
                name: ext.name ?? '',
                item: ext,
                kind: 'Extension',
                icon: <img className="w-4" alt='img' src={ext.icon}/>,
                perform: async () => {
                    if (ext.installed) {
                        // @ts-ignore
                        window.launcher.openExtension(ext)
                        return
                    }

                    const text = await installExtension(ext)
                    sleep(100).then(() => {
                        getRemoteExtensions().then(e => {
                            setExtensions(e)
                        })
                    })
                }
            }),
        );
    }, [extensions]);

    useEffect(() => {
        getRemoteExtensions().then(e => {
            setExtensions(e)
        })
    }, [])

    useRegisterActions(actions, [actions]);
}

export default function Store() {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const {useRegisterActions, state, setResultHandleEvent, setActiveIndex, setRootActionId} = useActionStore();
    const {results, rootActionId} = useMatches(value, state.actions, state.rootActionId);

    const currentExt = useMemo(() => {
        const item = results[state.activeIndex];
        if (item && typeof item !== "string") {
            return item.item
        }
        return undefined
    }, [state.activeIndex, results])

    useRegisterRemoteExtensions(useRegisterActions)

    const {changeView} = useViewEvent()
    useKeyPress('esc', () => {
        changeView('self')
    })

    return (
        <Container>
            <Background>
                <Input value={value}
                       onValueChange={setValue}
                       inputRefSetter={(r) => {
                           inputRef.current = r
                       }}
                       actions={state.actions}
                       currentRootActionId={state.rootActionId}
                       onCurrentRootActionIdChange={setRootActionId}
                />

                <ResultsRender items={results}
                               setActiveIndex={setActiveIndex}
                               search={value}
                               setSearch={setValue}
                               setRootActionId={setRootActionId}
                               currentRootActionId={state.rootActionId}
                               activeIndex={state.activeIndex}
                               handleKeyEvent={state.resultHandleEvent}
                               onRender={({item, active}) => {
                                   if (typeof item === "string") {
                                       return <div>{item}</div>
                                   }

                                   return <RenderItem
                                       active={active}

                                       action={item}
                                       currentRootActionId={rootActionId ?? ''}
                                   />
                               }
                               }
                />

                <Footer
                    icon={<StoreIcon/>}
                    onSubCommandHide={() => {
                        setResultHandleEvent(true)
                        inputRef.current?.focus()
                    }}
                    onSubCommandShow={() => {
                        setResultHandleEvent(false)
                    }}
                    content={(current) => {
                        return <div className='command-open-trigger'>
                            {currentExt?.installed ? 'Open extension' : 'Install Extension'}
                            <kbd>↵</kbd>
                        </div>
                    }}
                    current={results.length === 0 ? null : results[state.activeIndex]}
                />
            </Background>
        </Container>
    )
}
