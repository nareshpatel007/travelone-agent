"use client";

import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

// Define props
interface Props {
    id: number;
    name: string;
    slug: string;
    featured_image: string;
    tour_type: number;
    tour_sub_title: string;
    is_refundable: number;
    starting_price: string;
    city_nights: string;
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
    tour_type,
    tour_sub_title,
    is_refundable,
    starting_price,
    city_nights,
}: Props) {
    // Get tour summary
    const tourSummary = useMemo<string[]>(
        () => safeJsonParse<string[]>(tour_sub_title),
        [tour_sub_title]
    );

    return (
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

                    <div className="absolute top-3 left-3 flex overflow-hidden rounded-full bg-black text-white">
                        {tour_type && (
                            <span className={`px-3 py-1 text-xs ${is_refundable && "border-r border-gray-200"}`}>
                                {tour_type}
                            </span>
                        )}
                        {is_refundable === 1 && (
                            <span className="px-3 py-1 text-xs">Free Cancellation</span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-4 p-6 text-center">
                    {/* Title */}
                    <Link target="_blank" href={`/my-tours/edit/${id}`}>
                        <h2 className="line-clamp-2 text-lg font-medium text-gray-900 md:text-xl">
                            {name}
                        </h2>
                    </Link>

                    {/* Summary */}
                    {tourSummary.length > 0 && (
                        <div className="text-sm text-black">
                            {tourSummary[0]} /{" "}
                            {tourSummary[3]?.replace("Places", "Locations")} /{" "}
                            {tourSummary[1]}
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-auto pt-4">
                        <span className="rounded-sm bg-amber-300 px-5 py-1.5 text-xs md:text-sm font-semibold text-black">
                            Start from USD ${formatPrice(starting_price, 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}