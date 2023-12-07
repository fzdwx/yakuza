import mitt from 'mitt'
import {useState} from "react";

type ViewEvent = {
    changeView: ViewName
}

type ViewName = 'self' | 'store'
const emitter = mitt<ViewEvent>()

const useViewEvent = () => {
    const changeView = (viewName: ViewName) => {
        emitter.emit('changeView', viewName)
    }

    return {
        emitter,
        changeView
    }
}

export {useViewEvent}

export type {ViewName}
