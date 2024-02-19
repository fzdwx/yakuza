import mitt from 'mitt'
import {useState} from "react";
import {ipcRenderer} from "electron";

type ViewEvent = {
    changeView: ViewName
}

type ViewName = 'self' | 'Store' | 'extView' | 'extViewTransport' | 'Extension Settings' | 'File System'
const emitter = mitt<ViewEvent>()

const useViewEvent = () => {
    const changeView = (viewName: ViewName) => {
        ipcRenderer.postMessage('changeView', viewName)
        emitter.emit('changeView', viewName)
    }

    return {
        emitter,
        changeView
    }
}

export {useViewEvent}

export type {ViewName}
