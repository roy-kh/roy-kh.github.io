// Slot Machine / Letter Shuffle Animation for Subtitles

const titles = [
    'Data Analyst',
    'Fullstack Developer',
    'Business Operations Strategist',
    'Machine Learning Enthusiast'
];

// Characters to use for shuffling (alphanumeric + some symbols)
const shuffleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

function getRandomChar() {
    return shuffleChars[Math.floor(Math.random() * shuffleChars.length)];
}

function initSlotMachine() {
    const container = document.getElementById('slot-machine-text') || document.querySelector('.Iam b');
    if (!container) return;

    let currentTitleIndex = 0;
    let isAnimating = false;
    let cycleTimeout = null;

    // Calculate and set fixed width based on "Data Analyst"
    function setFixedContainerWidth() {
        // Create a temporary element to measure text width
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.font = window.getComputedStyle(container).font;
        temp.style.fontSize = window.getComputedStyle(container).fontSize;
        temp.style.fontFamily = window.getComputedStyle(container).fontFamily;
        temp.style.fontWeight = window.getComputedStyle(container).fontWeight;
        temp.style.whiteSpace = 'nowrap';
        temp.textContent = 'Data Analyst';
        document.body.appendChild(temp);
        
        const width = temp.offsetWidth;
        container.style.width = width + 'px';
        
        document.body.removeChild(temp);
    }

    function createLetterElement(char, index) {
        const span = document.createElement('span');
        span.className = 'slot-letter';
        span.textContent = char;
        span.style.setProperty('--index', index);
        return span;
    }

    function displayTitle(title) {
        container.innerHTML = '';
        const letters = title.split('');
        letters.forEach((char, index) => {
            const letterEl = createLetterElement(char === ' ' ? '\u00A0' : char, index);
            container.appendChild(letterEl);
        });
    }

    function resizeToTitleLength(targetLength) {
        const currentLetters = Array.from(container.querySelectorAll('.slot-letter'));
        
        // Add letters if needed
        while (currentLetters.length < targetLength) {
            const newLetter = createLetterElement('', currentLetters.length);
            container.appendChild(newLetter);
            currentLetters.push(newLetter);
        }
        
        // Remove extra letters
        while (currentLetters.length > targetLength) {
            container.removeChild(currentLetters.pop());
        }
    }

    function shuffleToNextTitle() {
        if (isAnimating) return;
        isAnimating = true;

        const currentTitle = titles[currentTitleIndex];
        const nextTitleIndex = (currentTitleIndex + 1) % titles.length;
        const nextTitle = titles[nextTitleIndex];
        
        // Immediately resize to next title's length to prevent wrapping
        resizeToTitleLength(nextTitle.length);
        
        const currentLetters = container.querySelectorAll('.slot-letter');

        // Phase 1: Shuffle existing letters
        let shuffleCount = 0;
        const shuffleInterval = setInterval(() => {
            currentLetters.forEach((letter) => {
                if (letter.textContent !== ' ' && letter.textContent !== '\u00A0' && letter.textContent !== '') {
                    letter.textContent = getRandomChar();
                    letter.classList.add('shuffling');
                } else if (letter.textContent === '') {
                    // New empty letters also shuffle
                    letter.textContent = getRandomChar();
                    letter.classList.add('shuffling');
                }
            });
            shuffleCount++;
            
            if (shuffleCount >= 10) {
                clearInterval(shuffleInterval);
                resolveToNextTitle(nextTitle, nextTitleIndex);
            }
        }, 60);
    }

    function resolveToNextTitle(nextTitle, nextTitleIndex) {
        const finalLetters = container.querySelectorAll('.slot-letter');
        const nextTitleChars = nextTitle.split('');
        let lettersResolved = 0;
        const totalLetters = nextTitleChars.length;

        // Phase 2: Resolve each letter to its final character
        nextTitleChars.forEach((targetChar, index) => {
            const letter = finalLetters[index];
            if (!letter) {
                lettersResolved++;
                if (lettersResolved === totalLetters) {
                    finishResolution(nextTitleIndex);
                }
                return;
            }

            // Stagger the resolution for a cascading effect
            setTimeout(() => {
                let shuffleCycles = 0;
                const resolveInterval = setInterval(() => {
                    if (shuffleCycles < 4) {
                        // Show a few more random chars before resolving
                        letter.textContent = getRandomChar();
                        shuffleCycles++;
                    } else {
                        // Resolve to final character
                        letter.textContent = targetChar === ' ' ? '\u00A0' : targetChar;
                        letter.classList.remove('shuffling');
                        letter.classList.add('resolved');
                        
                        // Remove resolved class after animation
                        setTimeout(() => {
                            letter.classList.remove('resolved');
                        }, 400);
                        
                        clearInterval(resolveInterval);
                        lettersResolved++;
                        
                        // Check if all letters are resolved
                        if (lettersResolved === totalLetters) {
                            finishResolution(nextTitleIndex);
                        }
                    }
                }, 50);
            }, index * 25); // Stagger each letter by 25ms for smoother cascade
        });
    }

    function finishResolution(nextTitleIndex) {
        setTimeout(() => {
            isAnimating = false;
            currentTitleIndex = nextTitleIndex;
            // Continue cycle
            continueCycle();
        }, 500);
    }

    function continueCycle() {
        // Clear any existing timeout
        if (cycleTimeout) {
            clearTimeout(cycleTimeout);
        }
        
        // Show current title for 3 seconds, then shuffle to next
        cycleTimeout = setTimeout(() => {
            shuffleToNextTitle();
        }, 3000);
    }

    // Initialize with first title
    displayTitle(titles[0]);

    // Set fixed container width based on "Data Analyst"
    // Wait a bit for fonts to load
    setTimeout(() => {
        setFixedContainerWidth();
        
        // Recalculate on window resize
        window.addEventListener('resize', () => {
            setFixedContainerWidth();
        });
    }, 100);

    // Start the cycle
    continueCycle();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSlotMachine();
});

