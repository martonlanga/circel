export function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isProd = process.env.NODE_ENV === 'production'

export const formatDirectMessage = (
    rawMessage: string,
    values: {
        username: string
        followerName: string
        followerScreenName: string
    },
): string => {
    return rawMessage
        .replace(/\[username\]/g, values.username)
        .replace(/\[follower\]/g, values.followerName)
        .replace(/\[follower_handle\]/g, values.followerScreenName)
}

export const removeEmpty: <T>(obj: T) => Partial<T> = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
        else if (obj[key] === undefined) delete obj[key]
    })
    return obj
}

// VERCE_UL is the Preview's url (https://asfjhadsjhf.vercel.app)
export const baseUrl = isProd
    ? 'https://circel.me'
    : process.env.NEXT_PUBLIC_LOCAL_URL
