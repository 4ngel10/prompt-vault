import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    {/* Vercel Web Analytics: sin cookies ni identificadores persistentes, no requiere consentimiento.
        Se quita la query para no registrar los tokens de enlaces compartidos (?s=…) */}
    <Analytics beforeSend={event => ({ ...event, url: event.url.split('?')[0] })} />
  </StrictMode>,
)
