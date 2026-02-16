"use server";

import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
    const h = await headers();

    const forwardedFor = h.get("x-forwarded-for");
    const realIp = h.get("x-real-ip");

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    // If no forwardedFor, use realIp
    return realIp ?? "unknown";
}