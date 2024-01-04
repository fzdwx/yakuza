import {ipcRenderer} from 'electron'
import {useViewEvent} from "@/hooks/useView";

const {changeView} = useViewEvent()
ipcRenderer.on('changeView', (_event, ...args) => {
    changeView(args[0])
})
