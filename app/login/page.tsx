"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import { LoginPage } from "@/components/pages/login";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
    // Define router
    const router = useRouter();

    // Define state
    const [ready, setReady] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => { setReady(true); });
    }, []);

    return (
        <>
            {ready && <>
                <CommonHeader />
                <LoginPage />
                <CommonFooter />
            </>}
        </>
    );
}