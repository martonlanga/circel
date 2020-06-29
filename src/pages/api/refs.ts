import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LeaderboardRef {
    id: string
    referrals?: number
    bounty?: number
}

export default async (req, res) => {
    try {
        switch (req.method) {
            case 'GET':
                const { username, take } = req.query

                const refs: LeaderboardRef[] = await prisma.ref.findMany({
                    where: {
                        users: {
                            every: { username },
                        },
                    },
                    select: {
                        id: true,
                    },
                    take: parseInt(take),
                })

                const { ethBounty: bounty } = await prisma.user.findOne({
                    where: { username },
                    select: { ethBounty: true },
                })

                const sum = await prisma.email.count({
                    where: { user: { username }, ref: {}, verified: true }, // only count the ones which have refs connected, and are verified
                })

                for (const ref of refs) {
                    ref.referrals = await prisma.email.count({
                        where: { refId: ref.id, verified: true },
                    })
                    ref.bounty = (ref.referrals / sum) * bounty
                }

                return res.status(200).json(refs as LeaderboardRef[])
            case 'POST':
                const ref = await prisma.ref.create({
                    data: req.body,
                })

                return res.status(200).json(ref)
            default:
                res.setHeader('Allow', ['GET', 'POST'])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        console.error(error)
        res.end()
    }
}
