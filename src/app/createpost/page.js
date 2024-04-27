"use client";
import React, { useState, useEffect } from 'react';
import { useDraft } from '../hooks/useDraft';

export default function ProductDescription() {
    const [title, setTitle] = useState(() => sessionStorage.getItem('draftTitle') || '');
    const [content, setContent] = useState(() => sessionStorage.getItem('draftContent') || '');
    const [author, setAuthor] = useState(() => sessionStorage.getItem('draftAuthor') || '');
    const [confirmation, setConfirmation] = useState(false);
    const [image, setImage] = useState(() => {
        const imageData = sessionStorage.getItem('draftImage') || localStorage.getItem('draftImage');
        return imageData ? { dataURL: imageData } : null;
    });
    const [mode, setMode] = useState(getInitialMode());
    const [posts, setPosts] = useState([]);
    const [showPrompt, setShowPrompt] = useState(false);

    useDraft(title, content, author, image);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                const dataURL = reader.result;
                localStorage.setItem('draftImage', dataURL);
                setImage({ dataURL });
            };
            reader.onerror = (error) => {
                console.error('Läsfel:', error);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('Ingen giltig fil vald.');
        }
    };

    const openIndexedDB = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('draftDB', 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('drafts')) {
                    db.createObjectStore('drafts', { keyPath: 'id'});
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    };

    const fetchPostsFromIndexedDB = async () => {
        const db = await openIndexedDB();
        const transaction = db.transaction('drafts', 'readonly');
        const draftsStore = transaction.objectStore('drafts');

        const request = draftsStore.getAll();
        request.onsuccess = () => {
            setPosts(request.result);
            
        };

        request.onerror = (event) => {
            console.error('Failed to fetch blog posts from IndexedDB:', event.target.error);
        };
    };

    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    function getInitialMode() {
        const savedMode = getCookie('mode');
        return savedMode ? savedMode : 'light';
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = '; expires=' + date.toUTCString();
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
    function getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const db = await openIndexedDB();
        const transaction = db.transaction('drafts', 'readwrite');
        const draftsStore = transaction.objectStore('drafts');
    
        const draftData = {
            id: Date.now(),
            title,
            content,
            author,
            image: image?.dataURL || null 
        };
    
        const request = draftsStore.add(draftData);
    
        request.onsuccess = () => {
            console.log('Draft data saved to IndexedDB');
            setShowPrompt(true);
            setTimeout(() => {
                setShowPrompt(false);
                window.location.reload();
            }, 1000);
        };
    
        request.onerror = (event) => {
            console.error('Failed to save draft data to IndexedDB:', event.target.error);
        };
    
        sessionStorage.removeItem('draftTitle');
        sessionStorage.removeItem('draftContent');
        sessionStorage.removeItem('draftAuthor');
        sessionStorage.removeItem('draftImage');
    
        setTitle('');
        setContent('');
        setAuthor('');
        setImage(null);
    };

    useEffect(() => {
        fetchPostsFromIndexedDB();
    }, []);

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        setPosts(storedPosts);
    }, []);
    return (
        <div className={`App ${mode === 'dark' ? 'dark' : ''} ${mode === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
            <button onClick={toggleMode} className="fixed top-4 right-4 px-4 py-2 rounded-md">
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <div className='flex min-h-screen flex-col items-center p-24'>
                <h1 className="text-4xl font-bold m-5">Skapa ett nytt blogginlägg</h1>
                {showPrompt && <div className="mb-4 text-green-500">Bloggposten är Skapad</div>}
                <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                    <div className="mb-4">
                        <label htmlFor="title" className={`${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'text-white' : 'black'}`}>Titel:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border-solid border-2 rounded-md focus:outline-none focus:border-${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'black' : 'black'}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className={`${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'text-white' : 'black'}`}>Innehåll:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border-solid border-2 rounded-md focus:outline-none focus:border-${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'black' : 'black'}`}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="author" className={`${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'text-white' : 'black'}`}>Författare:</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                            className={`w-full px-3 py-2 border-solid border-2 rounded-md focus:outline-none focus:border-${mode === 'dark' ? 'white' : 'blue'}-500 text-${mode === 'dark' ? 'black' : 'black'}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Lägg till bild:</label>
                        <input className='py-3'
                            type="file"
                            id="image"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="flex justify-center space-x-5">
                        <button className="bg-black text-white rounded-xl py-3 px-6 m-15" type="submit">Skapa inlägg</button>
                        <a href="/" className="bg-black text-white rounded-xl py-3 px-12 m-15 p-4">Tillbaka</a>
                </div>
                </form>
                <div className="mt-8">
    <h2 className={`text-2xl font-bold mb-4 text-center ${mode === 'dark' ? 'text-white' : 'text-black'}`}>BLOGG INLÄGG</h2>
    {posts.map((post, index) => (
        <div key={index} className="mb-4 mx-20">
            <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-black'}`}>{post.title}</h3><br />
            <p className={`${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{post.content}</p><br />
            <p className={`${mode === 'dark' ? 'text-white' : 'text-gray-700'}`}>Författare: {post.author}</p><br />
            {post.image && <img src={post.image} alt="Blog post image" className="max-w-full h-auto my-4" />}
            <hr />
        </div>
    ))}
</div>

            </div>
        </div>
    );
};
    
