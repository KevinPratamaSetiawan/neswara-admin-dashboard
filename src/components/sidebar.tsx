import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link'
import CompanyLogo from './companyLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faNewspaper, faShapes, faTag, faUser, faUserGear, faVideo } from '@fortawesome/free-solid-svg-icons';
import { RoleContext } from '@/provider/Provider';

export default function Sidebar() {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2  text-sm text-text dark:text-darkText rounded-lg hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={toggleSidebar}
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>

            <aside
                id="sidebar"
                className={`absolute top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-card dark:bg-darkCard text-text dark:text-darkText">
                    <div className='w-full flex items-center justify-between mb-5'>
                        <Link href={`/news`} className="flex items-center ps-2.5">
                            <CompanyLogo size={40} />
                            <span className="self-center text-xl font-bold whitespace-nowrap ml-2">Neswara</span>
                        </Link>
                        <button
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-text dark:text-darkText rounded-lg button-ring button-hover"
                            onClick={toggleSidebar}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <ul className="space-y-2 font-medium">
                        {hasPermission('news-list') &&
                            <li>
                                <Link href={`/news`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faNewspaper} />
                                    <span className="ms-3">News</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('video-list') &&
                            <li>
                                <Link href={`/videos`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faVideo} />
                                    <span className="ms-3">Video</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('category-list') &&
                            <li>
                                <Link href={`/categories`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faShapes} />
                                    <span className="ms-3">Category</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('tag-list') &&
                            <li>
                                <Link href={`/tags`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faTag} />
                                    <span className="ms-3">Tags</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('user-list') &&
                            <li>
                                <Link href={`/user`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span className="ms-3">User Account</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('role-list') &&
                            <li>
                                <Link href={`/roles`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faUserGear} />
                                    <span className="ms-3">User Role</span>
                                </Link>
                            </li>
                        }
                        {hasPermission('log-list') &&
                            <li>
                                <Link href={`/activity-log`} className="flex items-center p-2 text-text dark:text-darkText rounded-lg button-ring button-hover group">
                                    <FontAwesomeIcon icon={faList} />
                                    <span className="ms-3">Activity Log</span>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </aside>
        </>
    );
};
