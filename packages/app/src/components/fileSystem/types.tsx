interface File {
    name: string
    isDir: boolean
    info?: FileInfo
}

interface FileInfo {
    size: number,
    mode: string,
    modTime: number,
}


export type {File, FileInfo}
