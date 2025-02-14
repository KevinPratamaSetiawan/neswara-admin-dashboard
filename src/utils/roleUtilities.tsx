import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export type Permission = {
    id: number;
    name: string;
};

export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
    permission: string[];
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
    status?: number;
    message?: string;
    meta?: Meta;
    data?: Role[];
    role?: Role;
    permissions?: Permission[];
    error?: string;
};

export async function handleFetchRoleBySearch(
    searchTerm: string,
    currentPage: number,
    limitPage: number,
    order: string,
    // selectedPermissions: Permission[],
): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles`,
            {
                params: {
                    page: currentPage,
                    limit: limitPage,
                    search: searchTerm,
                    order,
                    // permission: selectedPermissions,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                validateStatus: () => true,
            }
        );

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                meta: response.data.meta,
                data: response.data.data,
            };
        } else {
            return {
                status: response.status,
                message: response.data.message,
            };
        }
    } catch (err: any) {
        console.error("Error fetching role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}

export async function handleFetchRole(
    role_id: number,
): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/role?id=${role_id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                validateStatus: () => true,
            }
        );

        if (response.status === 200) {
            return {
                status: response.status,
                role: response.data.data,
            };
        } else {
            return {
                status: response.status,
                message: response.data.message,
            };
        }
    } catch (err: any) {
        console.error("Error fetching role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}

export async function handleFetchPermission(): Promise<Response> {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/permission/`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                validateStatus: () => true,
            }
        );

        if (response.status === 200) {
            return {
                status: response.status,
                message: response.data.message,
                permissions: response.data.data,
            };
        } else {
            return {
                status: response.status,
                message: response.data.message,
            };
        }
    } catch (err: any) {
        console.error("Error fetching role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}

export async function handleAddRole(
    name: string,
    permissions: Permission[]
): Promise<Response> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/add`,
            {
                name, permissions
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (err: any) {
        console.error("Error saving role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}

export async function handleUpdateRole(
    roleId: number,
    name: string,
    permissions: Permission[]
): Promise<Response> {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/edit/${roleId}`,
            {
                name, permissions
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (err: any) {
        console.error("Error saving role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}

export async function handleDeleteRole(roleId: number): Promise<Response> {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles/delete/${roleId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message,
        };
    } catch (err: any) {
        console.error("Error deleting role:", err.response?.data || err.message);
        return {
            status: err.response.status || 500,
            message: err.response.data.message || "An unexpected error occurred.",
        };
    }
}