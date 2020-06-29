import { Follower, FollowerWhereInput } from '@prisma/client'
import { useEffect, useState } from 'react'
import Filter from '../../components/filter'
import Layout from '../../components/layout'
import Loading from '../../components/loading'
import Details from '../../components/message-details'
import Table from '../../components/table'
import styles from '../../styles/message.module.css'

const NewMessagePage = () => {
    const [data, setData] = useState<{
        followers: Follower[]
        uploadedFollowersCount: number
        followersCount: number
    } | null>(null)
    const [filterEnabled, setFilterEnabled] = useState(false)
    const [filters, setFilters] = useState<undefined | FollowerWhereInput>(
        undefined,
    )
    const [page, setPage] = useState(1)

    const getFollowers = async () => {
        const response = await fetch('/api/followers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: filterEnabled ? filters : undefined,
                page: page - 1,
            }),
        })
        const followersData: {
            followers: Follower[]
            uploadedFollowersCount: number
            followersCount: number
        } = await response.json()
        setData(followersData)
    }

    useEffect(() => {
        getFollowers()
    }, [page, filterEnabled, filters])

    if (!data) return <Loading size="big" />

    if (!data.uploadedFollowersCount) return <div>You have no followers.</div>

    const numberLoaded = data.followers.length
    const maxPages = Math.ceil(data.followersCount / 20)
    return (
        <Layout fullWidth auth>
            <section className="container mx-auto my-8 space-y-8">
                <div className="space-y-6 lg:space-y-0 lg:space-x-10 flex flex-col lg:flex-row">
                    <div className="w-full lg:w-2/3">
                        <Details
                            filters={filters}
                            followersCount={data.followersCount}
                        />
                    </div>
                    <div className="flex-grow">
                        <div className="flex flex-no-wrap space-x-2 mb-4">
                            <button
                                onClick={() => {
                                    setFilterEnabled(false)
                                }}
                                className={styles.toggle}
                                style={{
                                    backgroundColor: !filterEnabled
                                        ? 'white'
                                        : undefined,
                                }}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterEnabled(true)}
                                className={styles.toggle}
                                style={{
                                    backgroundColor: filterEnabled
                                        ? 'white'
                                        : undefined,
                                }}
                            >
                                Filter
                            </button>
                        </div>
                        {filterEnabled ? (
                            <Filter setFilters={setFilters} />
                        ) : (
                            <div className="ml-4 leading-7 text-sm text-gray-600">
                                No filters applied.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mx-auto bg-white py-3 px-10 rounded-md flex items-center space-x-10 justify-between">
                    <div className="space-x-2">
                        <button
                            onClick={() => {
                                if (page <= 1) return
                                setPage(page - 1)
                            }}
                            className="text-sm font-bold tracking-wider text-gray-600"
                        >
                            Prev
                        </button>
                        <input
                            type="number"
                            value={page}
                            onChange={({ target: { value } }) => {
                                const newPage = parseInt(value)
                                if (
                                    !newPage ||
                                    newPage < 1 ||
                                    newPage > maxPages
                                )
                                    return
                                setPage(newPage)
                            }}
                            className="bg-gray-200 rounded-md px-1 py-1 text-right w-12"
                        />
                        <span className="text-sm text-gray-600">
                            /{maxPages}
                        </span>
                        <button
                            onClick={() => {
                                const newPage = page + 1
                                if (newPage > maxPages) return
                                setPage(newPage)
                            }}
                            className="text-sm font-bold tracking-wider text-gray-600"
                        >
                            Next
                        </button>
                    </div>
                    <a
                        className="teal-link"
                        href="https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object"
                        target="_blank"
                    >
                        Info • Twitter
                    </a>
                    <h3 className="font-bold text-gray-700 tracking-tight">
                        Showing {numberLoaded} out of {data.followersCount}
                    </h3>
                </div>
            </section>

            <div className={styles.tableContainer}>
                <Table followers={data.followers} />
            </div>
        </Layout>
    )
}

export default NewMessagePage
