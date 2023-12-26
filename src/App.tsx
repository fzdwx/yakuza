import Self from '@/components/self';
import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useState} from "react";
import Store from "@/components/store";
import ExtensionView from "@/components/extensionView";
import Settings from "@/components/settings";
import FileSystem from "@/components/fileSystem";

const {emitter, changeView} = useViewEvent();

function switchView(view: ViewName) {
    switch (view) {
        case 'self':
            return <Self/>
        case 'Store':
            return <Store/>
        case "extView":
            return <ExtensionView transport={false}/>
        case "extViewTransport":
            return <ExtensionView transport={true}/>
        case "Settings":
            return <Settings/>
        case 'File System':
            return <FileSystem/>
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
            <div id='top' className='dark text-white'>
                {switchView(view)}
            </div>
    )
}

export default App
