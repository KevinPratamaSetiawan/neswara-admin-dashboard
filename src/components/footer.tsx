'use client';

import { usePathname } from 'next/navigation';
import AccessCheck from '@/utils/accessCheck';

export default function Footer() {
    const thisYear = new Date().getFullYear().toString();
    const pathname = usePathname();
    const hide = ['/login'];

    return (
        !hide.includes(pathname) &&
        <footer className="w-full flex items-center justify-center p-5 text-gray-600 text-xs md:text-base">
            <p>© {thisYear} Neswara. All rights reserved.</p>
            <AccessCheck />
        </footer>
    );
}