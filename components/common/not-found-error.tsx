"use client"

import { Home } from "lucide-react";
import Link from "next/link";

// Define props
interface Props {
    needCode?: boolean;
    heading?: string;
    subHeading?: string;
    needButton?: boolean;
}

export default function NotFoundError({ needCode = true, heading, subHeading, needButton = true }: Props) {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-30 text-center">
                {needCode && <div className="relative mb-8">
                    <h1 className="text-[120px] md:text-[180px] font-bold text-black opacity-10 leading-none">404</h1>
                </div>}

                <h2 className="text-3xl md:text-4xl font-semibold text-[#1E1E1E] mb-4">
                    {heading || "Oops! Looks like you're off the map"}
                </h2>

                <p className="text-base md:text-lg text-black mb-10 max-w-2xl mx-auto">
                    {subHeading || "The page you're looking for doesn't exist. But don't worry, there are plenty of amazing destinations waiting to be explored."}
                </p>

                {/* Extra Button */}
                {needButton && <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded font-semibold text-base hover:bg-[#1E1E1E] transition-colors shadow-lg"
                    >
                        <Home className="h-5 w-5" />
                        Back to Dashboard
                    </Link>
                </div>}
            </div>
        </>
    )
}
