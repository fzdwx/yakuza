import {
    buildEvent,
    exitAction,
    ExtEvent, getClipTextAction,
} from "../../lib/ext/api/types";
import {useViewEvent} from "../composables/useViewEvent";
import {View} from "../utils";
import {GetClipText} from "../../wailsjs/go/main/App";

const viewEvent = useViewEvent();

type Handle<T> = (e: ExtEvent<T>, source: MessageEventSource | null) => void;

const handleMap: Map<string, Handle<any>> = new Map();

handleMap.set(exitAction, (e) => {
    viewEvent.emitter.emit('changeView', View.Self)
})

handleMap.set(getClipTextAction, (e, s) => {
    (async () => {
        const text = await GetClipText()
        s?.postMessage(buildEvent(getClipTextAction,'qwheqjkehjkqwhekqjwheqk'), {
            targetOrigin: '*'
        })
    })()
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
    init,
}
