export interface ExtEvent<T> {
    action: string;
    data?: T;
}

const exitAction = 'exit';
const getClipTextAction = 'getClipText';

function buildEvent<T>(action: string, data?: T): ExtEvent<T> {
    if (data === undefined) {
        // @ts-ignore
        data = action
    }
    return {
        action,
        data,
    }
}

export {
    exitAction, getClipTextAction, buildEvent
}


