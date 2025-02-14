"use client";

import { CategoryCard } from '@/components/Cards';
import CategoryModal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import { Toast } from '@/components/toastList';
import { RoleContext } from '@/provider/Provider';
import { PageAccessCheck } from '@/utils/accessCheck';
import { Category, CategoryIcon, IconName, handleAddCategory, handleFetchCategoryBySearch } from '@/utils/categoryUtilities';
import { Meta } from '@/utils/newsUtilities';
import { faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';

export default function Categories() {
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
    const [categoryDatas, setCategoryDatas] = useState<Category[]>([]);

    // Filter
    const [trySearch, setTrySearch] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [order, setOrder] = useState<string>('ASC');

    const fetchCategoryList = async () => {
        const response = await handleFetchCategoryBySearch(searchTerm, currentPage, limitPage, order);

        if (response.status === 200 && response.categories && response.meta) {
            setMetaData(response.meta);
            setCategoryDatas(response.categories);
        } else if (response.message) {
            Toast('error', response.message);
            setMetaData({
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 1
            });
            setCategoryDatas([]);
        }
    };

    useEffect(() => {
        fetchCategoryList();
    }, [currentPage, limitPage, searchTerm, order]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Add Section
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [categoryIcon, setCategoryIcon] = useState('Staff Snake');
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');

    const AddCategory = async () => {
        const response = await handleAddCategory(categoryName, categoryDesc, categoryIcon);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsAddOpen(false);
            fetchCategoryList();
            setCategoryIcon('Staff Snake');
            setCategoryName('');
            setCategoryDesc('')
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <PageAccessCheck permission={['category-list']} />
            <Header />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex items-center justify-between'>
                    <p className='text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight mr-auto'>Category</p>
                    {hasPermission('category-create') && <button onClick={() => setIsAddOpen((prev) => !prev)} className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/80 button-ring' type='button'>Add Category</button>}
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
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='table w-full border-collapse'>
                        {
                            metaData.totalItems ?
                                <>
                                    <div className='table-row text-left font-medium text-secondaryText dark:text-darkSecondaryText'>
                                        <div className='table-cell px-3'>Icon</div>
                                        <div className='table-cell px-3'>Name - Description</div>
                                    </div>

                                    {categoryDatas?.map((category, index) => (
                                        <CategoryCard category={category} refetch={() => fetchCategoryList()} key={index} />
                                    ))}
                                </>
                                :
                                <div className='table-row'>
                                    <div className='table-cell w-full text-center py-4 text-secondaryText dark:text-darkSecondaryText'>No category available.</div>
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

            {isAddOpen && hasPermission('category-create') &&
                <CategoryModal
                    title='New Category'
                    useButton={true}
                    onClose={() => setIsAddOpen(false)}
                    handleModal={AddCategory}
                    isGreen={true}
                    buttonText='Add'
                >
                    <div className='w-full flex flex-col md:flex-row items-bottom gap-5'>
                        <div className='w-full md:w-1/2 flex flex-col items-center justify-end gap-5'>
                            <div className="w-16">{CategoryIcon(categoryIcon)}</div>
                            <select
                                value={categoryIcon}
                                onChange={(e) => setCategoryIcon(e.target.value)}
                                className='text-center bg-card dark:bg-darkCard border-b-2 border-text dark:border-darkText py-2'
                            >
                                {
                                    IconName.map((icon, index) => (
                                        <option value={icon} key={index}>{icon}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='w-full md:w-1/2 flex flex-col items-center gap-3'>
                            <input
                                type="text"
                                placeholder='Name...'
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className='w-full bg-card dark:bg-darkCard border-b-2 border-text dark:border-darkText p-2'
                            />
                            <textarea
                                rows={5}
                                placeholder="Description..."
                                value={categoryDesc}
                                onChange={(e) => setCategoryDesc(e.target.value)}
                                className="w-full p-2 text-base font-light border-b-2 border-text dark:border-darkText bg-card dark:bg-darkCard"
                            />
                        </div>
                    </div>
                </CategoryModal>
            }

            <Footer />
        </>
    );
}
