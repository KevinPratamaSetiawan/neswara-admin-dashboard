"use client";

import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import { Toast } from '@/components/toastList';
import { PageAccessCheck } from '@/utils/accessCheck';
import { UserActivity, UserFilter, handleFetchUserActivity } from '@/utils/logUtilities';
import { Meta } from '@/utils/newsUtilities';
import { User, handleFetchUserList } from '@/utils/userUtilities';
import { faCalendar, faCheck, faFilter, faMagnifyingGlass, faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const filterOptions = [
    [
        "All",
        "Security Events",
        "News",
        "Video",
        "Category",
        "Tag",
        "User Account",
        "Role"
    ],
    [
        "All",
        "POST",
        "PUT",
        "DELETE"
    ]
];

export default function ActivityLog() {
    const [metaData, setMetaData] = useState<Meta>({
        currentPage: 1,
        itemsPerPage: 50,
        totalItems: 0,
        totalPages: 1
    });
    const [logDatas, setLogDatas] = useState<UserActivity[]>([]);
    const [userDatas, setUserDatas] = useState<User[]>([]);

    // Filter
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(50);
    const [order, setOrder] = useState<string>('DESC');
    const [action, setAction] = useState<string>('all');
    const [resource, setResource] = useState<string>('all');
    const [userId, setUserId] = useState(0);
    const [date, setDate] = useState<Date>(new Date());
    // Add status filter: All, Success, Error

    // User Filter
    const [userIdFilter, setUserIdFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [userList, setUserList] = useState<UserFilter[]>([]);

    const onAddUserEventHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (userFilter.trim()) {
                const newUser = userFilter
                    .split(',')
                    .map(userFilter => userFilter.trim())
                    .filter(
                        userFilter => userFilter !== "" &&
                            userDatas.some(user => user.email === userFilter)
                    )
                    .map(userFilter => ({ "id": 0, "email": userFilter }));

                let updatedUserList = [...userList, ...newUser];
                updatedUserList = Array.from(new Map(updatedUserList.map(user => [user.email, user])).values());

                setUserList(updatedUserList);
                setUserFilter('');
            }
        }
    };

    const removeUser = (index: number) => {
        const updatedUserList = [...userList];
        updatedUserList.splice(index, 1);
        setUserList(updatedUserList);
    };

    const fetchUserActivity = async () => {
        const response = await handleFetchUserActivity(searchTerm, currentPage, limitPage, order, action, resource, userList, date)

        if (response.status === 200 && response.userActivity && response.meta) {
            setMetaData(response.meta);
            setLogDatas(response.userActivity);
        } else if (response.message) {
            setMetaData({
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 1
            });
            setLogDatas([]);
        }
    };

    useEffect(() => {
        fetchUserActivity();
    }, [currentPage, limitPage, searchTerm, order, resource, action]);

    const fetchUserList = async () => {
        const response = await handleFetchUserList('', 1, 1000, 'ASC', 'all');

        if (response.status === 200 && response.users && response.meta) {
            setUserDatas(response.users);
        } else if (response.message) {
            Toast('error', response.message);
            setUserDatas([]);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <>
            <PageAccessCheck permission={['log-list']} />
            <Header />
            <div className="w-full px-2 md:px-12 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex items-center'>
                    <p className='text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight'>User Activity</p>
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='w-full flex flex-col md:flex-row items-stretch gap-3'>
                        <div className='w-full border-2 border-border dark:border-darkBorder rounded-lg overflow-hidden flex items-center button-ring transition-colors'>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Search..."
                                className='px-3 flex-1 outline-none bg-transparent text-sm text-text dark:text-darkText placeholder:text-secondaryText dark:placeholder:text-darkSecondaryText'
                            />
                            <button className='px-4 py-2 button-hover rounded-e-lg text-secondaryText dark:text-darkSecondaryText hover:text-text dark:hover:text-darkText transition-colors' onClick={() => setSearchTerm(searchTerm)}>
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
                        <button className='flex items-center justify-center gap-2 button-hover px-3 py-2 text-text dark:text-darkText border-2 border-border dark:border-darkBorder rounded-lg transition-colors' type='button' onClick={() => setIsFilterOpen((prev) => !prev)}>
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                    </div>
                    {
                        isFilterOpen &&
                        <>
                            <div className='w-full flex flex-col md:flex-row items-start gap-5 xl:px-40'>
                                {/* Action Filter */}
                                <div className='w-full md:w-1/2 flex flex-col items-start gap-4'>
                                    <div className='w-full flex flex-col items-start gap-1'>
                                        <p className='text-sm text-text/70 dark:text-darkText/70'>Action</p>
                                        <ul className='flex flex-wrap items-center gap-3'>
                                            {filterOptions[1].map((option, index) => (
                                                <li
                                                    key={index}
                                                    className='px-2 py-1 border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'
                                                >
                                                    <button
                                                        className='flex items-center gap-2'
                                                        type='button'
                                                        onClick={() => setAction(option.toLowerCase())}
                                                    >
                                                        {action === option.toLowerCase() ? (
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        )}
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'>
                                                            {option}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* Resource Type Filter */}
                                <div className='w-full md:w-1/2 flex flex-col items-start gap-4'>
                                    <div className='w-full flex flex-col items-start gap-1'>
                                        <p className='text-sm text-text/70 dark:text-darkText/70'>Resource Type</p>
                                        <ul className='flex flex-wrap items-center gap-3'>
                                            {filterOptions[0].map((option, index) => (
                                                <li
                                                    key={index}
                                                    className='px-2 py-1 text-nowrap border border-border dark:border-darkBorder w-fit rounded-lg bg-border dark:bg-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover'
                                                >
                                                    <button
                                                        className='flex items-center gap-2'
                                                        type='button'
                                                        onClick={() => setResource(option.toLowerCase())}
                                                    >
                                                        {resource === option.toLowerCase() ? (
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        )}
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'>
                                                            {option}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* <div className='w-full flex flex-col md:flex-row items-start gap-5 xl:px-40'>
                                // User Filter
                                <div className='w-full flex flex-col items-start gap-4'>
                                    <div className='w-full flex flex-col items-start gap-1'>
                                        <p className='text-sm text-text/70 dark:text-darkText/70'>User</p>
                                        <ul className='flex items-center gap-2 m-0 px-2 py-3 border border-border dark:border-darkBorder rounded-md' style={{ overflowX: 'auto', flexWrap: 'wrap' }}>
                                            {userList.map((user: UserFilter, index: number) => (
                                                <li
                                                    key={index}
                                                    className='px-2 py-1 border rounded-md flex items-center gap-2'
                                                >
                                                    {user.email}
                                                    <button
                                                        type='button'
                                                        onClick={() => removeUser(index)}
                                                        className='p-0 border-0 rounded-circle flex items-center justify-center bg-card/50'
                                                        style={{ borderRadius: '5px', width: '20px', height: '20px' }}
                                                    >
                                                        <FontAwesomeIcon icon={faX} size='2xs' className='m-0' />
                                                    </button>
                                                </li>
                                            ))}
                                            <input
                                                type="text"
                                                value={userFilter}
                                                onChange={(e) => setUserFilter(e.target.value)}
                                                onKeyDown={onAddUserEventHandler}
                                                placeholder='Add user email here..'
                                                aria-label="User"
                                                aria-describedby="user-input"
                                                className="w-auto flex-grow-1 border-0 p-0 px-2 rounded-0 bg-card dark:bg-darkCard text-text dark:text-darkText"
                                                list='user-list'
                                            />
                                            <datalist id='user-list'>
                                                {
                                                    userDatas.map((user, index) => (
                                                        <option value={user.email} key={index}></option>
                                                    ))
                                                }
                                            </datalist>
                                        </ul>
                                    </div>
                                </div>
                                // Date Filter
                                <select name="" id=""></select>
                                <input type="date" name="" id="" />
                            </div> */}

                        </>
                    }
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='w-full flex items-center justify-end'>
                        <select className='bg-card dark:bg-darkCard text-text dark:text-darkText text-center px-3 py-1 border border-border dark:border-darkBorder rounded-md' value={limitPage} onChange={(e) => setLimitPage(parseInt(e.target.value))}>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={150}>150</option>
                            <option value={200}>200</option>
                            <option value={250}>250</option>
                        </select>
                    </div>

                    <div className='table w-full border-collapse'>
                        {
                            metaData.totalItems ?
                                <>
                                    <div className='table-row text-left font-medium text-secondaryText dark:text-darkSecondaryText'>
                                        <div className='table-cell px-3 text-center'>Status</div>
                                        <div className='table-cell px-3 text-center'>Action</div>
                                        <div className='table-cell px-3'>Resource</div>
                                        <div className='hidden md:table-cell px-3'>Description</div>
                                        <div className='hidden sm:table-cell px-3 text-center lg:text-left'>Time</div>
                                        <div className='hidden lg:table-cell px-3'>User/IP Address</div>
                                    </div>

                                    {logDatas?.map((log, index) => (
                                        <div className='table-row min-h-[100px] text-base text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer' key={index}>
                                            <div className='table-cell px-3 text-center align-middle'>
                                                <span className={`text-center px-2 py-1 text-xs rounded-full text-darkText ${log.status === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{log.status[0].toUpperCase() + log.status.slice(1)}</span>
                                            </div>
                                            <div className='table-cell px-3 align-middle text-center'>
                                                <span
                                                    className={`text-center px-2 py-1 text-xs rounded-full text-darkText ${log.action === "POST" ? "bg-green-500" : log.action === "PUT" ? "bg-yellow-500" : log.action === "DELETE" ? "bg-red-500" : "bg-gray-500"}`}
                                                >
                                                    {log.action}
                                                </span>
                                            </div>
                                            <div className='table-cell px-3 align-middle text-nowrap tracking-tight'><p className='py-1'>{log.object}</p></div>
                                            <div className='hidden md:table-cell px-3 align-middle'>{log.description}</div>
                                            <div className='hidden sm:table-cell px-3 align-middle text-nowrap text-right lg:text-left'>
                                                {new Date(log.created_at).toLocaleString('en-GB', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                            </div>
                                            <div className='hidden lg:table-cell px-3 align-middle'>{log.user_email ? log.user_email : log.ip_address}</div>
                                        </div>
                                    ))}
                                </>
                                :
                                <div className='table-row'>
                                    <div className='table-cell w-full text-center py-4 text-secondaryText dark:text-darkSecondaryText'>No activity log available.</div>
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