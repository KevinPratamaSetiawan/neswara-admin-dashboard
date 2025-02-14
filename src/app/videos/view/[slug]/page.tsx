"use client";
import React, { useContext, useEffect, useState } from 'react';

import { VideoStatusModal } from '@/components/StatusModal';
import Footer from '@/components/footer';
import { Toast } from '@/components/toastList';
import { getStatusColor } from '@/utils/newsUtilities';
import { Video, handleDeleteVideo, handleFetchVideoBySlug } from '@/utils/videoUtilities';
import { faAngleRight, faArrowLeft, faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import { RoleContext } from '@/provider/Provider';
import { MyAccount } from '@/utils/userUtilities';
import { PageAccessCheck } from '@/utils/accessCheck';

export default function ViewNews({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const params = React.use(paramsPromise);
    const { slug } = params;
    const [videoData, setVideoData] = useState<Video>();
    const [isOpen, setIsOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const response = await handleFetchVideoBySlug(slug);

            console.log(response.data);

            if (response.status === 200 && response.data) {
                setVideoData(response.data);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        loadData();
    }, [isStatusOpen]);

    const DeleteVideo = async () => {
        const response = await handleDeleteVideo(videoData?.id ? videoData.id : 0);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            router.push('/videos')
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <PageAccessCheck permission={['video-list']} />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex flex-col items-center gap-8 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-4 shadow-lg'>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center'>
                            <a href="/videos" className='button-hover rounded-full px-3 py-2'>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </a>
                            <div className='hidden md:flex items-center gap-1 font-semibold'>
                                <a href='/videos' className="w-full text-center">Video</a>
                                <FontAwesomeIcon icon={faAngleRight} />
                                <a href='/video' className="w-full text-center">{videoData?.category_name}</a>
                            </div>
                        </div>
                        <div className='flex items-stretch gap-3'>
                            {hasPermission('video-edit-status') ?
                                <button type='button' onClick={() => setIsStatusOpen((prev) => !prev)} className={`inline-flex items-center rounded-md hover:bg-gray-300 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer ${getStatusColor(videoData?.status ? videoData.status : 'draft')}`}>
                                    {videoData?.status[0].toUpperCase()}{videoData?.status.slice(1)}
                                </button> :
                                <p className={`inline-flex items-center rounded-md hover:bg-gray-300 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer ${getStatusColor(videoData?.status ? videoData.status : 'draft')}`}>
                                    {videoData?.status[0].toUpperCase()}{videoData?.status.slice(1)}
                                </p>
                            }
                            {videoData && hasPermission('video-edit-status') && (<VideoStatusModal video={videoData} open={isStatusOpen} videoId={videoData?.id || 0} onClose={() => setIsStatusOpen(false)} />)}
                            {(MyAccount('id') === videoData?.created_by && (hasPermission('video-edit')) || hasPermission('video-edit-all')) &&
                                <Link href={`/videos/view/${slug}/edit`} className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer">
                                    <FontAwesomeIcon icon={faPen} />
                                </Link>
                            }
                            {hasPermission('video-delete') && <button type='button' onClick={() => setIsOpen((prev) => !prev)} className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></button>}
                        </div>
                    </div>
                    <iframe
                        className='rounded-lg border-2 border-border dark:border-darkBorder object-cover aspect-video lg:w-[800px] lg:h-[400px]'
                        src={`https://www.youtube.com/embed/${videoData?.content_id}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>

                    <div className='w-full flex flex-col items-start xl:px-40'>
                        <div className='w-full flex items-center justify-between'>
                            <p className="text-lg font-semibold">{videoData?.title}</p>
                            <div className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faEye} size='sm' />
                                <p>{videoData?.total_hit}</p>
                            </div>
                        </div>
                        <div className='w-full flex flex-col items-center gap-2 mt-5'>
                            <p className="w-full text-sm font-semibold">
                                {videoData?.created_at
                                    ? new Date(videoData.created_at).toLocaleString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "N/A"}
                            </p>
                            <p className="w-full">{videoData?.description}</p>
                            <p className="w-full text-right text-sm font-semibold">{videoData?.username}</p>
                        </div>
                    </div>

                    <div className='w-full xl:px-40'>
                        <hr className='w-full my-5' />

                        <ul className='w-full flex items-center gap-3 flex-wrap'>
                            {videoData?.tags.map((tag) => (
                                <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder pointer-events-none" key={tag.id}>
                                    <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                    {tag.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full xl:px-40'>
                        {videoData?.id && hasPermission('comment-list') && <CommentSection type='video' sourceId={videoData.id} />}
                    </div>
                </div>
            </div>

            {isOpen && hasPermission('video-delete') && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure you want to delete this video?</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen((prev) => !prev)}
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
                                    <span className="sr-only">Close exit modal</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                                <button
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={DeleteVideo}
                                    type='button'
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}
