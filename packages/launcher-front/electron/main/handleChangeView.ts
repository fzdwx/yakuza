import {LauncherApi} from "../api";
import {ipcMain} from "electron";
import {ViewName} from "@/hooks/useView";

function handleChangeView(a: LauncherApi) {
    ipcMain.on('changeView', (event, arg) => {
        const view = arg as ViewName
    })
}

export {handleChangeView}
