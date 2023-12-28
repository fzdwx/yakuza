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
import {useRegisterExtensions} from "@/components/self/extensions";
import {useRegisterBuiltin} from "@/components/self/builtin";
import {useRegisterApps} from "@/components/self/application";

export default function Self() {
    const [inputValue, setInputValue] = React.useState("");
    const {useRegisterActions, state, setActiveIndex, setRootActionId} = useActionStore();
    useRegisterExtensions(useRegisterActions)
    useRegisterBuiltin(useRegisterActions)
    useRegisterApps(useRegisterActions)

    const {results, rootActionId} = useMatches(inputValue, state.actions, state.rootActionId);
    return (
        <Container>
            <Background>
                <Input value={inputValue}
                       onValueChange={setInputValue}
                       actions={state.actions}
                       currentRootActionId={state.rootActionId}
                       onCurrentRootActionIdChange={setRootActionId}
                />
                <ResultsRender items={results}
                               setActiveIndex={setActiveIndex}
                               search={inputValue}
                               setSearch={setInputValue}
                               setRootActionId={setRootActionId}
                               currentRootActionId={state.rootActionId}
                               activeIndex={state.activeIndex}
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
                        return [
                            {
                                name: 'Open in Browser',
                                id: 'open-in-browser',
                                perform: () => {
                                    window.open('https://www.baidu.com')
                                }
                            },
                            {
                                name: 'Open in Folder',
                                id: 'open-in-folder',
                            }
                        ]
                    }}
                    icon={'🤖'}
                    content={(current) => {
                        return <div className='command-open-trigger'>
                            <span className='mr-1'>Open</span>
                            <kbd>↵</kbd>
                        </div>
                    }}
                    current={results.length === 0 ? null : results[state.activeIndex]}/>
            </Background>
        </Container>
    )
}
