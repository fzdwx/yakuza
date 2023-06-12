/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'bgray1': 'hsl(0, 0%, 8.5%)',
                'bgray2': 'hsl(0, 0%, 11%)',
                'bgray3': 'hsl(0, 0%, 13.6%)',
                'bgray4': 'hsl(0, 0%, 15.8%)',
                'bgray5': 'hsl(0, 0%, 17.9%)',
                'bgray6': 'hsl(0, 0%, 20.5%)',
                'bgray7': 'hsl(0, 0%, 24.3%)',
                'bgray8': 'hsl(0, 0%, 31.2%)',
                'bgray9': 'hsl(0, 0%, 43.9%)',
                'bgray10': 'hsl(0, 0%, 49.4%)',
                'bgray11': 'hsl(0, 0%, 62.8%)',
                'bgray12': 'hsl(0, 0%, 93%)',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
            }
        },
    },
    plugins: [],
}

