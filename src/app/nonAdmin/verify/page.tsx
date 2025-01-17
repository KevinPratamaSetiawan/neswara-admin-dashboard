"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
    const email = useSearchParams().get('email');
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post("http://localhost:8080/api/user/verification", {
                email,
                code
            });

            if (response.status === 200) {
                setSuccess(response.data.message);
                setTimeout(() => {
                    router.push(`/login`);
                }, 3000);
            } else {
                setError(response.data.message);
            }

        } catch (err: any) {
            console.error("Error registering:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to sign up");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="/black-logo.png"
                    className="mx-auto h-16 w-auto"
                />
                <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Verify your {email} account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm/6 font-medium text-gray-900">
                            Code
                        </label>
                        <div className="mt-2">
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">{success}</p>}
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Confirm
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Back to{' '}
                    <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}