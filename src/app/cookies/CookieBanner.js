"use client";
import React, { useState, useEffect } from 'react';

function CookieBanner() {
    const [isVisible, setIsVisible] = useState(() => {
        const acceptedCookies = localStorage.getItem('acceptedCookies');
        return acceptedCookies !== 'true'; 
    });

    const handleAccept = () => {
        localStorage.setItem('acceptedCookies', 'true'); 
        setIsVisible(false); 
    };

    return (
        <>
            {isVisible && (
                <div className="flex justify-between items-center gap-2 bg-gray-100 px-4 py-2 fixed bottom-0 left-0 w-full">
                    <p className="text-sm text-gray-700">
                        We use cookies to ensure you get the best experience on our website. Learn more
                        <a href="#" className="underline">here</a>.
                    </p>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAccept} 
                        Accept>
                    </button>
                </div>
            )};
        </>
    );
}
 
export default CookieBanner;
