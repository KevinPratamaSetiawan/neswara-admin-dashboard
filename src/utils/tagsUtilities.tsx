import axios from 'axios';
import { useRouter } from 'next/navigation';

type TagProp = {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

type TagMetaProp = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
};

export async function fetchTags(
    currentPage: number,
    limitPage: number,
    setTagDatas: React.Dispatch<React.SetStateAction<TagProp[]>>,
    setMetaDatas: React.Dispatch<React.SetStateAction<TagMetaProp>>
) {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/tags?page=${currentPage}&limit=${limitPage}&order=DESC`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            setTagDatas(response.data.tags);
            setMetaDatas(response.data.meta);
        } else if (response.status === 401 || response.status === 404) {
            setTagDatas([]);
            setMetaDatas({ currentPage: 1, itemsPerPage: 0, totalItems: 0, totalPages: 0 });
        }
    } catch (error: any) {
        console.error('Error fetching tags:', error.response?.data || error.message);
        setTagDatas([]);
        setMetaDatas({ currentPage: 1, itemsPerPage: 0, totalItems: 0, totalPages: 0 });
    }
}

export async function fetchTag(
    slug: string,
) {
    try {
        const response = await axios.get(`http://localhost:8080/api/tags/${slug}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            return response.data.tag;
        }
    } catch (error) {
        console.error('Error fetching tag:', error);
    }
}

export async function updateTag(
    tagId: number,
    name: string,
    description: string,
    color: string,
    router: ReturnType<typeof useRouter>
): Promise<void> {
    try {
        const response = await axios.put(
            `http://localhost:8080/api/tags/edit/${tagId}`,
            { name, description, color },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('Tag updated successfully:', response.data.message);
            setTimeout(() => {
                router.push('/tags');
            }, 300);
        }
    } catch (error: any) {
        console.error('Error updating tag:', error.response?.data || error.message);
    }
}

export async function addTag(
    name: string,
    description: string,
    color: string,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/tags/add`,
            {
                name,
                description,
                color,
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log(response.data.message);
            setTimeout(() => {
                router.push('/tags');
            }, 300);
        }
    } catch (error: any) {
        console.error('Error saving tag:', error.response?.data || error.message);
        return null;
    }
}

export async function deleteTag(
    tagId: number,
    reFetchData: () => void
) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/tags/delete/${tagId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            reFetchData();
        }

    } catch (error: any) {
        console.error("Error deleting tag:", error.response?.data || error.message);
    }
}
