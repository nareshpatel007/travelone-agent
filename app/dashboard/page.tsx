"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import { isLoggedIn } from "@/lib/auth";

export default function Page() {
    // Define state
    const [ready, setReady] = useState(false);

    // Check login and set ready
    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
        }
        requestAnimationFrame(() => { setReady(true); });
    }, []);

    return (
        <>
            {ready && <>
                <CommonHeader />

                <div className="p-8">
                    Welcome to Agent Dashboard!
                </div>

                <CommonFooter />
            </>}
        </>
    );
}
