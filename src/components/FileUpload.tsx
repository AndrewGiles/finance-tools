'use client'

import { DragEvent, useState } from "react";

export default function FileUpload({ processFile = async (file: File) => { } }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovered(true);
    };

    const handleDragLeave = () => {
        setIsHovered(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setIsHovered(false);
            setIsLoading(true);
            try {
                await processFile(file);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center bg-gray-100 transition duration-300 ${isHovered ? 'bg-blue-200' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className="bg-white p-8 rounded-md shadow-md max-w-md text-center">
                <h1 className="text-4xl mb-4 font-serif text-blue-600">Gilez Apps</h1>
                <h2 className="text-3xl mb-8 font-serif text-gray-800">Mint Financial Tools</h2>
                <label
                    htmlFor="fileInput"
                    className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 transition duration-300 hover:border-blue-500 ${isLoading ? 'opacity-50' : ''}`}
                >
                    <div className="mb-8 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto mb-4 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 1a9 9 0 110 18 9 9 0 010-18zM5 9a1 1 0 011-1h8a1 1 0 010 2H6a1 1 0 01-1-1zM9 5a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-lg font-semibold text-gray-600">
                            {isLoading ? 'Processing...' : 'Drag and drop your CSV file here'}
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                    />
                    <div className="flex items-center justify-center mt-4">
                        <button
                            type="button"
                            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            Browse
                        </button>
                    </div>
                </label>
            </div>
        </div>
    );
}
