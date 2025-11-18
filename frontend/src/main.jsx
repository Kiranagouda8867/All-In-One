import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary'

// Debug logs to verify module load and mount
// eslint-disable-next-line no-console
console.log('[debug] main.jsx loaded')

const root = createRoot(document.getElementById('root'))
// eslint-disable-next-line no-console
console.log('[debug] creating root and rendering App')

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
