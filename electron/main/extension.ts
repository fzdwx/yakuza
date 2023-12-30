import {BrowserView, BrowserWindow} from "electron";
import {Height, Width} from "../cons";

let view: BrowserView

const createView = (preload: string, mainWin: BrowserWindow) => {
    view = new BrowserView(
        {
            webPreferences: {
                preload,
                webSecurity: false,
                experimentalFeatures: true,
                nodeIntegration: true,
                contextIsolation: false,
                devTools: true,
                webviewTag: true,
            }
        }
    )

    mainWin.on('resize', () => {
        if (view) {
            const b = mainWin.getBounds();
            view.setBounds({x: 0, y: 0, width: b.width, height: b.height})
        }
    })
}

const getView = () => {
    return view
}


export {createView, getView}
