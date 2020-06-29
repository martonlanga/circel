import { NextApiRequest, NextApiResponse } from 'next'
import Twitter from 'twitter-lite'
import { baseUrl } from './../../../lib/index'

const twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const results = await twitterClient.getRequestToken(
            `${baseUrl}/api/callback/twitter`,
        )
        if (
            results &&
            results.oauth_callback_confirmed === 'true' &&
            results.oauth_token
        ) {
            res.writeHead(302, {
                Location: `https://api.twitter.com/oauth/authenticate?oauth_token=${results.oauth_token}`,
            })
            return res.end()
        }
        throw new Error('Results is empty.')
    } catch (error) {
        console.error(error)
        res.end()
    }
}
