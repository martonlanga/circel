export interface User {
    // in cookie
    isLoggedIn: boolean
    token?: string
    tokenSecret?: string
    id?: string

    // get these from /api/user (not stored in the cookie)
    username?: string
    profileImageUrl?: string
    ethBounty?: number
    endOfCampaign?: string // date
    uploadedFollowersCount?: number
}

export type UserCookie = Pick<
    User,
    'isLoggedIn' | 'token' | 'tokenSecret' | 'id'
>

// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object
// !!! `derived` Arrays of Enrichment Objects
// **Enterprise** APIs only Collection of Enrichment metadata derived for user. Provides the Profile Geo Enrichment metadata. See referenced documentation for more information, including JSON data dictionaries. Example:

export interface LookedUpUser {
    // id: number (Use string instead: https://developer.twitter.com/en/docs/basics/twitter-ids)
    id_str: string
    name: string
    screen_name: string
    location: string | null
    url: string | null
    description: string | null
    protected: boolean
    verified: boolean
    followers_count: number
    friends_count: number
    listed_count: number
    favourites_count: number
    statuses_count: number
    created_at: string
    profile_banner_url?: string
    profile_image_url_https: string
    default_profile: boolean
    default_profile_image: boolean
    status?: {
        created_at: string
    }
}
