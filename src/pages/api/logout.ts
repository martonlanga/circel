import { NextApiResponse } from 'next'
import { User } from '../../lib/interfaces'
import withSession from '../../lib/session'

export default withSession(async (req, res: NextApiResponse<User>) => {
    req.session.destroy()
    res.writeHead(302, {
        Location: '/',
    })
    res.end()
})
