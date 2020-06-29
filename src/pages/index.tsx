import Link from 'next/link'
import React from 'react'
import HowItWorks from '../components/how-it-works'
import Layout from '../components/layout'
import { Illustration } from '../components/svg'
import TwitterButton from '../components/twitter-button'
import useUser from '../lib/useUser'

const IndexPage = () => {
    const { user } = useUser()

    return (
        <Layout>
            {user?.username && (
                <div className="bg-teal-100 px-8 md:px-12 py-3 mb-10 rounded-lg inline-block">
                    <span>
                        Welcome back
                        <Link href="/[username]" as={`/${user.username}`}>
                            <a className="teal-link"> @{user.username}</a>
                        </Link>
                        .{' '}
                    </span>
                    <Link
                        href="/[username]/dashboard"
                        as={`/${user.username}/dashboard`}
                    >
                        <a className="teal-link">Go to your dashboard</a>
                    </Link>
                    .
                </div>
            )}
            <div className="relative">
                <div className="space-y-4 w-8/12 md:w-5/12 relative z-10">
                    <h1 className="heading-1">
                        Collect your followers
                        <em className="text-teal-400">'</em> emails
                    </h1>
                    <p className="paragraph text-lg">
                        Circel is a platform for exporting your followers from
                        social media and enabling you to take control of your
                        user-base.
                    </p>
                    <TwitterButton>Get started</TwitterButton>
                </div>
                <div
                    className="w-48 md:w-1/2 absolute"
                    style={{ top: '0', right: '5%', zIndex: -1 }}
                >
                    <Illustration />
                </div>
            </div>
            <div className="mt-40">
                <HowItWorks />
            </div>
        </Layout>
    )
}

export default IndexPage
