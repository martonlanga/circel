import React from 'react'

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
    <input
        {...props}
        ref={ref}
        className="bg-gray-100 focus:bg-gray-200 px-5 py-2 rounded-lg ease focus:outline-none placeholder-gray-400"
    />
))

export default Input
