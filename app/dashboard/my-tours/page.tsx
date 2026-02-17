"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import PageHeading from "@/components/common/page-heading";
import { TourCard } from "@/components/tours/tour-card";
import { isLoggedIn } from "@/lib/auth";

export default function Page() {
    // Define state
    const [ready, setReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tourData, setTourData] = useState<any>([]);

    // Check login and set ready
    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
        }
        requestAnimationFrame(() => { setReady(true); });
    }, []);

    // Init data
    useEffect(() => {
        if (!ready) return;
        const controller = new AbortController();
        const fetchTours = async () => {
            try {
                // Set loading
                setIsLoading(true);

                // Fetch the data
                const response = await fetch("/api/tours/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    signal: controller.signal,
                });

                // Check response
                if (!response.ok) return;

                // Parse the JSON response
                const data = await response.json();

                // Update the state
                setTourData(data?.data?.result ?? []);
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch tours:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
        return () => controller.abort();
    }, [ready]);

    return (
        <>
            {ready && <>
                <CommonHeader />

                <div className="max-w-7xl mx-auto px-5 md:px-0 py-6">
                    <PageHeading
                        main="My Tours"
                        sub="Manage your created or imported tours here."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
                        {tourData.map((tour: any) => (
                            <TourCard key={tour.id} {...tour} />
                        ))}
                    </div>
                </div>

                <CommonFooter />
            </>}
        </>
    );
}
