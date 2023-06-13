import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {GetClipText} from "../../wailsjs/go/main/App";
import {
    buildEvent, changeInputStateAction,
    exitAction,
    getClipTextAction,
    InputState, openUrlAction
} from "@fzdwx/launcher-api";
import {ExtEvent} from "@fzdwx/launcher-api/dist/types/ext/api/types";
import {ref} from "vue";
import {BrowserOpenURL} from "../../wailsjs/runtime";

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

handleMap.set(openUrlAction, (e) => {
    BrowserOpenURL(e.data)
})

const handler = (event: MessageEvent<any>) => {
    const {action, data} = event.data as ExtEvent<any>;
    const handle = handleMap.get(action);
    if (handle) {
        handle({action, data}, event.source);
    }
}
const init = () => {
    window.removeEventListener('message', handler)
    window.addEventListener('message', handler);
}


export {
    init, inputState
}
