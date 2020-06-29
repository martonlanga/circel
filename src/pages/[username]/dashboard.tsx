import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr'
import Button, { ButtonWithIcon } from '../../components/button'
import Input from '../../components/input'
import Label from '../../components/label'
import Layout from '../../components/layout'
import Messages from '../../components/messages'
import { Download, Plus, Upload } from '../../components/svg'
import Tile from '../../components/tile'
import useUser from '../../lib/useUser'

export interface DashboardData {
    uploadedFollowersCount: number
    lookedUpFollowersCount: number
    currentFollowersCount: number
    emailsCollectedCount: number
    sentMessagesCount: number
    refsCount: number
}

const DashboardPage = () => {
    const { user } = useUser()
    const { data, error } = useSWR<DashboardData>('/api/dashboard')
    const { register, handleSubmit, errors } = useForm<{
        ethBounty: string
        endOfCampaign: string
    }>()

    const onCampaignSubmit = handleSubmit(async data => {
        await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ethBounty: data.ethBounty
                    ? parseFloat(data.ethBounty)
                    : undefined,
                endOfCampaign: data.endOfCampaign
                    ? new Date(data.endOfCampaign)
                    : undefined,
            }),
        })
    })

    if (!user) return null

    if (error) {
        console.error(error.error)
        return <div>{error.message}</div>
    }

    return (
        <Layout auth>
            <h1 className="heading-1">Dashboard</h1>
            <section className="my-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-6">
                <Tile
                    label="Emails Collected"
                    data={data?.emailsCollectedCount}
                />
                <Tile
                    label="Conversion Rate"
                    data={
                        data
                            ? `${Math.ceil(
                                  (data.emailsCollectedCount /
                                      data.currentFollowersCount) *
                                      100,
                              )}%`
                            : undefined
                    }
                />
                <Tile
                    label="Current Follower Count"
                    data={data?.currentFollowersCount}
                />
                <Tile
                    label="Uploaded Followers"
                    data={data?.uploadedFollowersCount}
                />
                <Tile
                    label="Loaded Followers"
                    data={data?.lookedUpFollowersCount}
                />
                <Tile label="DM's sent" data={data?.sentMessagesCount} />
                <Tile label="Bounty" data={`${user?.ethBounty || 0} ETH`} />
                <Tile label="Referrers" data={data?.refsCount} />
                {user.endOfCampaign && (
                    <Tile
                        label="End of campaign"
                        data={formatDistanceToNow(new Date(user.endOfCampaign))}
                        small
                    />
                )}
            </section>

            <section className="flex space-x-3">
                {user && (
                    <Link
                        href="/[username]/upload"
                        as={`/${user.username}/upload`}
                    >
                        <a>
                            <ButtonWithIcon>
                                <div className="w-5 mr-3 text-gray-700">
                                    <Upload />
                                </div>
                                Upload followers
                            </ButtonWithIcon>
                        </a>
                    </Link>
                )}
                <Link href="/api/emails">
                    <a>
                        <ButtonWithIcon>
                            <div className="w-5 mr-3 text-gray-700">
                                <Download />
                            </div>
                            Export {data?.emailsCollectedCount} email
                            {data && data.emailsCollectedCount === 1
                                ? ''
                                : 's'}{' '}
                            as CSV
                        </ButtonWithIcon>
                    </a>
                </Link>
            </section>

            <section className="my-16 space-y-8">
                <header className="">
                    <h1 className="heading-1 inline-block">Direct Messages</h1>
                </header>
                <div className="inline-flex flex-col space-y-3">
                    {user && (
                        <Link
                            href="/[username]/new-message"
                            as={`/${user.username}/new-message`}
                        >
                            <a>
                                <ButtonWithIcon>
                                    <div className="w-5 mr-3 text-gray-700">
                                        <Plus />
                                    </div>
                                    New Direct Message
                                </ButtonWithIcon>
                            </a>
                        </Link>
                    )}
                    {/* {isProd || (
                        <div>
                            <Button
                            onClick={() =>
                                fetch('', {
                                    headers: {
                                        authorization:
                                            process.env
                                                .NEXT_PUBLIC_CRON_SECRET,
                                    },
                                })
                            }
                            >
                                Send DM's
                            </Button>
                        </div>
                    )} */}
                </div>
                <Messages />
            </section>

            <section className="space-y-6">
                <h1 className="heading-1">Campaign details</h1>
                <form
                    onSubmit={onCampaignSubmit}
                    className="bg-white max-w-lg flex flex-col p-10 space-y-3 rounded-xl"
                >
                    <Label>
                        ETH to be distributed (used to calculate payout)
                    </Label>
                    <Input
                        type="text"
                        name="ethBounty"
                        placeholder="0 ETH"
                        ref={register}
                        defaultValue={user?.ethBounty}
                    />
                    <Label>End of campaign (date of payout)</Label>
                    <Input
                        type="date"
                        name="endOfCampaign"
                        ref={register}
                        defaultValue={
                            user?.endOfCampaign &&
                            new Date(user.endOfCampaign)
                                .toISOString()
                                .split('T')[0]
                        }
                    />
                    {user && <Button>Apply</Button>}
                </form>
                {/* <CoinbaseCommerceButton
                    checkoutId={'aa5242d0-715d-49c5-acb0-6901cec1cde2'}
                    className="b w-6 rounded-lg bg-gray-100"
                >
                    $1
                </CoinbaseCommerceButton> */}
            </section>
        </Layout>
    )
}

export default DashboardPage
