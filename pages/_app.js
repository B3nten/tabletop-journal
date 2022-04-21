import Parchment from '../components/Parchment/Parchment'
import { Toaster } from 'react-hot-toast'
import { AuthContextProvider } from '../lib/authentication'
import '../styles/globals.css'

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
      <AuthContextProvider>
        <Parchment>
          <Component {...pageProps} />
        </Parchment>
      </AuthContextProvider>
    </>
  )
}

export default MyApp
