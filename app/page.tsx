"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import { LoginPage } from "@/components/pages/login";

export default function Page() {
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
