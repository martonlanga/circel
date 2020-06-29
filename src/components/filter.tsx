import { FollowerWhereInput } from '@prisma/client'
import { subDays } from 'date-fns'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { removeEmpty } from '../lib'
import Button from './button'
import { Plus } from './svg'

interface Contains {
    bio: string[]
    location: string[]
}

export interface FormData {
    hasCustomProfile: boolean
    hasCustomProfileImage: boolean
    verifiedChecked: boolean
    lastStatusDateNumber: string
    createdAtNumber: string
    listedCount: string
    favouritesCount: string
    statusesCount: string
    friendsCount: string
    followersCount: string
    location: string
    description: string
}

interface Props {
    setFilters: Dispatch<SetStateAction<FollowerWhereInput>>
}

const Filter: React.FC<Props> = ({ setFilters }) => {
    const { register, handleSubmit, errors, watch, setValue } = useForm<
        FormData
    >({
        defaultValues: {
            favouritesCount: '10',
            statusesCount: '10',
            friendsCount: '50',
            followersCount: '10',
            lastStatusDateNumber: '31',
            createdAtNumber: '31',
            hasCustomProfileImage: true,
        },
    })
    const [contains, setContains] = useState<Contains>({
        bio: [],
        location: [],
    })

    const onSubmit = handleSubmit(formData => {
        setFilters(
            removeEmpty({
                listedCount: hasData(formData.listedCount)
                    ? {
                          gte: parseInt(formData.listedCount),
                      }
                    : undefined,
                favouritesCount: hasData(formData.favouritesCount)
                    ? {
                          gte: parseInt(formData.favouritesCount),
                      }
                    : undefined,
                statusesCount: hasData(formData.statusesCount)
                    ? {
                          gte: parseInt(formData.statusesCount),
                      }
                    : undefined,
                friendsCount: hasData(formData.friendsCount)
                    ? {
                          gte: parseInt(formData.friendsCount),
                      }
                    : undefined,
                followersCount: hasData(formData.followersCount)
                    ? {
                          gte: parseInt(formData.followersCount),
                      }
                    : undefined,
                lastStatusDate: hasData(formData.lastStatusDateNumber)
                    ? {
                          gt: subDays(
                              new Date(),
                              parseInt(formData.lastStatusDateNumber),
                          ),
                      }
                    : undefined,
                createdAt: hasData(formData.createdAtNumber)
                    ? {
                          lt: subDays(
                              new Date(),
                              parseInt(formData.createdAtNumber),
                          ),
                      }
                    : undefined,
                OR:
                    contains.bio.length || contains.location.length
                        ? [
                              ...contains.bio.map(b => ({
                                  description: { contains: b },
                              })),
                              ...contains.location.map(l => ({
                                  location: { contains: l },
                              })),
                          ]
                        : undefined,
                defaultProfile: formData.hasCustomProfile
                    ? { equals: false }
                    : undefined,
                defaultProfileImage: formData.hasCustomProfileImage
                    ? {
                          equals: false,
                      }
                    : undefined,
                verified: formData.verifiedChecked
                    ? {
                          equals: true,
                      }
                    : undefined,
            }),
        )
    })

    return (
        <div className="bg-white p-8 rounded-md">
            <form onSubmit={onSubmit} className="flex flex-col space-y-2">
                <Input
                    type="number"
                    name="listedCount"
                    text="Part of at least # lists"
                    ref={register}
                />
                <Input
                    type="number"
                    name="favouritesCount"
                    text="Has liked at least # times"
                    ref={register}
                />
                <Input
                    type="number"
                    name="statusesCount"
                    text="Has at least # tweets"
                    ref={register}
                />
                <Input
                    type="number"
                    name="friendsCount"
                    text="Follows at least # people"
                    ref={register}
                />
                <Input
                    type="number"
                    name="followersCount"
                    text="Has at least # followers"
                    ref={register}
                />
                <Input
                    type="number"
                    name="lastStatusDateNumber"
                    text="Tweeted in the last # days"
                    ref={register}
                />
                <Input
                    type="number"
                    name="createdAtNumber"
                    text="Account is older than # days"
                    ref={register}
                />
                <Input
                    type="text"
                    name="description"
                    text="Bio contains: "
                    placeholder="BTC"
                    ref={register}
                >
                    {
                        <div className="space-x-2 flex items-center flex-wrap">
                            <div
                                onClick={() => {
                                    const val = watch('description')
                                    if (typeof val !== 'string' || !val) {
                                        console.log('here', val)

                                        return
                                    }
                                    setContains({
                                        ...contains,
                                        bio: [
                                            ...contains.bio,
                                            watch('description') as string,
                                        ],
                                    })
                                    setValue('description', '')
                                }}
                                className="w-6 p-1 bg-gray-200 rounded-full text-gray-500 cursor-pointer hover:text-gray-700 ease"
                            >
                                <Plus />
                            </div>
                            {contains.bio.map((b, i) => (
                                <span
                                    key={i}
                                    onClick={() =>
                                        setContains({
                                            ...contains,
                                            bio: contains.bio.filter(
                                                (_, j) => j !== i,
                                            ),
                                        })
                                    }
                                    className="bg-gray-100 rounded-md px-2 cursor-pointer text-sm text-gray-800 hover:text-foreground ease"
                                >
                                    {b}
                                </span>
                            ))}
                        </div>
                    }
                </Input>
                <Input
                    type="text"
                    name="location"
                    text="Location contains: "
                    placeholder="SF"
                    ref={register}
                >
                    {
                        <div className="space-x-2 flex items-center flex-wrap">
                            <div
                                onClick={() => {
                                    const val = watch('location')
                                    if (typeof val !== 'string' || !val) {
                                        console.log('here', val)

                                        return
                                    }
                                    setContains({
                                        ...contains,
                                        location: [
                                            ...contains.location,
                                            watch('location') as string,
                                        ],
                                    })
                                    setValue('location', '')
                                }}
                                className="w-6 p-1 bg-gray-200 rounded-full text-gray-500 cursor-pointer hover:text-gray-700 ease"
                            >
                                <Plus />
                            </div>
                            {contains.location.map((l, i) => (
                                <span
                                    key={i}
                                    onClick={() =>
                                        setContains({
                                            ...contains,
                                            location: contains.location.filter(
                                                (_, j) => j !== i,
                                            ),
                                        })
                                    }
                                    className="bg-gray-100 rounded-md px-2 cursor-pointer text-sm text-gray-800 hover:text-foreground ease"
                                >
                                    {l}
                                </span>
                            ))}
                        </div>
                    }
                </Input>
                <Input
                    type="checkbox"
                    name="hasCustomProfile"
                    text="Has custom theme or background"
                    ref={register}
                />
                <Input
                    type="checkbox"
                    name="hasCustomProfileImage"
                    text="Has custom profile image"
                    ref={register}
                />
                <Input
                    type="checkbox"
                    name="verifiedChecked"
                    text="Is verified"
                    ref={register}
                />
                <div className="pt-4">
                    <Button type="submit">Apply</Button>
                </div>
            </form>
        </div>
    )
}

const hasData = (field: string): boolean => {
    if (field && field !== '0') {
        return true
    }
    return false
}

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        text: string
        wide?: boolean
    }
>(({ children, name, text, wide = false, ...props }, ref) => (
    <div className="space-x-2 flex">
        <input
            {...props}
            name={name}
            ref={ref}
            className="bg-gray-100 rounded-md px-2 w-20"
        />
        <label htmlFor={name} className="text-gray-600 text-sm">
            {text}
        </label>
        {children}
    </div>
))

export default Filter
