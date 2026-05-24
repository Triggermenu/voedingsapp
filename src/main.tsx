import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import '@/i18n/index'
import '@/styles/index.css'
import '@/styles/print.css'
import App from './App'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Gezondheidsgegevens (gekozen aandoeningen, menukaart-foto's, scan-resultaten)
    // mogen niet in Sentry belanden — RISKS.md R-007 / acties-peter.md A-7.
    sendDefaultPii: false,
    // Session Replay: maskeer alle tekst en blokkeer media, anders worden de
    // aandoeningen en de menufoto ongemaskeerd vastgelegd.
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
    // Defensieve scrub: strip request-bodies en de menuscan-fetchbreadcrumb,
    // die anders de base64-foto of aandoeningen zouden kunnen bevatten.
    beforeSend(event) {
      if (event.request) {
        delete event.request.data
        delete event.request.cookies
      }
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((b) => {
          const url = b.data?.url
          if (typeof url === 'string' && url.includes('/api/menuscan')) {
            return { ...b, data: { url: '/api/menuscan', status_code: b.data?.status_code } }
          }
          return b
        })
      }
      return event
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
