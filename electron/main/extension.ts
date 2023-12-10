import {BrowserView, BrowserWindow} from "electron";
import {Height, Width} from "./cons";

let view: BrowserView

const createView = (preload: string, mainWin: BrowserWindow) => {
    view = new BrowserView(
        {
            transparent: true,
            webPreferences: {
                preload,
                webSecurity: false,
                experimentalFeatures: true,
                nodeIntegration: true,
                contextIsolation: false,
                devTools: true,
                transparent: true,
                webviewTag: true,
            }
        }
    )
}

const getView = () => {
    return view
}


export {createView, getView}
