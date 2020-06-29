import { PrismaClient } from '@prisma/client'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import cron from 'node-cron'
import Twitter from 'twitter-lite'
import { getVerificationToken, sendEmail } from '../email'
import { lookupFollowers } from '../upload'
import { formatDirectMessage, isProd, sleep } from './../../src/lib/index'
require('dotenv').config()

const TWITTER_SECRETS = {
    consumer_key: process.env.CONSUMER_KEY as string,
    consumer_secret: process.env.CONSUMER_SECRET as string,
}

const prisma = new PrismaClient()
const app = express()

if (!isProd) {
    // prisma.follower
    //     .findMany({ where: { users: { every: { id: 2 } } } })
    //     .then(d => console.log(d))
    // prisma.user
    //     .update({
    //         where: { id: 2 },
    //         data: { followers: { connect: { id: '1096964253729251328' } } },
    //         include: {
    //             followers: true,
    //         },
    //     })
    //     .then(d => console.log(d))
    //     .catch(e => {
    //         console.error(e)
    //     })
    app.use(cors())
}

app.use(bodyParser.json({ limit: '200mb' })) // follower.js files can be big

app.post('/upload', async (req, res) => {
    try {
        const { token, tokenSecret, userId, followersArray } = req.body

        const client = new Twitter({
            ...TWITTER_SECRETS,
            access_token_key: token,
            access_token_secret: tokenSecret,
        })

        lookupFollowers(followersArray, client, userId)

        await prisma.user.update({
            where: { id: userId },
            data: { uploadedFollowersCount: followersArray.length },
        })
        res.status(200).json({
            message: 'Upload complete. Looking up users in progress...',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error during uploading', error })
    }
})
app.post('/email', async (req, res) => {
    try {
        const { username, email } = req.body
        const verificationToken = getVerificationToken()
        const { id } = await prisma.email.create({
            data: {
                email: email,
                user: {
                    connect: {
                        username: username,
                    },
                },
                ref: req.body.ref && {
                    connect: {
                        id: req.body.ref,
                    },
                },
                verificationToken,
            },
        })

        console.log(email)

        await sendEmail(
            email,
            username,
            `https://circel.me/${username}/referral?t=${verificationToken}&id=${id}`,
        )

        return res.status(200).json({
            message: 'Email created & sent.',
        })
    } catch (error) {
        console.error(error)
        res.end()
    }
})

// todo: trigger with webhook
// const secret = req.headers['authorization']

// if (secret !== process.env.CRON_SECRET) {
//     throw new Error('Authorization header is invalid.')
// }

/**
 *  run 24 times a day, send out 42 dm's each time (24 * 42 = 1008) -> run every 1 hour
 *  8 will probably fail, but that's fine - will come back to those in the next batch
 */
cron.schedule('0 * * * *', async () => {
    console.log("Sliding into DM's at", new Date())
    console.log(new Date().getSeconds())

    await dm()
    console.log('cron finished')
})

const dm = async () => {
    const take = 42

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                token: true,
                tokenSecret: true,
                messages: { where: { active: true } },
                username: true,
            },
        })

        for (const user of users) {
            const client = new Twitter({
                ...TWITTER_SECRETS,
                access_token_key: user.token,
                access_token_secret: user.tokenSecret,
            })

            for (const message of user.messages) {
                console.log(message.name)

                const filters = !!message.filters
                    ? // @ts-ignore idk why this complains
                      JSON.parse(message.filters)
                    : undefined

                // get followers who haven't received the message
                const followers = await prisma.follower.findMany({
                    where: {
                        ...filters,
                        userId: user.id,
                        dms: { none: { messageId: message.id } },
                    },
                    take,
                })

                let sentCount = 0
                console.log(
                    `Sending ${message.name} to: ${followers.length} people.`,
                )

                if (!followers.length) {
                    console.log(`Deactivating ${message.name}`)

                    // make message inactive if it has finished (no followers left to send it to)
                    await prisma.message.update({
                        where: { id: message.id },
                        data: { active: false },
                    })
                    continue
                }

                for (const follower of followers) {
                    // https://developer.twitter.com/en/docs/direct-messages/sending-and-receiving/api-reference/new-event
                    try {
                        await client.post('direct_messages/events/new', {
                            event: {
                                type: 'message_create',
                                message_create: {
                                    target: {
                                        recipient_id: follower.twitterId,
                                    },
                                    message_data: {
                                        text: formatDirectMessage(
                                            message.message,
                                            {
                                                username: user.username,
                                                followerName: follower.name,
                                                followerScreenName:
                                                    follower.screenName,
                                            },
                                        ),
                                    },
                                },
                            },
                        })
                        sentCount += 1
                        console.log('Sent', sentCount)
                        await prisma.dm.create({
                            data: {
                                user: { connect: { id: user.id } },
                                message: { connect: { id: message.id } },
                                follower: { connect: { id: follower.id } },
                            },
                        })
                    } catch (error) {
                        console.log('Twitter error')
                        if (!!error.errors && error.errors[0].code === 349) {
                            // You cannot send messages to this user
                            console.log('Deleting', follower.screenName)
                            await prisma.follower.delete({
                                where: { id: follower.id },
                            })
                        }
                        console.error(error)
                    }

                    const duration =
                        (Math.floor(Math.random() * 60) + 30) * 1000 // 30s - 90s
                    console.log('Sleeping for', duration)
                    await sleep(duration)
                    /**
                     * Always get this after ~14 messages:
                     * This request looks like it might be automated. To protect our users from spam and other malicious activity, we can't complete this action right now. Please try again later.
                     */
                }
            }
        }
    } catch (error) {
        console.log('cron failed')
        console.error(error)
    }
}

const server = app.listen(3001, () =>
    console.log('🚀 Server ready at: http://localhost:3001\n'),
)
