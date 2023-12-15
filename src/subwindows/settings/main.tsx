import React from 'react'
import ReactDOM from 'react-dom/client'
import 'virtual:uno.css'
import '@radix-ui/themes/styles.css';
import {Theme} from '@radix-ui/themes'
import '@/assets/global.scss'
import 'launcher-api/dist/index.css'
import App from "@/subwindows/settings/App";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Theme className=''>
            <App/>
        </Theme>
    </React.StrictMode>,
)

postMessage({payload: 'removeLoading'}, '*')
