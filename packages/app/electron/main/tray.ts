import {LauncherApi} from "../api";
import {Menu, Tray} from "electron";
import path from "node:path";

export const attachTray = (api: LauncherApi) => {
    const tray = new Tray(path.join(process.env.VITE_PUBLIC, 'logo.png'));
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Switch Theme',
            click: () => {
                api.changeTheme("toggle")
            }
        },
        {
            label: 'Toggle DevTools',
            click: () => {
                api.toggleDevTools()
            }
        }
    ]))
    tray.on('click', () => {
        api.toggle()
    })
}
