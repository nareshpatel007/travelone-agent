"use client";

import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import { useEffect, useState } from "react";
import NotFoundError from "@/components/common/not-found-error";

export default function NotFound() {
    // Define state
    const [ready, setReady] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setReady(true);
        });
    }, []);

    // If not ready, return null to prevent rendering
    if (!ready) return null;

    return (
        <div className="min-h-screen bg-white">
            <CommonHeader />
            <NotFoundError />
            <CommonFooter />
        </div>
    )
}
