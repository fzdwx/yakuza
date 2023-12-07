import {Command, useCommandState} from 'launcher-api'
import {useInterval, useKeyPress} from 'ahooks'
import React, {useEffect, useState} from 'react'
import {SubCommand} from "@/components/subCommand";
import RemoteExtension from "@/components/store/remoteExtension";
import StoreIcon from "@/components/store/storeIcon";
import {
    getRemoteExtensions,
    RemoteExtensionResp,
} from "@/native";
import {useViewEvent} from "@/hooks/useView";

const useRemoteExtensions = () => {
    const [loading, setLoading] = useState(true)
    const [extensions, setExtensions] = useState<RemoteExtensionResp[]>([])

    const get = () => {
        setLoading(true)
        getRemoteExtensions().then((apps) => {
            setExtensions(apps)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        get()
    }, []);

    useInterval(() => {
        get()
    }, 1000);


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
    const [currentExt, setCurrentExt] = useState<RemoteExtensionResp>()
    React.useEffect(() => {
        inputRef.current?.focus()
    })

    const {changeView} = useViewEvent()

    const onValueChange = (v: string) => {
        setValue(v)
    }

    useKeyPress('esc', () => {
        changeView('self')
    })

    return (
        <Command className='raycast' label="Store">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input loading={loading} value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>Store is empty</Command.Empty>

                <RemoteExtension changeExtension={setCurrentExt} extensions={extensions}/>

            </Command.List>

            <div cmdk-raycast-footer="">
                <StoreIcon/>

                <button cmdk-raycast-open-trigger="">
                    {currentExt?.installed ? 'Open extension' : 'Install Extension'}
                    <kbd>↵</kbd>
                </button>

                <hr/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
