'use client'

import { CheckCircle, Loader2, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Define props
interface Props {
    tourId: string;
    isMediaLocked: boolean;
    featuredImage: string;
    gallery: string[];
}

export default function MediaGallery({ tourId, isMediaLocked, featuredImage, gallery }: Props) {
    // Define state
    const [images, setImages] = useState<string[]>(gallery || []);
    const [featured, setFeatured] = useState<string | null>(featuredImage || null);
    const [isLockMedia, setIsLockMedia] = useState(isMediaLocked || false);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Handle add image
    const handleAddImages = (files: FileList | null) => {
        if (!files) return;

        const newImages = Array.from(files).map(file =>
            URL.createObjectURL(file)
        );

        setImages([...images, ...newImages]);
    };

    // Remove image
    const removeImage = (img: string) => {
        const updated = images.filter(i => i !== img);
        setImages(updated);

        if (featured === img) {
            setFeatured(null);
        }
    };

    // Handle update
    const handleUpdate = async () => {
        // Validation
        if (!featured) {
            setMessage({ type: "error", text: "Please select a featured image." });
            return;
        } else if (images.length === 0 || images.includes("")) {
            setMessage({ type: "error", text: "Please add at least one image." });
            return;
        } else if (!images.includes(featured)) {
            setMessage({ type: "error", text: "Featured image must be in the gallery." });
            return;
        }

        try {
            // Update state
            setIsFormLoading(true);
            setMessage(null);

            // Make API call to update the gallery
            const response = await fetch("/api/tours/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tour_id: tourId,
                    action: "media_gallery",
                    data: {
                        featured_image: featured,
                        gallery: {
                            sightseeing: images
                        },
                        is_lock_media: isLockMedia
                    }
                }),
            });

            // Parse response
            const data = await response.json();

            // Check response
            if (data.status) {
                setMessage({ type: "success", text: "Gallery updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.message });
            }

            // Clear message after 5 seconds
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
                        Media Gallery
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

                {/* UPLOAD BOX */}
                {/* <div className="bg-white p-6 rounded shadow-sm">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-8 cursor-pointer hover:border-black transition space-y-3">
                        <Plus size={28} className="text-gray-500" />
                        <p className="text-gray-600 text-sm">Click to upload new image</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAddImages(e.target.files)}
                            className="hidden"
                        />
                    </label>
                </div> */}

                {/* GALLERY GRID */}
                <div className="bg-white p-6 rounded shadow-sm space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                        {images.length > 0 && images.map((img, index) => (
                            <div
                                key={index}
                                className="relative group rounded-md overflow-hidden shadow-sm bg-white"
                            >
                                <Image
                                    src={img}
                                    alt="Gallery"
                                    className="w-full h-40 object-cover"
                                    width={200}
                                    height={200}
                                    draggable={false}
                                />

                                {/* Featured Badge */}
                                {featured === img && (
                                    <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star size={12} /> Featured
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setFeatured(img)}
                                        className="bg-white text-black px-3 py-1 rounded text-xs font-medium cursor-pointer hover:bg-gray-200"
                                    >
                                        Set Featured
                                    </button>

                                    <button
                                        onClick={() => removeImage(img)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium cursor-pointer hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Preview */}
                {featured && (
                    <div className="bg-white p-6 rounded shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Featured Image Preview
                        </h2>
                        <Image
                            src={featured}
                            alt="Featured"
                            width={900}
                            height={900}
                            draggable={false}
                            className="w-full max-h-96 object-cover rounded-xl"
                        />
                    </div>
                )}

                {/* Featured Preview */}
                <div className="bg-white p-6 rounded shadow-sm space-y-4">
                    <h2 className="flex items-center gap-2 text-md font-medium text-gray-800 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={isLockMedia}
                            onChange={(e) => setIsLockMedia(e.target.checked)}
                        />
                        Yes! Images will be updated automatically when the itinerary is updated.
                    </h2>
                </div>
            </div>
        </div>
    );
}