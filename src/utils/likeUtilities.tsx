import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export type Like = {
    user_id: number;
    username: string;
    user_email: string;
    user_photo: string;
    news_id: number;
}

export type Response = {
    status?: number;
    message?: string;
    isLiked?: boolean
    like?: Like;
    likes?: Like[];
    total?: number;
    error?: string;
};

export async function handleFetchLike(
    slug: string,
): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/${slug}/like`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                validateStatus: () => true,
            }
        );

        return {
            status: response.status,
            message: response.data.message,
            isLiked: response.data.data
        };
    } catch (err: any) {
        console.error("Error fetching like:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchLikesListByUser(): Promise<Response> {
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

export async function handleFetchLikesListInNews(newsId: number): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/news-likes-list/${newsId}`, {
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

export async function handleToggleLike(
    newsId: number
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/toggle-like/${newsId}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            status: response.status,
            message: response.data.message
        };
    } catch (err: any) {
        console.error('Error toggle like:', err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
}