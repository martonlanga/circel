import Link from 'next/link'
import React from 'react'
import useUser from '../lib/useUser'

const Logo: React.FC = () => {
    const { user } = useUser()

    const logo = (
        <span className="select-none font-bold whitespace-no-wrap text-2xl tracking-tighter">
            circel.me
        </span>
    )

    return user?.username ? (
        <Link href="/[username]/dashboard" as={`/${user.username}/dashboard`}>
            <a>{logo}</a>
        </Link>
    ) : (
        <Link href="/">
            <a>{logo}</a>
        </Link>
    )
}
export default Logo
