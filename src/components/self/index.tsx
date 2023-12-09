import {Command, RaycastLightIcon} from 'launcher-api'
import React, {useState} from 'react'
import {useApplications} from './applicationItem'
import {useLocalExtensions} from "@/components/self/localExtension";
import {SubCommand} from "@/components/subCommand";
import Builtin from "@/components/self/builtin";
import {SearchItem, SearchResp} from "@/native/types";
import {Application, LocalExtension} from "@/native";
import RenderItem from "@/components/self/renderItem";

const sort = (extensions: SearchResp<LocalExtension>[], apps: SearchResp<Application>[]) => {
    const arr = [...extensions, ...apps]
    arr.sort((a, b) => {
        return b.score - a.score
    })

    return arr
}


export default function Self() {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const [items, setItems] = useState<SearchResp<SearchItem>[]>([])

    const {extensions,} = useLocalExtensions(value)
    const {apps,} = useApplications(value)

    React.useEffect(() => {
        inputRef.current?.focus()
    })

    React.useEffect(() => {
        const arr = sort(extensions, apps)
        setItems(arr)
    }, [extensions, apps])

    const onValueChange = (v: string) => {
        setValue(v)
    }

    // todo 重构搜索， 不区分 group 转移到一个里面，只根据类型来渲染
    return (
        <Command shouldFilter={false} className='raycast' label="Global Command Menu">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>No results found.</Command.Empty>

                {
                    items.map((item) => {
                        return (<RenderItem key={item.item.name + item.kind + item.score} item={item}/>)
                    })
                }

                < Builtin searchText={value}/>

            </Command.List>

            <div cmdk-raycast-footer="">
                <RaycastLightIcon/>

                <button cmdk-raycast-open-trigger="">
                    Open Application
                    <kbd>↵</kbd>
                </button>

                <hr/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
