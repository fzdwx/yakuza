import Self from '@/components/self';
import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useState} from "react";
import Store from "@/components/store";
import ExtensionView from "@/components/extensionView";
import {Provider} from "jotai";
import {createStore} from "jotai";
import useSetShortcut from "@/components/self/hooks/useSetShortcut";

const {emitter, changeView} = useViewEvent();
const jotaiStore = createStore()

function switchView(view: ViewName) {
    switch (view) {
        case 'self':
            return <Self/>
        case 'store':
            return <Store/>
        case "extView":
            return <ExtensionView transport={false}/>
        case "extViewTransport":
            return <ExtensionView transport={true}/>
        default:
            return <Self/>
    }
}


function App() {
    const [view, setView] = useState<ViewName>('self')
    emitter.on('changeView', (view: ViewName) => {
        setView(view)
    })
    const {SetShortcutModel} = useSetShortcut()

    return (
        <Provider store={jotaiStore}>
            <div id='top' className='dark text-white bg-dark/90 backdrop-blur'>
                {switchView(view)}
                <SetShortcutModel/>
            </div>
        </Provider>
    )
}

export default App
