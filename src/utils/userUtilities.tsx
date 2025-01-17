import axios from 'axios';
import { useRouter } from 'next/navigation';

export async function handleLogin(
    email: string,
    password: string,
    setSuccess: React.Dispatch<React.SetStateAction<string | null>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.post("http://localhost:8080/api/user/login", {
            email,
            password,
        });

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            setSuccess(response.data.message);
            setTimeout(() => {
                router.push('/news');
            }, 1000);
        } else {
            setError(response.data.message);
        }
    } catch (err: any) {
        console.error("Error logging in:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to login");
    }
}

export async function fetchUserData(
    setUserData: React.Dispatch<React.SetStateAction<{ photo: string; username: string } | null>>,
    router: ReturnType<typeof useRouter>
) {
    try {
        const response = await axios.get(`http://localhost:8080/api/user/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.status === 200) {
            setUserData(response.data.user);
        }

    } catch (error: any) {
        if (error.response.status === 401) {
            setTimeout(() => {
                router.push('/login');
            }, 300)
        }
        console.error("Error fetching user data:", error.response?.data || error.message);
    }
};