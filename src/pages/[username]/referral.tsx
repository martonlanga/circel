import { PrismaClient, RefCreateInput } from '@prisma/client'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/button'
import Input from '../../components/input'
import Layout from '../../components/layout'
import Leaderboard from '../../components/leaderboard'
import { Copy } from '../../components/svg'
import { baseUrl } from '../../lib'

interface FormData {
    id: string
    ethAddress?: string
}

const RerferralPage: NextPage = () => {
    const router = useRouter()
    const { username } = router.query
    const { register, handleSubmit, errors } = useForm<FormData>()
    const [referralLink, setReferralLink] = useState<null | string>(null)
    const [copied, setCopied] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const onSubmit = handleSubmit(async data => {
        await fetch('/api/refs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                users: {
                    connect: { username: username as string },
                },
            } as RefCreateInput),
        })
        setReferralLink(`${baseUrl}/${username}?ref=${data.id}`)
    })

    return (
        <Layout>
            {!referralLink ? (
                <form
                    onSubmit={onSubmit}
                    className="bg-white max-w-lg flex flex-col p-10 space-y-6 rounded-xl mx-auto"
                >
                    <h1 className="heading-3">Become a referrer</h1>
                    <p className="text-gray-600">
                        Share your referral link with others and get payed in
                        Ethereum for it!
                    </p>
                    <Input
                        type="text"
                        name="id"
                        ref={register({ required: true })}
                        placeholder="Twitter handle"
                    />
                    <Input
                        type="text"
                        name="ethAddress"
                        ref={register}
                        placeholder="Ethereum Address"
                    />
                    <Button type="submit">Get your referral link</Button>
                </form>
            ) : (
                <div className="bg-white max-w-lg flex flex-col p-10 space-y-6 rounded-lg mx-auto">
                    <h1 className="heading-3">Start referring other people!</h1>
                    <div className="relative">
                        <Input
                            ref={inputRef}
                            value={referralLink}
                            readOnly
                            // disabled
                            style={{ width: '100%' }}
                        />
                        <div
                            className="absolute w-5 text-gray-600 hover:text-gray-800 ease cursor-pointer"
                            style={{
                                top: '50%',
                                right: '1rem',
                                transform: 'translate(0, -50%)',
                            }}
                            onClick={() => {
                                const input = inputRef.current
                                input.select()
                                input.setSelectionRange(0, 9999)

                                document.execCommand('copy')
                                setCopied(true)
                            }}
                        >
                            <Copy />
                        </div>
                    </div>
                    {copied && (
                        <p className="text-center text-sm text-gray-600">
                            Copied!
                        </p>
                    )}
                </div>
            )}
            <Leaderboard username={username as string} preview />
        </Layout>
    )
}

const prisma = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async ({
    query,
    res,
    params,
}) => {
    const { username } = params
    const { t, id: rawId } = query
    const id = parseInt(rawId as string)

    if (t && id) {
        const { verificationToken } = await prisma.email.findOne({
            where: { id },
        })
        if (t === verificationToken) {
            const { email } = await prisma.email.update({
                where: { id },
                data: { verified: true },
            })
            console.log('Verified', email)
        }

        res.setHeader('location', `/${username}/referral`)
        res.statusCode = 302
        res.end()
    }

    return { props: {} }
}

export default RerferralPage
