import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {GetClipText} from "../../wailsjs/go/main/App";
import {buildEvent, exitAction, getClipTextAction, userInputAction} from "@fzdwx/launcher-api";
import {ExtEvent} from "@fzdwx/launcher-api/dist/types/ext/api/types";
import {useExtensionEvent} from "../composables/useExtensionEvent";
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

const extensionEvent = useExtensionEvent();
const extensionFrameWindow = ref<WindowProxy>();

const init = () => {
    window.addEventListener('message', (event) => {
        const {action, data} = event.data as ExtEvent<any>;
        const handle = handleMap.get(action);
        if (handle) {
            handle({action, data}, event.source);
        }
    });

    extensionEvent.emitter.on("userInput", (text) => {
        if (extensionFrameWindow.value) {
            extensionFrameWindow.value.postMessage(buildEvent(userInputAction, text), "*")
        }
    })
}

const setExtensionFrameWindow = (frame: WindowProxy) => {
    extensionFrameWindow.value = frame;
}


export {
    init, setExtensionFrameWindow
}
