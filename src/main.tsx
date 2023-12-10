import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'
import '@radix-ui/themes/styles.css';
import {Theme} from '@radix-ui/themes'
import './native/handleEvent'
// import '@/assets/global.scss'
import 'launcher-api/dist/index.css'
import {useCommandState} from "launcher-api";
import {ipcRenderer} from "electron";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Theme className=''>
            <App/>
        </Theme>
    </React.StrictMode>,
)

postMessage({payload: 'removeLoading'}, '*')
