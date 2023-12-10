import {BrowserWindow, app, ipcMain, clipboard, shell} from "electron"
import {toCenter} from "../main/screen";
import * as cmd from 'node:child_process'
import util from 'node:util'
import {execCommand, getConfig, setConfig} from "../../src/native";
import {LauncherApiType} from "launcher-api";
import {getView} from "../main/extension";
import {Height, Width} from "../main/cons";

const spawn = util.promisify(cmd.spawn)

let LoadMainView: () => void

class LauncherApi implements LauncherApiType {

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
        this.loadMainView()
    }

    public loadDevView() {
        const view = getView();
        view.setBounds({
            x: 0,
            y: 0,
            height: Height,
            width: Width,
        })
        view.webContents.on('did-finish-load', () => {
            view.webContents.focus()
        })
        view.webContents.loadURL(`http://localhost:35678`)
        this.mainWindow.setBrowserView(view)
    }

    public openExtension({data}: { data: any }) {
        const {ext} = data
        const view = getView();
        view.setBounds({
            x: 0,
            y: 0,
            height: Height,
            width: Width,
        })
        view.webContents.on('did-finish-load', () => {
            view.webContents.focus()
        })
        view.webContents.loadURL(`http://localhost:8080?ext=${ext.fullPath}`)
        this.mainWindow.setBrowserView(view)
    }

    public exitExtension() {
        this.mainWindow.setBrowserView(null)
        this.mainWindow.webContents.focus()
    }

    public loadMainView() {
        this.mainWindow.webContents.send('changeView', 'self')
        this.exitExtension()
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
        const {command, args, terminal} = data
        return await execCommand(command, args ? args : [], terminal)
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

    public set({data}: { data: any }): Promise<void> {
        const {key, value} = data
        return setConfig(key, value)
    }

    public get<T>({data}: { data: any }): Promise<T> {
        const {key} = data
        return getConfig(key)
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
