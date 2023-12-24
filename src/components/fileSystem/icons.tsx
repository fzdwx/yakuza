import {File} from "./types"

// https://icones.js.org/collection/vscode-icons
const fileIcons = {
    "": <div className='i-vscode-icons:default-file'/>,
    ".go": <div className='i-vscode-icons:file-type-go-gopher'/>,
    ".ts": <div className='i-vscode-icons:file-type-typescript-official'/>,
}

const dirIcons = {
    "": <div className='i-vscode-icons:default-folder'/>,
    ".github": <div className='i-vscode-icons:folder-type-github'/>,
}

const getIcon = (f: File) => {
    if (f.isDir) {
        // @ts-ignore
        return dirIcons[f.name] || dirIcons[""]
    }
    if (icon(f.name)) {
        return icon(f.name)
    }
    // get ext
    const ext = f.name.split(".").pop()
    if (ext) {
        if (icon("." + ext)) {
            return icon("." + ext)
        }
    }

    return icon("")
}

const icon = (name: string) => {
    // @ts-ignore
    return fileIcons[name]
}

export {getIcon}
