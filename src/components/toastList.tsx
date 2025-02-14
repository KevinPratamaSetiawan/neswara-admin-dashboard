import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export function Toast(type: string, content: string) {
    const isDark = JSON.parse(localStorage.getItem('isDark') || 'false');

    if (type === 'success') {
        toast.success(content, {
            style: {
                background: isDark ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)',
                color: isDark ? 'rgb(244, 244, 245)' : 'rgb(17, 24, 39)'
            },
        })
    } else if (type === 'error') {
        toast.error(content, {
            style: {
                background: isDark ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)',
                color: isDark ? 'rgb(244, 244, 245)' : 'rgb(17, 24, 39)'
            },
        })
    }
};















// "use client";

// import { useContext, useEffect, useState } from "react";
// import { ToastContext } from "@/app/layout";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faX } from "@fortawesome/free-solid-svg-icons";

// function ToastType(type: string) {
//     if (type === 'success') {
//         return (
//             <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6 text-green-500"
//             >
//                 <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M4.5 12.75l6 6 9-13.5"
//                 />
//             </svg>
//         );
//     } else if (type === 'error') {
//         return (
//             <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6 text-red-500"
//             >
//                 <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M18 6L6 18M6 6l12 12"
//                 />
//             </svg>
//         );
//     }
// };

// export function useToast() {
//     const context = useContext(ToastContext);
//     if (!context) {
//         throw new Error("useToast must be used within a ToastContext.Provider");
//     }
//     const [toastList, setToastList] = context;

//     const addToast = (type: string, content: string) => {
//         const maxId = toastList.reduce((max, toast) => Math.max(max, toast.id), 0);

//         const newToast = { id: maxId + 1, type, content };
//         const updatedToast = [...toastList, newToast];

//         setToastList(updatedToast);
//     };

//     return addToast;
// }

// export function Toast({ type, content, id }: { type: string; content: string; id: number }) {
//     const context = useContext(ToastContext);
//     if (!context) {
//         throw new Error("ToastList must be used within a ToastContext.Provider");
//     }
//     const [toastList, setToastList] = context;
//     const duration = 5000;
//     const [durationLeft, setDurationLeft] = useState(duration);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setDurationLeft((prev) => {
//                 const newDurationLeft = Math.max(prev - 100, 0);

//                 if (newDurationLeft === 0) {
//                     const updatedToast = toastList.filter((toast) => toast.id !== id);
//                     console.log(updatedToast);
//                     setToastList(updatedToast);
//                 }

//                 return newDurationLeft;
//             });
//         }, 100);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="relative flex items-center gap-3 w-full max-w-xs p-4 text-text bg-card rounded-md shadow overflow-hidden">
//             <div>
//                 {ToastType(type)} {/* Render appropriate icon */}
//             </div>
//             {/* Toast Content */}
//             <div className="text-sm font-normal">{content} {id}</div>

//             {/* Close Button */}
//             <button
//                 className="flex items-center justify-center text-gray-500 hover:text-text"
//                 type="button"
//                 onClick={() => setToastList((prev) => prev.filter((toast) => toast.id !== id))} // Close the toast manually
//             >
//                 <FontAwesomeIcon icon={faX} size="xs" />
//             </button>

//             {/* Progress Bar */}
//             <div
//                 className="absolute bottom-0 left-0 h-1 bg-primary"
//                 style={{ width: `${(durationLeft / duration) * 100}%`, transition: "width 0.1s linear" }}
//             ></div>
//         </div>
//     );
// }

// export default function ToastList() {
//     const context = useContext(ToastContext);
//     if (!context) {
//         throw new Error("ToastList must be used within a ToastContext.Provider");
//     }
//     const [toastList, setToastList] = context;

//     return (
//         <div className="fixed top-4 right-4 z-50 space-y-2 p-4">
//             {toastList.map((toast, index) => (
//                 <Toast type={toast.type} content={toast.content} id={toast.id} key={index} />
//             ))}
//         </div>
//     );
// }