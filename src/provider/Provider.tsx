'use client';

import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Permission, Role, handleFetchPermission, handleFetchRole, handleFetchRoleBySearch } from "@/utils/roleUtilities";
import { handleFetchUserData } from "@/utils/userUtilities";

export const ThemeContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem('isDark') || 'false')
    });

    // useEffect(() => {
    //     setIsDark(JSON.parse(localStorage.getItem('isDark') || 'false'));
    // }, []);

    return (
        <ThemeContext.Provider value={[isDark, setIsDark]}>
            {children}
        </ThemeContext.Provider>
    );
};

export const RoleContext = createContext<{
    role: number;
    permissions: string[];
    hasPermission: (permission: string) => boolean;
    FetchUserRole: () => Promise<void>;
} | null>(null);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<number>(7);
    const [permissions, setPermissions] = useState<string[]>([]);

    const FetchUserRole = async () => {
        const response = await handleFetchUserData();

        if (response.status === 200 && response.user) {
            setRole(response.user.role_id);
            fetchPermissions(response.user.role_id);
        }
    };

    const fetchPermissions = async (role_id: number) => {
        const response = await handleFetchRole(role_id);

        if (response.status === 200 && response.role) {
            setPermissions(response.role.permission);
        }
    };

    useEffect(() => {
        try {
            FetchUserRole();
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            setRole(7);
            setPermissions([]);
        }
    }, []);

    const hasPermission = (permission: string) => {
        // console.log(permissions.includes(permission));
        // console.log(permissions);

        return permissions.includes(permission);
    };

    return (
        <RoleContext.Provider value={{ role, permissions, hasPermission, FetchUserRole }}>
            {children}
        </RoleContext.Provider>
    );
};


