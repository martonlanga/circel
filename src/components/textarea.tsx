import React from 'react'

const TextArea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
    <textarea
        {...props}
        ref={ref}
        className="bg-gray-100 focus:bg-gray-200 px-5 py-2 rounded-lg ease focus:outline-none placeholder-gray-400"
    />
))

export default TextArea
