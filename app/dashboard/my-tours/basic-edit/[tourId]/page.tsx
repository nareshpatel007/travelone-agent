'use client'

import { useEffect, useState } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import CommonHeader from '@/components/header/common-header';
import CommonFooter from '@/components/footer/common-footer';
import { isLoggedIn } from '@/lib/auth';

export default function CreateTourPage() {
    // Define state
    const [ready, setReady] = useState(false);
    const [step, setStep] = useState('package_price');

    // Check login and set ready
    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
        }
        requestAnimationFrame(() => { setReady(true); });
    }, []);

    // If not ready, show loading
    if (!ready) return null;

    return (
        <>
            <CommonHeader />

            <div className="bg-white">
                <div className="bg-[#FFF9EE] border-b-2 border-[#d9cec1] sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
                        <div className="flex-1">
                            Update for <span className="font-bold text-black">Tour Title here</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button className="flex items-center gap-2 border-1 border-black bg-amber-300 text-black px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black">
                                <CheckCircle className='w-4 h-4' /> Save Changes
                            </button>

                            <button className="flex items-center gap-2 border-1 border-black bg-black text-white px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black">
                                Preview Tour <ExternalLink className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="max-w-7xl mx-auto py-4">
                    <div className="flex items-center">
                        <div className={`flex px-4 py-2 items-center justify-center font-semibold text-sm transition-colors border border-black cursor-pointer ${step === 'package_price' ? 'bg-black text-white' : 'bg-white text-black'}`} onClick={() => setStep('package_price')}>
                            Package Pricing
                        </div>
                        <div className={`flex px-4 py-2 items-center justify-center font-semibold text-sm transition-colors border border-black cursor-pointer ${step === 'attraction_update' ? 'bg-black text-white' : 'bg-white text-black'}`} onClick={() => setStep('attraction_update')}>
                            Itinerary Attraction
                        </div>
                    </div>
                </div>

                {/* Step for Package Price */}
                {step === "package_price" && (
                    <div className="max-w-7xl mx-auto py-4 mb-5 space-y-5">
                        <h1 className="text-xl font-semibold text-black">Package Pricing</h1>
                        <div className='space-y-5'>
                            <div className="bg-white rounded border border-[#d9cec1]">
                                <div className="px-6 py-4 bg-[#FFF9EE] border-b border-[#d9cec1]">
                                    <h3 className="font-medium text-black">4 Star Stay</h3>
                                </div>
                                <div className="px-6 py-4 bg-white">
                                    <div className="grid grid-cols-6 gap-2">
                                        {['Adult', 'Child (3-7)', 'Child (8-12)', 'Infant (0-2)', 'Extra Adult', 'Single Supplement'].map((type, idx) => (
                                            <div key={idx} className='w-full flex flex-col items-start gap-2'>
                                                <p className="text-sm font-medium text-black">{type}</p>
                                                <div className="flex">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        defaultValue={0}
                                                        className="w-full px-2 py-1 border-1 text-sm border-black rounded-l"
                                                    />
                                                    <button className="bg-black text-white text-sm px-2 rounded-r">$</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step for Attraction Update */}
                {step === "attraction_update" && (
                    <div className="max-w-7xl mx-auto py-8">
                        <h1 className="text-xl font-semibold text-black">Itinerary Attraction</h1>
                    </div>
                )}
            </div>

            <CommonFooter />
        </>
    )
}
