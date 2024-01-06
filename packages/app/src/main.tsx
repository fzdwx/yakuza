import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'
import '@radix-ui/themes/styles.css';
import {Theme} from '@radix-ui/themes'
import './native/handleEvent'
import './assets/global.scss'
import 'launcher-api/index.css'
import {Provider} from "jotai";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider>
        <App/>
    </Provider>
)

postMessage({payload: 'removeLoading'}, '*')
