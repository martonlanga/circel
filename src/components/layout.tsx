import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useUser from '../lib/useUser'
import Loading from './loading'
import Logo from './logo'
import TwitterButton from './twitter-button'

type Props = {
    title?: string
    fullWidth?: boolean
    auth?: boolean // if true, only return children if `user` is loaded
}

const Layout: React.FunctionComponent<Props> = ({
    children,
    title,
    fullWidth = false,
    auth = false,
}) => {
    const { user, mutateUser } = useUser()
    const router = useRouter()

    const content = auth ? user ? children : <Loading size="big" /> : children

    return (
        <>
            <Head>
                {title ? (
                    <title>{title} • Circel</title>
                ) : (
                    <title>Collect your followers' emails • Circel</title>
                )}
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <nav className="mx-auto container py-4 flex items-center text-sm">
                <Logo />
                <div className="ml-auto flex items-center space-x-4">
                    <Link href="/about">
                        <a className="link">About</a>
                    </Link>
                    {!!user || (
                        <a
                            className="link"
                            href="https://github.com/martonlanga/circel"
                            target="_blank"
                        >
                            Github
                        </a>
                    )}
                    {user &&
                        (user?.isLoggedIn ? (
                            <>
                                <Link
                                    href="/[username]/leaderboard"
                                    as={`/${user.username}/leaderboard`}
                                >
                                    <a className="link">Leaderboard</a>
                                </Link>
                                <a
                                    className="link"
                                    href="/api/logout"
                                    onClick={async e => {
                                        e.preventDefault()
                                        await fetch('/api/logout')
                                        await mutateUser({ isLoggedIn: false })
                                        router.push('/')
                                    }}
                                >
                                    Log out
                                </a>
                                <Link
                                    href="/[username]/dashboard"
                                    as={`/${user.username}/dashboard`}
                                >
                                    <a className="link">
                                        <img
                                            src={user.profileImageUrl}
                                            alt="Twitter Profile Image"
                                            className="rounded-full w-8 border border-gray-300"
                                        />
                                    </a>
                                </Link>
                            </>
                        ) : (
                            <TwitterButton />
                        ))}
                </div>
            </nav>

            {fullWidth ? (
                <main className="my-16" style={{ minHeight: '60vh' }}>
                    {content}
                </main>
            ) : (
                <main
                    className="my-16 md:my-24 container mx-auto"
                    style={{ minHeight: '60vh' }}
                >
                    {content}
                </main>
            )}

            <footer className="mt-20 py-20 px-4 bg-white rounded-xl">
                <div className="flex justify-center space-x-8 md:space-x-16">
                    <ul className="flex space-x-4">
                        <li className="footer-item text-gray-600">
                            <Link href="/about">
                                <a className="link">About</a>
                            </Link>
                        </li>
                        <li className="footer-item text-gray-600">
                            <a
                                className="link"
                                href="https://github.com/martonlanga/circel"
                                target="_blank"
                            >
                                Github
                            </a>
                        </li>
                        <li className="footer-item text-gray-600">
                            <a
                                className="link"
                                href="https://twitter.com/martonlanga"
                                target="_blank"
                            >
                                Contact
                            </a>
                        </li>
                        <li className="footer-item text-gray-600">
                            <Link href="/about#terms">
                                <a>Terms</a>
                            </Link>
                        </li>
                        <li className="footer-item text-gray-600">
                            <a
                                className="link"
                                href="https://twitter.com/circeldotme"
                                target="_blank"
                            >
                                Twitter
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <Logo />
                    <p className="mt-3 text-sm text-gray-600">
                        © {new Date().getFullYear()} Circel
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Layout
