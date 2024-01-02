import {app} from "electron";
import main, {preload, WinManager} from "./mainWin";
import {LauncherApi, registerApi} from "../api";
import * as child_process from "child_process";
import util from "node:util";
import path from "node:path";
import {createView} from "./extension";
import {initShortCut} from "./shortcut";
import {handleChangeView} from "./handleChangeView";

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
}

const launcher = new Launcher()
app.whenReady().then(async () => {
    launcher.createWindow()
    await launcher.startBackend()
})

app.on('activate', () => {
    if (launcher.m.getWindow() === null) {
        launcher.createWindow()
    }
})
