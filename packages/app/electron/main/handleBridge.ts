import {LauncherApi} from "../api";

export const handleBridge = (api: LauncherApi) => {
    return (data) => {
        const {op} = JSON.parse(data.toString())
        switch (op) {
            case 'hide':
                api.hide()
                return
            case 'show':
                api.show()
                return
            case 'toggle':
                api.toggle()
                return;
            case 'toggleTheme':
                api.changeTheme("toggle")
                return;
        }
    }
}
