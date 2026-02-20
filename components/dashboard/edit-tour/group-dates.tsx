'use client'

import { CheckCircle, FileWarning, Loader2, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

// Define props
interface Props {
    tourId: string;
    tourData: any;
}

// Define types
interface GroupDate {
    id: string;
    group_date: string;
    group_size: number;
    available_seat: number;
}

export default function GroupDates({ tourId, tourData }: Props) {
    // Define state
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const [tourType, setTourType] = useState<string>(
        tourData?.tour_type || "Individual Tour"
    );
    const [groupDates, setGroupDates] = useState<GroupDate[]>(
        tourData?.group_dates || []
    );

    // Add new date
    const addNewDate = () => {
        setGroupDates([
            ...groupDates,
            {
                id: Date.now().toString(),
                group_date: "",
                group_size: 0,
                available_seat: 0
            }
        ]);
    };

    // Remove Date Row
    const removeDate = (id: string) => {
        setGroupDates(groupDates.filter(d => d.id !== id));
    };

    // Update Field
    const updateDateField = (
        id: string,
        field: keyof GroupDate,
        value: any
    ) => {
        setGroupDates(
            groupDates.map(d =>
                d.id === id ? { ...d, [field]: value } : d
            )
        );
    };

    // Handle form submission
    const handleUpdate = async () => {
        // Validation
        if (tourType === "group" && groupDates.length === 0) {
            setMessage({ type: "error", text: "Please add at least one group date." });
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
                    action: "group_dates",
                    data: {
                        tour_type: tourType,
                        group_dates: tourType === "Group Tour" ? groupDates : []
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
                        Tour Type & Group Dates
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
                    <h2 className="text-md font-semibold text-black">Select Tour Type</h2>
                    <div className="flex gap-6">
                        {["Individual Tour", "Group Tour"].map(type => (
                            <div
                                key={type}
                                onClick={() => setTourType(type)}
                                className={`cursor-pointer flex-1 p-6 rounded-md border transition
                                ${tourType === type
                                        ? "border-black bg-[#FFF9EE] text-black"
                                        : "border-gray-300 bg-gray-50 hover:border-black"
                                    }`}
                            >
                                <h3 className="text-lg font-semibold capitalize">
                                    {type}
                                </h3>
                                <p className="text-sm mt-2 opacity-80">
                                    {type === "Group Tour" ? "Fixed departure with limited seats" : "Customizable private tour"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GROUP DATES TABLE */}
                {tourType === "Group Tour" && (
                    <div className="bg-white p-6 rounded shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Group Departure Dates</h2>
                            <button
                                onClick={addNewDate}
                                className="flex items-center gap-2 text-sm font-medium text-black/80 hover:text-black cursor-pointer"
                            >
                                <Plus size={16} /> Add Date
                            </button>
                        </div>

                        {/* No group dates */}
                        {groupDates.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <PlusCircle className="w-7 h-7" />
                                <p className="text-sm text-black/80">
                                    No group dates added. Click "Add Date" to add group departure dates
                                </p>
                            </div>
                        )}

                        {/* Group dates */}
                        <div className="space-y-4">
                            {groupDates.map((d) => (
                                <div
                                    key={d.id}
                                    className="grid grid-cols-1 md:grid-cols-[30%_30%_30%_10%] gap-4 items-center border border-gray-300 p-4 rounded-sm"
                                >
                                    <input
                                        type="date"
                                        value={d.group_date}
                                        onChange={(e) =>
                                            updateDateField(d.id, "group_date", e.target.value)
                                        }
                                        min={new Date().toISOString().split("T")[0]}
                                        placeholder="Date"
                                        className="px-3 py-2 border border-gray-300 text-sm rounded"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Total Seats"
                                        value={d.group_size}
                                        onChange={(e) =>
                                            updateDateField(
                                                d.id,
                                                "group_size",
                                                Number(e.target.value)
                                            )
                                        }
                                        min={1}
                                        className="px-3 py-2 border border-gray-300 text-sm rounded"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Available Seats"
                                        value={d.available_seat}
                                        onChange={(e) =>
                                            updateDateField(
                                                d.id,
                                                "available_seat",
                                                Number(e.target.value)
                                            )
                                        }
                                        min={1}
                                        max={d.group_size}
                                        className="px-3 py-2 border border-gray-300 text-sm rounded"
                                    />

                                    <button
                                        onClick={() => removeDate(d.id)}
                                        className="flex items-center justify-center cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}