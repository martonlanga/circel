import React from 'react'

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>((props, ref) => (
    <label
        {...props}
        ref={ref}
        className="pl-4 text-sm font-semibold text-gray-600"
    />
))

export default Label
