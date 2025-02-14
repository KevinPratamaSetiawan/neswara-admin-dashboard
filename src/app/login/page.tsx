"use client";

import { handleAdminLogin } from '@/utils/userUtilities';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { Toast } from '@/components/toastList';
import { RoleContext, ThemeContext } from '@/provider/Provider';
import CompanyLogo from '@/components/companyLogo';
import Metadata from '@/utils/metadata';

export default function Login() {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { FetchUserRole } = roleContext;
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("ThemeToggle must be used within a ThemeProvider");
    }
    const [isDark, setIsDark] = context;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await handleAdminLogin(email, password);

        if (response.status === 200) {
            const message = response.message || 'Login Success';
            if (message) {
                Toast('success', message);
            }
            localStorage.setItem('token', response.token || '');
            await FetchUserRole();
            setTimeout(() => {
                router.push('/news');
            }, 1000)
        } else {
            const message = response.message || 'An unexpected error occurred.';
            if (message) {
                Toast('error', message);
            }
        }
    };

    return (
        <>
            <Metadata title='Login ' description='| Neswara' />
            <div className='w-screen h-screen flex items-center justify-center'>
                <div className="max-w-[500px] mx-auto bg-card dark:bg-darkCard rounded-2xl shadow-lg flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
                        <CompanyLogo size={55} />
                        <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight">
                            Login to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md px-3 py-1.5 text-base bg-card dark:bg-darkCard text-text dark:text-darkText outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md px-3 py-1.5 text-base bg-card dark:bg-darkCard text-text dark:text-darkText outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col items-center gap-4'>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary/80 button-ring"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
