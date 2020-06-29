import { SWRConfig } from 'swr'
import fetcher from '../lib/fetcher'
import '../styles/index.css'

function MyApp({ Component, pageProps }) {
    return (
        <SWRConfig
            value={{
                fetcher,
                onError: err => {
                    console.error(err)
                },
            }}
        >
            <Component {...pageProps} />{' '}
        </SWRConfig>
    )
}

export default MyApp
