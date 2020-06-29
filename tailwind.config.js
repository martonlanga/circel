module.exports = {
    purge: [
        './src/components/**/*.{js,ts,tsx}',
        './src/pages/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#EEEEEE',
                foreground: '#000000',
                accent: '#21D2BD',
                gray: {
                    '100': '#F5F5F5',
                    '200': '#EEEEEE',
                    '300': '#E0E0E0',
                    '400': '#BDBDBD',
                    '500': '#999999',
                    '600': '#777777',
                    '700': '#555555',
                    '800': '#333333',
                    '900': '#111111',
                },
                twitter: 'rgb(29, 161, 242)',
            },
            borderRadius: {
                xl: '1rem',
            },
        },
    },
    variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'odd'],
        borderRadius: ['responsive', 'first', 'last'],
    },
    plugins: [],
}
