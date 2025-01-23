import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export type NewsProp = {
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

export type NewsMetaProp = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

type Response = {
    status?: number;
    message?: string;
    meta?: NewsMetaProp;
    data?: NewsProp;
    slug?: string;
    error?: string;
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
                data: response.data.data
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
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news/search?page=${currentPage}&limit=${limitPage}&search=${searchTerm}&order=${order}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                data: response.data.data
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
    category: number,
    tags: number[],
): Promise<Response> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/add`,
            {
                title,
                sub_title: subTitle,
                content: content,
                category_id: category,
                tags_id: tags
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
    category: number,
    tags: number[],
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/edit/${newsId}`,
            {
                title,
                sub_title: subTitle,
                category_id: category,
                content,
                tags_id: tags
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
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/news/update-status/${newsId}`,
            {
                status
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