import mitt, {Emitter} from 'mitt'

type Events = {
    changeView: string
}

const emitter: Emitter<Events> = mitt<Events>()

const useViewEvent = () => {
    return {
        emitter
    }
}

export {useViewEvent}
