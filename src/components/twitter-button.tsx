import React from 'react'
import { Twitter } from './svg'

interface Props {
    children?: React.ReactChild
    long?: boolean
}

const TwitterButton: React.FC<Props> = ({ long = false, children }) => {
    const defaultText = `Sign up${long ? ` with Twitter` : ''}`
    return (
        <a
            href="/api/auth/twitter"
            className={`px-6 py-2 bg-twitter rounded-lg hover:bg-blue-600 ease inline-flex items-center text-white`}
        >
            <div className="w-4 h-full mr-3">
                <Twitter />
            </div>
            <span
                className="text-sm text-center leading-none"
                style={{ transform: 'translateY(1px)' }}
            >
                {children ? children : defaultText}
            </span>
        </a>
    )
}

export default TwitterButton
