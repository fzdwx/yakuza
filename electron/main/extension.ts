import { BrowserView, BrowserWindow } from "electron";
import { Height, Width } from "./cons";

let view: BrowserView

const createView = (preload: string, mainWin: BrowserWindow) => {
  view = new BrowserView(
    {
      webPreferences: {
        preload,
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
      }
    }
  )
}

const getView = () => {
  return view
}


export { createView, getView }
