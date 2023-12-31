import {File} from "./types";
import {useEffect, useRef, useState} from "react";
import {sort} from "@/components/fileSystem/sort";
import {getIcon} from "./icons";
import {nanoid} from "nanoid";
import {convertToHtml, getLang} from "@/components/fileSystem/hliglight";

interface Props {
    path: string
    file?: File
}

const listFs = async (path: string): Promise<any> => {
    return (await fetch("http://localhost:35677/api/fs/list", {
        method: "POST",
        body: JSON.stringify({path: path})
    })).json()
}

interface ReadFileResp {
    content: string
    ext: string
    mime: string
}

const readFile = async (path: string): Promise<ReadFileResp> => {
    return (await fetch("http://localhost:35677/api/fs/read", {
        method: "POST",
        body: JSON.stringify({path: path})
    })).json()
}

const RenderDir = ({file, path}: Props) => {
    const [files, setFiles] = useState<File[]>([])
    useEffect(() => {
        listFs(path).then((resp) => {
            setFiles(sort(resp.files.slice(0, 200)))
        })
    }, [path])

    return <div>
        {files.map((file) => {
            return <div key={nanoid()} className='flex p-[0,8px] gap-8px content-center h-40px text-[var(--gray12)]'>
                <div className='mt-8px'>{getIcon(file)}</div>
                <div className='mt-4px'>{file.name}</div>
            </div>
        })}
    </div>
}

const imgInclude = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"]
const videoInclude = ["mp4", "mp3"]
const DispatchRender = ({file, path}: Props) => {
    if (imgInclude.includes(file?.name.split(".").pop() || "")) {
        return <div className=''>
            <img className='w-[calc(73vh)]' src={`file://${path}`} alt={file?.name}/>
        </div>
    }

    if (videoInclude.includes(file?.name.split(".").pop() || "")) {
        return <div className=''>
            <video autoPlay={true} className='w-[calc(73vh)]' src={`file://${path}`} controls/>
        </div>
    }

    return <DetectFile file={file} path={path}/>
}
const UnSupportFile = ({name, ext}: { name: string, ext: string }) => {
    // /boot/loader/random-seed
    return <div className='flex text-[var(--gray12)]'>
        <div className="justify-center content-center">{name} is {ext} file</div>
    </div>
}

const EmptyFile = ({name}: { name: string }) => {
    return <div className='justify-center text-[var(--gray12)]'>{name} is Empty file</div>
}

const DetectFile = ({file, path}: { file?: File, path: string }) => {
    if (!file) {
        return <div className='content-center'>{path}</div>
    }
    const [rf, setRf] = useState<ReadFileResp>()

    useEffect(() => {
        readFile(path).then((resp) => {
            setRf(resp)
        })
    }, [path])

    return <div>
        <RenderFile path={path} rf={rf} file={file} fileName={file.name}/>
    </div>
}

const binaryMime = ["application/octet-stream", "application/x-executable"]
const RenderFile = ({rf, fileName, file, path}: { rf?: ReadFileResp, fileName: string, file: File, path: string }) => {
    if (!rf) {
        return <div>Reading {fileName} ...</div>
    }
    if (rf.content.length === 0) {
        return <EmptyFile name={fileName}/>
    }
    if (binaryMime.includes(rf.mime)) {
        return <UnSupportFile name={fileName} ext="binary"/>
    }

    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!divRef.current) {
            return
        }

        convertToHtml(rf.content.slice(0, 12 * 1024), {
            lang: getLang(file),
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            }
        }).then(rs => {
            divRef.current!.innerHTML = rs
        })
    }, [rf.content, file])


    return <div className='overflow-x-scroll' ref={divRef}/>
}

export default ({file, path}: Props) => {
    if (!file) {
        return <div>
            {path}
        </div>
    }
    const filePath = `${path}${file.name}`
    if (file.isDir) {
        return <RenderDir path={filePath} file={file}/>
    }

    return <DispatchRender path={filePath} file={file}/>
}
