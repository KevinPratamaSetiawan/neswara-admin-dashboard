"use client";

import axios from 'axios';
import Dropdown from './dropdown';
import Link from 'next/link'
import { deleteNews } from '@/utils/newsUtilities';

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

type NewsCardProps = {
    news: NewsProp;
    setToast: React.Dispatch<React.SetStateAction<string[]>>;
    reFetchData: () => void;
};

export default function NewsCard({ news, setToast, reFetchData }: NewsCardProps) {
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

    const onDelete = async () => {
        deleteNews(news.id, setToast, reFetchData);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-stretch justify-between gap-2">
                <div className="space-y-4 flex-1 overflow-hidden">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}>
                        {news.status.charAt(0).toUpperCase() + news.status.slice(1)}
                    </span>

                    <div className="w-full space-y-1 text-nowrap overflow-x-clip">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            <Link href={`/news/${news.slug}`}>{news.title}</Link>
                        </h3>
                        <p className="text-sm text-gray-500">
                            {news.sub_title}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between space-y-4">
                    <Dropdown onDelete={onDelete} />
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            {news.category_name}
                        </span>
                        <div className="hidden sm:flex items-center space-x-2">
                            <span>
                                {news.user_name}
                            </span>
                            <span>•</span>
                            <span>
                                {new Date(news.created_at).toISOString().split("T")[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
