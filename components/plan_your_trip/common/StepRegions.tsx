"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import QuestionHeading from "./questionHeading";

// Define cities based on countries
const COUNTRY_CITY_GROUPS: Record<
    string,
    { label: string; cities: string[] }[]
> = {
    // 🌏 Asia
    Japan: [
        {
            label: "Classic Japan",
            cities: ["Tokyo", "Kyoto", "Osaka", "Nara"],
        },
        {
            label: "Mount Fuji & Alps",
            cities: ["Hakone", "Mount Fuji", "Takayama", "Kanazawa"],
        },
        {
            label: "Historic South",
            cities: ["Hiroshima", "Fukuoka", "Nagasaki"],
        },
        {
            label: "Northern Japan",
            cities: ["Hokkaido", "Sapporo", "Hakodate"],
        },
        {
            label: "Tropical Islands",
            cities: ["Okinawa", "Ishigaki", "Miyakojima"],
        },
    ],

    "South Korea": [
        {
            label: "Classic Korea",
            cities: ["Seoul", "Busan", "Incheon"],
        },
        {
            label: "Cultural Heritage",
            cities: ["Gyeongju", "Andong"],
        },
        {
            label: "Island Escapes",
            cities: ["Jeju Island"],
        },
    ],

    Vietnam: [
        {
            label: "Northern Vietnam",
            cities: ["Hanoi", "Ha Long Bay", "Sapa"],
        },
        {
            label: "Central Vietnam",
            cities: ["Da Nang", "Hoi An", "Hue"],
        },
        {
            label: "Southern Vietnam",
            cities: ["Ho Chi Minh City", "Mekong Delta"],
        },
        {
            label: "Beach Destinations",
            cities: ["Nha Trang", "Phu Quoc"],
        },
    ],

    Indonesia: [
        {
            label: "Bali Highlights",
            cities: ["Bali", "Ubud"],
        },
        {
            label: "Java Heritage",
            cities: ["Jakarta", "Yogyakarta", "Bandung"],
        },
        {
            label: "Island Adventures",
            cities: ["Lombok", "Gili Islands"],
        },
    ],

    Thailand: [
        {
            label: "Classic Thailand",
            cities: ["Bangkok", "Ayutthaya"],
        },
        {
            label: "Northern Culture",
            cities: ["Chiang Mai", "Chiang Rai"],
        },
        {
            label: "Beach Paradise",
            cities: ["Phuket", "Krabi", "Koh Samui", "Koh Phi Phi"],
        },
        {
            label: "Vibrant Cities",
            cities: ["Pattaya"],
        },
    ],

    India: [
        {
            label: "Golden Triangle",
            cities: ["Delhi", "Agra", "Jaipur"],
        },
        {
            label: "Spiritual India",
            cities: ["Varanasi", "Amritsar", "Rishikesh"],
        },
        {
            label: "Royal Rajasthan",
            cities: ["Udaipur", "Jodhpur", "Jaisalmer"],
        },
        {
            label: "South India",
            cities: ["Kochi", "Alleppey", "Munnar"],
        },
        {
            label: "Hill Stations & Adventure",
            cities: ["Shimla", "Manali", "Leh Ladakh"],
        },
        {
            label: "Beaches",
            cities: ["Goa"],
        },
    ],

    // 🌍 Africa
    Kenya: [
        {
            label: "Safari Highlights",
            cities: ["Masai Mara", "Amboseli", "Lake Nakuru"],
        },
        {
            label: "Urban & Culture",
            cities: ["Nairobi"],
        },
        {
            label: "Beach Escapes",
            cities: ["Diani Beach", "Mombasa"],
        },
    ],

    // 🌍 Europe
    Italy: [
        {
            label: "Classic Italy",
            cities: ["Rome", "Florence", "Venice"],
        },
        {
            label: "Northern Italy",
            cities: ["Milan", "Lake Como", "Verona"],
        },
        {
            label: "Southern Italy",
            cities: ["Naples", "Amalfi Coast", "Sicily"],
        },
    ],

    Spain: [
        {
            label: "Classic Spain",
            cities: ["Madrid", "Barcelona"],
        },
        {
            label: "Andalusia",
            cities: ["Seville", "Granada", "Cordoba"],
        },
        {
            label: "Coastal Spain",
            cities: ["Valencia", "Malaga"],
        },
        {
            label: "Island Life",
            cities: ["Ibiza", "Mallorca"],
        },
    ],

    Portugal: [
        {
            label: "Classic Portugal",
            cities: ["Lisbon", "Porto"],
        },
        {
            label: "Historic Towns",
            cities: ["Sintra", "Evora"],
        },
        {
            label: "Beach Algarve",
            cities: ["Algarve", "Faro"],
        },
    ],

    Greece: [
        {
            label: "Classic Greece",
            cities: ["Athens"],
        },
        {
            label: "Iconic Islands",
            cities: ["Santorini", "Mykonos"],
        },
        {
            label: "Greek Islands",
            cities: ["Crete", "Rhodes", "Corfu"],
        },
    ],

    France: [
        {
            label: "Classic France",
            cities: ["Paris", "Versailles"],
        },
        {
            label: "French Riviera",
            cities: ["Nice", "Cannes", "Monaco"],
        },
        {
            label: "Wine & Culture",
            cities: ["Bordeaux", "Lyon"],
        },
        {
            label: "Historic Cities",
            cities: ["Marseille", "Strasbourg"],
        },
    ],

    Norway: [
        {
            label: "Norway Highlights",
            cities: ["Oslo", "Bergen"],
        },
        {
            label: "Fjords & Nature",
            cities: ["Geiranger", "Flam"],
        },
        {
            label: "Arctic Adventures",
            cities: ["Tromso", "Lofoten Islands"],
        },
    ],

    Iceland: [
        {
            label: "Golden Circle",
            cities: ["Reykjavik", "Thingvellir", "Geysir"],
        },
        {
            label: "South Coast",
            cities: ["Vik", "Skogafoss"],
        },
        {
            label: "Northern Iceland",
            cities: ["Akureyri"],
        },
    ],

    Denmark: [
        {
            label: "Classic Denmark",
            cities: ["Copenhagen"],
        },
        {
            label: "Cultural Cities",
            cities: ["Aarhus", "Odense"],
        },
    ],

    Switzerland: [
        {
            label: "Classic Switzerland",
            cities: ["Zurich", "Lucerne"],
        },
        {
            label: "Alpine Adventures",
            cities: ["Interlaken", "Zermatt"],
        },
        {
            label: "Lakes & Cities",
            cities: ["Geneva", "Montreux"],
        },
    ],

    Sweden: [
        {
            label: "Classic Sweden",
            cities: ["Stockholm"],
        },
        {
            label: "Urban Culture",
            cities: ["Gothenburg", "Malmo"],
        },
        {
            label: "Arctic Sweden",
            cities: ["Abisko"],
        },
    ],

    Finland: [
        {
            label: "Classic Finland",
            cities: ["Helsinki"],
        },
        {
            label: "Lapland Experience",
            cities: ["Rovaniemi", "Lapland"],
        },
        {
            label: "Cultural Cities",
            cities: ["Tampere", "Turku"],
        },
    ],

    // 🌎 North America
    Canada: [
        {
            label: "Eastern Canada",
            cities: ["Toronto", "Montreal", "Quebec City"],
        },
        {
            label: "Western Canada",
            cities: ["Vancouver", "Victoria"],
        },
        {
            label: "Rocky Mountains",
            cities: ["Banff", "Lake Louise", "Jasper"],
        },
    ],

    USA: [
        {
            label: "Classic USA",
            cities: ["New York City", "Washington DC"],
        },
        {
            label: "West Coast",
            cities: ["Los Angeles", "San Francisco", "Las Vegas"],
        },
        {
            label: "Theme Parks & Fun",
            cities: ["Orlando", "Anaheim"],
        },
        {
            label: "Nature & Parks",
            cities: ["Yellowstone", "Grand Canyon"],
        },
    ],
};

interface Props {
    planYourTripForm: any;
    setPlanYourTripForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepRegions({
    planYourTripForm,
    setPlanYourTripForm,
}: Props) {
    // Define state
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);

    // Selected countries (supports multi-country)
    const selectedCountries = Array.isArray(planYourTripForm.country) ? planYourTripForm.country : [planYourTripForm.country];

    // Build regions dynamically
    const regions = useMemo(() => {
        return selectedCountries.flatMap((country: any) => (COUNTRY_CITY_GROUPS[country] || []).map(
            (r) => `${r.label} (${r.cities.join(", ")})`
        ));
    }, [selectedCountries]);

    // Restore once
    useEffect(() => {
        if (Array.isArray(planYourTripForm?.cities_options)) {
            setSelectedRegions(planYourTripForm.cities_options);
        }
        if (Array.isArray(planYourTripForm?.selected_cities)) {
            setSelectedCities(planYourTripForm.selected_cities);
        }
    }, []);

    const syncForm = (regions: string[], cities: string[]) => {
        setPlanYourTripForm((form: any) => ({
            ...form,
            cities_options: regions,
            selected_cities: cities,
        }));
    };

    const toggleRegion = (region: string) => {
        setSelectedRegions((prev) => {
            const isActive = prev.includes(region);
            const updatedRegions = isActive
                ? prev.filter((r) => r !== region)
                : [...prev, region];

            setSelectedCities((prevCities) => {
                const regionCities = extractCities(region);

                const updatedCities = isActive
                    ? prevCities.filter((c) => !regionCities.includes(c))
                    : Array.from(new Set([...prevCities, ...regionCities]));

                syncForm(updatedRegions, updatedCities);
                return updatedCities;
            });

            return updatedRegions;
        });
    };

    const removeCity = (city: string) => {
        setSelectedCities((prev) => {
            const updatedCities = prev.filter((c) => c !== city);
            syncForm(selectedRegions, updatedCities);
            return updatedCities;
        });
    };

    return (
        <div className="space-y-3 md:space-y-5">
            <QuestionHeading title="Which parts would you like to explore?" />

            <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto space-y-2 md:space-y-3">
                {selectedCities.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
                        {selectedCities.map((city) => (
                            <span
                                key={city}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-white rounded-sm"
                            >
                                {city}
                                <button
                                    onClick={() => removeCity(city)}
                                    className="ml-1 hover:text-gray-300"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {regions.map((region: any) => {
                    const isActive = selectedRegions.includes(region);
                    const { title, subtitle } = formatRegion(region);

                    return (
                        <label
                            key={region}
                            onClick={() => toggleRegion(region)}
                            className={`flex items-center justify-between border px-5 py-3 rounded-sm cursor-pointer bg-white ${isActive ? "border-black" : "border-black/30"
                                }`}
                        >
                            <div>
                                <span className="text-sm md:text-base">{title}</span>
                                {subtitle && <div className="text-sm md:text-base">{subtitle}</div>}
                            </div>
                            {isActive && <Check className="h-5 w-5" />}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

/* ---------------- Helpers ---------------- */

function extractCities(region: string): string[] {
    const match = region.match(/\(([^)]+)\)/);
    if (!match) return [region];
    return match[1].split(",").map((c) => c.trim());
}

function formatRegion(region: string) {
    const match = region.match(/^(.+?)\s*\((.+)\)$/);
    if (!match) return { title: region, subtitle: null };
    return { title: match[1], subtitle: `(${match[2]})` };
}