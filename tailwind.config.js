module.exports = {
    content: [
        "./App.tsx",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                bold: ['SF-Pro-Text-Bold'],
                semiBold: ['SF-Pro-Text-Semibold'],
                regular: ['SF-Pro-Text-Regular'],
                displayBold: ['SF-Pro-Display-Bold'],
                displayMedium: ['SF-Pro-Display-Medium'],
                displayRegular: ['SF-Pro-Display-Regular'],
            },
        },
    },
    plugins: [],
};