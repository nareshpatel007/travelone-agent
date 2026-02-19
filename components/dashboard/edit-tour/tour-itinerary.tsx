'use client'

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle, Loader2, Plus, Trash2, GripVertical, X, LucideImagePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
    tourId: string;
    countries: number[];
    itinerary: any[];
}

// Sortable Line Component
function SortableLine({
    line,
    dayIndex,
    lineIndex,
    updateLineTitle,
    removeLine,
    setSelectedAttraction
}: any) {
    // Define styles for different line types
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: line.id });

    // Define type-based styles
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 border rounded p-3 shadow-sm bg-white cursor-pointer hover:bg-gray-100"
        >
            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
            </div>

            {/* Badge */}
            <div className="text-xs font-medium">
                {line.type === "transportation" && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600">Transport</span>
                )}
                {line.type === "attraction" && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-600">Attraction</span>
                )}
                {line.type === "meal" && (
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-600">Meal</span>
                )}
                {line.type === "hotel" && (
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-600">Hotel</span>
                )}
                {line.type === "notes" && (
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-900">Note</span>
                )}
            </div>

            {/* Title Input */}
            <input
                value={line.title}
                onChange={(e) => updateLineTitle(dayIndex, lineIndex, e.target.value)}
                autoComplete="off"
                className="flex-1 bg-transparent outline-none text-sm"
            />

            {/* If attraction, change image */}
            {line.type === "attraction" && line.attraction_id && (
                <button
                    onClick={() => {
                        setSelectedAttraction({
                            id: line.attraction_id,
                            title: line.title
                        });
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-blue-600 text-blue-600 hover:text-blue-700 cursor-pointer hover:bg-blue-100 transition"
                >
                    <LucideImagePlus className="w-3 h-3" /> Change
                </button>
            )}

            {/* Remove */}
            <button
                onClick={() => removeLine(dayIndex, lineIndex)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-red-500 text-red-500 hover:text-red-700 cursor-pointer hover:bg-red-100 transition"
            >
                <Trash2 className="w-3 h-3" /> Remove
            </button>
        </div>
    );
}

export default function TourItinerary({ tourId, countries, itinerary }: Props) {
    // Initialize DnD sensors
    const sensors = useSensors(useSensor(PointerSensor));

    // Define state
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
    const [selectedAttraction, setSelectedAttraction] = useState<any>("");
    const [openAddAttractionModal, setOpenAddAttractionModal] = useState<boolean>(false);
    const [isFormLoader, setIsFormLoader] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newAttraction, setNewAttraction] = useState({
        title: "",
        description: "",
        image: null as File | null,
    });
    const [days, setDays] = useState(
        itinerary.map(day => ({
            ...day,
            updated_items: day.front_itinerary_details.map((item: any) => ({
                id: crypto.randomUUID(),
                type: item.json_type,
                title: item.json_data?.title || item.json_data?.description || item.json_data?.attraction_name || (`${item.json_data?.meal_type} ${item.json_data?.package_type}`) || "",
                attraction_id: item.json_type === "attraction" ? item.json_data?.attraction_data?.id : ""
            }))
        }))
    );

    // Debounce logic (wait 500ms after typing stops)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API call runs only when debouncedQuery changes
    useEffect(() => {
        if (!debouncedQuery) return;
        const fetchAttractions = async () => {
            try {
                // Set the search query to state
                setIsFormLoader(true);

                // API call to search attractions
                const response = await fetch(`/api/tours/attractions/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        country: countries,
                        keyword: debouncedQuery
                    })
                });

                // Parse the JSON response
                const data = await response.json();

                // Check response
                if (data.status) {
                    setSearchResults(data?.data ?? []);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                setSearchResults([]);
            } finally {
                setIsFormLoader(false);
            }
        };
        fetchAttractions();
    }, [debouncedQuery]);

    // Day Handlers
    const addDay = () => {
        setDays([
            ...days,
            {
                day_no: days.length + 1,
                itinerary_title: `Day ${days.length + 1}: Enter day title here`,
                updated_items: [],
                status: "draft"
            }
        ]);
    };

    // Remove day and re-order remaining days
    const removeDay = (dayIndex: number) => {
        const updated = [...days];
        updated.splice(dayIndex, 1);
        setDays(updated);
    };

    // Update day title
    const updateTitle = (dayIndex: number, value: string) => {
        const updated = [...days];
        updated[dayIndex].itinerary_title = value;
        setDays(updated);
    };

    // Update line title
    const updateLineTitle = (dayIndex: number, lineIndex: number, value: string) => {
        const updated = [...days];
        updated[dayIndex].updated_items[lineIndex].title = value;
        setDays(updated);
    };

    // Add line to a day
    const addLine = (dayIndex: number, type = "note") => {
        const updated = [...days];
        updated[dayIndex].updated_items.push({
            id: crypto.randomUUID(),
            type,
            title: "Enter details here"
        });
        setDays(updated);
    };

    // Remove line from a day
    const removeLine = (dayIndex: number, lineIndex: number) => {
        const updated = [...days];
        updated[dayIndex].updated_items.splice(lineIndex, 1);
        setDays(updated);
    };

    // Drag End Handler
    const handleDragEnd = (event: any, dayIndex: number) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const updated = [...days];
        const items = updated[dayIndex].updated_items;

        const oldIndex = items.findIndex((i: any) => i.id === active.id);
        const newIndex = items.findIndex((i: any) => i.id === over.id);

        updated[dayIndex].updated_items =
            arrayMove(items, oldIndex, newIndex);

        setDays(updated);
    };

    // Add attraction to day
    const addAttractionToDay = (attraction: any) => {
        const updated = [...days];

        updated[selectedDayIndex].updated_items.push({
            id: crypto.randomUUID(),
            type: "attraction",
            title: attraction.name,
            attraction_id: attraction.id
        });

        setDays(updated);
        setOpenAddAttractionModal(false);
    };

    // Handle create new attraction
    const handleCreateAttraction = async () => {
        // Validation
        if (!newAttraction.title || !newAttraction.description || !newAttraction.image) {
            setError("Please fill all the fields and select an image.");
            return;
        }

        try {
            // Update state
            setError("");
            setIsFormLoader(true);

            // Define value
            let imageUrl = "";

            // Upload image in imagekit if image is selected
            if (newAttraction.image) {
                // Define form data
                const formData = new FormData();
                formData.append("file", newAttraction.image);
                formData.append("folder", "attractions");

                // API call to upload image to ImageKit
                const imagekitResponse = await fetch("/api/imagekit/upload", {
                    method: "POST",
                    body: formData
                });

                // Convert to json
                const data = await imagekitResponse.json();

                // Update form data
                if (data?.url) {
                    imageUrl = data.url;
                }
            }

            // API call to create attraction
            const response = await fetch("/api/tours/attractions/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newAttraction.title,
                    description: newAttraction.description,
                    featured_image: imageUrl,
                    country_id: countries ? countries[0] : null,
                })
            });

            // Parse JSON response
            const result = await response.json();

            // Check response and update state
            if (result.status) {
                addAttractionToDay({
                    id: result.data.id,
                    name: newAttraction.title,
                });
            } else {
                setError("Failed to create attraction. Please try again.");
            }
        } catch (error) {
            setError("An error occurred while creating the attraction. Please try again.");
        } finally {
            setIsFormLoader(false);
        }
    };

    // Handle change attraction image
    const handleUpdateImage = async () => {
        // Validation
        if (!selectedAttraction.id || !selectedAttraction.image) {
            setError("Please select an image.");
            return;
        }

        try {
            // Update state
            setError("");
            setIsFormLoader(true);

            // Define value
            let imageUrl = "";

            // Upload image in imagekit if image is selected
            if (selectedAttraction.image) {
                // Define form data
                const formData = new FormData();
                formData.append("file", selectedAttraction.image);
                formData.append("folder", "attractions");

                // API call to upload image to ImageKit
                const imagekitResponse = await fetch("/api/imagekit/upload", {
                    method: "POST",
                    body: formData
                });

                // Convert to json
                const data = await imagekitResponse.json();

                // Update form data
                if (data?.url) {
                    imageUrl = data.url;
                }
            }

            // API call to create attraction
            const response = await fetch("/api/tours/attractions/image_update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    attraction_id: selectedAttraction.id,
                    image: imageUrl,
                })
            });

            // Parse JSON response
            const result = await response.json();

            // Check response and update state
            if (result.status) {
                // Reset data
                setSelectedAttraction("");

                // Show success message
                setMessage({
                    type: "success",
                    text: 'Image updated successfully! Now click on "Save Changes" button to apply changes in itinerary.',
                });

                // Scroll to top with smooth behavior
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                // Set error message
                setError("Failed to update attraction image. Please try again.");
            }
        } catch (error) {
            // Set error message
            setError("An error occurred while updating the attraction image. Please try again.");
        } finally {
            setIsFormLoader(false);
        }

        // Auto hide after 5 seconds
        setTimeout(() => { setMessage(null); }, 5000);
    };

    // Handle form submission
    const handleUpdate = async () => {
        try {
            // Update state
            setIsFormLoading(true);

            // Extract updated_items key from every days and append id in sin
            const updatedItems = days.map(day => {
                return {
                    id: day.id,
                    day_title: day.itinerary_title,
                    data: day.updated_items
                };
            });

            // API call
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "itinerary",
                    data: updatedItems,
                }),
            });

            // Parse the JSON response
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({
                    type: "success",
                    text: "Itinerary updated successfully!",
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Failed to update itinerary.",
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to update itinerary.",
            });
        } finally {
            setIsFormLoading(false);
        }

        // Auto hide after 5 seconds
        setTimeout(() => { setMessage(null); }, 5000);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto py-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Tour Itinerary</h1>
                    <div className="flex gap-4 items-center">
                        {message && (
                            <div className="px-4 py-2 bg-green-100 text-green-700 rounded text-sm">
                                {message.text}
                            </div>
                        )}

                        <button
                            onClick={addDay}
                            disabled={isFormLoading}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm border rounded font-medium cursor-pointer hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            <Plus size={16} /> Add Day
                        </button>

                        <button
                            onClick={handleUpdate}
                            disabled={isFormLoading}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm border border-black font-medium rounded cursor-pointer bg-black text-white hover:bg-amber-300 hover:text-black disabled:cursor-not-allowed disabled:bg-black/50"
                        >
                            {isFormLoading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* DAYS */}
                {days.map((day: any, dayIndex: number) => (
                    <div key={dayIndex} className="bg-white border rounded p-6 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <input
                                value={day.itinerary_title}
                                onChange={(e) => updateTitle(dayIndex, e.target.value)}
                                className="text-lg font-semibold w-full outline-none border-b pb-2"
                            />
                            <button onClick={() => removeDay(dayIndex)} className="text-red-500 hover:text-red-600 cursor-pointer">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* DRAG CONTEXT PER DAY */}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleDragEnd(event, dayIndex)}
                        >
                            <SortableContext
                                items={day.updated_items.map((i: any) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {day.updated_items.map((line: any, lineIndex: number) => (
                                        <SortableLine
                                            key={line.id}
                                            line={line}
                                            dayIndex={dayIndex}
                                            lineIndex={lineIndex}
                                            updateLineTitle={updateLineTitle}
                                            removeLine={removeLine}
                                            setSelectedAttraction={setSelectedAttraction}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {/* Add Buttons */}
                        <div className="flex gap-1 text-sm font-medium pt-2">
                            <button onClick={() => addLine(dayIndex, "transportation")} className="bg-black border border-black text-white px-3 py-1 rounded cursor-pointer hover:bg-amber-300 hover:text-black">
                                + Transport
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedDayIndex(dayIndex);
                                    setOpenAddAttractionModal(true);
                                }}
                                className="bg-black border border-black text-white px-3 py-1 rounded cursor-pointer hover:bg-amber-300 hover:text-black"
                            >
                                + Attraction
                            </button>
                            <button onClick={() => addLine(dayIndex, "meal")} className="bg-black border border-black text-white px-3 py-1 rounded cursor-pointer hover:bg-amber-300 hover:text-black">
                                + Meal
                            </button>
                            <button onClick={() => addLine(dayIndex, "hotel")} className="bg-black border border-black text-white px-3 py-1 rounded cursor-pointer hover:bg-amber-300 hover:text-black">
                                + Hotel Stay
                            </button>
                            <button onClick={() => addLine(dayIndex, "notes")} className="bg-black border border-black text-white px-3 py-1 rounded cursor-pointer hover:bg-amber-300 hover:text-black">
                                + Note
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Attraction Modal */}
            {openAddAttractionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded w-full max-w-2xl space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Add Attraction in Day {selectedDayIndex + 1}
                            </h2>

                            {!isCreatingNew && (
                                <button
                                    type="button"
                                    className="bg-black border border-black text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-amber-300 hover:text-black transition cursor-pointer"
                                    onClick={() => setIsCreatingNew(true)}
                                >
                                    + Add New
                                </button>
                            )}
                        </div>

                        {/* SEARCH MODE */}
                        {!isCreatingNew && (
                            <>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search attraction..."
                                    autoComplete="off"
                                    className="w-full border rounded px-3 py-2 text-sm outline-none"
                                />

                                {isFormLoader && (
                                    <div className="flex justify-center text-sm py-10">
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                                        <span className="ml-2 text-gray-500">Searching attractions...</span>
                                    </div>
                                )}

                                {!isFormLoader && debouncedQuery && searchResults.length === 0 && (
                                    <div className="flex justify-center text-sm py-10">
                                        <span className="text-gray-500">No attractions found.</span>
                                    </div>
                                )}

                                {!isFormLoader && searchResults.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto space-y-2">
                                        {searchResults.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => addAttractionToDay(item)}
                                                className="border border-black cursor-pointer hover:bg-gray-100 overflow-hidden"
                                            >
                                                <Image
                                                    src={item.featured_image}
                                                    alt={item.name}
                                                    width={300}
                                                    height={200}
                                                    draggable={false}
                                                    className="w-full h-24 object-cover"
                                                />
                                                <div className="p-2 text-center text-sm font-medium border-t border-gray-200">
                                                    {item.name} ({item?.city_name})
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* CREATE MODE */}
                        {isCreatingNew && (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Attraction Title"
                                    value={newAttraction.title}
                                    onChange={(e) =>
                                        setNewAttraction({ ...newAttraction, title: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 text-sm outline-none"
                                />

                                <textarea
                                    placeholder="Description"
                                    value={newAttraction.description}
                                    onChange={(e) =>
                                        setNewAttraction({ ...newAttraction, description: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 text-sm outline-none"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setNewAttraction({
                                            ...newAttraction,
                                            image: e.target.files?.[0] || null
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2 text-sm outline-none"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            {!isFormLoader && (
                                <button
                                    onClick={() => {
                                        setIsCreatingNew(false);
                                        setOpenAddAttractionModal(false);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                        setIsCreatingNew(false);
                                        setSelectedDayIndex(0);
                                    }}
                                    className="flex items-center gap-1 px-4 py-1.5 border border-red-500 text-red-500 rounded text-sm cursor-pointer hover:bg-red-500 hover:text-white transition disabled:cursor-not-allowed disabled:bg-red-500/50"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}

                            {isCreatingNew && (
                                <button
                                    onClick={handleCreateAttraction}
                                    disabled={isFormLoader}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-black border border-black text-white rounded cursor-pointer hover:bg-amber-300 hover:text-black text-sm disabled:cursor-not-allowed disabled:bg-black/50"
                                >
                                    {isFormLoader && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {!isFormLoader && <CheckCircle className="w-4 h-4" />}
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Change Attraction Image Modal */}
            {selectedAttraction !== "" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded w-full max-w-2xl space-y-3 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Update Image for "{selectedAttraction?.title}"
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">Recommended size: 500 x 500 or larger and less than 4 MB</p>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setSelectedAttraction({
                                    ...selectedAttraction,
                                    image: e.target.files?.[0] || null
                                })
                            }
                            className="w-full border rounded px-3 py-2 text-sm outline-none"
                        />

                        {/* Preview upload image */}
                        {selectedAttraction.image && (
                            <div className="w-full h-90 border rounded overflow-hidden">
                                <Image
                                    src={URL.createObjectURL(selectedAttraction.image)}
                                    alt={selectedAttraction.title}
                                    width={500}
                                    height={500}
                                    draggable={false}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            {!isFormLoader && (
                                <button
                                    onClick={() => {
                                        setSelectedAttraction("");
                                    }}
                                    className="flex items-center gap-1 px-4 py-1.5 border border-red-500 text-red-500 rounded text-sm cursor-pointer hover:bg-red-500 hover:text-white transition disabled:cursor-not-allowed disabled:bg-red-500/50"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}

                            <button
                                onClick={handleUpdateImage}
                                disabled={isFormLoader}
                                className="flex items-center gap-2 px-4 py-1.5 bg-black border border-black text-white rounded cursor-pointer hover:bg-amber-300 hover:text-black text-sm disabled:cursor-not-allowed disabled:bg-black/50"
                            >
                                {isFormLoader && <Loader2 className="w-4 h-4 animate-spin" />}
                                {!isFormLoader && <CheckCircle className="w-4 h-4" />}
                                Upload Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}