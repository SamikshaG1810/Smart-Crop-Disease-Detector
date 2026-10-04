import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', padding: '2rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#be123c', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#9f1239', fontSize: '0.875rem', marginBottom: '1rem' }}>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{ background: '#14251B', color: '#fff', border: 'none', borderRadius: '9999px', padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
