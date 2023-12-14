import {Command} from 'launcher-api'
import React, {useState} from 'react'
import {SubCommand} from "@/components/self/subCommand";
import {SearchItem, SearchResp} from "@/native/types";
import RenderItem from "@/components/self/item/renderItem";
import {getHeader, getItemName, selectFirstItem} from "@/components/self/helper";
import {useHover} from "@/components/self/hooks";
import {useMatch} from "@/components/self/hooks/useMatch";
import {nanoid} from "nanoid";

export default function Self() {
    const commandRef = React.useRef<HTMLInputElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const [currentItem, setCurrentItem] = useState<SearchResp<SearchItem>>()
    const [items] = useMatch(value)

    const {on} = useHover()

    React.useEffect(() => {
        inputRef.current?.focus()
    })

    React.useEffect(() => {
        selectFirstItem();
    }, [])

    on(setCurrentItem)

    React.useEffect(() => {
        if (items.length === 0) {
            setCurrentItem(undefined)
        }
    }, [items])

    const onValueChange = (v: string) => {
        setValue(v)
        selectFirstItem();
    }

    return (
        <Command vimBindings={false} loop ref={commandRef} shouldFilter={false} className='raycast' label="Global Command Menu">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading={getHeader(value)}>
                    {
                        items.map((item) => {
                            return (<RenderItem key={nanoid()} item={item}/>)
                        })
                    }
                </Command.Group>
            </Command.List>

            <div cmdk-raycast-footer="">
                <div className='icon'>🖖</div>

                <button cmdk-raycast-open-trigger="">
                    {

                        currentItem ?
                            (<>
                                <span className='mr-1'>Open {getItemName(currentItem)}</span>
                                <kbd>↵</kbd>
                            </>)

                            : "Not Found"
                    }
                </button>

                <hr/>

                <SubCommand currentItem={currentItem} listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
