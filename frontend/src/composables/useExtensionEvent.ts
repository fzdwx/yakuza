import mitt, {Emitter} from 'mitt'

type Events = {
    userInput: string
}

const emitter: Emitter<Events> = mitt<Events>()

const useExtensionEvent = () => {
    return {
        emitter
    }
}

export {useExtensionEvent}
