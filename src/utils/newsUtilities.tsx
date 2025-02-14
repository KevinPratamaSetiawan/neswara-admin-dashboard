import axios from 'axios';
import dotenv from 'dotenv';
import { Tag } from './tagsUtilities';
dotenv.config();

export type News = {
    id: number;
    title: string;
    sub_title: string;
    slug: string;
    content: string;
    user_id: number;
    category_id: number;
    status: 'draft' | 'published' | 'archived' | 'approved' | 'rejected';
    total_hit: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    user_name: string;
    user_photo: string;
    category_name: string;
    category_icon: string;
    likes_count: number;
    isLiked: number;
    comments_count: number;
    news_images: {
        file_path: string;
        file_type: string;
    }[];
    tags: Tag[];
    rejection_reason: string;
    rejected_by: string;
    rejection_date: string;
};

export type Comment = {
    id: number;
    news_id: number;
    user_id: number;
    email: string;
    name: string;
    photo: string;
    parent_id: number;
    content: string;
    created_at: string;
    updated_at: string;
};

export type Meta = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export type Response = {
    total?: number;
    status?: number;
    message?: string;
    meta?: Meta;
    data?: News;
    datas?: News[];
    slug?: string;
    error?: string;
    comments?: Comment[];
};

export async function handleFetchNewsList(
    currentPage: number,
    limitPage: number,
    selectedStatus: string,
    order: string,
): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news?page=${currentPage}&limit=${limitPage}&status=${selectedStatus.toLowerCase()}&order=${order}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                datas: response.data.data
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error("Error fetching news:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchNewsBySlug(slug: string): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news/article/${slug}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                data: response.data.news
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchNewsBySearch(
    searchTerm: string,
    currentPage: number,
    limitPage: number,
    order: string,
    selectedCategory: number,
    selectedStatus: string,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news/search?page=${currentPage}&limit=${limitPage}&search=${searchTerm}&category=${selectedCategory}&status=${selectedStatus.toLowerCase()}&order=${order}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            validateStatus: () => true,
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                datas: response.data.data
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleAddNews(
    title: string,
    subTitle: string,
    content: string,
    image: string,
    category: number,
    tags: Tag[],
): Promise<Response> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/add`,
            {
                title,
                sub_title: subTitle,
                content: content,
                image: image,
                category_id: category,
                tags: tags
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message
        };
    } catch (err: any) {
        console.error('Error saving news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleUpdateNews(
    newsId: number,
    title: string,
    subTitle: string,
    content: string,
    image: string,
    category: number,
    tags: Tag[],
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/edit/${newsId}`,
            {
                title,
                sub_title: subTitle,
                category_id: category,
                image,
                content,
                tags: tags
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                slug: response.data.slug
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error saving news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleUpdateNewsStatus(
    newsId: number,
    status: string,
    reason: string,
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/update-status/${newsId}`,
            {
                status, reason
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error setting news status:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleDeleteNews(
    newsId: number,
): Promise<Response> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news/delete/${newsId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error deleting news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export const getStatusColor = (status: 'draft' | 'published' | 'approved' | 'rejected' | 'archived' | 'live') => {
    const colors = {
        draft: 'bg-gray-100 text-gray-700',
        published: 'bg-green-100 text-green-700',
        approved: 'bg-blue-100 text-blue-700',
        rejected: 'bg-red-100 text-red-700',
        live: 'bg-red-100 text-red-700',
        archived: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
};

// Comment Section
export async function handleFetchComments(
    type: string,
    id: number,
    order: string,
    currentPage: number,
    limitPage: number,
    parentId: number | null,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${type}/${id}?parent=${parentId}&page=${currentPage}&limit=${limitPage}&order=${order}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            validateStatus: () => true,
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                total: response.data.total,
                comments: response.data.data
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching comment:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleAddComment(
    type: string,
    sourceId: number,
    parentId: number | null,
    content: string,
): Promise<Response> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${type}/add`,
            {
                sourceId, parentId, content
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message
        };
    } catch (err: any) {
        console.error('Error saving comment:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleEditComment(
    type: string,
    id: number,
    content: string,
): Promise<Response> {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${type}/edit/${id}`,
            {
                content,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error deleting comment:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleDeleteComment(
    type: string,
    id: number,
): Promise<Response> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${type}/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error deleting comment:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}