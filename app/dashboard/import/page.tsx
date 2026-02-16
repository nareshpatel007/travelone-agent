"use client";

import { useEffect, useState } from "react";
import CommonFooter from "@/components/footer/common-footer";
import CommonHeader from "@/components/header/common-header";
import { AlertCircle, List, Play, PlaySquare, RefreshCcw, Upload } from "lucide-react";
import { CommonPlanTripModal } from "@/components/plan_your_trip/common-popup";
import { UploadImportModal } from "@/components/plan_your_trip/upload-import";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function Page() {
    // Define state
    const [ready, setReady] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openCommonPlanTrip, setOpenCommonPlanTrip] = useState<boolean>(false);
    const [openUploadImportFile, setOpenUploadImportFile] = useState<boolean>(false);
    const [importList, setImportList] = useState<any>([]);

    useEffect(() => {
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

                // Fetch the data
                const response = await fetch("/api/import/list", {
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
                setImportList(data?.data ?? []);
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch list:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitData();
        return () => controller.abort();
    }, [ready]);

    if (!ready) return null;

    return (
        <>
            <CommonHeader />

            <div className="flex">
                <div className="flex-1 p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload using PDF File */}
                        <div className="bg-[#FFF9EE] p-6 border border-[#d9cec1] rounded-sm space-y-4">
                            <h3 className="font-semibold text-black">
                                Import Tour (Using Upload PDF)
                            </h3>

                            <p className="text-sm text-black">
                                Upload a PDF file to import your tour. And recommanded size of the file is 4 MB. Supported formats: .pdf, .jpg, .jpeg, .png, .doc, .docx, .txt
                            </p>

                            <button
                                onClick={() => setOpenUploadImportFile(true)}
                                className="flex items-center gap-2 bg-black text-white text-sm md:text-base px-4 py-2 rounded hover:bg-black/90 cursor-pointer"
                            >
                                <Upload className="h-4 w-4" /> Upload File
                            </button>
                        </div>

                        {/* Generate using PYT */}
                        <div className="bg-[#FFF9EE] p-6 border border-[#d9cec1] rounded-sm space-y-5">
                            <h3 className="font-semibold text-black">
                                Generate Tour (Using Plan Your Trip)
                            </h3>

                            <p className="text-sm text-black">
                                We will ask basic information about your tour. And you can then generate a tour using Plan Your Trip.
                            </p>

                            <button
                                onClick={() => setOpenCommonPlanTrip(true)}
                                className="flex items-center gap-2 bg-black text-white text-sm md:text-base px-4 py-2 rounded hover:bg-black/90 cursor-pointer"
                            >
                                <RefreshCcw className="h-4 w-4" /> Generate Tour
                            </button>
                        </div>
                    </div>
                    <div className="rounded-sm overflow-hidden">
                        <div className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm md:text-base font-medium">
                            <List className="h-4 w-4" /> Import Logs
                        </div>
                        <div className="overflow-x-auto">
                            {/* Loader */}
                            {isLoading && (
                                <div className="border border-[#d9cec1] grid grid-cols-1 p-5 space-y-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-5 md:h-10 rounded-lg bg-gray-200 animate-pulse"
                                        />
                                    ))}
                                </div>
                            )}

                            {!isLoading && importList.length > 0 && (
                                <table className="w-full text-sm">
                                    <thead className="bg-[#FFF9EE] border border-[#d9cec1] text-left">
                                        <tr className="text-sm">
                                            <th className="px-4 py-3 font-semibold">Import Type</th>
                                            <th className="px-4 py-3 font-semibold">File Path</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Created Date</th>
                                            {/* <th className="px-4 py-3 font-semibold">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="border border-[#d9cec1]">
                                        {importList.map((item: any, index: number) => (
                                            <tr key={index} className="text-sm border-t border-[#d9cec1] hover:bg-gray-50">
                                                <td className="px-4 py-3 text-black hover:underline cursor-pointer">
                                                    {item?.import_type === "upload_file" ? "Upload File" : "Submit Form"}
                                                </td>
                                                <td className="px-4 py-3 text-black">
                                                    {item?.file_path ? <Link className="hover:underline cursor-pointer" target="_blank" href={item?.file_path}>{item?.file_path}</Link> : "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item?.status === 'imported' && (
                                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                                                            Imported
                                                        </span>
                                                    )}
                                                    {item?.status === 'pending' && (
                                                        <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {item?.status === 'processing' && (
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                            Processing
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDate(item?.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* No Data */}
                            {!isLoading && importList.length === 0 && (
                                <div className="bg-white border border-gray-200 rounded-sm p-12 text-center space-y-5">
                                    <div className="space-y-2">
                                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
                                        <h3 className="text-lg font-semibold text-black">
                                            No Import Log Found
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            You have not imported any tour yet.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Popup Modal */}
            <UploadImportModal open={openUploadImportFile} onOpenChange={setOpenUploadImportFile} />
            <CommonPlanTripModal open={openCommonPlanTrip} onOpenChange={setOpenCommonPlanTrip} />

            <CommonFooter />
        </>
    );
}