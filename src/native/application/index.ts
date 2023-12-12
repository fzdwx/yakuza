import * as fs from "node:fs";
import {Application, SearchResp} from "@/native";

const pattern = (path: string) => {
    return [
        path,
        `/usr/share/icons/hicolor/scalable/apps/${path}.svg`,
        `/usr/share/icons/hicolor/48x48/apps/${path}.png`,
        `/usr/share/icons/hicolor/32x32/apps/${path}.png`,
        `/usr/share/icons/hicolor/16x16/apps/${path}.png`,
        `/usr/share/icons/hicolor/128x128/apps/${path}.png`,
        `/usr/share/icons/hicolor/256x256/apps/${path}.png`,
        `/usr/share/icons/hicolor/512x512/apps/${path}.png`,
        `/usr/share/icons/breeze/apps/48/${path}.png`,
        `/usr/share/icons/breeze/apps/48/${path}.svg`,
        `/usr/share/icons/breeze/apps/16/${path}.svg`,
        `/usr/share/icons/breeze/status/16/${path}.svg`,
        `/usr/share/icons/breeze/status/24/${path}.svg`,
        `/usr/share/pixmaps/${path}.svg`,
        `/usr/share/pixmaps/${path}.png`,
        `/usr/share/pixmaps/${path}`,
        `/usr/share/icons/${path}.png`,
        `/usr/share/icons/breeze/actions/16/${path}.svg`,
        `/usr/share/icons/breeze/actions/24/${path}.svg`,
        `/usr/share/icons/breeze/places/16/${path}.svg`,
        `/usr/share/icons/breeze/preferences/16/${path}.svg`,
        `/usr/share/icons/breeze/devices/16/${path}.svg`,
        `/usr/share/icons/breeze/applets/64/${path}.svg`,
        `/usr/share/icons/breeze/preferences/24/${path}.svg`,
        `/usr/share/icons/breeze/preferences/32/${path}.svg`,
        `/usr/share/icons/Adwaita/16x16/legacy/${path}-symbolic.png`,
        `/usr/share/icons/Adwaita/symbolic/legacy/${path}-symbolic.png`,
        `/usr/share/icons/Adwaita/symbolic/legacy/${path}-symbolic.svg`,
        `/usr/share/icons/breeze/actions/symbolic/${path}.svg`,
        `/usr/share/icons/Adwaita/symbolic/legacy/${path}.svg`,
    ];
};

const iconCache = new Map<string, string>();
const getIcon = (app: Application) => {
    if (app.icon === "") {
        return null;
    }

    if (iconCache.has(app.icon)) {
        return iconCache.get(app.icon);
    }

    const p = pattern(app.icon);
    for (let i = 0; i < p.length; i++) {
        const item = p[i];
        if (fs.existsSync(item)) {
            const image = "file://" + item;
            iconCache.set(app.icon, image);
            return image;
        }
    }
    return null;
};

const getApplications = async () => {
    const resp = await fetch(`http://localhost:35677/api/applications`)
    return await resp.json() as Application[]
};

const addAppRunCount = async (app: Application) => {
    await fetch("http://localhost:35677/api/runHistory", {
        method: "POST",
        body: JSON.stringify({
            name: app.name,
            runType: "app",
            cmd: app.exec,
            terminal: app.terminal,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export {type Application, getApplications, getIcon, addAppRunCount};
