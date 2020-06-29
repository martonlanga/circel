import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import Button from '../../components/button'
import Layout from '../../components/layout'
import Leaderboard from '../../components/leaderboard'
import Tile from '../../components/tile'
import useUser from '../../lib/useUser'

const LeaderboardPage = () => {
    const router = useRouter()
    const { username } = router.query
    const { data, error } = useSWR<{
        ethBounty: number
        endOfCampaign: string
    }>('/api/leaderboard?username=' + username)
    const { user } = useUser()
    const [showPayout, setShowPayout] = useState(false)
    if (!data) return null
    const { ethBounty, endOfCampaign } = data
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
                            {/* <Payout referrers={[]} /> */}
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

export default LeaderboardPage
