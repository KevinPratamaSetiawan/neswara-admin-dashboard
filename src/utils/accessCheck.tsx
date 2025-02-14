import { Toast } from "@/components/toastList";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { handleFetchPermission } from "./roleUtilities";
import { RoleContext } from "@/provider/Provider";

export default function AccessCheck() {
    const [isOpen, setIsOpen] = useState(false);
    const [permissionList, setPermissionList] = useState<string[]>([]);
    const router = useRouter();

    const fetchPermission = async () => {
        const response = await handleFetchPermission();

        if (response.status === 200 && response.permissions) {
            setPermissionList(response.permissions.map((perm: { name: string }) => perm.name));
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            Toast('error', 'Invalid Token');
            setIsOpen(true);
            return;
        }

        try {
            fetchPermission();
            const decoded: { role_id: number; exp: number } = jwtDecode(token);

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                Toast('error', 'Session Expired');
                setIsOpen(true);
            }
        } catch (err) {
            Toast('error', 'Invalid Token');
            setIsOpen(true);
        }
    }, [router]);

    useEffect(() => {
        if (permissionList.length > 0 && !permissionList.includes("dashboard-access")) {
            Toast('error', 'User Unauthenticated');
            setIsOpen(true);
        }
    }, [permissionList]);

    return (
        <>
            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-center p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Authentication Required.</h3>
                            </div>
                            <div className="flex items-center justify-center p-4 md:p-5 rounded-b gap-2.5">
                                <a href={`/login`} className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Go to Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export function PageAccessCheck({ permission }: { permission: string[] }) {
    const [isChecking, setIsChecking] = useState(true);
    const roleContext = useContext(RoleContext);
    const router = useRouter();

    useEffect(() => {
        if (!roleContext || roleContext.permissions.length === 0) return;

        const { hasPermission } = roleContext;

        const isAllowed = permission.some((perm) => hasPermission(perm));

        if (!isAllowed) {
            router.replace(`/404`);
        } else {
            setIsChecking(false);
        }
    }, [roleContext, router, permission]);

    if (!isChecking) return null;

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                    <div className="flex items-center justify-center p-4 md:p-5 rounded-t">
                        <h3 className="text-xl font-semibold text-text dark:text-darkText">
                            Checking User Authorization...
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
