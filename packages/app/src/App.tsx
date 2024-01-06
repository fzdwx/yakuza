import Self from '@/components/self';
import {useViewEvent, ViewName} from "@/hooks/useView";
import React, {useState} from "react";
import Store from "@/components/store";
import ExtensionView from "@/components/extensionView";
import Settings from "@/components/settings";
import FileSystem from "@/components/fileSystem";
import {dark, light, Theme, useTheme} from "@/hooks/useTheme";
import {useLocalStorageState} from "ahooks";

const {emitter, changeView} = useViewEvent();
const {themeEvent, changeTheme} = useTheme();

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
    const [theme, setTheme] = useLocalStorageState<string>('launcher-theme', {defaultValue: light,},);
    emitter.on('changeView', (view: ViewName) => {
        setView(view)
    })

    themeEvent.on('changeTheme', (newTheme: Theme) => {
        if (newTheme === 'toggle') {
            if (theme === dark) {
                setTheme(light)
            } else {
                setTheme(dark)
            }
        } else {
            setTheme(newTheme)
        }
    })

    return (
        <div className={theme}>
            {switchView(view)}
        </div>
    )
}

export default App
