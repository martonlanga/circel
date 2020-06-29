import { PrismaClient } from '@prisma/client'
import withSession from '../../lib/session'
import { UserCookie } from './../../lib/interfaces'

const prisma = new PrismaClient()

const take = 20

export default withSession(async (req, res) => {
    try {
        const user: UserCookie = req.session.get('user')

        const where = {
            ...req.body.filters,
            user: {
                id: user.id,
            },
        }
        const followers = await prisma.follower.findMany({
            where,
            orderBy: {
                followersCount: 'desc',
            },
            take,
            skip: req.body.page * take,
        })
        const followersCount = await prisma.follower.count({
            where,
        })

        const { uploadedFollowersCount } = await prisma.user.findOne({
            where: { id: user.id },
            select: { uploadedFollowersCount: true },
        })

        return res.status(200).json({
            followers,
            uploadedFollowersCount,
            followersCount,
        })
    } catch (error) {
        console.error(error)
        res.end()
    }
})
