"use client";

import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TagCard from '@/components/tagCard';
import { fetchTags } from '@/utils/tagsUtilities';

type TagProp = {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

type TagMetaProp = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export default function Tags() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [tagDatas, setTagDatas] = useState<TagProp[]>([]);
    const [metaDatas, setMetaDatas] = useState<TagMetaProp>({
        currentPage: 1,
        itemsPerPage: 1,
        totalItems: 1,
        totalPages: 1
    });
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            await fetchTags(currentPage, limitPage, setTagDatas, setMetaDatas);
        };

        loadData()
    }, [currentPage, limitPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Header />
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center md:px-16 md:py-8">
                <div className="bg-white w-full min-h-[80vh] h-full px-10 py-8 rounded-3xl shadow-lg flex flex-col">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Tags</h2>
                        </div>
                        <div className="mt-5 flex lg:ml-4 lg:mt-0">
                            <span className="lg:ml-3">
                                <Link
                                    href={`/tags/new`}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    + New
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-2 flex flex-col">
                        <div className="space-y-2 h-full">
                            {tagDatas.length > 0 ? (
                                tagDatas.map((tag, index) => (
                                    <TagCard tag={tag} reFetchData={() => fetchTags(currentPage, limitPage, setTagDatas, setMetaDatas)} key={index} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No categories found.</p>
                            )}
                        </div>

                        {
                            tagDatas.length > 0 ?
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
