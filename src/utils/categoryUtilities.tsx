import axios from 'axios';
import { useRouter } from 'next/navigation';

type CategoryProp = {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    created_at: string;
    updated_at: string;
};

type CategoryMetaProp = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export async function AddCategory(
    name: string,
    description: string,
    icon: string,
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/categories/add`,
            {
                name,
                description,
                icon
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('Category saved successfully:', response.data.message);
            setTimeout(() => {
                router.push('/categories');
            }, 1000);
        }
    } catch (error: any) {
        console.error('Error saving category:', error.response?.data || error.message);
    } finally {
        setIsSaving(false);
    }
};

export async function UpdateCategory(
    name: string,
    description: string,
    icon: string,
    categoryId: number,
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/categories/edit/${categoryId}`,
            { name, description, icon },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('Category saved successfully:', response.data.message);
            setTimeout(() => {
                router.push('/categories');
            }, 1000);
        }
    } catch (error: any) {
        console.error('Error saving category:', error.response?.data || error.message);
    } finally {
        setIsSaving(false);
    }
};

export async function DeleteCategory(
    categoryId: number,
    reFetchData: () => void,
) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/categories/delete/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            reFetchData();
        }

    } catch (error: any) {
        console.error("Error deleting category:", error.response?.data || error.message);
    }
}

export async function fetchCategory(
    slug: string,
    setCategoryId: React.Dispatch<React.SetStateAction<number | null>>,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>
) {
    try {
        const response = await axios.get(`http://localhost:8080/api/categories/${slug}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            setCategoryId(response.data.category.id);
            setName(response.data.category.name);
            setDescription(response.data.category.description);
        }

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export async function fetchCategories(
    currentPage: number,
    limitPage: number,
    setCategoryDatas: React.Dispatch<React.SetStateAction<CategoryProp[]>>,
    setMetaDatas: React.Dispatch<React.SetStateAction<CategoryMetaProp>>,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/categories?page=${currentPage}&limit=${limitPage}&order=DESC`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            setCategoryDatas(response.data.data);
            setMetaDatas(response.data.meta);
        } else if (response.status === 401) {
            setCategoryDatas([]);
            setMetaDatas({
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 0,
            });
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else if (response.status === 404) {
            setCategoryDatas([]);
            setMetaDatas({
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 0,
            });
        }
    } catch (error: any) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        setCategoryDatas([]);
        setMetaDatas({
            currentPage: 1,
            itemsPerPage: 0,
            totalItems: 0,
            totalPages: 0,
        });
    }
}

export const fetchCategoriesPicker = async (
    setCategoryList: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>
) => {
    try {
        const response = await axios.get('http://localhost:8080/api/categories?page=1&limit=100', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            const categories = response.data.data.map((item: any) => ({
                id: item.id,
                name: item.name,
            }));
            setCategoryList(categories);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};