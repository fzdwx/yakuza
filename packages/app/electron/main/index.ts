import {app, Tray, nativeImage} from "electron";
import main, {preload, WinManager} from "./mainWin";
import {LauncherApi, registerApi} from "../api";
import * as child_process from "child_process";
import util from "node:util";
import path from "node:path";
import {createView} from "./extension";
import {initShortCut} from "./shortcut";
import {handleChangeView} from "./handleChangeView";
import WebSocket from 'ws';
import {sleep} from "ahooks/es/utils/testingHelpers";

let exec = util.promisify(child_process.exec);

class Launcher {
    public m: WinManager
    public api: LauncherApi
    private tray?: Electron.CrossProcessExports.Tray;

    constructor() {
        this.m = main()
        this.api = new LauncherApi(this.m)
    }

    createWindow() {
        this.m.init()
        this.tray = new Tray(path.join(process.env.VITE_PUBLIC, 'logo.png'));
        registerApi(this.api)
        handleChangeView(this.api)
        initShortCut(this.api)
        createView(preload, this.m.getWindow())
    }

    async startBackend() {
        // check is dev
        if (process.env.NODE_ENV === 'development') {
            console.log("please start backend manually :)")
        } else {
            const dir = path.dirname(app.getAppPath())
            const {stdout} = await exec(`sh -c ${dir}/bin/launcher-native`)
            console.log('stdout:', stdout);
        }
    }

    connectBackend() {
        setTimeout(() => {
            const webSocket = new WebSocket("ws://localhost:35677/api/bridge");
            webSocket.on('message', (data) => {
                const {op} = JSON.parse(data.toString())
                switch (op) {
                    case 'hide':
                        this.api.hide()
                        return
                    case 'show':
                        this.api.show()
                        return
                    case 'toggle':
                        this.api.toggle()
                        return;
                }
            })
            webSocket.on('error', (e) => {
                setTimeout(() => {
                    console.log("try to connect backend")
                    this.connectBackend()
                }, 1000)
            });
        }, 1500)
    }
}

const launcher = new Launcher()
app.whenReady().then(async () => {
    launcher.createWindow()
    launcher.connectBackend()
    await launcher.startBackend()
})

app.on('activate', () => {
    if (launcher.m.getWindow() === null) {
        launcher.createWindow()
    }
})
