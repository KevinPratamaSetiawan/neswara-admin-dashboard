"use client";
import React, { useContext, useEffect, useState } from 'react';

import CommentSection from '@/components/CommentSection';
import Modal from '@/components/Modal';
import { NewsStatusModal } from '@/components/StatusModal';
import Footer from '@/components/footer';
import { Toast } from '@/components/toastList';
import { RoleContext } from '@/provider/Provider';
import { Like, handleFetchLikesListInNews, handleToggleLike } from '@/utils/likeUtilities';
import { News, getStatusColor, handleDeleteNews, handleFetchNewsBySlug } from '@/utils/newsUtilities';
import { MyAccount } from '@/utils/userUtilities';
import { faThumbsUp as faThumbsUpEmpty } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faArrowLeft, faEye, faMessage, faPen, faThumbsUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageAccessCheck } from '@/utils/accessCheck';

const NewsContent = ({ content }: any) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: content,
            }}

            className='w-full text-justify'
        />
    );
};

export default function ViewNews({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const params = React.use(paramsPromise);
    const { slug } = params;
    const [newsId, setNewsId] = useState(0);
    const [newsData, setNewsData] = useState<News>();
    const [likeData, setLikeData] = useState<Like[]>();
    const [isLiked, setIsLiked] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLikesOpen, setIsLikesOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const response = await handleFetchNewsBySlug(slug);

            if (response.status === 200 && response.data) {
                setNewsData(response.data);
                setNewsId(response.data.id);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        loadData();
    }, [isStatusOpen, isLiked]);

    useEffect(() => {
        const loadLikes = async () => {
            const response = await handleFetchLikesListInNews(newsData?.id || 0);

            if (response.status === 200 && response.likes) {
                setLikeData(response.likes);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        loadLikes();
    }, [isLikesOpen]);

    const ToggleLike = async () => {
        const response = await handleToggleLike(newsData?.id || 0);

        if (response.status === 200 && response.message) {
            setIsLiked((prev) => !prev);
            Toast('success', response.message);
        } else if (response.message) {
            Toast('error', 'Like Removed');
        }
    };

    const DeleteNews = async () => {
        const response = await handleDeleteNews(newsData?.id ? newsData.id : 0);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            router.push('/news')
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <PageAccessCheck permission={['news-list']} />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex flex-col items-center gap-8 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-4 shadow-lg'>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center'>
                            <a href="/news" className='button-hover rounded-full px-3 py-2'>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </a>
                            <div className='hidden md:flex items-center gap-1 font-semibold'>
                                <a href='/news' className="w-full text-center">News</a>
                                <FontAwesomeIcon icon={faAngleRight} />
                                <a href='/news' className="w-full text-center">{newsData?.category_name}</a>
                            </div>
                        </div>
                        <div className='flex items-stretch gap-3'>
                            {
                                hasPermission('news-edit-status') ?
                                    <button type='button' onClick={() => setIsStatusOpen((prev) => !prev)} className={`inline-flex items-center rounded-md hover:bg-gray-300 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer ${getStatusColor(newsData?.status ? newsData.status : 'draft')}`}>
                                        {newsData?.status[0].toUpperCase()}{newsData?.status.slice(1)}
                                    </button> :
                                    <p className={`inline-flex items-center rounded-md hover:bg-gray-300 px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer ${getStatusColor(newsData?.status ? newsData.status : 'draft')}`}>
                                        {newsData?.status[0].toUpperCase()}{newsData?.status.slice(1)}
                                    </p>
                            }
                            {newsData && hasPermission('news-edit-status') && (<NewsStatusModal news={newsData} open={isStatusOpen} newsId={newsData?.id || 0} onClose={() => setIsStatusOpen(false)} />)}
                            {
                                ((MyAccount('id') === newsData?.user_id && hasPermission('news-edit')) || hasPermission('news-edit-all')) &&
                                <Link href={`/news/view/${slug}/edit`} className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer">
                                    <FontAwesomeIcon icon={faPen} />
                                </Link>
                            }
                            {hasPermission('news-delete') && <button type='button' onClick={() => setIsOpen((prev) => !prev)} className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></button>}
                        </div>
                    </div>

                    {
                        newsData?.status === 'rejected' &&
                        <div className='w-full flex flex-col items-end xl:px-40 bg-red-400/20 rounded-lg p-5'>
                            <p className='w-full text-left'>
                                {newsData?.rejection_date
                                    ? new Date(newsData.rejection_date).toLocaleString("id-ID", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Asia/Jakarta",
                                        hour12: false,
                                    }) + " WIB"
                                    : "N/A"}
                            </p>
                            <p className='w-full'>{newsData.rejection_reason}</p>
                            <p>- {newsData.rejected_by}</p>
                        </div>
                    }

                    <div className='w-full flex flex-col items-center xl:px-40'>
                        <p className="w-full text-3xl text-center font-bold uppercase">{newsData?.title}</p>
                        <p className="w-full text-lg text-center">{newsData?.sub_title}</p>
                        <p className="text-sm font-semibold">{newsData?.user_name} - Neswara</p>
                        <p className="text-sm font-light">
                            {newsData?.created_at
                                ? new Date(newsData.created_at).toLocaleString("id-ID", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Asia/Jakarta",
                                    hour12: false,
                                }) + " WIB"
                                : "N/A"}
                        </p>
                    </div>
                    <Image src={`/news/${newsData?.news_images[0].file_path}`} alt='News Thumbnail' width={1000} height={400} className='rounded-lg' priority />


                    <div className='w-full xl:px-40'>
                        <NewsContent content={newsData?.content} />
                    </div>

                    <div className='w-full xl:px-40'>
                        <div className='w-full flex items-center justify-between text-lg'>
                            <div className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faEye} />
                                <p>{newsData?.total_hit}</p>
                            </div>
                            <div className='flex items-center gap-5'>
                                <div className='flex items-center gap-2'>
                                    <button type="button" onClick={ToggleLike}>
                                        {
                                            newsData?.isLiked || 0 > 0 ?
                                                <FontAwesomeIcon icon={faThumbsUp} /> :
                                                <FontAwesomeIcon icon={faThumbsUpEmpty} />
                                        }
                                    </button>
                                    <button type='button' onClick={() => setIsLikesOpen(true)}>
                                        <p>{newsData?.likes_count.toString().padStart(3, '0')}</p>
                                    </button>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button type="button">
                                        <FontAwesomeIcon icon={faMessage} />
                                    </button>
                                    <p>{newsData?.comments_count}</p>
                                </div>
                            </div>
                        </div>

                        <hr className='w-full my-5' />

                        <ul className='w-full flex items-center gap-3 flex-wrap'>
                            {newsData?.tags.map((tag) => (
                                <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder pointer-events-none" key={tag.id}>
                                    <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                    {tag.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full xl:px-40'>
                        {newsId !== 0 && hasPermission('comment-list') && <CommentSection type='news' sourceId={newsId} />}
                    </div>
                </div>
            </div >

            {isOpen && hasPermission('news-delete') && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure you want to delete this news article?</h3>
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
                                    onClick={DeleteNews}
                                    type='button'
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {
                isLikesOpen &&
                <Modal
                    title='Liked by'
                    onClose={() => setIsLikesOpen(false)}
                    useButton={false}
                >
                    <ul className='w-full flex flex-col items-center gap-3'>
                        {
                            likeData?.map((like, index) => (
                                <li className='w-full flex items-center gap-4' key={index}>
                                    <Image src={`/${like.user_photo}`} alt='User Photo' width={45} height={45} className='rounded-full' />
                                    <div className='w-full flex flex-col items-start'>
                                        <p className='font-semibold text-lg flex items-center gap-2'>{like.username} {MyAccount('email') === like.user_email ? <span className='text-xs text-center p-1 bg-backgroundHover dark:bg-darkBackgroundHover rounded-md'>[You]</span> : ''}</p>
                                        <p className='text-gray-500'>{like.user_email}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </Modal>
            }
            <Footer />
        </>
    );
}
