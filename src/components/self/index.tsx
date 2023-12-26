import React from 'react'
import {useRegisterBuiltin, useRegisterExtensions} from "@/components/self/hooks/useMatch";
import {KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches} from "@/lib/kbar";
import {useRegisterApps} from "@/components/self/item/application";
import RenderItem from "@/lib/kbar/RenderItem";

export default function Self() {
    return (
        <KBarProvider options={{defaultShow: true}}>
            <SelfCommand/>
        </KBarProvider>
    )
}

function SelfCommand() {
    useRegisterExtensions()
    useRegisterApps()
    useRegisterBuiltin()
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


// <Command vimBindings={false} loop ref={commandRef} shouldFilter={false} className='raycast'
//                      label="Global Command Menu">
//                 <div cmdk-raycast-top-shine=""/>
//                 <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
//                 <Command.List ref={listRef}>
//                     <Command.Empty>No results found.</Command.Empty>
//
//                     <Command.Group heading={getHeader(value)}>
//                         {
//                             items.map((item) => {
//                                 return (<RenderItem key={nanoid()} item={item}/>)
//                             })
//                         }
//                     </Command.Group>
//                 </Command.List>
//
//                 <div cmdk-raycast-footer="">
//                     <div className='icon'>🖖</div>
//
//                     <button cmdk-raycast-open-trigger="">
//                         {
//
//                             currentItem ?
//                                 (<>
//                                     <span className='mr-1'>Open {getItemName(currentItem)}</span>
//                                     <kbd>↵</kbd>
//                                 </>)
//
//                                 : "Not Found"
//                         }
//                     </button>
//
//                     <hr/>
//
//                     <SubCommand currentItem={currentItem} listRef={listRef} selectedValue={value} inputRef={inputRef}/>
//                 </div>
//             </Command>