import {Command} from 'launcher-api'
import React, {useEffect, useState} from 'react'
import {SubCommand} from "@/components/subCommand";
import RemoteExtension from "@/components/store/remoteExtension";
import StoreIcon from "@/components/store/storeIcon";
import {getRemoteExtensions, RemoteExtensionResp} from "@/native";

const useRemoteExtensions = () => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<RemoteExtensionResp[]>([])

    useEffect(() => {
        setLoading(true)
        getRemoteExtensions().then((apps) => {
            setExtensions(apps)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {
        extensions,
        loading
    }
}


export default function Store() {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const {extensions, loading} = useRemoteExtensions()
    React.useEffect(() => {
        inputRef.current?.focus()
    })

    const onValueChange = (v: string) => {
        setValue(v)
    }

    return (
        <Command className='raycast' label="Store">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input loading={loading} value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>Store is empty</Command.Empty>

                <RemoteExtension extensions={extensions}/>

            </Command.List>

            <div cmdk-raycast-footer="">
                <StoreIcon/>

                <button cmdk-raycast-open-trigger="">
                    Install Extension
                    <kbd>↵</kbd>
                </button>

                <hr/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
