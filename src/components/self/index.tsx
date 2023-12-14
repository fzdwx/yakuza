import {Command} from 'launcher-api'
import React, {useState} from 'react'
import {useApplications} from './item/applicationItem'
import {useLocalExtensions} from "@/components/self/item/localExtension";
import {SubCommand} from "@/components/self/subCommand";
import {useBuiltin} from "@/components/self/item/builtin";
import {appsToResp, builtinToResp, extToResp, SearchItem, SearchResp} from "@/native/types";
import {Application, LocalExtension} from "@/native";
import RenderItem from "@/components/self/item/renderItem";
import {getHeader, getItemName, selectFirstItem} from "@/components/self/helper";
import {nanoid} from "nanoid";
import {useHover} from "@/components/self/hooks";
import Fuse from "fuse.js";

function setId(array: SearchResp<SearchItem>[]) {
    return array.map(a => {
        a.id = nanoid()
        return a
    })
}

const sort = (value: string, extensions: LocalExtension[], apps: Application[], builtins: string[]) => {
    const arr = setId([...extToResp(extensions), ...appsToResp(apps), ...builtinToResp(builtins)])
    if (value.length === 0) {
        return arr
    }

    const fuse = new Fuse(arr, {
        includeScore: true,
        keys: [
            "item.name"
        ]
    })

    const resp = fuse.search(value);
    return resp.map(v => {
        const item = v.item;
        item.score = v.score
        return item
    }).slice(0, 5);
}

export default function Self() {
    const commandRef = React.useRef<HTMLInputElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const [items, setItems] = useState<SearchResp<SearchItem>[]>([])
    const [currentItem, setCurrentItem] = useState<SearchResp<SearchItem>>()

    const {extensions, refreshExt,} = useLocalExtensions()
    const {apps, refreshApp} = useApplications()
    const {builtins} = useBuiltin()
    const {on} = useHover()

    React.useEffect(() => {
        inputRef.current?.focus()
    })

    React.useEffect(()=>{
        selectFirstItem();
    },[])

    on((item) => {
        setCurrentItem(item)
    })

    React.useEffect(() => {
        const arr = sort(value, extensions, apps, builtins)
        if (arr.length === 0) {
            setCurrentItem(undefined)
        }
        setItems(arr)
    }, [extensions, apps, builtins, value])

    // useInterval(() => {
    //     if (doingSearch({searchText: value})) return
    //     refreshExt(value)
    //     refreshApp(value)
    // }, 1000)

    const onValueChange = (v: string) => {
        setValue(v)
        selectFirstItem();
    }

    return (
        <Command ref={commandRef} shouldFilter={false} className='raycast' label="Global Command Menu">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading={getHeader(value)}>
                    {
                        items.map((item) => {
                            return (<RenderItem item={item}/>)
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
