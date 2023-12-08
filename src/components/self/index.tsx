import {Command, RaycastLightIcon} from 'launcher-api'
import React from 'react'
import Application from './application'
import LocalExtension from "@/components/self/localExtension";
import {SubCommand} from "@/components/subCommand";

export default function Self() {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    React.useEffect(() => {
        inputRef.current?.focus()
    })

    const onValueChange = (v: string) => {
        setValue(v)
    }

    return (
        <Command shouldFilter={false} className='raycast' label="Global Command Menu">
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                <Command.Empty>No results found.</Command.Empty>

                <LocalExtension searchText={value}/>
                <Application searchText={value}/>

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
