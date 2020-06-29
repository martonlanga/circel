import { PrismaClient } from '@prisma/client'
import { NextApiResponse } from 'next'
import Twitter from 'twitter-lite'
import withSession from '../../lib/session'
import { DashboardData } from '../[username]/dashboard'
import { LookedUpUser, UserCookie } from './../../lib/interfaces'

const prisma = new PrismaClient()

export default withSession(
    async (
        req,
        res: NextApiResponse<DashboardData | { message: string; error: Error }>,
    ) => {
        try {
            const user: UserCookie = req.session.get('user')

            const client = new Twitter({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                access_token_key: user.token,
                access_token_secret: user.tokenSecret,
            })
            let twitterUser: LookedUpUser | undefined
            try {
                twitterUser = (
                    await client.post('users/lookup', {
                        user_id: user.id, // up to 100 per request
                    })
                )[0]
            } catch (error) {
                console.log('Twitter error')
                console.error(error)
            }

            const lookedUpFollowersCount = await prisma.follower.count({
                where: {
                    user: {
                        id: user.id,
                    },
                },
            })
            const emailsCollectedCount = await prisma.email.count({
                where: {
                    userId: user.id,
                },
            })
            const { uploadedFollowersCount } = await prisma.user.findOne({
                where: { id: user.id },
                select: { uploadedFollowersCount: true },
            })
            const refsCount = await prisma.ref.count({
                where: {
                    users: { every: { id: user.id } },
                },
            })
            const sentMessagesCount = await prisma.dm.count({
                where: { userId: user.id },
            })

            return res.status(200).json({
                uploadedFollowersCount: uploadedFollowersCount || 0,
                lookedUpFollowersCount,
                currentFollowersCount: twitterUser?.followers_count,
                emailsCollectedCount,
                sentMessagesCount,
                refsCount,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to get Dashboard.', error })
        }
    },
)
