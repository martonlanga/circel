import { PrismaClient } from '@prisma/client'
import { Parser } from 'json2csv'
import { NextApiResponse } from 'next'
import withSession from '../../lib/session'
import { UserCookie } from './../../lib/interfaces'

const prisma = new PrismaClient()

const take = 20

export default withSession(async (req, res: NextApiResponse) => {
    try {
        const user: UserCookie = req.session.get('user')

        const emails = await prisma.email.findMany({
            where: {
                user: {
                    id: user.id,
                },
            },
            select: {
                createdAt: true,
                email: true,
                verified: true,
            },
        })
        const parser = new Parser(['email', 'verified', 'createdAt'])
        const csv = parser.parse(emails)

        res.setHeader(
            'Content-disposition',
            `attachment; filename=Email\ list.csv`,
        )
        return res.send(csv)
    } catch (error) {
        console.error(error)
        res.end()
    }
})
