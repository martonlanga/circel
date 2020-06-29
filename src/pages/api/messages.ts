import { Message, PrismaClient } from '@prisma/client'
import withSession from '../../lib/session'
import { UserCookie } from './../../lib/interfaces'

const prisma = new PrismaClient()

export interface MessageWithCount extends Message {
    sendToCount: number
    sentToCount: number
}

export default withSession(async (req, res) => {
    try {
        const user: UserCookie = req.session.get('user')

        switch (req.method) {
            case 'GET':
                // get messages
                const messages: Partial<
                    MessageWithCount
                >[] = await prisma.message.findMany({
                    where: {
                        userId: user.id,
                    },
                    orderBy: {
                        active: 'desc',
                    },
                })
                for (const message of messages) {
                    message.sendToCount = await prisma.follower.count({
                        where: {
                            ...JSON.parse(message.filters),
                            user: {
                                id: user.id,
                            },
                        },
                    })

                    message.sentToCount = await prisma.dm.count({
                        where: {
                            message: { id: message.id },
                        },
                    })
                }
                return res.status(200).json(messages as MessageWithCount[])

            case 'POST':
                // create new message
                const message = await prisma.message.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                        name: req.body.name,
                        message: req.body.message,
                        filters: req.body.filters,
                        active: true,
                    },
                })

                console.log('Created new message')

                return res.status(200).json({
                    message: 'Message created.',
                })
            case 'PUT':
                await prisma.message.update({
                    where: {
                        id: parseInt(req.query.id),
                    },
                    data: req.body,
                })

                console.log('Updated message')

                return res.status(200).json({
                    message: 'Updated message.',
                })
            default:
                res.setHeader('Allow', ['POST', 'GET'])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        console.error(error)
        res.end()
    }
})
