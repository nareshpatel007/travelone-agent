'use client'

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Define props
type Props = {
    isStickyShow?: boolean
};

export default function CommonFooter({ isStickyShow = false }: Props) {
    // Define state
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <footer className="bg-[#FFF9EE] text-black">
                <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 mb-0 md:mb-12 space-y-12 md:space-y-0">
                        {/* MENU 1 */}
                        <div className='space-y-6'>
                            <h3 className="font-semibold text-lg">Company</h3>
                            <ul className="space-y-3 text-base">
                                <li>
                                    <Link href="/about" className="hover:underline underline-offset-4">About</Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:underline underline-offset-4">Contact</Link>
                                </li>
                                <li>
                                    <Link href="/country" className="hover:underline underline-offset-4">Global Destinations</Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="hover:underline underline-offset-4">Blog</Link>
                                </li>
                                <li>
                                    <Link href="/careers" className="hover:underline underline-offset-4">Careers</Link>
                                </li>
                            </ul>
                        </div>

                        {/* MENU 2 */}
                        <div className='space-y-6'>
                            <h3 className="font-semibold text-lg">The Ecosystem</h3>
                            <ul className="space-y-3 text-base">
                                <li>
                                    <Link href="https://travelone.io" target="_blank" className="hover:underline underline-offset-4">Traveler Portal</Link>
                                </li>
                                <li>
                                    <Link href="https://tech.travelone.io" target="_blank" className="hover:underline underline-offset-4">Tech Hub</Link>
                                </li>
                                <li>
                                    <Link href="https://agent.travelone.io" target="_blank" className="hover:underline underline-offset-4">Travel Agent</Link>
                                </li>
                                <li>
                                    <Link href="/legal/manage-my-persona" className="hover:underline underline-offset-4">Manage My Persona</Link>
                                </li>
                                <li>
                                    <Link href="https://agent.travelone.io/login" target="_blank" className="hover:underline underline-offset-4">Partner Login</Link>
                                </li>
                            </ul>
                        </div>

                        {/* MENU 3 */}
                        <div className='space-y-6'>
                            <h3 className="font-semibold text-lg">Support</h3>
                            <ul className="space-y-3 text-base">
                                <li>
                                    <Link href="/contact" className="hover:underline underline-offset-4">Help Center</Link>
                                </li>
                                <li>
                                    <Link href="/faqs" className="hover:underline underline-offset-4">FAQs</Link>
                                </li>
                                <li>
                                    <Link href="/legal/mors-security" className="hover:underline underline-offset-4">Merchant of Record Security</Link>
                                </li>
                                <li>
                                    <Link href="/legal/travel-advisory" className="hover:underline underline-offset-4">Travel Advisory</Link>
                                </li>
                                <li>
                                    <Link href="/legal/accessibility-statement" className="hover:underline underline-offset-4">Accessibility Statement</Link>
                                </li>
                            </ul>
                        </div>

                        {/* MENU 4 */}
                        <div className='space-y-6'>
                            <h3 className="font-semibold text-lg">Legal & Compliance</h3>
                            <ul className="space-y-3 text-base">
                                <li>
                                    <Link href="/legal/terms-service" className="hover:underline underline-offset-4">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link href="/legal/privacy-policy" className="hover:underline underline-offset-4">Privacy & Data Asset Policy</Link>
                                </li>
                                <li>
                                    <Link href="/legal/refund-policy" className="hover:underline underline-offset-4">Refund & Cancellation Policy</Link>
                                </li>
                                <li>
                                    <Link href="/legal/ai-transparency-disclosure" className="hover:underline underline-offset-4">Ethical AI Disclosure</Link>
                                </li>
                                <li>
                                    <Link href="/legal/impact-statement" className="hover:underline underline-offset-4">Modern Slavery Statement</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* COPYRIGHT */}
                    <div className={`text-center text-gray-900 text-sm md:text-base pt-5 md:pt-0 ${isStickyShow ? 'mb-0 sm:mb-10' : ''}`}>
                        © Copyright {new Date().getFullYear()} TravelOne Technologies Inc. | All Rights Reserved.
                    </div>
                </div>

                {/* SCROLL TO TOP */}
                {isVisible && (
                    <button
                        onClick={scrollToTop}
                        className={`fixed ${isStickyShow ? 'bottom-10 md:bottom-20' : 'bottom-5 md:bottom-8'} right-4 md:right-8 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-900 transition z-50 cursor-pointer`}
                        aria-label="Scroll to top"
                    >
                        <ChevronUp size={24} />
                    </button>
                )}
            </footer>
        </>
    );
}