import { PrismaClient } from '@prisma/client'
import Twitter from 'twitter-lite'
import withSession from '../../../lib/session'
import { LookedUpUser, UserCookie } from './../../../lib/interfaces'

const twitterClient = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
})

interface CallbackParams {
    oauth_token: string
    oauth_token_secret: string
    user_id: string
    screen_name: string
}

// create user / login user and redirect
export default withSession(async (req, res) => {
    try {
        const prisma = new PrismaClient()

        const {
            query: { oauth_token, oauth_verifier },
        } = req

        if (
            typeof oauth_token !== 'string' ||
            typeof oauth_verifier !== 'string'
        ) {
            throw new Error('No params found.')
        }

        const results: CallbackParams = await twitterClient.getAccessToken({
            oauth_verifier,
            oauth_token,
        })

        const userCookie: UserCookie = {
            isLoggedIn: true,
            token: results.oauth_token,
            tokenSecret: results.oauth_token_secret,
            id: results.user_id,
        }

        const authClient = new Twitter({
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token_key: userCookie.token,
            access_token_secret: userCookie.tokenSecret,
        })

        const twitterUser: LookedUpUser = (
            await authClient.post('users/lookup', {
                user_id: userCookie.id,
            })
        )[0]

        const data = {
            id: twitterUser.id_str,
            username: twitterUser.screen_name,
            profileImageUrl: twitterUser.profile_image_url_https,
            token: userCookie.token,
            tokenSecret: userCookie.tokenSecret,
        }

        const existingUser = await prisma.user.findOne({
            where: { id: userCookie.id },
            select: { id: true },
        })

        const user = await prisma.user.upsert({
            where: { id: userCookie.id },
            update: data,
            create: data,
        })

        req.session.set('user', userCookie)
        await req.session.save()

        res.writeHead(302, {
            Location: `/${user.username}/${
                existingUser ? 'dashboard' : 'upload'
            }`,
        })
        return res.end()
    } catch (error) {
        console.error(error)
        res.end()
    }
})
