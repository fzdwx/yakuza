import React, {useEffect} from "react";
import {Command} from "launcher-api";
import {SubCommand} from "@/components/store/subCommand";
import {FileSystemIcon} from "@/components/icons";
import {nanoid} from "nanoid";
import {getIcon} from "@/components/fileSystem/icons";
import {File, FileInfo} from "./types"

const listFs = async (value: string, init: boolean): Promise<any> => {
    return (await fetch("http://localhost:35677/api/fs/list", {
        method: "POST",
        body: JSON.stringify({search: value, initial: init})
    })).json()
}

export default () => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('')
    const [path, setPath] = React.useState('')
    const [files, setFiles] = React.useState<File[] | undefined>([])

    function handleFsResp(resp: { files: File[], path: string } | undefined) {
        if (resp !== undefined && resp.path !== undefined && value.length === 0) {
            setPath(resp.path)
        }

        if (resp === undefined || resp.files === undefined || resp.files === null) {
            setFiles([])
        } else {
            setFiles(resp.files)
            setPath(resp.path)
        }
        if (resp) {
            if (value === "~/") {
                setValue(resp.path)
            }
        }
    }

    useEffect(() => {
        listFs("", true).then(({files, path}) => {
            setPath(path)
            setFiles(files)
            setValue(path)
        })
    }, [inputRef])

    useEffect(() => {
        listFs(value, false).then(handleFsResp)
    }, [value])

    const onValueChange = (v: string) => {
        setValue(v)
    }

    return (
        <Command className='raycast' label="File System" shouldFilter={true}>
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
            <Command.List ref={listRef}>
                {
                    files?.map((item) => {
                        return (<Command.Item
                            data-value={`${path}${item.name}`}
                            value={`${path}${item.name}`}
                            onSelect={() => {
                                if (item.isDir) {
                                    setValue(`${path}${item.name}/`)
                                }
                            }}
                            key={nanoid()}>
                            {getIcon(item)}
                            {item.name}
                        </Command.Item>)
                    })
                }

            </Command.List>

            <div cmdk-raycast-footer="">
                <FileSystemIcon/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
