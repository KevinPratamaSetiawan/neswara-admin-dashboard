"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import SearchSelect from '@/components/combobox';
import Footer from '@/components/footer';
import { Toast } from '@/components/toastList';
import { Category, handleFetchCategoryList } from '@/utils/categoryUtilities';
import { Tag, handleFetchTagList } from '@/utils/tagsUtilities';
import { handleFetchVideoBySlug, handleUpdateVideo } from '@/utils/videoUtilities';
import { faArrowLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageAccessCheck } from '@/utils/accessCheck';

function YouTubeGetID(url: any) {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

export default function EditVideo({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentId, setContentId] = useState('');
    const [category, setCategory] = useState<number>(0);
    const [categoryDatas, setCategoryDatas] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagDatas, setTagDatas] = useState<Tag[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const params = React.use(paramsPromise);
    const { slug } = params;
    const router = useRouter();

    const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const videoId = YouTubeGetID(e.target.value);

        setContentId(videoId);
    };

    const handleTagSelection = (tag: Tag, isChecked: boolean) => {
        if (isChecked) {
            setTags((prevTags) => [...prevTags, tag]);
            setTagDatas((prevTags) => prevTags.filter((t) => t.id !== tag.id));
        } else {
            setTagDatas((prevTags) => [...prevTags, tag]);
            setTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
        }
    };

    const handleUpdate = async () => {
        const response = await handleUpdateVideo(id, title, description, contentId, category, tags);

        if (response.status === 200 && response.message && response.slug) {
            Toast('success', response.message);
            router.push(`/videos/view/${response.slug}`);
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const response = await handleFetchVideoBySlug(slug);

            if (response.status === 200 && response.data) {
                setId(response.data.id);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setContentId(response.data.content_id);
                setCategory(response.data.category_id);
                setTags(response.data.tags);
            } else if (response.message) {
                Toast('error', response.message);
            }
        }

        const fetchCategoryList = async () => {
            const response = await handleFetchCategoryList(1, 1000, 'ASC');

            if (response.status === 200 && response.categories) {
                setCategoryDatas(response.categories);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        const fetchTagList = async () => {
            const response = await handleFetchTagList(1, 1000, 'ASC');

            if (response.status === 200 && response.tags) {
                setTagDatas(response.tags);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        fetchCategoryList();
        loadData();
        fetchTagList();
    }, []);

    return (
        <>
            <PageAccessCheck permission={['video-edit', 'video-edit-all']} />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-4 shadow-lg'>
                    <div className='w-full flex items-start'>
                        <button onClick={() => setIsOpen((prev) => !prev)} type='button' className='button-hover rounded-full px-3 py-2'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </div>

                    <div className='flex flex-col items-center gap-3'>
                        <iframe
                            className='rounded-lg border-2 border-border dark:border-darkBorder object-cover aspect-video lg:w-[800px] lg:h-[400px]'
                            src={`https://www.youtube.com/embed/${contentId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                        <input
                            type="text"
                            value={contentId}
                            onChange={handleVideo}
                            placeholder='Youtube Video Link...'
                            className="w-full max-w-[400px] p-1 text-base font-light border-2 border-text dark:border-darkText rounded-md bg-card dark:bg-darkCard"
                        />
                    </div>

                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={1}
                        placeholder="Video Title..."
                        className="w-full px-1 py-2 text-xl font-bold border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard"
                    />

                    <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={1}
                            placeholder="Description..."
                            className="w-full p-1 text-base font-light border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard"
                        />
                        <SearchSelect data={categoryDatas} value={category} onChange={setCategory} className='w-full md:max-w-[200px]' />
                    </div>

                    <div className='w-full flex items-center justify-center'>
                        <details className='w-full flex flex-col items-center gap-5'>
                            <summary className='w-full list-none flex flex-col items-start gap-3'>
                                <div className='w-full flex items-center justify-between'>
                                    <div className='cursor-pointer flex items-center gap-1'>
                                        <FontAwesomeIcon icon={faCaretRight} />
                                        <p>Tags :</p>
                                    </div>
                                    <span className='px-2 py-1 rounded-md bg-primary text-darkText text-xs font-bold'>{tags.length}</span>
                                </div>
                                <ul className='w-full flex items-center gap-3 flex-wrap'>
                                    {tags.map((tag) => (
                                        <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-card dark:bg-darkCard hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder cursor-pointer" key={tag.id}>
                                            <button type='button' onClick={() => handleTagSelection(tag, false)} className='flex items-center gap-2'>
                                                <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                                {tag.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </summary>

                            <ul className='w-full flex items-start gap-3 flex-wrap border-t-2 border-border dark:border-darkBorder py-5'>
                                {tagDatas.map((tag) => (
                                    <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-card dark:bg-darkCard hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder cursor-pointer" key={tag.id}>
                                        <button type='button' onClick={() => handleTagSelection(tag, true)} className='flex items-center gap-2'>
                                            <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                            {tag.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>

                    <div className="w-full flex items-center justify-end gap-2 mt-auto">
                        <button
                            type='button'
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"
                        >Cancel</button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                        >Save</button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure? Your draft won't be saved.</h3>
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
                                <a
                                    href='/videos'
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Yes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}
