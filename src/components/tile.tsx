import React from 'react'
import Loading from './loading'

interface Props {
    data: string | undefined | number
    label: string
    small?: boolean
}

const Tile = ({ data, label, small = false }: Props) => {
    return (
        <div className="bg-white rounded-lg p-5 pb-2 text-center leading-none">
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            {data || data === 0 ? (
                <div className="mt-2">
                    <span
                        className="leading-none tracking-tight"
                        style={{ fontSize: small ? '1.4rem' : '2rem' }}
                    >
                        {data}
                    </span>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Loading size="small" />
                </div>
            )}
        </div>
    )
}

export default Tile
