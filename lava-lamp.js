// Lava Lamp Background - Web Version

const USE_SPECIFIC_COLORS = true;

const SPECIFIC_COLORS = ['#2E8B57', '#123524', '#228B22', '#6B8E23', '#006400', '#556B2F'];

// Or using a single hue (only used if USE_SPECIFIC_COLORS is false)
const LAVA_LAMP_HUE = '#2E8B57'; // Sea Green
const CIRCLE_COUNT = 4;
// ================================

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initLavaLamp(count = 4, hueOrColors = '#fb923c') {
    const container = document.getElementById('lava-lamp-container');
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine colors: use specific colors array or generate from hue
    let colors;
    let bgColor;
    
    if (Array.isArray(hueOrColors)) {
        // Use specific colors provided
        colors = hueOrColors.slice(0, count); // Use first 'count' colors
        // Use the darkest color (#123524) as background
        bgColor = '#123524';
    } else {
        // Generate colors from single hue
        colors = generateColorsFromHue(hueOrColors, count);
        bgColor = generateDarkColorFromHue(hueOrColors);
    }

    // Set background color
    container.style.backgroundColor = bgColor;

    // Clear existing circles
    container.innerHTML = '';

    // Create circles
    colors.forEach((color, index) => {
        const rand = randomNumber(15, 30) / 100; // Smaller multiplier for smaller circles
        const radius = width * rand;
        const x = Math.random() * (width - radius * 2);
        const y = Math.random() * (height - radius * 2);
        const randRotation = Math.random() * 360;

        const circleWrapper = document.createElement('div');
        circleWrapper.className = 'lava-circle-wrapper';
        // Set transform origin to center horizontally, but at the circle's y position vertically
        circleWrapper.style.transformOrigin = `50% ${y}px 0`;
        // Rotate continuously, starting from random rotation
        const rotationDuration = 25; // Duration in seconds for one full rotation
        circleWrapper.style.animation = `lavaRotate ${rotationDuration}s linear infinite`;
        // Start animation at a random point in the rotation cycle
        circleWrapper.style.animationDelay = `-${randRotation / 360 * rotationDuration}s`;

        const circle = document.createElement('div');
        circle.className = 'lava-circle';
        circle.style.backgroundColor = color;
        circle.style.left = `${x - radius}px`;
        circle.style.top = `${y - radius}px`;
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.borderRadius = `${radius}px`;

        circleWrapper.appendChild(circle);
        container.appendChild(circleWrapper);
    });

    // Create blur overlay
    const blurOverlay = document.createElement('div');
    blurOverlay.className = 'lava-blur-overlay';
    container.appendChild(blurOverlay);
}

function generateColorsFromHue(hue, count) {
    const colors = [];
    // Convert hex to HSL for easier manipulation
    const hsl = hexToHsl(hue);
    
    for (let i = 0; i < count; i++) {
        // Vary the hue slightly and use bright luminosity
        const hueVariation = (hsl.h + (i * 30)) % 360;
        const color = hslToHex(hueVariation, 70, 60); // Bright colors
        colors.push(color);
    }
    
    return colors;
}

function generateDarkColorFromHue(hue) {
    const hsl = hexToHsl(hue);
    return hslToHex(hsl.h, hsl.s, 20); // Dark background
}

function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const colorConfig = USE_SPECIFIC_COLORS ? SPECIFIC_COLORS : LAVA_LAMP_HUE;
    const circleCount = USE_SPECIFIC_COLORS ? Math.min(SPECIFIC_COLORS.length, CIRCLE_COUNT) : CIRCLE_COUNT;
    
    initLavaLamp(circleCount, colorConfig);
    
    // Reinitialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initLavaLamp(circleCount, colorConfig);
        }, 250);
    });
});

