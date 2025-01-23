import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

type Like = {
    user_id: number;
    news_id: number;
}

type Response = {
    status?: number;
    message?: string;
    like?: Like;
    likes?: Like[];
    total?: number;
    error?: string;
};

export async function handleFetchLike(
    newsId: number,
): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/${newsId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (err: any) {
        console.error("Error fetching like:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchLikesList(): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/likes-list`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                likes: response.data.data
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching likes list:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchLikesCount(
    newsId: number,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/${newsId}/count`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                total: response.data.total
            };
        } else {
            return {
                status: response.status,
                message: response.data.message
            };
        }
    } catch (err: any) {
        console.error('Error fetching likes count:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleAddNews(
    newsId: number
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/add-like/${newsId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message
        };
    } catch (err: any) {
        console.error('Error saving news:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}

export async function handleRemoveLike(
    newsId: number,
): Promise<Response> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/remove-like/${newsId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message,
        }
    } catch (err: any) {
        console.error('Error removing like:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}