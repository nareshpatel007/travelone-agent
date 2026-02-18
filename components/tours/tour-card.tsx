"use client";

import { formatPrice } from "@/lib/utils";
import { Edit, ExternalLink, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

// Define props
interface Props {
    id: number;
    name: string;
    slug: string;
    featured_image: string;
    tour_sub_title: string;
    starting_price: string;
    status: string;
    setOpenDeleteModal: (value: boolean) => void;
    setSelectedTour: (value: any) => void;
}

// Define functions
const safeJsonParse = <T,>(value?: string, fallback: T = [] as T): T => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

export function TourCard({
    id,
    name,
    slug,
    featured_image,
    tour_sub_title,
    starting_price,
    status,
    setOpenDeleteModal,
    setSelectedTour,
}: Props) {
    // Get tour summary
    const tourSummary = useMemo<string[]>(
        () => safeJsonParse<string[]>(tour_sub_title),
        [tour_sub_title]
    );

    return (
        <>
            <div className="group h-full">
                <div className="flex h-full flex-col border border-gray-200 transition-all hover:shadow-md">
                    <div className="relative h-52 md:h-80 overflow-hidden">
                        <Link href={`/my-tours/edit/${id}`}>
                            <Image
                                src={featured_image || "/placeholder.svg"}
                                alt={name}
                                fill
                                draggable={false}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        <div className="absolute top-3 left-3 flex overflow-hidden rounded-full border border-black bg-black text-white">
                            <span className="px-3 py-1 text-xs">
                                Start from USD ${formatPrice(starting_price, 0)}
                            </span>
                        </div>

                        <div className="absolute top-3 right-3 flex overflow-hidden rounded-full border border-black bg-white text-black">
                            <span className="px-3 py-1 text-xs">
                                {status == "1" && "Published"}
                                {status == "2" && "Draft"}
                                {status == "3" && "Unpublished"}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col space-y-3 p-5 text-center">
                        <Link target="_blank" href={`/my-tours/edit/${id}`}>
                            <h2 className="line-clamp-2 text-md font-medium text-gray-900 md:text-lg">
                                {name}
                            </h2>
                        </Link>

                        {tourSummary.length > 0 && (
                            <div className="text-sm text-black">
                                {tourSummary[0]} /{" "}
                                {tourSummary[3]?.replace("Places", "Locations")} /{" "}
                                {tourSummary[1]}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center gap-1 border-t border-gray-200 px-5 py-3 text-sm">
                        <Link target="_blank" href={`https://travelone.io/tour/${slug}`}>
                            <button className="flex items-center gap-1 text-sm border border-black text-white bg-black rounded px-4 py-1 cursor-pointer hover:bg-black/90">
                                <ExternalLink className="h-4 w-4" /> Preview
                            </button>
                        </Link>
                        
                        <Link target="_blank" href={`/dashboard/my-tours/edit/${id}`}>
                            <button className="flex items-center gap-1 text-sm border border-black text-white bg-black rounded px-4 py-1 cursor-pointer hover:bg-black/90">
                                <Edit className="h-4 w-4" /> Edit
                            </button>
                        </Link>

                        <button
                            className="flex items-center gap-1 text-sm border border-red-500 text-red-500 bg-white rounded px-4 py-1 cursor-pointer hover:bg-red-500 hover:text-white"
                            onClick={() => {
                                setOpenDeleteModal(true);
                                setSelectedTour({ id, name });
                            }}
                        >
                            <Trash className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}