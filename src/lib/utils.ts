import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPhone(phone: string) {
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

export function maskToken(token: string) {
  return token.slice(0, 6) + '••••••••' + token.slice(-4);
}
