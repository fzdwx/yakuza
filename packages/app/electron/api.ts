import {app, BrowserWindow, clipboard, globalShortcut, ipcMain, shell} from "electron"
import {toCenter} from "./main/utils/screen";
import * as cmd from 'node:child_process'
import util from 'node:util'
import {execCommand, exitExt, getConfig, setConfig, setShortcut, Shortcut} from "../src/native";
import {sleep} from "ahooks/es/utils/testingHelpers";
import {ViewName} from "@/hooks/useView";
import {WinManager} from "./main/win-manager";
import {Theme} from "@/hooks/useTheme";

const spawn = util.promisify(cmd.spawn)


class LauncherApi {

    private m: WinManager;

    constructor(m: WinManager) {
        this.m = m
    }

    public getMain = () => {
        return this.m.getWindow()
    }

    public hello = () => {
        return 'hello world'
    }

    public hide = () => {
        this.getMain().blur()
        this.getMain().hide()
        this.loadMainView()
        this.getMain().webContents.reload()
    }

    public loadDevView({data}: { data: any }) {
        const {ops} = data
        this.loadView(`http://localhost:35678?ts=${Date.now()}&theme=${ops.theme}`);
        this.m.getExtensionView().webContents.openDevTools()
    }

    public openExtension({data}: { data: any }) {
        const {ext, ops} = data
        this.loadView(`http://localhost:35677?ext=${ext.fullPath}&ts=${Date.now()}&command=${ext.action?.command}&theme=${ops.theme}`);
    }

    public exitExtension() {
        exitExt()
        this.m.getExtensionView().webContents.loadURL('about:blank')
        this.getMain().setBrowserView(null)
        this.getMain().webContents.focus()
    }

    public loadMainView() {
        this.changeView('self')
        this.exitExtension()
    }

    public show = () => {
        this.getMain().show()
        toCenter(this.getMain())
        this.getMain().focus()
        this.getMain().webContents.focus()
    }

    public toggle = () => {
        if (this.getMain().isVisible()) {
            this.hide()
        } else {
            this.show()
        }
    }

    public openUrl = async ({data}: { data: any }) => {
        const {url} = data
        return await shell.openExternal(url)
    }

    public openPath = async ({data}: { data: any }) => {
        const {path} = data
        return await shell.openPath(path)
    }

    public async execCommand({data}: { data: any }) {
        const {command, args, terminal, stdin} = data
        return await execCommand(command, args, terminal, stdin)
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

    public set({data}: { data: any }): Promise<string> {
        const {key, value} = data
        return setConfig(key, value, false)
    }

    public get({data}: { data: any }): Promise<string> {
        const {key} = data
        return getConfig(key, false)
    }

    public executeJs({data}: { data: any }) {
        const {js} = data
        if (this.getMain().getBrowserView()) {
            this.getMain().getBrowserView()?.webContents.executeJavaScript(js)
        } else {
            this.getMain().webContents.executeJavaScript(js)
        }
    }

    public async setShortcut({data}: {
        data: {
            shortcut: Shortcut
        }
    }) {
        const {shortcut} = data
        const oldShortcut = (await setShortcut(shortcut)) as Shortcut
        if (oldShortcut.shortcut.length != 0 && oldShortcut.name.length != 0 && oldShortcut.kind.length != 0) {
            globalShortcut.isRegistered(oldShortcut.shortcut) && globalShortcut.unregister(oldShortcut.shortcut)
        }

        if (shortcut.shortcut.length > 0) {
            this.registerShortcut(shortcut)
        }
    }

    public registerShortcut(shortcut: Shortcut) {
        globalShortcut.register(shortcut.shortcut, async () => {
            if (shortcut.kind == 'Extension') {
                if (!this.getMain().isVisible()) {
                    this.show()
                } else {
                    this.getMain().focus()
                }
                const theme = await getConfig("theme", true)
                this.openExtension({
                    data: {
                        ext: shortcut.item, ops: {
                            theme: theme
                        }
                    }
                })
            }
        })
    }

    public changeTheme(theme: Theme) {
        this.getMain().webContents.send('changeTheme', theme)
    }

    public toggleDevTools() {
        this.getMain().webContents.toggleDevTools()
    }

    private loadView(url: string) {
        const view = this.m.getExtensionView();
        const b = this.getMain().getBounds();
        view.setBounds({
            x: 0,
            y: 0,
            height: b.height,
            width: b.width,
        })

        view.webContents.on('did-finish-load', () => {
            view.webContents.focus()
        })
        view.webContents.on('cursor-changed', () => {
            for (let i = 0; i < 5; i++) {
                view.webContents.focus()
                sleep(20)
            }
        })
        this.getMain().setBrowserView(view)
        this.changeView('extViewTransport')
        view.webContents.loadURL(url)
    }


    private changeView(view: ViewName) {
        this.getMain().webContents.send('changeView', view)
    }
}


const registerApi = (a: LauncherApi) => {

    ipcMain.handle('yakuza-api', async (event, arg) => {
        const window = arg.winId ? BrowserWindow.fromId(arg.winId) : a.getMain();
        //@ts-ignore
        return await a[arg.type](arg, window, event);
    })

    ipcMain.on('yakuza-api', async (event, arg) => {
        const window = arg.winId ? BrowserWindow.fromId(arg.winId) : a.getMain();
        //@ts-ignore
        const data = await a[arg.type](arg, window, event);
        event.returnValue = data;
    })
}

export {registerApi, LauncherApi}
