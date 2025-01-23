import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AccessCheck() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decoded: { role_id: number; exp: number } = jwtDecode(token);

            if (decoded.role_id === 3 || decoded.exp * 1000 < Date.now()) {
                router.push("/login");
            }
        } catch (err) {
            console.error("Invalid token:", err);
            router.push("/login");
        }
    }, [router]);

    return <div>Protected Content</div>;
};
