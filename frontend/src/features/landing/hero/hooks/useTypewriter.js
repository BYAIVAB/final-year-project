import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50, delay = 0) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeout;

        // Initial delay before starting
        if (currentIndex === 0 && !isTyping) {
            timeout = setTimeout(() => setIsTyping(true), delay);
            return () => clearTimeout(timeout);
        }

        // Typing effect
        if (isTyping && currentIndex < text.length) {
            timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
        } else if (currentIndex >= text.length) {
            setIsTyping(false);
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, delay, isTyping, speed, text]);

    return { displayedText, isTyping };
};

export default useTypewriter;
