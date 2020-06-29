import { Follower } from '@prisma/client'
import format from 'date-fns/format'
import React from 'react'
import { useTable } from 'react-table'

interface Props {
    followers: Follower[]
}

//   id: string
//   userId: number
//   name: string
//   screenName: string
//   location: string | null
//   description: string | null
//   url: string | null
//   protected: boolean
//   followersCount: number
//   friendsCount: number
//   listedCount: number
//   createdAt: Date
//   favouritesCount: number
//   verified: boolean
//   statusesCount: number
//   lastStatusDate: Date | null
//   profileImageUrl: string
//   profileBannerUrl: string | null
//   defaultProfile: boolean
//   defaultProfileImage: boolean

const hydrateData = (followers: Follower[]) =>
    followers.map(follower => ({
        ...follower,
        screenName: (
            <a
                href={`https://twitter.com/${follower.screenName}`}
                target="_blank"
                className="text-twitter"
            >
                @{follower.screenName}
            </a>
        ),
        url: follower.url ? (
            <a href={follower.url} target="_blank" className="teal-link">
                Link
            </a>
        ) : null,
        description: (
            <p
                className="overflow-hidden"
                style={{ maxWidth: '15rem', minWidth: '10rem' }}
            >
                {follower.description}
            </p>
        ),
        createdAt: format(new Date(follower.createdAt), 'MM/dd/yyyy'),
        lastStatusDate: follower.lastStatusDate
            ? format(new Date(follower.lastStatusDate), 'MM/dd/yyyy')
            : null,
        defaultProfile: !follower.defaultProfile ? '✅' : '❌',
        defaultProfileImage: !follower.defaultProfileImage ? '✅' : '❌',
        verified: follower.verified ? '✅' : '❌',
    }))

const Table: React.FC<Props> = ({ followers }) => {
    const data = React.useMemo(() => hydrateData(followers), [followers])
    const columns = React.useMemo(
        () => [
            {
                Header: 'Handle',
                accessor: 'screenName',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Bio',
                accessor: 'description',
            },
            {
                Header: 'Location',
                accessor: 'location',
            },
            {
                Header: 'Url',
                accessor: 'url',
            },
            {
                Header: 'Created At',
                accessor: 'createdAt',
            },
            {
                Header: 'Last Status',
                accessor: 'lastStatusDate',
            },
            {
                Header: 'Followers',
                accessor: 'followersCount',
                align: 'right',
            },
            {
                Header: 'Following',
                accessor: 'friendsCount',
                align: 'right',
            },
            {
                Header: 'Tweets',
                accessor: 'statusesCount',
                align: 'right',
            },
            {
                Header: 'Likes',
                accessor: 'favouritesCount',
                align: 'right',
            },
            {
                // 'The number of public lists that this user is a member of',
                Header: 'In lists',
                accessor: 'listedCount',
                align: 'right',
            },
            {
                Header: 'Custom Profile',
                accessor: 'defaultProfile',
                align: 'center',
            },
            {
                Header: 'Custom Image',
                accessor: 'defaultProfileImage',
                align: 'center',
            },
            {
                Header: 'Verified',
                accessor: 'verified',
                align: 'center',
            },
        ],
        [],
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    return rows.length > 0 ? (
        <table {...getTableProps()} className="text-sm mx-auto text-gray-700">
            <thead className="heading-4 text-xs text-left text-gray-900">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                className="px-3 py-1 whitespace-no-wrap"
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()} className="">
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr
                            {...row.getRowProps()}
                            className="border-t border-gray-400 hover:bg-gray-100"
                        >
                            {row.cells.map(cell => {
                                return (
                                    <td
                                        {...cell.getCellProps({
                                            style: {
                                                textAlign: cell.column.align
                                                    ? cell.column.align
                                                    : 'left',
                                            },
                                        })}
                                        className="px-3 py-3"
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    ) : (
        <p className="paragraph text-center">No followers found</p>
    )
}

export default Table
