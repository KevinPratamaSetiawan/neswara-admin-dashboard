import axios from 'axios';
import { useRouter } from 'next/navigation';

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

export async function AddNews(
    title: string,
    subTitle: string,
    category: number,
    content: string,
    router: any,
) {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/news/add`,
            {
                title,
                sub_title: subTitle,
                category_id: category,
                content: content,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('News saved successfully:', response.data.message);
            setTimeout(() => {
                router.push('/news');
            }, 1000);
        }
    } catch (error: any) {
        console.error('Error saving news:', error.response?.data || error.message);
    }
}

export async function UpdateNews(
    newsId: number,
    title: string,
    subTitle: string,
    category: number,
    editor: any,
    router: ReturnType<typeof useRouter>
) {
    try {
        const content = editor.getHTML();
        const response = await axios.put(
            `http://localhost:8080/api/news/edit/${newsId}`,
            {
                title,
                sub_title: subTitle,
                category_id: category,
                content,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('News saved successfully:', response.data.message);
            setTimeout(() => {
                router.push(`/news/${response.data.slug}`);
            }, 300);
        }
    } catch (error: any) {
        console.error('Error saving news:', error.response?.data || error.message);
    }
}

export async function fetchNews(
    slug: string | undefined,
) {
    if (!slug) {
        console.error("Slug is required to fetch news.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/api/news/article/${slug}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200 && response.data?.news) {
            return response.data.news;
        } else {
            console.error("News not found in response.");
        }
    } catch (error: any) {
        console.error('Error fetching news:', error.response?.data || error.message);
    }
};

export async function fetchNewsList(
    currentPage: number,
    limitPage: number,
    selectedStatus: string,
    setNewsDatas: (data: NewsProp[]) => void,
    setMetaDatas: (data: NewsMetaProp) => void,
    router: ReturnType<typeof useRouter>
): Promise<void> {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/news?page=${currentPage}&limit=${limitPage}&status=${selectedStatus.toLowerCase()}&order=DESC`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status === 200) {
            setNewsDatas(response.data.data);
            setMetaDatas(response.data.meta);
        } else if (response.status === 401) {
            setNewsDatas([]);
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
            setNewsDatas([]);
            setMetaDatas({
                currentPage: 1,
                itemsPerPage: 0,
                totalItems: 0,
                totalPages: 0,
            });
        }
    } catch (error: any) {
        console.error("Error fetching news:", error.response?.data || error.message);
        setNewsDatas([]);
        setMetaDatas({
            currentPage: 1,
            itemsPerPage: 0,
            totalItems: 0,
            totalPages: 0,
        });
    }
};

export async function deleteNews(
    newsId: number,
    setToast: React.Dispatch<React.SetStateAction<string[]>>,
    reFetchData: () => void
) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/news/delete/${newsId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            setToast((prevToast) => [...prevToast, response.data.message]);
            reFetchData();
        }
    } catch (error: any) {
        console.error('Error deleting news:', error.response?.data || error.message);
    }
}