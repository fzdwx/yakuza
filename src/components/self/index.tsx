import React, {useEffect} from 'react'
import {SearchItem, SearchResp} from "@/native/types";
import {useMatch} from "@/components/self/hooks/useMatch";
import {
    Action,
    KBarAnimator,
    KBarPortal,
    KBarPositioner,
    KBarProvider,
    KBarResults,
    KBarSearch,
    useMatches
} from "kbar";
import {toggle} from "@/components/self/helper";

export default function Self() {
    const [value, setValue] = React.useState('')
    const [items] = useMatch(value)

    useEffect(() => {
        toggle()
    }, [])

    return (
        <KBarProvider actions={toKBarAction(items)}>
            <KBarPortal>
                <KBarPositioner
                    style={{
                        zIndex: 10000,
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed',
                        padding: '0',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <KBarAnimator style={animatorStyle}>
                        <KBarSearch style={searchStyle}/>
                        <RenderResults/>
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
        </KBarProvider>

    )
}

const searchStyle = {
    padding: '12px 16px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
    outline: 'none',
    border: 'none',
    background: 'rgb(252 252 252)',
    color: 'rgb(28 28 29)',
};

const animatorStyle = {
    maxWidth: '900px',
    width: '100%',
    zIndex: 1000,
    background: 'rgb(252 252 252)',
    color: 'rgb(28 28 29)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 6px 20px rgb(0 0 0 / 20%)',
};

function RenderResults() {
    const {results} = useMatches();

    return (
        <KBarResults
            items={results}
            onRender={({item, active}) =>
                typeof item === "string" ? (
                    <div>{item}</div>
                ) : (
                    <div
                        style={{
                            background: active ? "#eee" : "transparent",
                        }}
                    >
                        {item.name}
                    </div>
                )
            }
        />
    );
}


const toKBarAction = (items: SearchResp<SearchItem>[]) => {
    return items.map((item): Action => {
        return {id: item.id, name: item.item.name}
    })
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