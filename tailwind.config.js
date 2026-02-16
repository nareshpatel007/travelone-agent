module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                marqueeUp: {
                    "0%": { transform: "translateY(0%)" },
                    "100%": { transform: "translateY(-50%)" },
                },
                marqueeDown: {
                    "0%": { transform: "translateY(-50%)" },
                    "100%": { transform: "translateY(0%)" },
                },
            },
            animation: {
                marqueeUp: "marqueeUp 22s linear infinite",
                marqueeDown: "marqueeDown 22s linear infinite",
            },
        },
    },
    plugins: [],
};
