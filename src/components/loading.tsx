import React from 'react'
import styles from '../styles/loading.module.css'

type Size = 'small' | 'normal' | 'big'

interface Props {
    size?: Size
}

const getSize = (size: Size): string => {
    switch (size) {
        case 'small':
            return '2rem'
        case 'normal':
            return '3rem'
        case 'big':
            return '4rem'
    }
}

const Loading = ({ size = 'normal' }: Props) => {
    const length = getSize(size)
    return (
        <div
            className={styles.spinner}
            style={{ width: length, height: length }}
        ></div>
    )
}

export default Loading
