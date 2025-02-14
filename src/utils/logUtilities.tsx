import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export type UserActivity = {
    id: number;
    status: string;
    action: string;
    object: string;
    user_id: number;
    user_email: string;
    role_id: number;
    role: string;
    description: string;
    ip_address: string;
    device: string;
    created_at: string;
};

export type UserFilter = {
    id: number;
    email: string;
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
    userActivity?: UserActivity[];
    error?: string;
};

export async function handleFetchUserActivity(
    search: string,
    page: number,
    limit: number,
    order: string,
    action: string,
    resource: string,
    user: UserFilter[],
    date: Date,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/user-activity?page=${page}&limit=${limit}&order=${order}`,
            {
                search, action, resource, user, date
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
                meta: response.data.meta,
                userActivity: response.data.data
            };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error fetching user activity data:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};