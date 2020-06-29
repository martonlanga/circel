import React from 'react'
import useSWR from 'swr'
import { LeaderboardRef } from '../pages/api/refs'

interface Props {
    username: string
    preview?: boolean
}

const Leaderboard = ({ username, preview = false }: Props) => {
    const { data: refs, error, mutate } = useSWR<LeaderboardRef[]>(
        `/api/refs?username=${username}&take=${preview ? 25 : 300}`,
    )

    if (!refs) return null

    return refs.length === 0 ? null : (
        <section className="my-16">
            <h2 className="heading-2 mb-12 text-center">Leaderboard</h2>

            <table
                className="text-sm mx-auto text-gray-700"
                style={{ minWidth: '60%' }}
            >
                <thead className="heading-4 text-xs text-left text-gray-900">
                    <tr>
                        <th className="px-3 py-1 whitespace-no-wrap">Rank</th>
                        <th className="px-3 py-1 whitespace-no-wrap">Handle</th>
                        <th className="px-3 py-1 whitespace-no-wrap">
                            Referrals
                        </th>
                        <th className="px-3 py-1 whitespace-no-wrap">
                            Balance
                        </th>
                    </tr>
                </thead>
                <tbody className="">
                    {refs
                        .sort((a, b) => b.referrals - a.referrals)
                        .map((ref, i) => (
                            <tr
                                key={ref.id}
                                className="border-t border-gray-400 hover:text-black"
                            >
                                <td className="px-3 py-3 font-bold">{i + 1}</td>
                                <td className="px-3 py-3">
                                    <a
                                        href={`https://twitter.com/${ref.id}`}
                                        target="_blank"
                                        className="text-twitter"
                                    >
                                        @{ref.id}
                                    </a>
                                </td>
                                <td className="px-3 py-3">{ref.referrals}</td>
                                <td className="px-3 py-3">{ref.bounty} ETH</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </section>
    )
}

export default Leaderboard
