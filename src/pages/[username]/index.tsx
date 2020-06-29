import { PrismaClient } from '@prisma/client'
import { GetStaticPaths, NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/button'
import Input from '../../components/input'
import Layout from '../../components/layout'
import { baseUrl, emailRegex, isProd } from '../../lib'

interface FormData {
    email: string
}

const UserPage: NextPage<{
    user:
        | {
              username: string
              profileImageUrl: string
          }
        | undefined
}> = ({ user }) => {
    const router = useRouter()
    const { ref } = router.query
    const { register, handleSubmit, errors } = useForm<FormData>()
    const [submitted, setSubmitted] = useState(false)

    if (!user) return null

    const { username, profileImageUrl } = user

    const onSubmit = async ({ email }: FormData) => {
        setSubmitted(true)
        await fetch(isProd ? '/server/email' : 'http://localhost:3001/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                ref,
            }),
        })
    }

    return (
        <Layout>
            <NextSeo
                title={`Subscribe to ${username}'s email list`}
                description={`Subscribe to ${username}'s email list`}
                openGraph={{
                    url: `${baseUrl}/${username}`,
                    title: `Subscribe to ${username}'s email list`,
                    description: `Subscribe to ${username}'s email list`,
                    images: [
                        {
                            url: `https://og-image-sage-beta.vercel.app/%3Cp%20style%3D%22line-height%3A1%22%3ESubscribe%20to%20%3Cb%3E${username}%3C%2Fb%3E's%20email%20list%3C%2Fp%3E.png?theme=light&md=1&fontSize=200px&images=${encodeURI(
                                profileImageUrl,
                            )}`,
                            width: 1276,
                            height: 728,
                            alt: `Subscribe to ${username}'s email list`,
                        },
                    ],
                }}
                twitter={{
                    handle: '@' + username,
                    site: '@circeldotme',
                    cardType: 'summary_large_image',
                }}
            />
            {!submitted ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white max-w-lg flex flex-col p-10 space-y-6 rounded-lg mx-auto"
                >
                    <h1 className="heading-3">Subscribe</h1>
                    <p className="text-gray-600">
                        Your email will be put on {username}'s Substack email
                        list. You can unsubscribe anytime.
                    </p>
                    <Input
                        type="email"
                        name="email"
                        ref={register({
                            required: true,
                            pattern: emailRegex,
                        })}
                        placeholder="Email"
                    />
                    <Button type="submit">Sign up</Button>
                </form>
            ) : (
                <div className="bg-white max-w-lg flex flex-col p-10 space-y-6 rounded-lg mx-auto">
                    <h1 className="heading-3">Confirm your email</h1>
                    <p className="paragraph">
                        Click the link in your inbox to verify your email.
                    </p>
                    <p className="paragraph">
                        Advance on the{' '}
                        <Link
                            href="/[username]/leaderboard"
                            as={`/${username}/leaderboard`}
                        >
                            <a className="teal-link">leaderboard</a>
                        </Link>{' '}
                        and earn money by referring people to {username}'s email
                        list.
                    </p>
                </div>
            )}
        </Layout>
    )
}

const prisma = new PrismaClient()

export const getStaticProps = async ({ params }) => {
    const user = await prisma.user.findOne({
        where: {
            username: params.username,
        },
        select: {
            username: true,
            profileImageUrl: true,
        },
    })

    return {
        props: {
            user,
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const users = await prisma.user.findMany({
        select: {
            username: true,
        },
    })

    return {
        paths: users.map(user => ({ params: { username: user.username } })),
        fallback: true,
    }
}

export default UserPage
