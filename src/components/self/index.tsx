import React from 'react'
import {
    KBarAnimator,
    KBarPortal,
    KBarPositioner,
    KBarProvider,
    KBarResults,
    KBarSearch,
    useMatches
} from "@/lib/kbar";
import RenderItem from "@/lib/kbar/RenderItem";
import {useRegisterApps} from "@/components/self/application";
import {useRegisterBuiltin} from "@/components/self/builtin";
import {useRegisterExtensions} from "@/components/self/extensions";

export default function Self() {
    return (
        <KBarProvider options={{defaultShow: true}}>
            <SelfCommand/>
        </KBarProvider>
    )
}

function SelfCommand() {
    useRegisterApps()
    useRegisterBuiltin()
    useRegisterExtensions()
    return (
        <KBarPortal>
            <KBarPositioner>
                <KBarAnimator>
                    <KBarSearch/>
                    <RenderResults/>
                </KBarAnimator>
            </KBarPositioner>
        </KBarPortal>
    )
}

function RenderResults() {
    const {results, rootActionId} = useMatches();
    return (
        <KBarResults
            items={results}
            footer={{
                icon: "🖖",
                actions: (current) => {
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
                },
                content: (current) => {
                    return <>
                        <span className='mr-1'>Open {current?.name}</span>
                        <kbd>↵</kbd>
                    </>
                }
            }}
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
    );
}
