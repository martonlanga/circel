import { FollowerWhereInput } from '@prisma/client'
import Router from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatDirectMessage } from '../lib'
import useUser from '../lib/useUser'
import Button from './button'
import Input from './input'
import TextArea from './textarea'

const defaultMessage =
    "Hi [follower] (@[follower_handle]), I'm starting a newsletter about Why Ants Should Rule the World. Here's a unique link for you to sign up: circel.me/[username] Refer others for a chance to win $100!"

export interface DetailsFormValues {
    name: string
    message: string
}

interface Props {
    filters: FollowerWhereInput | undefined
    followersCount: number
}

const Details: React.FC<Props> = ({ filters, followersCount }) => {
    const { user } = useUser()
    const methods = useForm<DetailsFormValues>()
    const values = {
        username: user.username,
        followerName: 'Balaji S. Srinivasan',
        followerScreenName: 'balajis',
    }

    const [message, setMessage] = useState<string>(
        formatDirectMessage(defaultMessage, values),
    )

    const { register, handleSubmit, errors } = methods

    const onSubmit = handleSubmit(async ({ name, message }) => {
        await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filters: JSON.stringify(filters),
                name,
                message,
            }),
        })
        Router.push('/[username]/dashboard', `/${user.username}/dashboard`)
    })

    return (
        <div className="bg-white rounded-md p-10 flex space-x-10 w-full">
            <form
                onSubmit={onSubmit}
                className="flex flex-col space-y-6 flex-grow"
            >
                <h3 className="heading-3 leading-none">Message</h3>
                <Input
                    type="text"
                    name="name"
                    ref={register({ required: true })}
                    placeholder="Name (just for you)"
                />
                <TextArea
                    name="message"
                    ref={register({ required: true })}
                    placeholder="Your Message"
                    defaultValue={defaultMessage}
                    onChange={({ target: { value } }) => {
                        setMessage(value)
                    }}
                    style={{ minHeight: '10rem' }}
                ></TextArea>
                <Button type="submit">
                    Send Message to {followersCount} people.
                </Button>
            </form>
            <div className="space-y-6 flex flex-col overflow-hidden w-1/2">
                <h3 className="heading-3 leading-none text-gray-600">
                    Preview
                </h3>
                <div className="h-full flex justify-end items-end">
                    {message && (
                        <div
                            className="text-white rounded-xl rounded-br-none font-sans text-sm break-words overflow-hidden bg-twitter"
                            style={{
                                padding: '10px 15px',
                            }}
                        >
                            {formatDirectMessage(message, values)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Details
