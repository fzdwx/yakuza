import {app} from "electron";
import main from "./mainWin";
import {registerApi} from "../preload/api";
import * as child_process from "child_process";
import util from "node:util";
import path from "node:path";

let exec = util.promisify(child_process.exec);
let spawn = util.promisify(child_process.spawn);

class Launcher {
    init: () => void;
    getWindow: () => Electron.BrowserWindow;
    loadMainView: () => void;

    constructor() {
        const {init, getWindow, loadMainView} = main()
        this.init = init
        this.getWindow = getWindow
        this.loadMainView = loadMainView
    }

    createWindow() {
        this.init()
        registerApi(this.getWindow(), this.loadMainView)
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
    if (launcher.getWindow() === null) {
        launcher.createWindow()
    }
})
