import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '../../components/layout'
import { Upload } from '../../components/svg'
import { isProd } from '../../lib'
import useUser from '../../lib/useUser'

const UploadPage = () => {
    const { user } = useUser()
    const router = useRouter()
    const [state, setState] = useState(0)

    return (
        <Layout>
            <section className="flex flex-col md:flex-row justify-between md:space-x-10">
                <div>
                    <h1 className="heading-1">Upload your followers</h1>
                    <div className="my-10 space-y-6">
                        <h4 className="heading-4">Instructions</h4>
                        <ol className="ol space-y-1">
                            <li>
                                Go to your{' '}
                                <a
                                    className="teal-link"
                                    href="https://twitter.com/settings/your_twitter_data"
                                    target="_blank"
                                >
                                    Twitter settings
                                </a>
                            </li>
                            <li>
                                Enter your password under{' '}
                                <b>Download your Twitter data</b> , then click{' '}
                                <b>Confirm</b>
                            </li>
                            <li>
                                Click the <b>Request</b> data button
                            </li>
                            <li>Once available, download your data</li>
                            <li>Unzip the archive</li>
                            <li>
                                From the <b>data</b> folder, upload the{' '}
                                <code className="">follower.js</code> file
                            </li>
                        </ol>
                        <p className="text-sm">
                            <a
                                className="teal-link italic"
                                href="https://help.twitter.com/en/managing-your-account/how-to-download-your-twitter-archive"
                                target="_blank"
                            >
                                How to download and view your Twitter archive
                            </a>
                        </p>
                        <div>
                            <h4 className="heading-4">Lookup Duration</h4>
                            <p className="paragraph mt-3">
                                Approximately 1 second per 100 followers.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="md:w-5/12">
                    <p className="text-gray-600 mb-3">
                        {state > 0
                            ? `Uploading and looking up ${state} followers...`
                            : 'No followers selected.'}
                    </p>
                    <div className="relative p-20 rounded-lg flex flex-col items-center justify-center bg-gray-100 hover:bg-white space-y-4 b h-full">
                        <div className="w-10 text-gray-600">
                            <Upload />
                        </div>
                        <p className="heading-2 text-teal-600">follower.js</p>

                        <input
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            type="file"
                            onChange={async e => {
                                const file = e.target.files[0]
                                const text = (await file.text()).split('\n')
                                const accountIds = []
                                for (let i = 0; i < text.length; i++) {
                                    if (text[i].indexOf('accountId') > -1) {
                                        accountIds.push(text[i].split('"')[3])
                                    }
                                }
                                setState(accountIds.length)

                                const response = await fetch(
                                    isProd
                                        ? '/server/upload'
                                        : 'http://localhost:3001/upload',
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            token: user.token,
                                            tokenSecret: user.tokenSecret,
                                            userId: user.id,
                                            followersArray: accountIds,
                                        }),
                                    },
                                )
                                console.log(await response.text())
                                setTimeout(
                                    () =>
                                        router.push(
                                            '/[username]/dashboard',
                                            `/${user.username}/dashboard`,
                                        ),
                                    1000,
                                )
                            }}
                        />
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default UploadPage
