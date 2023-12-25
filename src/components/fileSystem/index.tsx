import React, {useEffect} from "react";
import {Command} from "launcher-api";
import {SubCommand} from "@/components/store/subCommand";
import {FileSystemIcon} from "@/components/icons";
import {nanoid} from "nanoid";
import {getIcon} from "@/components/fileSystem/icons";
import {File} from "./types"
import {useKeyPress} from "ahooks";
import {selectFirstItem} from "@/components/self/helper";
import RenderFile from "@/components/fileSystem/renderFile";
import {sort} from "@/components/fileSystem/sort";

const searchFs = async (value: string, init: boolean): Promise<any> => {
    return (await fetch("http://localhost:35677/api/fs/search", {
        method: "POST",
        body: JSON.stringify({search: value, initial: init})
    })).json()
}

export default () => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLInputElement>(null)
    const [value, setValue] = React.useState('~/')
    const [path, setPath] = React.useState('')
    const [files, setFiles] = React.useState<File[] | undefined>([])
    const [currentFile, setCurrentFile] = React.useState<File | undefined>(undefined)

    const sortAndSetFiles = (files: File[]) => {
        return setFiles(sort(files))
    }

    const handleFsResp = (resp: { files: File[], path: string } | undefined) => {
        if (resp !== undefined && resp.path !== undefined && value.length === 0) {
            setPath(resp.path)
        }

        if (resp === undefined || resp.files === undefined || resp.files === null) {
            sortAndSetFiles([])
        } else {
            sortAndSetFiles(resp.files)
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
        let p = value
        if (!p.endsWith("/")) {
            p = p.slice(0, p.lastIndexOf("/"))
        } else {
            p = p.split("/").slice(0, -2).join("/");
        }

        if (!p.endsWith("/")) {
            p = `${p}/`
        }
        setValue(p)
        selectFirstItem(50)
    }

    const enterDir = (item: File) => {
        if (item.isDir) {
            setValue(`${path}${item.name}/`)
            selectFirstItem(50)
        }
    }

    useEffect(() => {
        searchFs("", true).then(({files, path}) => {
            setPath(path)
            sortAndSetFiles(files)
            setValue(path)
        })
    }, [inputRef])

    useEffect(() => {
        searchFs(value, false).then(handleFsResp)
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
        <Command className='raycast' label="File System" shouldFilter={false} loop={true}>
            <div cmdk-raycast-top-shine=""/>
            <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>

            <div className='flex'>
                <div className='w-40%'>
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
                                    <span className='truncate'>{item.name}</span>
                                </Command.Item>)
                            })
                        }
                    </Command.List>
                </div>

                <div className='h-400px w-60% p-10px m-10px border shadow shadow-white/10'>
                    <RenderFile file={currentFile} path={path}/>
                </div>
            </div>


            <div cmdk-raycast-footer="">
                <FileSystemIcon/>

                <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
            </div>
        </Command>
    )
}
