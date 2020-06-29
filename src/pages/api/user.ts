import { PrismaClient, UserSelect } from '@prisma/client'
import { NextApiResponse } from 'next'
import { User } from '../../lib/interfaces'
import withSession from '../../lib/session'
import { UserCookie } from './../../lib/interfaces'

const prisma = new PrismaClient()

const select: UserSelect = {
    id: true,
    username: true,
    profileImageUrl: true,
    ethBounty: true,
    endOfCampaign: true,
    uploadedFollowersCount: true,
}

export default withSession(async (req, res: NextApiResponse<User>) => {
    try {
        const userCookie: UserCookie = req.session.get('user')

        if (!userCookie || !userCookie.isLoggedIn) {
            return res.status(200).json({ isLoggedIn: false })
        }

        switch (req.method) {
            case 'GET': {
                if (!userCookie.id) {
                    return res.status(404).end(`No userId`)
                }
                // get user (is logged in)
                const user: any = await prisma.user.findOne({
                    where: { id: userCookie.id },
                    select,
                })
                if (!user) {
                    return res
                        .status(404)
                        .end(`User with id: ${userCookie.id} not found`)
                }
                return res
                    .status(200)
                    .json({ ...userCookie, ...user, isLoggedIn: true }) // todo: is endOfC date or string?
            }
            case 'POST': {
                // update
                const user: any = await prisma.user.update({
                    where: { id: userCookie.id },
                    data: req.body,
                    select,
                })

                return res
                    .status(200)
                    .json({ ...userCookie, ...user, isLoggedIn: true }) // todo: is endOfC date or string?
            }
            default:
                res.setHeader('Allow', ['GET'])
                res.status(405).end(`Method ${req.method} Not Allowed`)
        }
    } catch (error) {
        console.error(error)
        return res.status(400).end(error)
    }
})
