import {File} from "./types"

// https://icones.js.org/collection/vscode-icons
// https://jetbrains.design/intellij/resources/icons_list/
const fileIcons = {
    "": <div className='i-vscode-icons:default-file'/>,
    ".go": <div className='i-vscode-icons:file-type-go-gopher'/>,
    ".ts": <div className='i-vscode-icons:file-type-typescript-official'/>,
    ".tsx": <div className='i-vscode-icons:file-type-reactts'/>,
    ".py": <div className='i-vscode-icons:file-type-python'/>,
    ".md": <div className='i-vscode-icons:file-type-markdown'/>,
    ".json": <div className='i-vscode-icons:file-type-light-json'/>,
    ".html": <div className='i-vscode-icons:file-type-html'/>,

    ".jpg": <div className='i-vscode-icons:file-type-image'/>,
    ".png": <div className='i-vscode-icons:file-type-image'/>,
    ".jpeg": <div className='i-vscode-icons:file-type-image'/>,
    ".webp": <div className='i-vscode-icons:file-type-image'/>,
    ".gif": <div className='i-vscode-icons:file-type-image'/>,
    ".ico": <div className='i-vscode-icons:file-type-image'/>,
    ".svg": <div className='i-vscode-icons:file-type-image'/>,
    ".sh": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="#43454A" stroke="#CED0D6"/>
        <path d="M4 6L6 8L4 10" stroke="#CED0D6" strokeWidth="1.2"/>
        <path d="M7.5 10.5H11.5" stroke="#CED0D6" strokeWidth="1.2"/>
    </svg>,
    ".gitignore": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M8.70711 1.30476C8.31658 0.914239 7.68342 0.914238 7.29289 1.30476L6.38067 2.21698L7.33533 3.17164C7.83709 2.8747 8.49461 2.94188 8.9259 3.37317C9.35718 3.80445 9.42436 4.46197 9.12742 4.96373L11.0361 6.87236C11.5378 6.57557 12.1952 6.64278 12.6264 7.07401C13.1373 7.58486 13.1373 8.41312 12.6264 8.92398C12.1155 9.43483 11.2873 9.43483 10.7764 8.92398C10.3457 8.49324 10.2781 7.83684 10.5738 7.33532L8.66437 5.42591C8.55791 5.48864 8.44448 5.535 8.32771 5.56501V10.4334C8.54666 10.4898 8.75385 10.6037 8.9253 10.7751C9.43615 11.286 9.43615 12.1143 8.9253 12.6251C8.41444 13.136 7.58618 13.136 7.07533 12.6251C6.56448 12.1143 6.56448 11.286 7.07533 10.7751C7.24692 10.6036 7.45432 10.4896 7.67348 10.4333V5.56485C7.45454 5.50847 7.24736 5.39457 7.07593 5.22313C6.64525 4.79245 6.57766 4.13618 6.87315 3.63469L5.91806 2.6796L1.30528 7.29238C0.914755 7.6829 0.914754 8.31607 1.30528 8.70659L7.29289 14.6942C7.68342 15.0847 8.31658 15.0847 8.70711 14.6942L14.6947 8.70659C15.0852 8.31607 15.0852 7.6829 14.6947 7.29238L8.70711 1.30476Z"
              fill="#F34E29"/>
    </svg>,


    ".txt": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="12" width="8" height="1" rx="0.5" fill="#CED0D6"/>
        <rect x="2" y="6" width="8" height="1" rx="0.5" fill="#CED0D6"/>
        <rect x="2" y="9" width="12" height="1" rx="0.5" fill="#CED0D6"/>
        <rect x="2" y="3" width="12" height="1" rx="0.5" fill="#CED0D6"/>
    </svg>
    ,
}

const dirIcons = {
    "": <div className='i-vscode-icons:default-folder'/>,
    ".github": <div className='i-vscode-icons:folder-type-github'/>,
    ".vscode": <div className='i-vscode-icons:folder-type-vscode'/>,
    ".vscode-oss": <div className='i-vscode-icons:folder-type-vscode'/>,
    ".vim": <div className='i-vscode-icons:file-type-vim'/>,
    "Pictures": <div className='i-vscode-icons:folder-type-images'/>,
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
