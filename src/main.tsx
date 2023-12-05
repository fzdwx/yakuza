import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'
import '@/assets/global.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme className=''>
      <App />
    </Theme>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
