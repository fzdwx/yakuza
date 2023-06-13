import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {GetClipText} from "../../wailsjs/go/main/App";
import {
    buildEvent, changeInputStateAction,
    exitAction,
    getClipTextAction,
    InputState
} from "@fzdwx/launcher-api";
import {ExtEvent} from "@fzdwx/launcher-api/dist/types/ext/api/types";
import {ref} from "vue";

const viewEvent = useViewEvent();

type Handle<T> = (e: ExtEvent<T>, source: MessageEventSource | null) => void;

const handleMap: Map<string, Handle<any>> = new Map();

handleMap.set(exitAction, (e) => {
    viewEvent.emitter.emit('changeView', View.Self)
})

handleMap.set(getClipTextAction, (e, s) => {
    (async () => {
        const text = await GetClipText()
        s?.postMessage(buildEvent(getClipTextAction, 'qwheqjkehjkqwhekqjwheqk'), {
            targetOrigin: '*'
        })
    })()
})

const inputState = ref<InputState>({
    loading: false,
})
handleMap.set(changeInputStateAction, (e) => {
    if (e.data) {
        const newState = JSON.parse(e.data) as InputState;
        if (newState.loading !== undefined) {
            inputState.value.loading = newState.loading;
        }
    }
})

const init = () => {
    window.addEventListener('message', (event) => {
        const {action, data} = event.data as ExtEvent<any>;
        const handle = handleMap.get(action);
        if (handle) {
            handle({action, data}, event.source);
        }
    });
}


export {
    init, inputState
}
