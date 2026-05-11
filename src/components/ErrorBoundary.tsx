import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  eventId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, eventId: null }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sentry = (window as any).Sentry as { captureException?: (e: Error, o: object) => string } | undefined
    if (sentry?.captureException) {
      const id = sentry.captureException(error, {
        contexts: { react: { componentStack: info.componentStack } },
      })
      this.setState({ eventId: id ?? null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-lg font-semibold text-[#1a1a18] mb-2">Er ging iets mis</h1>
            <p className="text-sm text-[#73726c] mb-6">
              De app heeft een onverwachte fout. Ververs de pagina om opnieuw te proberen.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1d9e75] hover:bg-[#178a65] text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Pagina vernieuwen
            </button>
            {this.state.eventId && (
              <p className="text-xs text-[#9c9a92] mt-4">Foutcode: {this.state.eventId}</p>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
