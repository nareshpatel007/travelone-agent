import Script from "next/script";

// Set metadata
export const metadata = {
    title: "TravelOne Supplier",
    description: "TravelOne Supplier",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <head>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                {/* <link rel="stylesheet" href="/assets/home-css/styles.css" /> */}
                {/* <link rel="stylesheet" href="/assets/home-css/grid.css" /> */}
                {/* <link rel="stylesheet" href="/assets/home-css/main.css" /> */}
                {/* <link rel="stylesheet" href="/assets/home-css/main.min.css" /> */}
                <link rel="stylesheet" href="/assets/home-css/main(1).min.css" />
                {/* <link rel="stylesheet" href="/assets/home-css/home.css" /> */}

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Quintessential&family=Science+Gothic:wght@100..900&display=swap"
                    rel="stylesheet"
                />

                <Script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></Script>
            </head>
            <html lang="en-US" className="no-touchevents">
                <body>
                    {children}
                </body>
            </html>
        </>
    );
}
