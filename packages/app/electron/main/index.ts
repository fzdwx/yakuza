import {app} from "electron";
import main, {WinManager} from "./win-manager";
import {LauncherApi, registerApi} from "../api";
import * as child_process from "child_process";
import util from "node:util";
import path from "node:path";
import {initShortCut} from "./shortcut";
import WebSocket from 'ws';
import {handleBridge} from "./handleBridge";
import {attachTray} from "./tray";

let exec = util.promisify(child_process.exec);

class Launcher {
    public m: WinManager
    public api: LauncherApi

    constructor() {
        this.m = main()
        this.api = new LauncherApi(this.m)
    }

    createWindow() {
        this.m.init()
        attachTray(this.api)
        registerApi(this.api)
        initShortCut(this.api)
    }

    async startBackend() {
        // check is dev
        if (process.env.NODE_ENV === 'development') {
            console.log("please start backend manually :)")
        } else {
            const dir = path.dirname(app.getAppPath())
            const {stdout} = await exec(`sh -c ${dir}/bin/yakuza-native`)
            console.log('stdout:', stdout);
        }
    }

    connectBackend() {
        const reconnect = () => {
            setTimeout(() => {
                console.log("try to connect backend")
                this.connectBackend()
            }, 1000)
        }

        setTimeout(() => {
            const webSocket = new WebSocket("ws://localhost:35677/api/bridge");
            webSocket.on('message', handleBridge(this.api))
            webSocket.on('error', err=>{
                webSocket.close()
                console.error('Socket encountered error: ', err.message, 'Closing socket');
            });
            webSocket.on('close', reconnect)
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
