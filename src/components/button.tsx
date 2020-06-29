import React from 'react'

export const ButtonWithIcon = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
    <button
        {...props}
        ref={ref}
        className="inline-flex items-center leading-tight text-teal-600 bg-gray-100 px-6 py-2 hover:bg-white rounded-lg select-none text-sm font-semibold tracking-wide ease whitespace-no-wrap border border-gray-300"
        style={{
            minWidth: '10rem',
        }}
    >
        {children}
    </button>
))

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
    <button
        {...props}
        ref={ref}
        className="bg-black px-6 hover:bg-gray-800 rounded-lg select-none leading-9 text-white text-sm font-semibold tracking-wide ease whitespace-no-wrap"
        style={{
            minWidth: '10rem',
        }}
    >
        {children}
    </button>
))

export default Button
