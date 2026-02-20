'use client'

import { CheckCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
    tourId: string;
    listingOption: string;
    highlights: string[];
}

export default function Highlights({ tourId, listingOption, highlights }: Props) {
    // Define state
    const [formHighlights, setFormHighlights] = useState(highlights || []);
    const [listingType, setListingType] = useState(listingOption || "Instant Booking");
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Update highlight at index
    const updateHighlight = (index: number, value: string) => {
        const updated = [...formHighlights];
        updated[index] = value;
        setFormHighlights(updated);
    };

    // Add highlight
    const addHighlight = () => {
        setFormHighlights([...formHighlights, ""]);
    };

    // Remove highlight
    const removeHighlight = (index: number) => {
        const updated = [...formHighlights];
        updated.splice(index, 1);
        setFormHighlights(updated);
    };

    // Handle update
    const handleUpdate = async () => {
        // Validation
        if (!listingType) {
            setMessage({
                type: "error",
                text: "Please select a listing type."
            });
            return;
        } else if (formHighlights.length === 0 || formHighlights.includes("")) {
            setMessage({
                type: "error",
                text: "Please enter all the highlights."
            });
            return;
        }

        try {
            // Update state
            setMessage(null);
            setIsFormLoading(true);

            // Make the API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "highlights",
                    data: {
                        highlights: formHighlights,
                        listing_type: listingType,
                    }
                }),
            });

            // Parse the response
            const data = await response.json();

            // Show message
            if (data.status) {
                setMessage({ type: "success", text: "Data updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message });
            }

            // Clear message
            setTimeout(() => setMessage(null), 5000);
        } catch {
            // Set error message
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
                        Tour Highlights & Settings
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

                {/* Highlights Card */}
                <div className="bg-white p-6 rounded shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-md font-semibold text-black">
                            Highlights
                        </h2>
                        <button
                            onClick={addHighlight}
                            className="flex items-center gap-2 text-sm font-medium text-black/80 hover:text-black cursor-pointer"
                        >
                            <Plus size={16} /> Add Highlight
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formHighlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={highlight}
                                    onChange={(e) =>
                                        updateHighlight(idx, e.target.value)
                                    }
                                    placeholder="Enter highlight"
                                    className="w-full px-4 py-2 text-base border rounded focus:ring-1 focus:ring-black focus:outline-none"
                                />
                                <button
                                    onClick={() => removeHighlight(idx)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Listing Type */}
                <div className="bg-white p-6 rounded shadow-sm space-y-4">
                    <h2 className="text-md font-semibold text-black">
                        Tour Listing Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Instant Booking', 'Inquiry Only'].map((item) => (
                            <label
                                key={item}
                                className={`cursor-pointer border rounded text-base p-2 text-center transition
                                ${listingType === item ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"}`}
                            >
                                <input
                                    type="radio"
                                    name="listingType"
                                    value={item}
                                    checked={listingType === item}
                                    onChange={() => setListingType(item)}
                                    className="hidden"
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}