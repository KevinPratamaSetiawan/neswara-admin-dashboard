import axios from 'axios';
import dotenv from 'dotenv';
import { jwtDecode } from 'jwt-decode';
dotenv.config();

export type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    role_id: number;
    role: string;
    no_ktp: number;
    photo: string;
    phone: number;
    last_login: string;
    active: number;
};

export type Meta = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export type Response = {
    status?: number;
    message?: string;
    token?: string;
    meta?: Meta;
    user?: User;
    users?: User[];
    error?: string;
};

type DecodedToken = {
    id: number;
    photo: string;
    email: string;
    name: string;
    role_id: number;
    iat: number;
    exp: number;
};

export const MyAccount = (need: string) => {
    const token = localStorage.getItem("token") || '';
    if (!token) return '';
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);

    if (need == 'id') {
        return decoded.id;
    } else if (need == 'photo') {
        return decoded.photo;
    } else if (need == 'email') {
        return decoded.email;
    } else if (need == 'name') {
        return decoded.name;
    } else if (need == 'role') {
        return decoded.role_id;
    }
};

export async function handleUserSignUp(
    email: string,
    username: string,
    password: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/sign-up`, {
            email,
            username,
            password,
        })

        if (response.status === 201) {
            return { status: response.status, message: response.data.message, user: response.data.user };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error registering user in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleUserVerification(
    email: string,
    code: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/verification`, {
            email,
            code,
        })

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error registering user in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleResendVerification(
    email: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/resend-verification`, {
            email,
        })

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error re-sending verification in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleLogin(
    email: string,
    password: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
            email,
            password,
        });

        if (response.status === 200) {
            return { status: response.status, message: response.data.messsage, token: response.data.token };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error logging in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handlePasswordResetRequest(
    email: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/request-password-reset`, {
            email,
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error proccessing request in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handlePasswordReset(
    email: string,
    token: string,
    newPassword: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/password-reset`, {
            email, token, newPassword
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error proccessing new password in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleLogout(): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error proccessing new password in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchUserData(): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/user-info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return { status: response.status, message: response.data.message, user: response.data.user };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error fetching user data:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleEditUserData(
    name: string,
    username: string,
    noKTP: number,
    phone: number
): Promise<Response> {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/edit-info`,
            {
                name, username, noKTP, phone
            }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error editing user data:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleDeleteUser(): Promise<Response> {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/edit-info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error deleting user:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

// Admin - Dev Handler
export async function handleAdminLogin(
    email: string,
    password: string,
): Promise<Response> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/admin-login`, {
            email,
            password,
        });

        if (response.status === 200) {
            return { status: response.status, message: response.data.message, token: response.data.token };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error login in:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchAdminData(): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/admin-info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return { status: response.status, message: response.data.message, user: response.data.user };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error fetching admin data:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleFetchUserList(
    searchTerm: string,
    currentPage: number,
    limitPage: number,
    order: string,
    selectedStatus: string,
): Promise<Response> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/user-list?page=${currentPage}&limit=${limitPage}&search=${searchTerm}&order=${order}&status=${selectedStatus.toLowerCase()}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                users: response.data.users
            };
        } else {
            return { status: response.status, message: response.data.message };
        }
    } catch (err: any) {
        console.error("Error fetching user data:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};

export async function handleEditUserRole(
    targetEmail: string,
    newRole: number
): Promise<Response> {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/edit-user-role`,
            {
                targetEmail, newRole
            }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return { status: response.status, message: response.data.message };
    } catch (err: any) {
        console.error("Error editing user roles:", err.response?.data || err.message);
        return { status: err.response.status || 500, message: err.response.data.message || "An unexpected error occurred." };
    }
};