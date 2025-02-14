"use client";
import { useState, useContext } from 'react';

import { Toast } from '@/components/toastList';
import { News, handleUpdateNewsStatus } from '@/utils/newsUtilities';
import { getStatusColor } from '@/utils/newsUtilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Video, handleUpdateVideoStatus } from '@/utils/videoUtilities';
import { User, handleEditUserRole } from '@/utils/userUtilities';
import { Role } from '@/utils/roleUtilities';
import { RoleContext } from '@/provider/Provider';

export function NewsStatusModal({ news, open, newsId, onClose }: { news: News; open: boolean; newsId: number; onClose: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [status, setStatus] = useState(news.status);
    const [reason, setReason] = useState('');

    const ChangeStatus = async () => {
        const response = await handleUpdateNewsStatus(newsId, status, reason);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            onClose()
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                            <div className="text-xl font-semibold text-text dark:text-darkText uppercase flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}>
                                    {news.status[0].toUpperCase() + news.status.slice(1)}
                                </span>
                                <p>{news.title}</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
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
                                <span className="sr-only">Close change status modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <ul className='w-full flex flex-wrap items-center justify-center gap-3'>
                                {
                                    hasPermission('news-drafted') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('draft')}>
                                            {
                                                status === 'draft' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('draft')}`}>
                                                Draft
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('news-rejected') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('rejected')}>
                                            {
                                                status === 'rejected' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('rejected')}`}>
                                                Reject
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('news-approve') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('approved')}>
                                            {
                                                status === 'approved' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('approved')}`}>
                                                Approve
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('news-published') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('published')}>
                                            {
                                                status === 'published' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('published')}`}>
                                                Publish
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('news-archived') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('archived')}>
                                            {
                                                status === 'archived' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('archived')}`}>
                                                Archive
                                            </span>
                                        </button>
                                    </li>
                                }
                            </ul>
                        </div>

                        {
                            hasPermission('news-rejected') && status === 'rejected' &&
                            <div className="p-4 md:p-5 space-y-4">
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={5}
                                    placeholder="Rejection reason..."
                                    className="w-full px-5 py-3 rounded-lg border-b border-border dark:border-darkBorder bg-border dark:bg-darkBorder"
                                />
                            </div>
                        }
                        <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                            <button
                                onClick={onClose}
                                className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ChangeStatus}
                                type='button'
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function VideoStatusModal({ video, open, videoId, onClose }: { video: Video; open: boolean; videoId: number; onClose: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [status, setStatus] = useState(video.status);

    const ChangeStatus = async () => {
        const response = await handleUpdateVideoStatus(videoId, status);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            onClose()
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                            <div className="text-xl font-semibold text-text dark:text-darkText uppercase flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                                    {video.status[0].toUpperCase() + video.status.slice(1)}
                                </span>
                                <p>{video.title}</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
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
                                <span className="sr-only">Close change status modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <ul className='w-full flex flex-wrap items-center justify-center gap-3'>
                                {
                                    hasPermission('video-drafted') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('draft')}>
                                            {
                                                status === 'draft' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('draft')}`}>
                                                Draft
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('video-publish') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('published')}>
                                            {
                                                status === 'published' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('published')}`}>
                                                Publish
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('video-live') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('live')}>
                                            {
                                                status === 'live' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('live')}`}>
                                                Live
                                            </span>
                                        </button>
                                    </li>
                                }
                                {
                                    hasPermission('video-archived') &&
                                    <li className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'>
                                        <button className='flex items-center gap-2' type='button' onClick={() => setStatus('archived')}>
                                            {
                                                status === 'archived' ?
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    :
                                                    <FontAwesomeIcon icon={faMinus} />
                                            }
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('archived')}`}>
                                                Archive
                                            </span>
                                        </button>
                                    </li>
                                }
                            </ul>
                        </div>

                        <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                            <button
                                onClick={onClose}
                                className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ChangeStatus}
                                type='button'
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function UserRoleModal({ user, open, roleData, onClose }: { user: User; open: boolean; roleData: Role[]; onClose: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [updatedRole, setUpdatedRole] = useState(user.role_id);

    const ChangeStatus = async () => {
        const response = await handleEditUserRole(user.email, updatedRole);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            onClose()
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                            <div className="text-xl font-semibold text-text dark:text-darkText uppercase flex items-center gap-2">
                                <p>{user.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
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
                                <span className="sr-only">Close change status modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <ul className='w-full flex flex-wrap items-center justify-center gap-3'>
                                {
                                    roleData.map((role, index) => {
                                        if (role.name.toLowerCase() === "banned" && !hasPermission("user-ban")) {
                                            return null;
                                        }

                                        return (
                                            <li
                                                key={index + role.id}
                                                className="px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover"
                                            >
                                                <button className="flex items-center gap-2" type="button" onClick={() => setUpdatedRole(role.id)}>
                                                    <FontAwesomeIcon icon={updatedRole === role.id ? faCheck : faMinus} />
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                        {role.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>

                        <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                            <button
                                onClick={onClose}
                                className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ChangeStatus}
                                type='button'
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}