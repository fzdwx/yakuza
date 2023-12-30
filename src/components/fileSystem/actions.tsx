import {shell} from "electron";
import {File} from "./types"
import {Action} from "@/lib/command";

export function getActions(file: File, fullPath: string, changeVisible: () => void) {
    return [
        {
            id: `OpenInFileManager:${file.name}`,
            name: `Open in File Manager`,
            perform: () => {
                shell.openPath(fullPath)
                changeVisible()
            }
        } as Action
    ]
}
