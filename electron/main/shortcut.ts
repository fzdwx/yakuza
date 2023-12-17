import {globalShortcut} from "electron";
import {LauncherApi} from "../api";
import {getShortcut, Shortcut} from "../../src/native";

const initShortCut = (api: LauncherApi) => {
    globalShortcut.register('Alt+Space', () => {
        if (api.getMain().isVisible()) {
            api.hide()
        } else {
            api.show()
        }
    })

    async function registerShortcut() {
        const shortcut = (await getShortcut()) as Shortcut[]
        shortcut.forEach((s) => {
            api.registerShortcut(s)
        })
    }

    registerShortcut()
}

export {initShortCut}
