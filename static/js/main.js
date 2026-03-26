function toggleMusic() {
    const music = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    if (!music || !icon) return;

    if (music.paused) {
        music.play().catch(e => console.log('Audio play error:', e));
    } else {
        music.pause();
    }
}

// Modal logic for gallery
function openModal(src) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('img01');
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

// Surprise Confetti
function triggerSurprise() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD1DC', '#FFB7CE', '#D4AF37']
    });

    document.getElementById('surprise-message').style.display = 'block';
    document.getElementById('surprise-btn').style.display = 'none';
}

// Typewriter Effect
function typeWriter(text, elementId, speed) {
    let i = 0;
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Background Collage Logic
function setupBackgroundCollage(images) {
    const container = document.getElementById('bg-collage');
    if (!container || !images || images.length === 0) return;

    container.innerHTML = ''; // Clear existing content

    const totalImages = images.length;
    const cols = 5;
    const rows = 2;
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('collage-img');

        // Calculate grid cell
        const col = index % cols;
        const row = Math.floor(index / cols);

        // Random offset within the cell (ensuring it stays roughly in its area)
        const leftBase = col * cellWidth;
        const topBase = row * cellHeight;

        // Add significant random offset for "messy but balanced" look
        const randomLeft = leftBase + (Math.random() * (cellWidth - 20));
        const randomTop = topBase + (Math.random() * (cellHeight - 20));

        img.style.left = `${randomLeft}vw`;
        img.style.top = `${randomTop}vh`;

        // Random rotation
        const rotation = (Math.random() * 20 - 10).toFixed(1); // Slightly more rotation
        img.style.setProperty('--rotation', `${rotation}deg`);
        img.style.transform = `rotate(${rotation}deg)`;

        // Random floating delay
        img.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(img);
    });
}

// Puzzle Logic
let isScrambled = false;

document.addEventListener('DOMContentLoaded', () => {
    const puzzleGrid = document.getElementById('puzzle-grid');
    if (puzzleGrid) {
        scramblePuzzle();
    }

    // Video Audio Interception
    const bgMusic = document.getElementById('bg-music');
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', () => {
            if (bgMusic && !bgMusic.paused) {
                bgMusic.pause();
                bgMusic.dataset.wasPlaying = "true";
            }
        });
        
        video.addEventListener('pause', () => {
            if (bgMusic && bgMusic.dataset.wasPlaying === "true") {
                bgMusic.play().catch(() => {});
                bgMusic.dataset.wasPlaying = "false";
            }
        });
        
        video.addEventListener('ended', () => {
            if (bgMusic && bgMusic.dataset.wasPlaying === "true") {
                bgMusic.play().catch(() => {});
                bgMusic.dataset.wasPlaying = "false";
            }
        });
    });
});

function launchFireworks() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000, colors: ['#FFD1DC', '#FFB7CE', '#D4AF37', '#ff0000', '#00ff00', '#0000ff', '#ffff00'] };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}



function initPuzzle() {
    const puzzleGrid = document.getElementById('puzzle-grid');
    puzzleGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile');
        tile.dataset.index = i;
        if (i === 15) {
            tile.classList.add('empty');
        } else {
            const x = (i % 4) * (100 / 3);
            const y = Math.floor(i / 4) * (100 / 3);
            tile.style.backgroundPosition = `${x}% ${y}%`;
        }

        tile.addEventListener('click', function () {
            if (!isScrambled) return;
            const currentIdx = Array.from(puzzleGrid.children).indexOf(this);
            const emptyIdx = Array.from(puzzleGrid.children).findIndex(el => el.classList.contains('empty'));

            const rowDiff = Math.abs(Math.floor(currentIdx / 4) - Math.floor(emptyIdx / 4));
            const colDiff = Math.abs((currentIdx % 4) - (emptyIdx % 4));

            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                swapTiles(currentIdx, emptyIdx);
                checkWin();
            }
        });
        puzzleGrid.appendChild(tile);
    }
}

function swapTiles(idx1, idx2) {
    const puzzleGrid = document.getElementById('puzzle-grid');
    const childArr = Array.from(puzzleGrid.children);
    const temp = document.createElement('div');
    puzzleGrid.insertBefore(temp, childArr[idx1]);
    puzzleGrid.replaceChild(childArr[idx1], childArr[idx2]);
    puzzleGrid.replaceChild(childArr[idx2], temp);
}

function scramblePuzzle() {
    document.getElementById('puzzle-message').style.display = 'none';
    const puzzleGrid = document.getElementById('puzzle-grid');

    // Ensure the puzzle is in its fully assembled state first before scrambling
    initPuzzle();

    // Make random valid moves 150 times to properly shuffle
    for (let i = 0; i < 150; i++) {
        const emptyIdx = Array.from(puzzleGrid.children).findIndex(el => el.classList.contains('empty'));
        const neighbors = [];
        if (emptyIdx % 4 !== 0) neighbors.push(emptyIdx - 1);
        if (emptyIdx % 4 !== 3) neighbors.push(emptyIdx + 1);
        if (emptyIdx >= 4) neighbors.push(emptyIdx - 4);
        if (emptyIdx < 12) neighbors.push(emptyIdx + 4);

        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        swapTiles(randomNeighbor, emptyIdx);
    }
    isScrambled = true;
}

function checkWin() {
    if (!isScrambled) return;
    let win = true;
    const puzzleGrid = document.getElementById('puzzle-grid');
    Array.from(puzzleGrid.children).forEach((tile, idx) => {
        if (parseInt(tile.dataset.index) !== idx) win = false;
    });

    if (win) {
        document.getElementById('puzzle-message').style.display = 'block';
        isScrambled = false;
        // Put the missing piece back for picture completion
        const emptyTile = puzzleGrid.children[15];
        emptyTile.classList.remove('empty');
        emptyTile.style.backgroundPosition = '100% 100%';
        triggerSurprise(); // Trigger confetti!
    }
}

// --- Gallery Flight Path ---
function drawFlightPath() {
    // Only target the moments gallery grid
    const momentsSection = document.getElementById('moments');
    if (!momentsSection) return;

    const grid = momentsSection.querySelector('.gallery-grid');
    if (!grid) return;

    const items = grid.querySelectorAll('.gallery-item');
    if (items.length < 2) return;

    // Remove existing SVG and rocket if any
    const existingSvg = document.getElementById('flight-path-svg');
    if (existingSvg) existingSvg.remove();
    const existingRocket = document.getElementById('flight-path-rocket');
    if (existingRocket) existingRocket.remove();

    grid.style.position = "relative";

    // Create SVG namespace
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "flight-path-svg";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1"; // Below gallery items

    let pathD = "";

    items.forEach((item, index) => {
        item.style.position = "relative";
        item.style.zIndex = "2";

        // Calculate center relative to grid
        const cx = item.offsetLeft + item.offsetWidth / 2;
        const cy = item.offsetTop + item.offsetHeight / 2;

        if (index === 0) {
            pathD += `M ${cx} ${cy} `;
        } else {
            // Draw smooth curve using Bezier curve approximation
            // Using a simple smooth line (S) or Quadratic curve (Q) can be nice, but straight lines (L) are cleanest for responsive wraps
            pathD += `L ${cx} ${cy} `;
        }

        // If it's the last item, add the rocket
        if (index === items.length - 1) {
            const prevItem = items[index - 1];
            const prevCx = prevItem.offsetLeft + prevItem.offsetWidth / 2;
            const prevCy = prevItem.offsetTop + prevItem.offsetHeight / 2;

            const dx = cx - prevCx;
            const dy = cy - prevCy;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Adjust +45 because the fa-rocket icon naturally points up-right (-45 deg)
            const rotation = angle + 45;

            const rocket = document.createElement("i");
            rocket.className = "fas fa-rocket";
            rocket.id = "flight-path-rocket";
            rocket.style.position = "absolute";
            // Place it slightly past the center of the last element, or right on it
            rocket.style.left = `${cx}px`;
            rocket.style.top = `${cy}px`;
            rocket.style.color = "var(--pink-primary)";
            rocket.style.fontSize = "2.5rem";
            rocket.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            rocket.style.zIndex = "3";
            rocket.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.2))";

            grid.appendChild(rocket);
        }
    });

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--pink-primary)");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-dasharray", "10, 15");
    path.setAttribute("stroke-linecap", "round");
    path.style.opacity = "0.8";

    svg.appendChild(path);
    grid.appendChild(svg);
}

// Handle dynamic drawing
window.addEventListener('load', () => {
    setTimeout(drawFlightPath, 500); // Slight delay for fonts/images to settle
});
window.addEventListener('resize', () => {
    // Debounce resize
    clearTimeout(window.resizeFlightPathTimeout);
    window.resizeFlightPathTimeout = setTimeout(drawFlightPath, 300);
});

/* Gatekeeper Quiz Logic */
function nextQuizStep(step) {
    const steps = document.querySelectorAll('.quiz-step');
    steps.forEach(el => {
        if (el.classList.contains('active')) {
            el.classList.remove('active');
            setTimeout(() => { el.style.display = 'none'; }, 400);
        }
    });

    setTimeout(() => {
        const nextElem = document.getElementById('quiz-step-' + step);
        if (nextElem) {
            nextElem.style.display = 'flex';
            void nextElem.offsetWidth; // force reflow
            nextElem.classList.add('active');
        }
    }, 450);
}

function checkAnswer(step, isCorrect, btn) {
    if (isCorrect) {
        btn.classList.add('correct');
        const siblings = btn.parentElement.querySelectorAll('button');
        siblings.forEach(b => b.style.pointerEvents = 'none');

        // Blast fireworks / confetti on correct answer!
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FFD1DC', '#B76E79', '#D4AF37', '#e8f5e9'],
                zIndex: 99999 // Ensure it sits above the entrance overlay (10000)
            });
        }

        setTimeout(() => {
            nextQuizStep(step + 1);
        }, 1200);
    } else {
        btn.classList.add('wrong');
        setTimeout(() => {
            btn.classList.remove('wrong');
        }, 500);
    }
}

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    if (cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        const interactiveElements = document.querySelectorAll('button, a, .gallery-item, .video-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // 1. Fairy Dust Trail
        let lastSparkTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSparkTime > 30) { // Spawn rate
                lastSparkTime = now;
                const spark = document.createElement('div');
                spark.className = 'mouse-spark';
                spark.style.left = e.clientX + 'px';
                spark.style.top = e.clientY + 'px';

                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 30 + 10;
                spark.style.setProperty('--vx', Math.cos(angle) * velocity + 'px');
                spark.style.setProperty('--vy', Math.sin(angle) * velocity + 'px');

                document.body.appendChild(spark);
                setTimeout(() => { if (spark.parentNode) spark.remove(); }, 600);
            }
        });

        // 2. Magnetic Buttons with improved smoothing
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline, .option-btn, .music-control');
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Gentler pull with better interpolation
                this.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.02)`;
            });

            btn.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });

        // 3. Floating Parallax Elements Spawning
        const parallaxLayer = document.getElementById('parallax-layer');
        if (parallaxLayer) {
            const icons = ['fa-heart', 'fa-sparkles', 'fa-star', 'fa-moon'];
            for (let i = 0; i < 20; i++) {
                const item = document.createElement('i');
                const icon = icons[Math.floor(Math.random() * icons.length)];
                item.className = `fas ${icon} float-item float-sparkle`;
                item.style.left = Math.random() * 100 + 'vw';
                item.style.top = Math.random() * 100 + 'vh';
                item.style.animationDelay = Math.random() * 5 + 's';
                // Assign a "depth" for parallax
                item.dataset.depth = Math.random() * 0.5 + 0.1;
                parallaxLayer.appendChild(item);
            }

            document.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
                
                const items = parallaxLayer.querySelectorAll('.float-item');
                items.forEach(item => {
                    const depth = parseFloat(item.dataset.depth);
                    item.style.transform = `translate(${moveX * depth * 50}px, ${moveY * depth * 50}px)`;
                });
            });
            
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const items = parallaxLayer.querySelectorAll('.float-item');
                items.forEach(item => {
                    const depth = parseFloat(item.dataset.depth);
                    item.style.transform = `translateY(${-scrolled * depth * 0.2}px)`;
                });
            });
        }

        // 4. Scroll-triggered Reveal Animations (Cinematic Staged)
        const revealElements = document.querySelectorAll('.reveal, .hero, .content-section, .surprise-section');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Choreographed Staging
                    const header = entry.target.querySelector('.section-title, .hero h1');
                    const items = entry.target.querySelectorAll('.gallery-item, .video-card, .timeline-item, .reveal-child, .staged-item');
                    
                    if (header) {
                        header.style.transitionDelay = '0.1s';
                    }
                    
                    items.forEach((item, index) => {
                        // Incremental delays for a ripple/staged effect
                        item.style.transitionDelay = `${0.3 + (index * 0.1)}s`;
                    });
                }
            });
        }, { 
            threshold: 0.2, // Trigger when 20% visible for smoother anticipation
            rootMargin: "0px 0px -5% 0px"
        });

        revealElements.forEach(el => {
            if (!el.classList.contains('reveal')) el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }
});
