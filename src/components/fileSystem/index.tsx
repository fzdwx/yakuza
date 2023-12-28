import React, {useEffect, useMemo} from "react";
import {File} from "./types"
import {useKeyPress} from "ahooks";
import {sort} from "@/components/fileSystem/sort";
import {
    Action, ActionImpl,
    Background,
    Container, Footer,
    Input,
    RenderItem,
    ResultsRender,
    useActionStore,
    useMatches
} from "@/lib/command";
import {IFuseOptions} from "fuse.js";
import {getIcon} from "@/components/fileSystem/icons";
import {FileSystemIcon} from "@/components/icons";
import RenderFile from "@/components/fileSystem/renderFile";

const searchFs = async (value: string, init: boolean): Promise<any> => {
    return (await fetch("http://localhost:35677/api/fs/search", {
        method: "POST",
        body: JSON.stringify({search: value, initial: init})
    })).json()
}

const options: IFuseOptions<ActionImpl> = {
    keys: [
        {
            name: "id",
            weight: 0.5,
        },
        {
            name: "keywords",
            getFn: (item) => (item.keywords ?? "").split(","),
            weight: 0.5,
        },
        "subtitle",
    ],
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    minMatchCharLength: 1,
}

export default () => {
    const [path, setPath] = React.useState('')
    const [value, setValue] = React.useState("~/");
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const {useRegisterActions, state, setResultHandleEvent, setActiveIndex, setRootActionId} = useActionStore();
    const [files, setFiles] = React.useState<File[]>([])

    useRegisterActions(files.map(f => {
        return {
            id: `${path}${f.name}`,
            name: f.name,
            icon: getIcon(f),
            item: f,
            perform: () => {
                if (f.isDir) {
                    setValue(`${path}${f.name}/`)
                }
            }
        } as Action
    }), [files]);

    const sortAndSetFiles = (files: File[]) => {
        return setFiles(sort(files))
    }

    const {results, rootActionId} = useMatches(value, state.actions, state.rootActionId, options);
    const currentFile = useMemo(() => {
        const item = results[state.activeIndex];
        if (item && typeof item !== "string") {
            return item.item
        }
        return undefined
    }, [state.activeIndex, results])

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
    }

    const enterDir = (item: File) => {
        if (item.isDir) {
            setValue(`${path}${item.name}/`)
        }
    }

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

    useEffect(() => {
        searchFs("", true).then(({files, path}) => {
            setPath(path)
            sortAndSetFiles(files)
            setValue(path)
        })
    }, [inputRef])

    return (
        <Container>
            <Background>
                <Input value={value}
                       onValueChange={setValue}
                       inputRefSetter={(r) => {
                           inputRef.current = r
                       }}
                       actions={state.actions}
                       currentRootActionId={state.rootActionId}
                       onCurrentRootActionIdChange={setRootActionId}
                />
                <ResultsRender
                    width={'40%'}
                    detailsClassName={'w-60% h-420px truncate'}
                    details={
                        <div className='h-420px p-10px overflow-auto border-l-solid border-l-[var(--primary2)] border-l-2px'>
                            <RenderFile
                                file={currentFile} path={path}/>
                        </div>
                    }
                    items={results}
                    setActiveIndex={setActiveIndex}
                    search={value}
                    setSearch={setValue}
                    setRootActionId={setRootActionId}
                    currentRootActionId={state.rootActionId}
                    activeIndex={state.activeIndex}
                    handleKeyEvent={state.resultHandleEvent}
                    onRender={({item, active}) => {
                        if (typeof item === "string") {
                            return <div>{item}</div>
                        }

                        return <RenderItem
                            active={active}

                            action={item}
                            currentRootActionId={rootActionId ?? ''}
                        />
                    }
                    }
                />

                <Footer
                    icon={<FileSystemIcon/>}
                    onSubCommandHide={() => {
                        setResultHandleEvent(true)
                        inputRef.current?.focus()
                    }}
                    onSubCommandShow={() => {
                        setResultHandleEvent(false)
                    }}
                    content={(current) => {
                        return <div className='command-open-trigger'>
                            <span className='mr-1'>Open</span>
                            <kbd>↵</kbd>
                        </div>
                    }}
                    current={results.length === 0 ? null : results[state.activeIndex]}
                />
            </Background>
        </Container>
    )

    // return (
    //     <Command className='raycast' label="File System" shouldFilter={false} loop={true}>
    //         <div cmdk-raycast-top-shine=""/>
    //         <Command.Input value={value} onValueChange={onValueChange} autoFocus ref={inputRef}/>
    //
    //         <div className='flex'>
    //             <div className='w-40%'>
    //                 <Command.List ref={listRef}>
    //                     {
    //                         files?.map((item) => {
    //                             return (<Command.Item
    //                                 data-value={`${path}${item.name}`}
    //                                 value={`${path}${item.name}`}
    //                                 onHover={() => {
    //                                     setCurrentFile(item)
    //                                 }}
    //                                 onSelect={() => {
    //                                     enterDir(item);
    //                                 }}
    //                                 key={nanoid()}>
    //                                 {getIcon(item)}
    //                                 <span className='truncate'>{item.name}</span>
    //                             </Command.Item>)
    //                         })
    //                     }
    //                 </Command.List>
    //             </div>
    //
    //             <div className='h-400px w-60% p-10px m-10px border shadow shadow-white/10'>
    //                 <RenderFile file={currentFile} path={path}/>
    //             </div>
    //         </div>
    //
    //
    //         <div cmdk-raycast-footer="">
    //             <FileSystemIcon/>
    //
    //             <SubCommand listRef={listRef} selectedValue={value} inputRef={inputRef}/>
    //         </div>
    //     </Command>
    // )
}
