"use client";

import NewsCard from '@/components/newsCard';
import Pagination from '@/components/pagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { fetchNewsList } from '@/utils/newsUtilities';

type NewsProp = {
    id: number;
    title: string;
    sub_title: string;
    slug: string;
    content: string;
    user_name: string;
    category_name: string;
    status: 'draft' | 'published' | 'archived';
    total_hit: number;
    published_at: string;
    created_at: string;
    updated_at: string;
};

type NewsMetaProp = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(5);
    const [newsDatas, setNewsDatas] = useState<NewsProp[]>([]);
    const [metaDatas, setMetaDatas] = useState<NewsMetaProp>({
        currentPage: 1,
        itemsPerPage: 1,
        totalItems: 1,
        totalPages: 1
    });
    const [selectedStatus, setSelectedStatus] = useState('All');
    const statuses = ['All', 'Draft', 'Published', 'Approved', 'Rejected', 'Archived'];
    const [toastList, setToastList] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchNewsList(currentPage, limitPage, selectedStatus, setNewsDatas, setMetaDatas, router);
    }, [currentPage, limitPage, selectedStatus]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (toastList.length === 0) return;

        const timer = setTimeout(() => {
            setToastList((prev) => prev.slice(1));
        }, 3000);

        return () => clearTimeout(timer);
    }, [toastList])

    return (
        <>
            <Header />
            <div className='fixed bottom-0 right-0 z-50 space-y-2 p-4'>
                {
                    toastList.map((toast, index) => (
                        <div className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow" key={index}>
                            <div className="text-sm font-normal">{toast}</div>
                        </div>
                    ))
                }
            </div>
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center md:px-16 md:py-8">
                <div className="bg-white w-full min-h-[80vh] h-full px-10 py-8 rounded-3xl shadow-lg flex flex-col">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">News</h2>
                        </div>
                        <div className="mt-5 flex lg:ml-4 lg:mt-0">
                            <span className="lg:ml-3">
                                <Link
                                    href={`/news/new`}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    + New
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-2 flex flex-col">
                        <div className="flex items-center space-x-4 border-b pb-4">
                            <ul className="w-full flex space-x-4 overflow-x-scroll overflow-y-hidden">
                                {statuses.map((status) => (
                                    <li key={status}>
                                        <button
                                            className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedStatus === status ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                            onClick={() => { setSelectedStatus(status); setCurrentPage(1) }}
                                        >
                                            {status}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-2 h-full">
                            {newsDatas.length > 0 ? (
                                newsDatas.map((news, index) => (
                                    <NewsCard key={index} news={news} setToast={setToastList} reFetchData={() => fetchNewsList(currentPage, limitPage, selectedStatus, setNewsDatas, setMetaDatas, router)} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">
                                    No news articles found for the <span className='font-bold'>{selectedStatus}</span> status.
                                </p>
                            )}
                        </div>

                        {
                            newsDatas.length > 0 ?
                                <Pagination
                                    currentPage={currentPage}
                                    itemsPerPage={metaDatas.itemsPerPage}
                                    totalItems={metaDatas.totalItems}
                                    totalPages={metaDatas.totalPages}
                                    onPageChange={handlePageChange}
                                /> : null
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
