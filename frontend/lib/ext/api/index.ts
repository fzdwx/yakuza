// @ts-ignore
import {buildEvent, exitAction, ExtEvent, getClipTextAction} from "./types";

/**
 * exit current view
 */
function exit() {
    window.parent.postMessage(buildEvent(exitAction), '*');
}

/**
 * get clipboard text
 * @param callback
 */
function getClipText(callback: (text: string) => void) {
    window.parent.postMessage(buildEvent(getClipTextAction), '*');

    window.addEventListener('message', (event) => {
        const {action, data} = event.data as ExtEvent<string>;
        if (action === getClipTextAction) {
            callback(data || '');
        }
    })
}

export {exit, getClipText}
