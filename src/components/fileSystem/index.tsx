import React, {useEffect} from "react";
import {Command} from "launcher-api";
import {SubCommand} from "@/components/store/subCommand";
import {FileSystemIcon} from "@/components/icons";
import {nanoid} from "nanoid";
import {getIcon} from "@/components/fileSystem/icons";
import {File, FileInfo} from "./types"
import {useKeyPress} from "ahooks";
import {selectFirstItem} from "@/components/self/helper";

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
    const [currentFile, setCurrentFile] = React.useState<File | undefined>(undefined)

    const handleFsResp = (resp: { files: File[], path: string } | undefined) => {
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

    const onValueChange = (v: string) => {
        setValue(v)
    }

    const goPrevDir = () => {
        const p = path.split("/").slice(0, -2).join("/");
        setValue(p)
        selectFirstItem(50)
    }

    const enterDir = (item: File) => {
        if (item.isDir) {
            setValue(`${path}${item.name}/`)
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

    useKeyPress("leftarrow", (e) => {
        goPrevDir()
        e.preventDefault()
    })

    useKeyPress("rightarrow", (e) => {
        if (currentFile && currentFile.isDir) {
            enterDir(currentFile)
            e.preventDefault()
        }
    })


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
                            onHover={() => {
                                setCurrentFile(item)
                            }}
                            onSelect={() => {
                                enterDir(item);
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
