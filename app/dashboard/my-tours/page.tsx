"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import PageHeading from "@/components/common/page-heading";
import { TourCard } from "@/components/tours/tour-card";
import { getLoginCookie, isLoggedIn } from "@/lib/auth";
import { CheckCircle2, ListCheckIcon, Loader2 } from "lucide-react";
import { Pagination } from "@/components/tours/pagination";

export default function Page() {
    // Define state
    const [ready, setReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [tourData, setTourData] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [totalPages, setTotalPages] = useState<any>(0);
    const [totalCount, setTotalCount] = useState<any>(0);
    const [isFormLoader, setIsFormLoader] = useState(false);
    const [selectedTour, setSelectedTour] = useState<any>(null);
    const [isOpenVisibleModal, setOpenDeleteModal] = useState(false);
    const [isContentReload, setIsContentReload] = useState(false);

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
                setIsPageLoading(true);

                // Get auth data
                const authData = getLoginCookie();

                // Fetch the data
                const response = await fetch("/api/tours/list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        agent_id: authData?.user_id,
                        page: currentPage,
                    }),
                    signal: controller.signal,
                });

                // Check response
                if (!response.ok) return;

                // Parse the JSON response
                const data = await response.json();

                // Update the state
                setTourData(data?.data?.result ?? []);
                setTotalPages(data?.data?.last_page ?? 0);
                setCurrentPage(data?.data?.current_page ?? 1);
                setTotalCount(data?.data?.total ?? 0);

                // Scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch tours:", error);
                }
            } finally {
                setIsLoading(false);
                setIsPageLoading(false);
            }
        };
        fetchTours();
        return () => controller.abort();
    }, [ready, currentPage, isContentReload]);

    // Handle delete tour
    const handleDeleteTour = async () => {
        // Validation
        if (!selectedTour?.id) return;

        try {
            // Set loading
            setIsFormLoader(true);

            // Make API call to delete the tour
            const response = await fetch("/api/tours/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    agent_id: getLoginCookie()?.user_id,
                    tour_id: selectedTour?.id
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check response and reload if successful
            if (data.status) {
                setIsContentReload((prev) => !prev);
            }
        } catch (err) {
            console.error("Error deleting tour:", err);
        } finally {
            // Reset loading and close modal
            setIsFormLoader(false);
            setOpenDeleteModal(false);
        }
    }

    return (
        <>
            {ready && <>
                <CommonHeader />

                <div className="p-8">
                    <PageHeading
                        main={`My Tours (${totalCount || 0} tours found)`}
                        sub="Manage your created or imported tours here."
                    />

                    {/* Loader */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 md:h-55 rounded bg-gray-200 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Data */}
                    {!isLoading && tourData.length > 0 && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
                                {tourData.map((tour: any) => (
                                    <TourCard
                                        key={tour.id}
                                        setOpenDeleteModal={setOpenDeleteModal}
                                        setSelectedTour={setSelectedTour}
                                        {...tour} />
                                ))}
                            </div>

                            <Pagination
                                isLoading={isPageLoading}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && tourData.length === 0 && (
                        <div className="mx-auto max-w-4xl py-20 text-center space-y-5">
                            <ListCheckIcon
                                size={120}
                                className="mx-auto text-[#ef2853] opacity-15"
                            />
                            <h2 className="text-3xl font-medium text-black">
                                No Tours Found
                            </h2>
                            <p className="text-base text-black max-w-2xl mx-auto">
                                You haven't created or imported any tours yet. Start by creating a new tour or importing one to see it listed here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Delete Tour Modal */}
                {isOpenVisibleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-100">
                        <div className="bg-white p-5 rounded w-full max-w-md space-y-4">
                            <h2 className="text-xl font-medium">Confirm Delete?</h2>
                            <p className="mt-2 text-sm md:text-base">
                                Are you sure you want to delete <b>"{selectedTour?.name}"</b> tour? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    disabled={isFormLoader}
                                    className="rounded bg-black px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-black/50"
                                    onClick={() => setOpenDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isFormLoader}
                                    className="flex items-center gap-1 text-sm border border-red-500 text-white bg-red-500 rounded px-4 py-1 cursor-pointer hover:bg-red-500/90 disabled:cursor-not-allowed disabled:bg-red-500/50"
                                    onClick={handleDeleteTour}
                                >
                                    {isFormLoader && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {!isFormLoader && <CheckCircle2 className="h-4 w-4" />}
                                    Yes! Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <CommonFooter />
            </>}
        </>
    );
}
