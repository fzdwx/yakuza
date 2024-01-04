import {app, BrowserWindow} from "electron"
import {Height, Width} from "../cons"
import {join} from 'node:path'
import {release} from 'node:os'
import {update} from "./update"
import {toCenter} from "./screen"

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}
export const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

export default (): WinManager => {
    let mainWin: BrowserWindow

    const init = () => {
        createWindow()
    }

    const createWindow = () => {
        mainWin = new BrowserWindow({
            title: 'launcher',
            focusable: true,
            resizable: true,
            width: Width,
            height: Height,
            titleBarStyle: 'hiddenInset',
            visualEffectState: "followWindow",
            alwaysOnTop: true,
            transparent: true,
            frame: false,
            icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
            webPreferences: {
                webSecurity: false,
                backgroundThrottling: false,
                experimentalFeatures: true,
                contextIsolation: false,
                webviewTag: true,
                nodeIntegration: true,
                spellcheck: false,
                preload
            },
        })

        if (url) { // electron-vite-vue#298
            mainWin.loadURL(url)
            // Open devTool if the app is not packaged
            mainWin.webContents.openDevTools()
        } else {
            mainWin.loadFile(indexHtml)
        }


        mainWin.on('close', () => {
            //@ts-ignore
            mainWin = null
        })

        update(mainWin)

        mainWin.setMenu(null)
        // mainWin.setMaximumSize(Width, Height)
        mainWin.setMinimumSize(Width, Height)
        toCenter(mainWin)
    }

    const getWindow = () => {
        return mainWin
    }

    const loadMainView = () => {
        if (url) { // electron-vite-vue#298
            mainWin.loadURL(url)
            // Open devTool if the app is not packaged
            // mainWin.webContents.openDevTools()
        } else {
            mainWin.loadFile(indexHtml)
        }
    }

    return {
        init,
        getWindow,
        loadMainView,
    }
}


interface WinManager {
    init: () => void;
    loadMainView: () => void;
    getWindow: () => Electron.CrossProcessExports.BrowserWindow;
}

export type {WinManager}
