import { PrismaClient } from '@prisma/client'
import { format } from 'date-fns'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../../components/button'
import Layout from '../../components/layout'
import Leaderboard from '../../components/leaderboard'
import Payout from '../../components/payout'
import Tile from '../../components/tile'
import useUser from '../../lib/useUser'

const LeaderboardPage: NextPage<{
    ethBounty: number
    endOfCampaign: string
}> = ({ ethBounty, endOfCampaign }) => {
    const { user } = useUser()
    const router = useRouter()
    const { username } = router.query
    const [showPayout, setShowPayout] = useState(false)
    return (
        <Layout>
            {user?.isLoggedIn && (
                <div className="mx-auto mb-10 -mt-10">
                    <Button onClick={() => setShowPayout(true)}>
                        Pay referrers
                    </Button>
                    {showPayout && (
                        <div
                            className="fixed inset-0 w-full h-full flex items-center justify-center"
                            style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                        >
                            <Payout />
                        </div>
                    )}
                </div>
            )}
            <section className="bg-white rounded-lg p-10 grid grid-cols-2">
                <Tile label="Bounty" data={`${ethBounty} ETH`} />
                <Tile
                    label="Deadline"
                    data={format(new Date(endOfCampaign), 'MM/dd')}
                />
            </section>
            <Leaderboard username={username as string} />
        </Layout>
    )
}

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const username = params.username as string

    const results = await prisma.user.findOne({
        where: { username },
        select: {
            ethBounty: true,
            endOfCampaign: true,
        },
    })

    return { props: JSON.parse(JSON.stringify(results)) } // https://github.com/vercel/next.js/pull/12156
}

export default LeaderboardPage
