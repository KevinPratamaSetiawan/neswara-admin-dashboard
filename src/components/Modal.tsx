
export default function Modal({ title, useButton, onClose, handleModal, buttonText, isGreen, children }:
    {
        title: string;
        useButton: boolean;
        onClose: () => void;
        handleModal?: () => void;
        buttonText?: string;
        isGreen?: boolean;
        children?: React.ReactNode;
    }) {
    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                            <h3 className="text-xl font-semibold text-text dark:text-darkText">{title}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close exit modal</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">{children}</div>

                        {
                            useButton &&
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                                <button
                                    onClick={onClose}
                                    className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                                >
                                    Cancel
                                </button>
                                {
                                    isGreen ?
                                        <button onClick={handleModal} type='button' className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            {buttonText}
                                        </button> :
                                        <button onClick={handleModal} type='button' className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            {buttonText}
                                        </button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>
    );
}
