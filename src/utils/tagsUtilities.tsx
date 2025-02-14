import axios from 'axios';
import { useRouter } from 'next/navigation';

export type Tag = {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

export type Meta = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

type Response = {
    status?: number;
    message?: string;
    meta?: Meta;
    tag?: Tag;
    tags?: Tag[];
    total?: number;
    slug?: string;
    error?: string;
};

export async function handleFetchTagList(
    currentPage: number,
    limitPage: number,
    order: string,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags?page=${currentPage}&limit=${limitPage}&order=${order}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                tags: response.data.tags
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching tag list:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchTagBySlug(slug: string): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/view/${slug}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                tag: response.data.category
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching tag:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchTagBySearch(
    searchTerm: string,
    currentPage: number,
    limitPage: number,
    order: string,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/search?page=${currentPage}&limit=${limitPage}&search=${searchTerm}&order=${order}`, {
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
                tags: response.data.data
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching tags:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleAddTag(
    name: string,
    description: string,
    color: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/add`, {
            name, description, color
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message
        };
    } catch (err: any) {
        console.error('Error creating new tag:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleUpdateTag(
    tagId: number,
    name: string,
    color: string,
    description: string,
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/edit/${tagId}`,
            {
                name, color, description
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
        console.error('Error updating tag:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleDeleteTag(tagId: number): Promise<Response> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/delete/${tagId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error deleting tag:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}
