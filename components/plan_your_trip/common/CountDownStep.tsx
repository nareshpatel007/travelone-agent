"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Clock, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

// Define props
interface Props {
    isSubmitted: boolean;
    token: string;
}

export default function CountDownStep({ isSubmitted, token }: Props) {
    // Define state
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [isTourReady, setIsTourReady] = useState(false);
    const [tourSlug, setTourSlug] = useState("");
    const [isTimeout, setIsTimeout] = useState(false);
    const intervalRef = useRef<any>(null);
    const pollingRef = useRef<any>(null);

    // Countdown Timer
    useEffect(() => {
        if (!isSubmitted || !token || isTourReady) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    clearInterval(pollingRef.current);
                    setIsTimeout(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isSubmitted, token, isTourReady]);

    // API Polling Every 5 Seconds
    useEffect(() => {
        if (!isSubmitted || !token || isTourReady) return;

        const checkTourStatus = async () => {
            try {
                // Make API request
                const res = await fetch(`/api/import/tour_status`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                // Get json parse
                const data = await res.json();

                // Check status
                if (data?.status && data?.data?.flag === true) {
                    setIsTourReady(true);
                    setTourSlug(data?.data?.tour_slug);
                    clearInterval(intervalRef.current);
                    clearInterval(pollingRef.current);
                }
            } catch (err) {
                console.error("Error checking tour:", err);
            }
        };

        // Call instantly first
        checkTourStatus();

        pollingRef.current = setInterval(checkTourStatus, 5000);

        return () => clearInterval(pollingRef.current);
    }, [isSubmitted, token, isTourReady]);

    // Format time
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    if (!isSubmitted) return null;

    return (
        <div className="w-full max-w-3xl mx-auto mt-10">

            {!isTourReady && !isTimeout && (
                <div className="bg-white shadow-xl rounded-2xl p-10 text-center space-y-6 border">
                    <div className="flex flex-col items-center gap-3 space-y-3">
                        <div className="relative">
                            <Loader2 className="h-10 w-10 text-black animate-spin" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            {timeLeft <= 100 ? "Generating Your Tour..." : "Analyzing Your Request..."}
                        </h1>

                        <p className="text-gray-500 text-sm max-w-md">
                            Our AI is creating a personalized tour plan for you. Please wait while we process your request.
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="flex justify-center items-center gap-3 text-green-700">
                        <Clock className="h-6 w-6" />
                        <span className="text-2xl font-semibold tracking-widest">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(timeLeft / 180) * 100}%` }}
                        ></div>
                    </div>

                </div>
            )}

            {/* Tour Generated Successfully */}
            {isTourReady && (
                <div className="bg-white shadow-xl rounded-2xl p-10 text-center space-y-6 border">
                    <div className="flex flex-col items-center gap-4 space-y-2">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            🎉 Tour Generated Successfully!
                        </h1>
                        <p className="text-gray-500">
                            Your requested tour has been successfully generated.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Link href={`https://travelone.io/tour/${tourSlug}`} target="_blank">
                            <button className="flex items-center gap-2 bg-black text-white font-medium cursor-pointer px-6 py-2 rounded-sm hover:bg-black/80 transition">
                                View Tour Details <ExternalLink className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Timeout Case */}
            {isTimeout && !isTourReady && (
                <div className="bg-red-50 shadow rounded-2xl p-10 text-center space-y-4 border border-red-200">
                    <h2 className="text-2xl font-semibold text-red-600">
                        Taking Longer Than Expected
                    </h2>
                    <p className="text-gray-600">
                        Tour generation is still in progress.
                        Please refresh or check again later.
                    </p>
                </div>
            )}

        </div>
    );
}