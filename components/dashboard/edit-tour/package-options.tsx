'use client'

import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
    tourId: string;
    packages: any[];
}

export default function PackageOptions({ tourId, packages }: Props) {
    // Define state
    const [packageData, setPackageData] = useState(packages);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Toggle publish/draft status
    const handleToggle = (index: number) => {
        const updated = [...packageData];
        updated[index].status = updated[index].status === "published" ? "draft" : "published";
        setPackageData(updated);
    };

    // Handle price change
    const handleChange = (index: number, field: string, value: number) => {
        const updated = [...packageData];
        updated[index][field] = value;
        setPackageData(updated);
    };

    // Handle update (for demo, just log the data)
    const handleUpdate = async () => {
        try {
            // Update state
            setIsFormLoading(true);

            // API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "package_options",
                    data: packageData,
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({
                    type: "success",
                    text: "Packages updated successfully!",
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Failed to update packages.",
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to update packages.",
            });
        } finally {
            setIsFormLoading(false);
        }

        // Auto hide after 5 seconds
        setTimeout(() => {
            setMessage(null);
        }, 5000);
    };

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-black">
                    Package Pricing
                </h1>
                <div className="flex items-center gap-4">
                    {/* Message */}
                    {message && (
                        <div
                            className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${message.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleUpdate}
                        disabled={isFormLoading}
                        className="flex items-center gap-2 border-1 border-black bg-black text-white px-4 py-1.5 rounded-sm text-sm font-medium cursor-pointer hover:bg-amber-300 hover:text-black disabled:cursor-not-allowed disabled:bg-black/50"
                    >
                        {isFormLoading && <Loader2 className="animate-spin w-4 h-4" />}
                        {!isFormLoading && <CheckCircle className='w-4 h-4' />}
                        Save Changes
                    </button>
                </div>
            </div>

            {packageData.map((pkg: any, idx: number) => {
                // Determine if the package is published
                const isPublished = pkg.status === "published";

                return (
                    <div
                        key={idx}
                        className={`rounded border transition-all duration-300 ${(isPublished && !isFormLoading) ? "bg-white" : "bg-gray-100 opacity-70"}`}
                    >
                        {/* Header */}
                        <div className="flex shadow-sm justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-2xl">
                            <h3 className="font-semibold text-lg text-gray-800">
                                {pkg.package_name}
                            </h3>
                            <div className="flex items-center gap-3">
                                {/* Status Badge */}
                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-medium ${isPublished ? "bg-green-100 border border-green-600 text-green-600" : "bg-red-100 border border-red-600 text-red-500"}`}
                                >
                                    {isPublished ? "Published" : "Draft"}
                                </span>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(idx)}
                                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition cursor-pointer ${isPublished ? "bg-green-500" : "bg-gray-400"}`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${isPublished ? "translate-x-6" : "translate-x-1"}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: "Adult", field: "b2c_price_adult" },
                                { label: "Child (8-12)", field: "b2c_price_adult_8_12" },
                                { label: "Child (3-7)", field: "b2c_price_child_3_7" },
                                { label: "Infant (0-2)", field: "b2c_price_infant_0_2" },
                                { label: "Extra Adult", field: "b2c_price_extra_adult" },
                                { label: "Single Supplement", field: "b2c_price_single_supplement" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {item.label}
                                    </label>
                                    <div className="flex rounded-lg overflow-hidden border focus-within:ring-1 focus-within:ring-black">
                                        <input
                                            type="number"
                                            min={0}
                                            value={pkg[item.field] ?? 0}
                                            disabled={!isPublished || isFormLoading}
                                            onChange={(e) =>
                                                handleChange(idx, item.field, Number(e.target.value))
                                            }
                                            className="w-full px-3 py-2 text-sm outline-none bg-white disabled:bg-gray-200"
                                        />
                                        <span className="bg-black text-white px-3 flex items-center text-sm">
                                            $
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}