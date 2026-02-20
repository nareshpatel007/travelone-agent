'use client'

import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

// Define props
interface Props {
    tourId: string;
    tourData: any;
}

export default function SeoDetails({ tourId, tourData }: Props) {
    // Define state
    const [metaTitle, setMetaTitle] = useState(tourData?.seo_title || "");
    const [metaDescription, setMetaDescription] = useState(tourData?.seo_description || "");
    const [slug, setSlug] = useState(tourData?.slug || "");
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);

    // Handle update
    const handleUpdate = async () => {
        // Validation
        if (!metaTitle) {
            setMessage({ type: "error", text: "Please enter a meta title." });
            return;
        } else if (!metaDescription) {
            setMessage({ type: "error", text: "Please enter a meta description." });
            return;
        } else if (!slug) {
            setMessage({ type: "error", text: "Please enter a slug." });
            return;
        }

        try {
            // Update state
            setIsFormLoading(true);
            setMessage(null);

            // Make API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "seo_details",
                    data: {
                        meta_title: metaTitle,
                        meta_description: metaDescription,
                        slug,
                    }
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({ type: "success", text: "SEO details updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message });
            }

            // Reset error
            setTimeout(() => setMessage(null), 5000);
        } catch {
            // Handle error
            setMessage({ type: "error", text: "Something went wrong." });
        } finally {
            // Update state
            setIsFormLoading(false);
        }
    };

    return (
        <div className="py-6 space-y-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-black">
                        SEO Details
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

                {/* SEO Form */}
                <div className="bg-white p-6 rounded shadow-sm space-y-6">
                    {/* Meta Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Meta Title</label>
                        <input
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            type="text"
                            placeholder="Enter meta title"
                            className="w-full px-4 py-2 border text-base rounded focus:ring-1 focus:ring-black outline-none"
                        />
                        <p className="flex items-center text-xs mt-1 text-gray-500">
                            {metaTitle.length > 60 && "⚠️"} {metaTitle.length} / 60 characters
                        </p>
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Meta Description</label>
                        <textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            rows={4}
                            placeholder="Enter meta description"
                            className="w-full px-4 py-2 border text-base rounded focus:ring-1 focus:ring-black outline-none"
                        />
                        <p className="text-xs mt-1 text-gray-500">
                            {metaDescription.length} / 160 characters
                        </p>
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">URL Slug</label>
                        <div className="flex items-center">
                            <span className="bg-black text-white border border-black px-4 py-[8px] text-sm rounded-l border-r-0">
                                https://travelone.io/tour/
                            </span>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                type="text"
                                placeholder="tour-slug"
                                className="flex-1 px-4 py-1.5 border text-base rounded-r focus:ring-1 focus:ring-black outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Google Preview */}
                <div className="bg-white p-6 rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Google Search Preview</h2>
                    <div className="space-y-1">
                        <p className="text-blue-600 text-lg font-medium">
                            {metaTitle || "Meta title preview"}
                        </p>
                        <p className="text-green-700 text-sm">
                            https://travelone.io/tour/{slug || "your-slug"}
                        </p>
                        <p className="text-gray-700 text-sm">
                            {metaDescription || "Meta description preview will appear here..."}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}