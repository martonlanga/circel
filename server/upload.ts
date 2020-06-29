import { PrismaClient } from '@prisma/client'
import Twitter from 'twitter-lite'
import { sleep } from '../src/lib'
import { LookedUpUser } from '../src/lib/interfaces'

const prisma = new PrismaClient()

export const lookupFollowers = async (
    userIds: string[],
    client: Twitter,
    userId: string,
) => {
    let requestCount = 0
    let followersCount = 0
    try {
        while (followersCount < userIds.length) {
            const userBatch = userIds.slice(
                // Max lookups allowed per request: 100
                followersCount,
                followersCount + 100,
            )
            followersCount += userBatch.length
            console.log(userBatch.join(','))

            console.log(
                `Batch: ${followersCount}/${userIds.length} | ${Math.round(
                    (followersCount / userIds.length) * 100,
                )}%`,
            )

            // https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
            const followers: LookedUpUser[] = await client.post(
                'users/lookup',
                {
                    user_id: userBatch.join(','), // up to 100 per request
                },
            )
            requestCount += 1

            console.log(`Creating ${followers.length} followers`)

            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    followers: {
                        create: followers.map(follower => ({
                            twitterId: follower.id_str,
                            name: follower.name,
                            screenName: follower.screen_name,
                            location: follower.location,
                            description: follower.description,
                            url: follower.url,
                            protected: follower.protected,
                            followersCount: follower.followers_count,
                            friendsCount: follower.friends_count,
                            listedCount: follower.listed_count,
                            createdAt: new Date(follower.created_at),
                            favouritesCount: follower.favourites_count,
                            verified: follower.verified,
                            statusesCount: follower.statuses_count,
                            lastStatusDate: follower.status
                                ? new Date(follower.status.created_at)
                                : null,
                            profileImageUrl: follower.profile_image_url_https,
                            profileBannerUrl: follower.profile_banner_url,
                            defaultProfile: follower.default_profile,
                            defaultProfileImage: follower.default_profile_image,
                        })),
                    },
                },
            })
            if (requestCount >= 900) {
                // 900 lookups per 15 minutes
                console.log('Sleeping for 15 minutes...')
                await sleep(15 * 60 * 1000)
                console.log('Continue lookup')
            }
        }

        console.log('Finished')
    } catch (error) {
        console.log('Failed to lookup users.', requestCount, followersCount)
        console.error(error)
    }
}
