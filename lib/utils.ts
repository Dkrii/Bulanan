import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatMoney(amount: number): string {
    // IDR Currency
    return 'Rp ' + (amount || 0).toLocaleString('id-ID');
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    // Example: Oct 24, 2023
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getIconForCategory(category: string): string {
    const cat = (category || '').toLowerCase();
    if (cat.includes('makan') || cat.includes('food')) return '🍔';
    if (cat.includes('transport') || cat.includes('uber') || cat.includes('gojek') || cat.includes('gas')) return '🚗';
    if (cat.includes('belanja') || cat.includes('shopping')) return '🛍️';
    if (cat.includes('gaji') || cat.includes('salary')) return '💵';
    if (cat.includes('hiburan') || cat.includes('movie')) return '🎬';
    if (cat.includes('tagihan') || cat.includes('bill') || cat.includes('rent')) return '📄';
    if (cat.includes('home') || cat.includes('house')) return '🏠';
    if (cat.includes('work') || cat.includes('freelance')) return '💼';
    return '💰';
}
