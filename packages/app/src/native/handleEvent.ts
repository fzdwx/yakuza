import {ipcRenderer} from 'electron'
import {useViewEvent} from "@/hooks/useView";
import {themeEvent, useTheme} from "@/hooks/useTheme";

const {changeView} = useViewEvent()
ipcRenderer.on('changeView', (_event, ...args) => {
    changeView(args[0])
})

ipcRenderer.on('changeTheme', (_event, ...args) => {
    themeEvent.emit('changeTheme', args[0])
})
