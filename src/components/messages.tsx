import React from 'react'
import useSWR from 'swr'
import useUser from '../lib/useUser'
import { MessageWithCount } from '../pages/api/messages'
import Loading from './loading'

interface Props {}

const Messages: React.FC<Props> = () => {
    const { user } = useUser()
    const { data, error, mutate } = useSWR<MessageWithCount[]>('/api/messages')

    if (error) {
        console.error(error)
        return <div>Error</div>
    }

    return data ? (
        data.length === 0 ? (
            <p className="text-gray-600 mb-10">No messages sent. </p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {data.map(message => {
                    const progress = Math.ceil(
                        (message.sentToCount / message.sendToCount) * 100,
                    )

                    const state =
                        progress === 100
                            ? 'Finished'
                            : message.active
                            ? 'Active'
                            : 'Paused'
                    const color =
                        state === 'Active'
                            ? 'blue'
                            : state === 'Finished'
                            ? 'green'
                            : 'yellow'
                    return (
                        <section
                            key={message.id}
                            className="bg-white flex flex-col rounded-xl overflow-hidden"
                        >
                            <div className="px-10 py-6 h-full">
                                <div className="flex justify-between text-center">
                                    <h3 className="heading-3 text-lg">
                                        {message.name}
                                    </h3>
                                    <div className="text-gray-800 text-sm tracking-tighter">
                                        Sent to{' '}
                                        <span className="text-lg text-black">
                                            {progress}%
                                        </span>
                                    </div>
                                </div>
                                <p className="paragraph text-xs break-words mt-2">
                                    {message.message}
                                </p>
                            </div>
                            <footer
                                className={`bg-${color}-200 px-10 py-2 flex items-center justify-between`}
                            >
                                <span
                                    className={`text-${color}-800 uppercase text-xs font-bold`}
                                >
                                    {state}
                                </span>

                                {state !== 'Finished' && (
                                    <button
                                        className="text-gray-700 uppercase text-xs font-bold hover:text-black"
                                        onClick={() => {
                                            const active = state === 'Paused'
                                            fetch(
                                                '/api/messages?id=' +
                                                    message.id,
                                                {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type':
                                                            'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        active,
                                                    }),
                                                },
                                            )
                                            mutate()
                                        }}
                                    >
                                        {state === 'Active'
                                            ? 'Pause'
                                            : 'Resume'}
                                    </button>
                                )}
                            </footer>
                            {/* to prevent post-css tree-shaking */}
                            <span className="bg-blue-200 bg-green-200 bg-yellow-200 text-blue-800 text-green-800 text-yellow-800" />
                        </section>
                    )
                })}
            </div>
        )
    ) : (
        <Loading size="big" />
    )
}

export default Messages
