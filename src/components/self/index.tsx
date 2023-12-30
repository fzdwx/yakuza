import React from 'react'
import {
    Background,
    Container,
    Footer,
    Input,
    RenderItem,
    ResultsRender,
    useActionStore,
    useMatches
} from "@/lib/command";
import {extensionActions, ExtensionKind, useRegisterExtensions} from "@/components/self/extensions";
import {builtinActions, BuiltinKind, useRegisterBuiltin} from "@/components/self/builtin";
import {applicationActions, ApplicationKind, useRegisterApps} from "@/components/self/application";
import {useSettingsStore} from "@/hooks/useSettingsStore";

export default function Self() {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const {useRegisterActions, state, setResultHandleEvent, setActiveIndex, setRootActionId} = useActionStore();
    useRegisterExtensions(useRegisterActions)
    useRegisterBuiltin(useRegisterActions)
    useRegisterApps(useRegisterActions)

    const {results, rootActionId} = useMatches(value, state.actions, state.rootActionId);
    const {setCurrentItem} = useSettingsStore()
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
                    actions={(a) => {
                        if (typeof a === 'string' || a === null) {
                            return []
                        }

                        switch (a.kind) {
                            case ApplicationKind:
                                return applicationActions(a.item)
                            case ExtensionKind:
                                return extensionActions(a.item,setCurrentItem)
                            case BuiltinKind:
                                return builtinActions(a.item)
                            default:
                                return []
                        }
                    }}
                    icon={'🤖'}
                    onSubCommandHide={() => {
                        setResultHandleEvent(true)
                        inputRef.current?.focus()
                    }}
                    onSubCommandShow={() => {
                        setResultHandleEvent(false)
                    }}
                    content={(current) => {
                        return <div className='command-open-trigger'>
                            <span className='mr-1'>Open</span>
                            <kbd>↵</kbd>
                        </div>
                    }}
                    current={results.length === 0 ? null : results[state.activeIndex]}
                />
            </Background>
        </Container>
    )
}
