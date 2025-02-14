"use client";

import { ThemeContext } from '@/provider/Provider';
import Image from 'next/image';
import { useContext } from 'react';

export default function CompanyLogo({ size }: { size: number; }) {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("ThemeToggle must be used within a ThemeProvider");
    }
    const [isDark, setIsDark] = context;
    return (
        <>
            {
                isDark ?
                    <Image
                        loading='lazy'
                        alt="Company Logo"
                        src="/white-logo.png"
                        width={size}
                        height={size}
                    /> :
                    <Image
                        loading='lazy'
                        alt="Company Logo"
                        src="/black-logo.png"
                        width={size}
                        height={size}
                    />
            }
        </>
    );
}
