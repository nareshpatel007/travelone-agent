'use client'

import { sub } from "date-fns";
import { CheckCircle, FileWarning, Loader2, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

// Define props
interface Props {
    tourId: string;
    status: number;
}

// Define status
const STATUS = [
    { key: 1, text: "Public", subtext: "Visible to everyone on the platform." },
    { key: 2, text: "Draft", subtext: "Only visible to you. Not published yet." },
    { key: 3, text: "Unpublished", subtext: "Hidden from public listings. Accessible via shared link only." },
];

export default function Visibility({ tourId, status }: Props) {
    // Define state
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const [visibilityStatus, setVisibilityStatus] = useState<number>(status || 2);

    // Handle form submission
    const handleUpdate = async () => {
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
                    action: "visibility",
                    data: {
                        status: visibilityStatus
                    }
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({ type: "success", text: "Updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message });
            }

            // Clear message
            setTimeout(() => setMessage(null), 5000);
        } catch {
            // Something went wrong
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
                        Tour Visibility Settings
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

                {/* TOUR TYPE SELECTOR */}
                <div className="bg-white p-6 rounded shadow-sm space-y-4">
                    <div className="flex gap-6">
                        {STATUS.map(type => (
                            <div
                                key={type?.key}
                                onClick={() => setVisibilityStatus(type?.key)}
                                className={`cursor-pointer flex-1 p-6 rounded-md border transition
                                ${visibilityStatus === type?.key ? "border-black bg-[#FFF9EE] text-black" : "border-gray-300 bg-gray-50 hover:border-black"}`}
                            >
                                <h3 className="text-lg font-semibold capitalize">
                                    {type?.text}
                                </h3>
                                <p className="text-sm mt-2 opacity-80">
                                    {type?.subtext}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}