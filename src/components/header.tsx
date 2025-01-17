'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchUserData } from '@/utils/userUtilities';

import Sidebar from './sidebar';

export default function Header() {
    const [userData, setUserData] = useState<{ photo: string; username: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleLogoutModal = () => {
        setIsOpen(!isOpen);
    };

    const onLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    useEffect(() => {
        const handelFetchUserData = async () => {
            setLoading(true);
            await fetchUserData(setUserData, router)
            setLoading(false);
        };

        handelFetchUserData();
    }, []);

    return (
        <>
            <div className='w-full sticky top-0 left-2 px-1 md:px-5 pt-3 z-20'>
                <header className="w-full h-[40px] flex items-center justify-between bg-white shadow-md rounded-full px-5 py-8">
                    <Sidebar />
                    <Link href={`/news`}>
                        <img src="/black-logo.png" alt="Company Logo" className='h-8 sm:h-9' />
                    </Link>
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : userData ? (
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton
                                        className="text-nowrap inline-flex w-full justify-center rounded-full p-1 bg-white text-sm font-semibold text-gray-900 hover:shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 hover:bg-gray-50"
                                        aria-label="User Menu"
                                    >
                                        <img
                                            src={userData.photo}
                                            alt="User Photo Profile"
                                            className='rounded-full h-8 sm:h-9'
                                        />
                                    </MenuButton>
                                </div>

                                <MenuItems className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    <div className="py-1">
                                        <MenuItem>
                                            <div className='w-full flex flex-col items-center gap-1 py-2 border-b border-gray-300'>
                                                <img
                                                    src={userData.photo}
                                                    alt="User Photo Profile"
                                                    className="rounded-full"
                                                    width={50}
                                                />
                                                <p className={`block w-full text-center pointer-events-none px-4 py-2 text-sm text-gray-900 font-semibold data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none`}>{userData.username}</p>
                                            </div>
                                        </MenuItem>
                                        <MenuItem>
                                            <button onClick={toggleLogoutModal} className={`block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-red-500 data-[focus]:outline-none`} type="button">Logout</button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        ) : (
                            <p>User data not available</p>
                        )}
                    </div>
                </header>
            </div>

            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black/40">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h3 className="text-xl font-semibold text-gray-900">Are you sure you want to logout?</h3>
                                <button type="button" onClick={toggleLogoutModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close logout modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4">
                                <p className="text-base leading-relaxed text-gray-500">
                                    If you log out, you will lose your session and may need to log back in.
                                    Are you sure you want to proceed?
                                </p>
                            </div>
                            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b gap-2.5">
                                <button onClick={toggleLogoutModal} className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Cancel</button>
                                <button onClick={onLogout} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}