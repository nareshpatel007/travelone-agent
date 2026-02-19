'use client'

import { useEffect, useState } from 'react';
import { ExternalLink, MoveLeft, SearchAlert } from 'lucide-react';
import CommonHeader from '@/components/header/common-header';
import CommonFooter from '@/components/footer/common-footer';
import { getLoginCookie, isLoggedIn } from '@/lib/auth';
import Link from 'next/link';
import PackageOptions from '@/components/dashboard/edit-tour/package-options';
import TourItinerary from '@/components/dashboard/edit-tour/tour-itinerary';
import Highlights from '@/components/dashboard/edit-tour/highlights';

// Define tabs
const tabs = [
    // { label: "Basic Info", value: "basic_info" },
    // { label: "Highlights", value: "highlights" },
    // { label: "Group Dates", value: "group_dates" },
    // { label: "Media Gallery", value: "media_gallery" },
    // { label: "SEO Details", value: "seo_details" },
    { label: "Package Options", value: "package_options" },
    { label: "Tour Itinerary", value: "tour_itinerary" },
    // { label: "Terms", value: "terms" },
];

type Props = {
    params: Promise<{ tourId: string }>;
};

export default function Page({ params }: Props) {
    // Define state
    const [ready, setReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('package_options');
    const [tourData, setTourData] = useState<any>(null);

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
        const fetchInitData = async () => {
            try {
                // Set loading
                setIsLoading(true);

                // Get auth login
                const authData = getLoginCookie();

                // Fetch the data
                const response = await fetch("/api/tours/single", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tour_id: (await params).tourId,
                        agent_id: authData?.user_id,
                    }),
                    signal: controller.signal,
                });

                // Parse the JSON response
                const data = await response.json();

                // Update the state
                if (data.status) {
                    setTourData(data?.data ?? []);
                }
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch tour data:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitData();
        return () => controller.abort();
    }, [ready]);

    // If not ready, show loading
    if (!ready) return null;

    return (
        <>
            <CommonHeader />

            <div className="bg-gray-50">
                {isLoading && (
                    <div className="max-w-7xl mx-auto py-7 grid grid-cols-1 space-y-5">
                        <div className="animate-pulse bg-gray-200 rounded-lg h-30"></div>
                        <div className="animate-pulse bg-gray-200 rounded-lg h-50"></div>
                        <div className="animate-pulse bg-gray-200 rounded-lg h-50"></div>
                    </div>
                )}

                {!isLoading && tourData && (
                    <>
                        <div className="bg-[#FFF9EE] border-b-2 border-[#d9cec1] z-50">
                            <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
                                <div className="flex-1">
                                    Edit tour for <span className="font-bold text-black">"{tourData?.tour?.name}"</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Link href={`https://travelone.io/tour/${tourData?.tour?.slug}`} target="_blank">
                                        <button className="flex items-center gap-2 border-1 border-black bg-amber-300 text-black px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black">
                                            Preview Tour <ExternalLink className='w-4 h-4' />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="max-w-7xl mx-auto py-4">
                            <div className="bg-white rounded shadow-sm space-y-6 border-b border-gray-200">
                                <div className="flex overflow-x-auto">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            className="relative py-3 px-4 text-base font-medium whitespace-nowrap transition cursor-pointer flex-shrink-0"
                                        >
                                            <span className={activeTab === tab.value ? "text-black" : "text-gray-500 hover:text-black"}>
                                                {tab.label}
                                            </span>

                                            {activeTab === tab.value && (
                                                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black rounded-full transition-all duration-300"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tab for Highlights */}
                        {activeTab === "highlights" && <Highlights
                            tourId={tourData?.tour?.id}
                            highlights={tourData?.tour?.tour_highlights ?? []}
                        />}

                        {/* Tab for Package Options */}
                        {activeTab === "package_options" && <PackageOptions
                            tourId={tourData?.tour?.id}
                            packages={tourData?.packages ?? []}
                        />}

                        {/* Tab for Tour Itinerary */}
                        {activeTab === "tour_itinerary" && <TourItinerary
                            tourId={tourData?.tour?.id}
                            countries={tourData?.countries ?? []}
                            itinerary={tourData?.itinerary ?? []}
                        />}
                    </>
                )}

                {/* Tour not found */}
                {!isLoading && !tourData && (
                    <div className="mx-auto max-w-4xl py-30 text-center space-y-5">
                        <SearchAlert
                            size={120}
                            className="mx-auto text-[#ef2853] opacity-15"
                        />
                        <h2 className="text-3xl font-medium text-black">
                            Tour not found
                        </h2>
                        <p className="text-base text-black max-w-2xl mx-auto">
                            The tour you are looking for does not exist. It might have been removed or the URL might be incorrect. Please check the URL or explore our other tours.
                        </p>
                        <div className='flex items-center justify-center'>
                            <Link
                                href="/my-tours"
                                className="max-w-max flex items-center justify-center gap-2 px-8 py-2 bg-black text-white rounded font-medium text-base hover:bg-black/90 transition-colors shadow-lg"
                            >
                                <MoveLeft className="h-5 w-5" />
                                Back to Listing
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <CommonFooter />
        </>
    )
}
