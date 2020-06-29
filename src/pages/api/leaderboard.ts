import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req, res) => {
    try {
        const results = await prisma.user.findOne({
            where: { username: req.query.username },
            select: {
                ethBounty: true,
                endOfCampaign: true,
            },
        })

        return res.status(200).json(results)
    } catch (error) {
        console.error(error)
        res.end()
    }
}
