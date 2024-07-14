import {shell} from "electron";
import {File} from "./types"
import {Action} from "@/lib/command";

export function getActions(file: File, fullPath: string, changeVisible: () => void) {
    return [
        {
            id: `OpenInIdea:${file.name}`,
            name: 'Open in IntelliJ IDEA',
            perform: () => {
                window.launcher.execCommand("idea", [fullPath])
                changeVisible()
            }
        },
        {
            id: `OpenInFileManager:${file.name}`,
            name: `Open in File Manager`,
            perform: () => {
                shell.showItemInFolder(fullPath)
                changeVisible()
            }
        } as Action,
        {
            id: `OpenInVSCode:${file.name}`,
            name: 'Open in VSCode',
            perform: () => {
                window.launcher.execCommand("code", [fullPath])
                changeVisible()
            }
        },
    ]
}
