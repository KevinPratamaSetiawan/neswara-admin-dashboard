"use client";

import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "@/provider/Provider";

export default function ThemeToggle() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("ThemeToggle must be used within a ThemeProvider");
    }

    const [isDark, setIsDark] = context;

    useEffect(() => {
        const toggleTheme = () => {
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        };

        localStorage.setItem("isDark", JSON.stringify(isDark));
        toggleTheme();
    }, [isDark]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "isDark") {
                setIsDark(JSON.parse(event.newValue || "false"));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [setIsDark]);

    return (
        <div className="fixed right-5 bottom-5 shadow-2xl rounded-full">
            <button
                className="flex items-center justify-center rounded-full dark:bg-card bg-darkCard dark:text-text text-darkText p-3 button-ring"
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
            >
                {isDark ? (
                    <FontAwesomeIcon icon={faSun} className="w-4 h-3 hover:animate-spin" />
                ) : (
                    <FontAwesomeIcon icon={faMoon} className="w-4 h-3 hover:animate-spin" />
                )}
            </button>
        </div>
    );
}
