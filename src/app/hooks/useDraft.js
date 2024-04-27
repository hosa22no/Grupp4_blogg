import { useEffect } from 'react';

export function useDraft(title, content, author, image) {
    useEffect(() => {
        sessionStorage.setItem('draftTitle', title);
        sessionStorage.setItem('draftContent', content);
        sessionStorage.setItem('draftAuthor', author);
    }, [title, content, author, image]);
}
