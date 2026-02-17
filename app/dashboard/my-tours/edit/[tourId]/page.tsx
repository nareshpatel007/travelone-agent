'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ChevronDown, ExternalLink } from 'lucide-react'
import CommonHeader from '@/components/header/common-header'
import CommonFooter from '@/components/footer/common-footer'
import Image from 'next/image'
import { isLoggedIn } from '@/lib/auth'

// Define destination regions
const DESTINATION_REGIONS = [
    {
        name: 'Europe',
        image: 'https://ik.imagekit.io/288weifiq/destination/img_destination_64c28d8db3bd21-15021459-74046607.png'
    },
    {
        name: 'US & Canada',
        image: 'https://ik.imagekit.io/288weifiq/destination/img_destination_64c802d5083bf6-73864480-33247609.png'
    },
    {
        name: 'Asia',
        image: 'https://ik.imagekit.io/288weifiq/temp/img_temp_6352999f8e9031-28975195-99666318.png'
    },
    {
        name: 'Australia & Pacific',
        image: 'https://ik.imagekit.io/288weifiq/destination/img_destination_64c80357e4f7b0-88298060-14567833.png'
    },
    {
        name: 'Middle East',
        image: 'https://ik.imagekit.io/288weifiq/destination/img_destination_64c8037c87f057-00271065-75188789.png'
    },
    {
        name: 'Africa',
        image: 'https://ik.imagekit.io/288weifiq/destination/img_destination_64c2862026f257-08081692-45008691.png'
    },
]

// Define themes
const THEMES = [
    'Historical & Heritage Sites', 'Adventure & Outdoor Activities', 'Nature & Scenic Experiences',
    'Food & Culinary Experiences', 'Cruises & Water Journeys', 'Seasonal & Holiday Trips',
    'Luxury & Romantic Getaways', 'Spiritual & Religious Journeys', 'Eco & Sustainable Travel',
    'Nightlife & Festivals', 'Local Culture & Traditions', 'Sports & Active Travel'
]

// Define personas
const PERSONAS = [
    'The Foodie Traveler', 'The Nature Lover', 'The History Buff', 'The Spiritual Traveler',
    'The Eco-Traveler', 'The Party Traveler', 'Cultural Explorer', 'Adventure Seekers',
    'The Sports Fanatic', 'The Luxury & Romantic Traveler', 'The Cruise Lover', 'The Seasonal Traveler',
    'The Road Tripper', 'The Wellness & Retreat Traveler', 'The Budget Traveler', 'The Digital Nomad'
]

export default function CreateTourPage() {
    // Define state
    const [ready, setReady] = useState(false);
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        title: 'Cherry Blossom Discovery of Tokyo, Fuji, Kansai & Universal Studios Japan',
        selectedRegion: 'Asia',
        itinerary: [
            { country: 'Japan', city: 'Tokyo', nights: '3' },
            { country: 'Japan', city: 'Hakone', nights: '1' },
            { country: 'Japan', city: 'Kanazawa', nights: '2' },
            { country: 'Japan', city: 'Kyoto', nights: '2' },
            { country: 'Japan', city: 'Nara', nights: '0' },
            { country: 'Japan', city: 'Osaka', nights: '2' },
        ],
        tourType: 'Individual Tour',
        dmc: 'Choose DMC',
        packageOptions: '1',
        selectedThemes: [] as string[],
        selectedPersonas: [] as string[],
        tourQuality: 'Popular',
        trendingDeal: 'Special Deal',
        seoTitle: 'Cherry Blossom Discovery of Tokyo, Fuji, Kansai & Universal Studios Japan',
        seoDescription: 'Cherry Blossom Discovery of Tokyo, Fuji, Kansai & Universal Studios Japan',
        seoKeywords: 'Keywords',
        seoSlug: 'cherry-blossom-discovery-of-tokyo-fuji-kansai-universal-studios-japan-698e653d9245d',
        highlights: Array(10).fill(''),
        guestNationality: 'American',
        listingType: 'Instant Booking'
    });

    // Check login and set ready
    useEffect(() => {
        if (!isLoggedIn()) {
            window.location.href = "/login";
        }
        requestAnimationFrame(() => { setReady(true); });
    }, []);

    const updateFormData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const updateItinerary = (index: number, field: string, value: string) => {
        const newItinerary = [...formData.itinerary]
        newItinerary[index] = { ...newItinerary[index], [field]: value }
        updateFormData('itinerary', newItinerary)
    }

    const updateHighlight = (index: number, value: string) => {
        const newHighlights = [...formData.highlights]
        newHighlights[index] = value
        updateFormData('highlights', newHighlights)
    }

    const toggleTheme = (theme: string) => {
        const newThemes = formData.selectedThemes.includes(theme)
            ? formData.selectedThemes.filter(t => t !== theme)
            : [...formData.selectedThemes, theme]
        updateFormData('selectedThemes', newThemes)
    }

    const togglePersona = (persona: string) => {
        const newPersonas = formData.selectedPersonas.includes(persona)
            ? formData.selectedPersonas.filter(p => p !== persona)
            : [...formData.selectedPersonas, persona]
        updateFormData('selectedPersonas', newPersonas)
    }

    return (
        <>
            <CommonHeader />

            <div className="bg-white">
                <div className="bg-[#FFF9EE] border-b-2 border-[#d9cec1] sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto py-7 flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div
                                        key={s}
                                        onClick={() => setStep(s)}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border border-black ${s < step ? 'bg-amber-300 text-black' : s === step ? 'bg-black text-white' : 'bg-white text-black'}`}
                                        >
                                            {s < step ? '✓' : s}
                                        </div>
                                        {s < 5 && (
                                            <div className={`w-12 h-1 mx-2 ${s < step ? 'bg-black' : 'bg-[#d9cec1]'}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            {/* <button className="flex items-center gap-2 border-1 border-black bg-amber-300 text-black px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black">
                                <CheckCircle className='w-4 h-4' /> Save Changes
                            </button> */}

                            <button className="flex items-center gap-2 border-1 border-black bg-black text-white px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black">
                                Preview Tour <ExternalLink className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 1: Tour Creation */}
                {step === 1 && (
                    <div className="max-w-7xl mx-auto py-7 space-y-5">
                        {/* Tour Title */}
                        <div className="space-y-2 bg-gray-50 p-6 border border-gray-300 rounded-sm">
                            <label className="block text-sm md:text-base font-semibold text-black">Tour Title</label>
                            <input
                                type="text"
                                defaultValue={formData.title}
                                placeholder='Enter tour title'
                                className="w-full px-4 py-2 border border-gray-300 text-sm md:text-base font-medium rounded-sm bg-white text-black placeholder:text-gray-400"
                            />
                        </div>

                        {/* Destination Selection */}
                        <div className="space-y-5 bg-gray-50 p-6 border border-gray-300 rounded-sm">
                            <label className="block text-sm md:text-base font-semibold text-black">Choose destination</label>
                            <div className="grid grid-cols-6 gap-4">
                                {DESTINATION_REGIONS.map((region) => (
                                    <button
                                        key={region.name}
                                        onClick={() => updateFormData('selectedRegion', region.name)}
                                        className={`text-center p-1 rounded-sm overflow-hidden transition-all cursor-pointer ${formData.selectedRegion === region.name ? 'ring-2 ring-black' : 'hover:shadow-md'}`}
                                    >
                                        <Image
                                            src={region.image || "/placeholder.svg"}
                                            alt={region.name}
                                            width={500}
                                            height={500}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <p className="text-sm font-semibold text-black mt-2">{region.name}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Separator */}
                            <hr className='my-4 border-1 border-gray-300' />

                            {/* City Nights */}
                            <div className="mb-8">
                                <div className="grid grid-cols-3 gap-6 mb-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-2">Country *</label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-2">City *</label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-2">Nights *</label>
                                    </div>
                                </div>

                                {formData.itinerary.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-3 gap-6 mb-4">
                                        <select
                                            value={item.country}
                                            onChange={(e) => updateItinerary(idx, 'country', e.target.value)}
                                            className="px-4 py-2 text-sm md:text-base font-normal border border-black rounded bg-white text-black"
                                        >
                                            <option>Japan</option>
                                        </select>
                                        <select
                                            value={item.city}
                                            onChange={(e) => updateItinerary(idx, 'city', e.target.value)}
                                            className="px-4 py-2 text-sm md:text-base font-normal border border-black rounded bg-white text-black"
                                        >
                                            <option>Tokyo</option>
                                            <option>Hakone</option>
                                            <option>Kanazawa</option>
                                            <option>Kyoto</option>
                                            <option>Nara</option>
                                            <option>Osaka</option>
                                        </select>
                                        <select
                                            value={item.nights}
                                            onChange={(e) => updateItinerary(idx, 'nights', e.target.value)}
                                            className="px-4 py-2 text-sm md:text-base font-normal border border-black rounded bg-white text-black"
                                        >
                                            {[0, 1, 2, 3, 4, 5].map((n) => (
                                                <option key={n}>{n} Night{n !== 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                <button className="text-red-500 font-semibold text-sm">+ Add</button>
                            </div>
                        </div>

                        {/* Tour Type */}
                        <div className="space-y-2 bg-gray-50 p-6 border border-gray-300 rounded-sm">
                            <label className="block text-sm md:text-base font-semibold text-black">Tour Type</label>
                            <select
                                value={formData.tourType}
                                onChange={(e) => updateFormData('tourType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 text-sm md:text-base font-medium rounded-sm bg-white text-black placeholder:text-gray-400"
                            >
                                <option>Individual Tour</option>
                                <option>Group Tour</option>
                            </select>
                        </div>

                        {/* Save Changes */}
                        <div className='flex justify-end'>
                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 border-1 border-black bg-black text-white px-4 py-2 rounded-sm text-sm font-medium cursor-pointer hover:bg-white hover:text-black"
                            >
                                <CheckCircle className='w-4 h-4' /> Save Changes & Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Highlights & Final Settings */}
                {step === 2 && (
                    <div className="max-w-7xl mx-auto py-8">
                        <h1 className="text-2xl font-bold text-black mb-8">Highlights & Settings</h1>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">Type Highlights *</label>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.highlights.map((highlight, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={highlight}
                                        onChange={(e) => updateHighlight(idx, e.target.value)}
                                        placeholder="Enter highlight"
                                        className="w-full px-4 py-2 border-2 border-black rounded text-black"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">Guest Nationality *</label>
                            <div className="flex gap-4">
                                {['American', 'Canadian', 'European'].map((nationality) => (
                                    <label key={nationality} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="nationality"
                                            value={nationality}
                                            checked={formData.guestNationality === nationality}
                                            onChange={(e) => updateFormData('guestNationality', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-black font-semibold">{nationality}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-black mb-4">Listing Type *</label>
                            <div className="flex gap-4">
                                {['Instant Booking', 'Inquiry Only'].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="listingType"
                                            value={type}
                                            checked={formData.listingType === type}
                                            onChange={(e) => updateFormData('listingType', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-black font-semibold">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 border-2 border-teal-600 text-teal-600 py-3 rounded font-bold"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => alert('Tour created successfully!')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold"
                            >
                                Complete & Publish
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Package Details */}
                {step === 5 && (
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <h1 className="text-2xl font-bold text-black mb-8">Package Details</h1>

                        <div className="mb-8">
                            <p className="text-sm font-semibold text-black mb-4">How many package options you want to make?</p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => updateFormData('packageOptions', String(n))}
                                        className={`px-6 py-2 border-2 rounded font-semibold transition-colors ${formData.packageOptions === String(n)
                                            ? 'border-red-500 bg-red-50 text-red-500'
                                            : 'border-black text-black hover:bg-teal-50'
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded border-2 border-black mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4 border-b-2 border-gray-300">
                                    <button className="text-red-500 font-bold pb-2">Package</button>
                                    <button className="text-black pb-2">Itinerary</button>
                                    <button className="text-black pb-2">Terms</button>
                                </div>
                                <button className="bg-teal-700 text-white px-4 py-2 rounded font-bold">Save Package</button>
                            </div>

                            <div className="border-l-4 border-teal-600 pl-6">
                                <h3 className="font-bold text-black mb-4">4 Star Stay</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-black mb-3">City Breakup</h4>
                                        <ul className="space-y-2 text-teal-700">
                                            <li>Tokyo (3N)</li>
                                            <li>Hakone (1N)</li>
                                            <li>Kanazawa (2N)</li>
                                            <li>Kyoto (2N)</li>
                                            <li>Osaka (2N)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <button className="border-2 border-red-400 text-red-500 px-6 py-2 rounded font-bold">
                                            Customize Tour
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-semibold text-black mb-4">B2B Pricing * Price per person in USD</h4>
                                    <div className="grid grid-cols-7 gap-2">
                                        {['Adult', 'Child (3-7)', 'Child (8-12)', 'Infant (0-2)', 'Extra Adult', 'Single Suppl.'].map((type, idx) => (
                                            <div key={idx}>
                                                <p className="text-xs font-semibold text-black mb-2">{type}</p>
                                                <div className="flex">
                                                    <input
                                                        type="number"
                                                        defaultValue={type === 'Adult' || type === 'Extra Adult' ? 4150 : type === 'Single Suppl.' ? 0 : 0}
                                                        className="w-16 px-2 py-1 border-2 border-black rounded-l"
                                                    />
                                                    <button className="bg-black text-white px-2 rounded-r">$</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 border-2 border-teal-600 text-teal-600 py-3 rounded font-bold"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 bg-teal-700 hover:bg-black text-white py-3 rounded font-bold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Media */}
                {step === 3 && (
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <h1 className="text-2xl font-bold text-black mb-8">Media</h1>

                        <div className="mb-8 flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="media" defaultChecked className="w-5 h-5" />
                                <span className="text-black font-semibold">Use TravelOne Media</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="media" className="w-5 h-5" />
                                <span className="text-black font-semibold">Upload My Own Media</span>
                            </label>
                        </div>

                        <h2 className="text-lg font-bold text-black mb-4">TravelOne Media Library</h2>
                        <p className="text-sm text-teal-700 mb-6">Manage the uploaded media library for TravelOne attractions.</p>

                        <div className="grid grid-cols-6 gap-4 mb-8">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="border-2 border-black rounded p-2">
                                    <img src="/market-festival-crowd.jpg" alt="" className="w-full h-24 object-cover rounded mb-2" />
                                    <div className="flex gap-2 justify-center">
                                        <button className="bg-teal-600 text-white text-xs px-2 py-1 rounded">Main</button>
                                        <button className="text-red-500 font-bold text-lg">×</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-teal-700 mb-8">
                            <input type="checkbox" className="w-4 h-4" />
                            Images will be updated automatically when the itinerary changes.
                        </label>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 border-2 border-teal-600 text-teal-600 py-3 rounded font-bold"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 bg-teal-700 hover:bg-black text-white py-3 rounded font-bold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Tour Settings & SEO */}
                {step === 4 && (
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        <h1 className="text-2xl font-bold text-black mb-8">Tour Settings</h1>

                        {/* Theme Selection */}
                        <div className="mb-8">
                            <h2 className="font-bold text-black mb-4">Theme</h2>
                            <div className="grid grid-cols-4 gap-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => toggleTheme(theme)}
                                        className={`px-4 py-2 rounded border-2 transition-colors text-sm font-semibold ${formData.selectedThemes.includes(theme)
                                            ? 'border-teal-600 bg-teal-50 text-black'
                                            : 'border-black text-black hover:bg-teal-50'
                                            }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Traveler Personas */}
                        <div className="mb-8">
                            <h2 className="font-bold text-black mb-4">Traveler Personas</h2>
                            <div className="grid grid-cols-5 gap-3">
                                {PERSONAS.map((persona) => (
                                    <button
                                        key={persona}
                                        onClick={() => togglePersona(persona)}
                                        className={`px-4 py-2 rounded border-2 transition-colors text-sm font-semibold ${formData.selectedPersonas.includes(persona)
                                            ? 'border-teal-600 bg-teal-50 text-black'
                                            : 'border-black text-black hover:bg-teal-50'
                                            }`}
                                    >
                                        {persona}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tour Quality */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="font-bold text-black">Tour Quality</h2>
                                <button className="text-red-500 text-sm font-semibold">Reset</button>
                            </div>
                            <div className="flex gap-6">
                                {['Popular', 'New', 'Unique', 'Last Minute', "Today's Deal"].map((quality) => (
                                    <label key={quality} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="quality"
                                            value={quality}
                                            checked={formData.tourQuality === quality}
                                            onChange={(e) => updateFormData('tourQuality', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-black font-semibold">{quality}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Homepage Trending Deals */}
                        <div className="mb-8">
                            <h2 className="font-bold text-black mb-4">Homepage Trending Deals Selection</h2>
                            <div className="flex gap-6">
                                {['Special Deal', 'Destination'].map((deal) => (
                                    <label key={deal} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="trending"
                                            value={deal}
                                            checked={formData.trendingDeal === deal}
                                            onChange={(e) => updateFormData('trendingDeal', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-black font-semibold">{deal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SEO Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">SEO Title</label>
                                <input
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={(e) => updateFormData('seoTitle', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">SEO Description</label>
                                <input
                                    type="text"
                                    value={formData.seoDescription}
                                    onChange={(e) => updateFormData('seoDescription', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">SEO Keyword</label>
                                <input
                                    type="text"
                                    value={formData.seoKeywords}
                                    onChange={(e) => updateFormData('seoKeywords', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black mb-2">SEO Slug</label>
                                <input
                                    type="text"
                                    value={formData.seoSlug}
                                    onChange={(e) => updateFormData('seoSlug', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 border-2 border-teal-600 text-teal-600 py-3 rounded font-bold"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStep(5)}
                                className="flex-1 bg-teal-700 hover:bg-black text-white py-3 rounded font-bold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <CommonFooter />
        </>
    )
}
