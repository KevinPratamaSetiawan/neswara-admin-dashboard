"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Footer from '@/components/footer';
import { type } from 'os';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { fetchNews } from '@/utils/newsUtilities';

type News = {
    id: number;
    title: string;
    sub_title: string;
    slug: string;
    content: string;
    user_id: number;
    category_id: number;
    status: 'draft' | 'published' | 'approved' | 'rejected' | 'archived';
    total_hit: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user_name: string;
    category_name: string;
    tags: string;
};

const getStatusColor = (status: 'draft' | 'published' | 'approved' | 'rejected' | 'archived') => {
    const colors = {
        draft: 'bg-gray-100 text-gray-700',
        published: 'bg-green-100 text-green-700',
        approved: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        archived: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
};

const NewsContent = ({ content }: any) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

export default function EditNews({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = React.use(paramsPromise);
    const { slug } = params;
    const [newsData, setNewsData] = useState<News>();


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchNews(slug);
            setNewsData(data)
        }

        loadData();
    }, []);

    return (
        <>
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center md:px-16 md:py-8">
                <div className="bg-white w-full min-h-[90vh] h-full px-10 py-8 rounded-3xl shadow-lg flex flex-col items-start gap-2">
                    <div className="w-full flex items-center justify-between mb-4">
                        <Link href="/news" className="bg-white text-black px-2 py-1 rounded-lg transition-colors duration-300 hover:bg-gray-700 hover:text-white"><FontAwesomeIcon icon={faArrowLeftLong} /></Link>
                        <Link href={`/news/${slug}/edit`} className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Edit
                        </Link>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-3xl font-semibold text-gray-800">{newsData?.title || ''}</h1>
                        <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium ${getStatusColor(newsData?.status ?? 'draft')}`}>
                            {newsData?.status ? newsData.status.charAt(0).toUpperCase() + newsData.status.slice(1) : 'Draft'}
                        </p>
                    </div>

                    <p className="text-lg text-gray-500 mb-4">{newsData?.sub_title}</p>

                    <div className="w-full mb-6">
                        <NewsContent content={newsData?.content} />
                    </div>

                    <div className="w-full flex items-center justify-between mt-auto">
                        <p className="text-sm text-gray-500">Views: {newsData?.total_hit}</p>
                        <p className="text-sm text-gray-500">{newsData?.category_name}</p>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <p className="text-sm text-gray-500">by: {newsData?.user_name}</p>
                        <p className="text-sm text-gray-500">
                            {newsData?.updated_at ? new Date(newsData.updated_at).toLocaleString() : 'No date available'}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
