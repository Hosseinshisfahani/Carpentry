import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import './index.css'
import App from './App.jsx'

// Create RTL cache for Persian text direction
const cache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  </StrictMode>,
)
