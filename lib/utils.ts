import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format only date
export function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// Format number format
export function formatPrice(price: any, decimal = 2) {
    // Format price
    const formattedPrice = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimal,
        maximumFractionDigits: 2,
    }).format(price);

    // Return formatted price
    return formattedPrice
}

// Email validator
export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}