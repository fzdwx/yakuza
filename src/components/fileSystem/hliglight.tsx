import {codeToHtml, getHighlighter} from 'shikiji'
import {File} from "@/components/fileSystem/types";


getHighlighter({
    themes: ['vitesse-dark', 'github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', "jsx", 'shell', 'go', 'zsh', 'json', 'markdown', "makefile"],
})

const convertToHtml = codeToHtml

const langMap = {
    ".zshrc": "zsh",
    ".bashrc": "bash",
    ".bash_profile": "bash",
    ".bash_aliases": "bash",
    ".bash_functions": "bash",
    ".bash_history": "bash",
    ".bash_logout": "bash",
    ".zshenv": "zsh",
    ".zprofile": "zsh",
    ".json": "json",
    ".js": "javascript",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".jsx": "jsx",
    ".md": "markdown",
    ".go": "go"
}

const getLang = (f: File) => {
    if (f.isDir) {
        return "txt"
    }
    const lang = langMap[f.name];
    if (lang) {
        return lang
    }

    const ext = f.name.split(".").pop();
    if (ext) {
        return langMap["." + ext] || "txt"
    }

    return "txt"
}

export {getLang}


export {convertToHtml}
