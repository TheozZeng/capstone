require('../styles/globals.less')
import { AppProps } from 'next/app'
import { UserContextProvider } from '../components/Shared/UserContext'
import Head from 'next/head'
require('antd/dist/antd.less')


React.useLayoutEffect = React.useEffect;
function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  )
}

export default MyApp

