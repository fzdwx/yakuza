import {globalShortcut} from "electron";
import {LauncherApi} from "../preload/api";

const initShortCut = (api: LauncherApi) => {
    globalShortcut.register('Alt+Space', () => {
        if (api.getMain().isVisible()) {
            api.hide()
        } else {
            api.show()
        }
    })
}

export {initShortCut}
