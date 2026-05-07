import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
if (GA_ID) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
}

// Handle GitHub Pages redirect
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  window.history.replaceState(null, '', redirect);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
