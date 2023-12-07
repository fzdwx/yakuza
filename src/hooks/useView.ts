import mitt from 'mitt'
import {useState} from "react";

type ViewEvent = {
    changeView: ViewName
}

type ViewName = 'self' | 'store'
const emitter = mitt<ViewEvent>()

emitter.on('changeView', (view: ViewName) => {
    console.log(view)
})

const useViewEvent = () => {
    return {
        emitter
    }
}

export {useViewEvent}

export type {ViewName}
