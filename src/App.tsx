import Self from '@/components/self';
import {useViewEvent, ViewName} from "@/hooks/useView";
import {useEffect, useState} from "react";
import Store from "@/components/store";
import ExtensionView from "@/components/extensionView";
import {ipcRenderer} from "electron";

const {emitter, changeView} = useViewEvent();

function switchView(view: ViewName) {
    switch (view) {
        case 'self':
            return <Self/>
        case 'store':
            return <Store/>
        case "extView":
            return <ExtensionView/>
        default:
            return <Self/>
    }
}


function App() {
    const [view, setView] = useState<ViewName>('self')
    emitter.on('changeView', (view: ViewName) => {
        setView(view)
    })

    return (
        <div id='top' className='dark text-white bg-dark/90 backdrop-blur'>
            {switchView(view)}
        </div>
    )
}

export default App
