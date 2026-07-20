import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'
import Header from './component/Header'
import Footer from './component/Footer'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — add it to your .env file')
}
const clerkAppearance = {
  variables: {
    colorPrimary: '#5e69e8',
    colorText: '#12131a',
    colorTextSecondary: '#848590',
    colorBackground: '#fcfcfe',
    colorInputBackground: '#fcfcfe',
    colorInputText: '#12131a',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  elements: {
    card: 'shadow-none border border-[#dfe0eb] rounded-2xl',
    formButtonPrimary: 'bg-[#5e69e8] hover:opacity-90 text-white normal-case shadow-none',
    footerActionLink: 'text-[#5e69e8] hover:text-[#4c52d0]',
  },
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={clerkAppearance}
        afterSignOutUrl="/"
      >
        <Header />
        <App />
        <Footer />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)