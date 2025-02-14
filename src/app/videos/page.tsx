"use client";

import SearchSelect from '@/components/combobox';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import { Toast } from '@/components/toastList';
import { VideoCard } from '@/components/Cards';
import { Category, handleFetchCategoryList } from '@/utils/categoryUtilities';
import { Meta, Video, handleFetchVideoBySearch } from '@/utils/videoUtilities';
import { faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { RoleContext } from '@/provider/Provider';
import { PageAccessCheck } from '@/utils/accessCheck';

export default function Video() {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [metaData, setMetaData] = useState<Meta>({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [videoDatas, setVideoDatas] = useState<Video[] | undefined>([]);
    const [categoryDatas, setCategoryDatas] = useState<Category[]>([]);
    const statuses = ['All', 'Draft', 'Published', 'Live', 'Archived'];

    // Filter
    const [trySearch, setTrySearch] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number>(-1);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [order, setOrder] = useState<string>('ASC');

    useEffect(() => {
        const fetchVideoList = async () => {
            const response = await handleFetchVideoBySearch(searchTerm, currentPage, limitPage, order, selectedCategory, selectedStatus);

            if (response.status === 200 && response.datas && response.meta) {
                setMetaData(response.meta);
                setVideoDatas(response.datas);
            } else if (response.status === 404 && response.message) {
                setMetaData({
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0,
                    totalPages: 1
                });
                setVideoDatas([])
                Toast('error', response.message);
            } else if (response.message) {
                setMetaData({
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalItems: 0,
                    totalPages: 1
                });
                setVideoDatas([])
                Toast('error', response.message);
            }
        };

        fetchVideoList();
    }, [currentPage, limitPage, searchTerm, selectedCategory, selectedStatus, order]);

    useEffect(() => {
        const fetchCategoryList = async () => {
            const response = await handleFetchCategoryList(1, 1000, 'ASC');

            if (response.status === 200 && response.categories) {
                setCategoryDatas(response.categories);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        fetchCategoryList();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <PageAccessCheck permission={['video-list']} />
            <Header />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex items-center justify-between'>
                    <p className='text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight mr-auto'>Video</p>
                    {hasPermission('video-create') && <a className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/80 button-ring' href='/videos/new'>Add Video</a>}
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='w-full flex flex-col md:flex-row items-stretch gap-3'>
                        <div className='w-full md:w-1/2 border-2 border-border dark:border-darkBorder rounded-lg overflow-hidden flex items-center button-ring transition-colors'>
                            <input
                                value={trySearch}
                                onChange={(e) => setTrySearch(e.target.value)}
                                type="text"
                                placeholder="Search..."
                                className='px-3 flex-1 outline-none bg-transparent text-sm text-text dark:text-darkText placeholder:text-secondaryText dark:placeholder:text-darkSecondaryText'
                            />
                            <button className='px-4 py-2 button-hover rounded-e-lg text-secondaryText dark:text-darkSecondaryText hover:text-text dark:hover:text-darkText transition-colors' onClick={() => setSearchTerm(trySearch)}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className='w-4 h-4' />
                            </button>
                        </div>
                        <div className='w-full md:w-1/2 overflow-hidden flex items-center gap-3'>
                            <SearchSelect data={categoryDatas} value={selectedCategory} onChange={setSelectedCategory} className='w-3/5 md:w-4/5' />
                            <button className='w-2/5 md:w-1/5 flex items-center justify-center gap-2 button-hover px-3 py-2 text-text dark:text-darkText border-2 border-border dark:border-darkBorder rounded-lg transition-colors' type='button' onClick={() => {
                                if (order === 'ASC') {
                                    setOrder('DESC');
                                    setCurrentPage(1);
                                } else {
                                    setOrder('ASC');
                                    setCurrentPage(1);
                                }
                            }}>
                                <FontAwesomeIcon icon={faCalendar} />
                                {
                                    order === 'ASC' ? 'Oldest' : 'Recent'
                                }
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center border-b border-secondaryText dark:border-darkSecondaryText pb-2">
                        <ul className="w-full flex items-center sm:justify-center gap-1 md:gap-4 overflow-x-auto overflow-y-hidden">
                            {statuses.map((status) => (
                                <li key={status}>
                                    <button
                                        className={`whitespace-nowrap px-3 py-1 text-sm rounded-full transition-colors ${selectedStatus === status ? 'bg-backgroundHover dark:bg-darkBackgroundHover text-primary font-medium' : 'text-secondaryText dark:text-darkSecondaryText hover:text-text dark:hover:text-darkText'}`}
                                        onClick={() => { setSelectedStatus(status); setCurrentPage(1) }}
                                    >
                                        {status}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <table className='w-full border-collapse'>
                        <tbody className='w-full'>
                            {
                                metaData.totalItems ?
                                    <>
                                        <tr className='text-left font-medium text-secondaryText dark:text-darkSecondaryText'>
                                            <th className='px-3'>Status</th>
                                            <th className='px-3'>Title</th>
                                            <th className='px-3 hidden lg:table-cell'>Category</th>
                                            <th className='px-3 hidden xl:table-cell'>Author</th>
                                        </tr>

                                        {videoDatas?.map((video, index) => (
                                            <VideoCard video={video} key={index} />
                                        ))}
                                    </>
                                    :
                                    <tr>
                                        <td colSpan={4} className='text-center py-4 text-secondaryText dark:text-darkSecondaryText'>No video available.</td>
                                    </tr>
                            }
                        </tbody>
                    </table>

                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={limitPage}
                        totalItems={metaData.totalItems}
                        totalPages={metaData.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}
