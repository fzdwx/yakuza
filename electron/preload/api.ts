import {BrowserWindow, app, ipcMain, clipboard, shell} from "electron"
import {toCenter} from "../main/screen";
import * as cmd from 'node:child_process'
import util from 'node:util'

const exec = util.promisify(cmd.exec)
const spawn = util.promisify(cmd.spawn)

let LoadMainView: () => void

class LauncherApi {

    private readonly mainWindow: BrowserWindow

    constructor(mainWindow: Electron.BrowserWindow, loadMainView: () => void) {
        this.mainWindow = mainWindow
        LoadMainView = loadMainView
    }

    public hello = () => {
        return 'hello world'
    }

    public hide = () => {
        this.mainWindow.blur()
        this.mainWindow.hide()
        LoadMainView()
    }

    public loadDevView() {
        this.mainWindow.loadURL('http://localhost:35678')
    }

    public openExtension({data}: { data: any }) {
        const {ext} = data
        this.mainWindow.loadURL(`http://localhost:8080?ext=${ext.fullPath}`)
    }

    public loadMainView() {
        LoadMainView()
    }

    public show = () => {
        this.mainWindow.show()
        toCenter(this.mainWindow)
        this.mainWindow.focus()
    }

    public openUrl = async ({data}: { data: any }) => {
        const {url} = data
        return await shell.openExternal(url)
    }

    public async execCommand({data}: { data: any }) {
        const {command, args} = data
        if (args && args.length > 0) {
            return await exec(`${command} ${args?.join(' ')}`)
        }
        return await exec(command)
    }

    public async spawn({data}: { data: any }) {
        const {command, args} = data
        return await spawn(command, args ? args : [], {})
    }

    public getPath({data}: { data: any }) {
        const {name} = data
        return app.getPath(name)
    }

    public getSelect() {
        return clipboard.readText('selection')
    }

    public getClipText() {
        return clipboard.readText()
    }

    public setClipText({data}: { data: any }) {
        const {text} = data
        clipboard.writeText(text)
    }
}

const registerApi = (mainWindow: Electron.BrowserWindow, loadMainView: () => void) => {
    const a = new LauncherApi(mainWindow, loadMainView)

    ipcMain.handle('launcher-api', async (event, arg) => {
        const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
        //@ts-ignore
        return await a[arg.type](arg, window, event);
    })

    ipcMain.on('launcher-api', async (event, arg) => {
        const window = arg.winId ? BrowserWindow.fromId(arg.winId) : mainWindow;
        //@ts-ignore
        const data = await a[arg.type](arg, window, event);
        event.returnValue = data;
    })
}

export {registerApi, LauncherApi}
