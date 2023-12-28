import {File} from "./types";
import {useEffect, useRef, useState} from "react";
import {sort} from "@/components/fileSystem/sort";
import {getIcon} from "./icons";
import {nanoid} from "nanoid";
import {convertToHtml} from "@/components/fileSystem/hliglight";
import {getLang} from "@/components/fileSystem/hliglight";

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

const readFile = async (path: string): Promise<any> => {
    return (await fetch("http://localhost:35677/api/fs/read", {
        method: "POST",
        body: JSON.stringify({path: path})
    })).text()
}

const RenderDir = ({file, path}: Props) => {
    const [files, setFiles] = useState<File[]>([])
    useEffect(() => {
        listFs(path).then((resp) => {
            setFiles(sort(resp.files))
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

const imgInclude = ["png", "jpg", "jpeg", "gif", "webp", "svg"]
const videoInclude = ["mp4", "mp3"]
const DispatchRender = ({file, path}: Props) => {
    if (imgInclude.includes(file?.name.split(".").pop() || "")) {
        return <div className=''>
            <img className='max-w-500px max-h-380px' src={`file://${path}`} alt={file?.name}/>
        </div>
    }

    if (videoInclude.includes(file?.name.split(".").pop() || "")) {
        return <div className=''>
            <video autoPlay={true} className='max-w-500px max-h-380px' src={`file://${path}`} controls/>
        </div>
    }

    return <RenderFile file={file} path={path}/>
}
const BinaryFile = ({name}: { name: string }) => {
    return `<div className='text-[var(--gray12)]'>${name} is Binary file</div>`
}

const EmptyFile = ({name}: { name: string }) => {
    return `<div className='text-[var(--gray12)]'>${name} is Empty file</div>`
}

const RenderFile = ({file, path}: { file?: File, path: string }) => {
    if (!file) {
        return <div>{path}</div>
    }
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        readFile(path).then((resp) => {
            if (resp.startsWith('ELF')) {
                divRef.current!.innerHTML = BinaryFile({name: file.name})
                return
            }
            if (resp.length === 0) {
                divRef.current!.innerHTML = EmptyFile({name: file.name})
                return
            }

            convertToHtml(resp, {
                // @ts-ignore
                lang: getLang(file),
                themes: {
                    light: 'github-light',
                    dark: 'vitesse-dark',
                }
            }).then(resp => {
                divRef.current!.innerHTML = resp
            })
        })
    }, [file])

    return <div ref={divRef}>
    </div>
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
