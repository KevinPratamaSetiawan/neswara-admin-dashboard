"use client";

import { UserCard } from '@/components/Cards';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import { Toast } from '@/components/toastList';
import { PageAccessCheck } from '@/utils/accessCheck';
import { Meta } from '@/utils/newsUtilities';
import { User, handleFetchUserList } from '@/utils/userUtilities';
import { faCalendar, faGroupArrowsRotate, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function User() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [metaData, setMetaData] = useState<Meta>({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [userDatas, setUserDatas] = useState<User[]>([]);

    // Filter
    const [trySearch, setTrySearch] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [order, setOrder] = useState<string>('ASC');
    const statuses = ['All', 'Super Administrator', 'Administrator', 'Developer', 'Editor', 'Writer', 'Moderator', 'Viewer', 'Banned'];
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const fetchUserList = async () => {
        const response = await handleFetchUserList(searchTerm, currentPage, limitPage, order, selectedStatus);

        if (response.status === 200 && response.users && response.meta) {
            setMetaData(response.meta);
            setUserDatas(response.users);
        } else if (response.message) {
            Toast('error', response.message);
            setMetaData({
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 1
            });
            setUserDatas([]);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [currentPage, limitPage, searchTerm, order, selectedStatus]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <PageAccessCheck permission={['user-list']} />
            <Header />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex items-center justify-start'>
                    <p className='text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight'>User</p>
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='w-full flex flex-col md:flex-row items-stretch gap-3'>
                        <div className='w-full border-2 border-border dark:border-darkBorder rounded-lg overflow-hidden flex items-center button-ring transition-colors'>
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
                        <button className='flex items-center justify-center gap-2 button-hover px-3 py-2 text-text dark:text-darkText border-2 border-border dark:border-darkBorder rounded-lg transition-colors' type='button' onClick={() => {
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
                    <div className="w-full flex items-center justify-center border-b border-secondaryText dark:border-darkSecondaryText pb-2">
                        <ul className="w-full flex items-center xl:justify-center gap-1 md:gap-4 overflow-x-auto overflow-y-hidden">
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
                    <div className='table w-full border-collapse'>
                        {
                            metaData.totalItems ?
                                <>
                                    <div className='table-row text-left font-medium text-secondaryText dark:text-darkSecondaryText'>
                                        <div className='table-cell px-3'>User</div>
                                        <div className='table-cell px-3'>Role</div>
                                        <div className='hidden md:table-cell px-3'>Status</div>
                                    </div>

                                    {userDatas?.map((user, index) => (
                                        <UserCard user={user} refetch={() => fetchUserList()} key={index} />
                                    ))}
                                </>
                                :
                                <div className='table-row'>
                                    <div className='table-cell w-full text-center py-4 text-secondaryText dark:text-darkSecondaryText'>No user available.</div>
                                </div>
                        }
                    </div>

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
