"use client";

import { isLoggedIn } from "@/lib/auth";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CommonHeader() {
    // Is user login
    const isLoginUser = isLoggedIn();

    return (
        <>
            <header className="top-0 z-50 bg-white border-b border-[#d9cec1]">
                <div className="px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
                    <Link href="/">
                        <Image
                            src="/common/logo.webp"
                            alt="Logo"
                            width={160}
                            height={100}
                            className="cursor-pointer w-32 md:w-40"
                            draggable="false"
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-900">
                        {isLoginUser && <>
                            <Link className="hover:underline underline-offset-5 cursor-pointer" href="/dashboard">Dashboard</Link>
                            <Link className="hover:underline underline-offset-5 cursor-pointer" href="/dashboard/my-tours">My Tours</Link>
                            <Link className="hover:underline underline-offset-5 cursor-pointer" href="/dashboard/import">Import Tours</Link>
                        </>}

                        {!isLoginUser && <>
                            <Link className="flex items-center gap-2 hover:underline underline-offset-5 cursor-pointer" href="/login">
                                <LogIn className="w-4 h-4" /> Log In
                            </Link>
                        </>}
                    </nav>
                </div>
            </header>
        </>
    );
}
