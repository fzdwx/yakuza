import {Command} from "launcher-api";
import {File} from "./types";
import {useEffect, useState} from "react";
import {sort} from "@/components/fileSystem/sort";
import {getIcon} from "./icons";

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

const RenderDir = ({file, path}: Props) => {
    const [files, setFiles] = useState<File[]>([])
    useEffect(() => {
        listFs(path).then((resp) => {
            setFiles(sort(resp.files))
        })
    }, [path])

    return <div>
        {files.map((file) => {
            return <div className='flex p-[0,8px] gap-8px content-center h-40px text-[var(--gray12)]'>
                <div className='mt-8px'> {getIcon(file)}</div>
                <div className='mt-4px'>{file.name}</div>
            </div>
        })}
    </div>
}

const imgInclude = ["png", "jpg", "jpeg", "gif", "webp"]
const RenderFile = ({file, path}: Props) => {
    if (imgInclude.includes(file?.name.split(".").pop() || "")) {
        return <div className=''>
            <img className='max-w-500px max-h-400px' src={`file://${path}`} alt={file?.name}/>
        </div>
    }
    return <div>
        {file?.name}
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

    return <RenderFile path={filePath} file={file}/>
}
