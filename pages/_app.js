import Parchment from '../components/Parchment/Parchment'
import { Toaster } from 'react-hot-toast'
import { AuthContextProvider } from '../lib/authentication'
import { Metatags } from '../components/Metatags'
import '../styles/globals.css'
import { Toolbar } from '../components/Toolbar'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster toastOptions={{
        style: {
          borderRadius: '20px',
          background: '#ede7d8',
          color: 'black',
        },
      }} />
      <Metatags/>
      <AuthContextProvider>
        <Parchment>
          <Component {...pageProps} />
        </Parchment>
        <Toolbar />
      </AuthContextProvider>
    </>
  )
}

export default MyApp
