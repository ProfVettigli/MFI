document.addEventListener('DOMContentLoaded', () => {

    const GRID_SIZE = 16;
    const palette = [
        '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#FCD34D',
        '#10B981', '#3B82F6', '#A855F7', '#EC4899', '#78350F',
        '#F5DEB3', '#1a1f2e'
    ];
    let currentColor = '#EF4444';
    let isDrawing = false;
    const pixels = new Array(GRID_SIZE * GRID_SIZE).fill('#1a1f2e');

    const grid = document.getElementById('pixel-grid');
    const paletteEl = document.getElementById('palette');

    function buildGrid() {
        if (!grid) return;
        grid.innerHTML = '';
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'pixel-cell';
            cell.style.background = pixels[i];
            cell.dataset.idx = i;
            cell.addEventListener('mousedown', e => {
                e.preventDefault();
                isDrawing = true;
                paint(i);
            });
            cell.addEventListener('mouseenter', () => { if (isDrawing) paint(i); });
            cell.addEventListener('touchstart', e => { e.preventDefault(); paint(i); });
            grid.appendChild(cell);
        }
    }

    function paint(i) {
        pixels[i] = currentColor;
        const cell = grid.children[i];
        if (cell) cell.style.background = currentColor;
    }

    document.addEventListener('mouseup', () => { isDrawing = false; });

    function buildPalette() {
        if (!paletteEl) return;
        palette.forEach((c, i) => {
            const sw = document.createElement('div');
            sw.className = 'palette-swatch' + (c === currentColor ? ' active' : '');
            sw.style.background = c;
            sw.addEventListener('click', () => {
                currentColor = c;
                document.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
                sw.classList.add('active');
            });
            paletteEl.appendChild(sw);
        });
    }

    const marioSprite = [
        '................',
        '................',
        '.....RRRRR......',
        '....RRRRRRRR....',
        '....KKKFFKF.....',
        '...KFKFFFKFFF...',
        '...KFKKFFFKFFF..',
        '...KKFFFFKKKK...',
        '.....FFFFFFF....',
        '....RRBRRRBR....',
        '...RRRBRRRBRR...',
        '..RRRRBBBBRRRR..',
        '..FFRBYBBYBRFF..',
        '..FFFBBBBBBFFF..',
        '..FFBBBBBBBBFF..',
        '...BBBB..BBBB...'
    ];

    const heartSprite = [
        '................',
        '..RR.......RR...',
        '.RRRR.....RRRR..',
        'RRRRRR...RRRRRR.',
        'RRPPRRRRRRPRRRR.',
        'RRPPRRRRRRPRRRR.',
        'RRRRRRRRRRRRRRR.',
        '.RRRRRRRRRRRRRR.',
        '.RRRRRRRRRRRRR..',
        '..RRRRRRRRRRR...',
        '...RRRRRRRRR....',
        '....RRRRRRR.....',
        '.....RRRRR......',
        '......RRR.......',
        '.......R........',
        '................'
    ];

    const coinSprite = [
        '................',
        '.....YYYY.......',
        '....YOOOOY......',
        '...YOYYYYYO.....',
        '...YOY..YYO.....',
        '..YOY...YYO.....',
        '..YOY...YYO.....',
        '..YOY...YYO.....',
        '..YOY...YYO.....',
        '...YOY..YYO.....',
        '...YOY..YYO.....',
        '....YOYYYYO.....',
        '.....YOOOOO.....',
        '......YYYY......',
        '................',
        '................'
    ];

    const ghostSprite = [
        '....BBBBBB......',
        '...BBBBBBBB.....',
        '..BBWWBBBWWBB...',
        '..BWWWBBWWWWB...',
        '..BWBKBBWBKWB...',
        '..BWWWBBWWWWB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BBBBBBBBBBB...',
        '..BB.BB.BB.BB...',
        '..B...B...B.B...',
        '................'
    ];

    const colorMap = {
        '.': '#1a1f2e', 'R': '#EF4444', 'K': '#78350F', 'F': '#F5DEB3',
        'B': '#3B82F6', 'Y': '#FCD34D', 'O': '#F59E0B', 'W': '#FFFFFF',
        'P': '#FECDD3'
    };

    function loadSpriteData(spriteData) {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const ch = spriteData[y][x];
                pixels[y * GRID_SIZE + x] = colorMap[ch] || '#1a1f2e';
            }
        }
        buildGrid();
    }

    function clearGrid() {
        for (let i = 0; i < pixels.length; i++) pixels[i] = '#1a1f2e';
        buildGrid();
    }

    function drawToCanvas(canvas, spriteData) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const ch = spriteData[y][x];
                ctx.fillStyle = colorMap[ch] || '#1a1f2e';
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    function exportPNG() {
        const canvas = document.createElement('canvas');
        canvas.width = GRID_SIZE;
        canvas.height = GRID_SIZE;
        const ctx = canvas.getContext('2d');
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                ctx.fillStyle = pixels[y * GRID_SIZE + x];
                ctx.fillRect(x, y, 1, 1);
            }
        }
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    buildGrid();
    buildPalette();

    document.getElementById('ed-clear')?.addEventListener('click', clearGrid);
    document.getElementById('ed-mario')?.addEventListener('click', () => loadSpriteData(marioSprite));
    document.getElementById('ed-heart')?.addEventListener('click', () => loadSpriteData(heartSprite));
    document.getElementById('ed-export')?.addEventListener('click', exportPNG);

    drawToCanvas(document.getElementById('sprite-mario'), marioSprite);
    drawToCanvas(document.getElementById('sprite-heart'), heartSprite);
    drawToCanvas(document.getElementById('sprite-coin'), coinSprite);
    drawToCanvas(document.getElementById('sprite-ghost'), ghostSprite);

    function flipH(data) {
        return data.map(row => row.split('').reverse().join(''));
    }
    function rotate90(data) {
        const out = [];
        for (let y = 0; y < 16; y++) {
            let row = '';
            for (let x = 0; x < 16; x++) row += data[15 - x][y];
            out.push(row);
        }
        return out;
    }
    function zoomCrop(data) {
        const out = [];
        for (let y = 0; y < 16; y++) {
            let row = '';
            for (let x = 0; x < 16; x++) row += data[Math.floor(y / 2) + 4][Math.floor(x / 2) + 4];
            out.push(row);
        }
        return out;
    }

    drawToCanvas(document.getElementById('trans-original'), marioSprite);
    drawToCanvas(document.getElementById('trans-flip'), flipH(marioSprite));
    drawToCanvas(document.getElementById('trans-rot'), rotate90(marioSprite));
    drawToCanvas(document.getElementById('trans-zoom'), zoomCrop(marioSprite));

    const quizData = [
        {
            question: "1. In che anno esce Super Mario Bros per NES, lo sprite piu iconico della pixel art?",
            options: ["1981", "1985", "1990"],
            correct: 1
        },
        {
            question: "2. Quanti bit servono per memorizzare un pixel a colore RGB 'true color' (24-bit)?",
            options: ["8 bit", "16 bit", "24 bit (3 byte)"],
            correct: 2
        },
        {
            question: "3. Una palette a 8-bit puo rappresentare al massimo quanti colori diversi?",
            options: ["8", "64", "256"],
            correct: 2
        },
        {
            question: "4. Qual e la differenza principale tra uno sprite e un tile?",
            options: [
                "Lo sprite e in bianco/nero, il tile a colori",
                "Lo sprite si muove indipendente, il tile si ripete per costruire i livelli",
                "Sono sinonimi"
            ],
            correct: 1
        },
        {
            question: "5. Per ingrandire una pixel art mantenendola 'croccante' si usa l'algoritmo:",
            options: ["Bilineare", "Nearest neighbor", "Bicubico"],
            correct: 1
        },
        {
            question: "6. Quale formato e SBAGLIATO usare per la pixel art perche distrugge i bordi netti?",
            options: ["PNG", "GIF", "JPG"],
            correct: 2
        },
        {
            question: "7. Lo sprite originale di Mario e composto da:",
            options: ["8x8 pixel", "16x16 pixel", "32x32 pixel"],
            correct: 1
        },
        {
            question: "8. Quale gioco indie del 2018, premiato come 'capolavoro', usa pixel art moderna?",
            options: ["Celeste", "Fortnite", "Call of Duty"],
            correct: 0
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    function renderQuiz() {
        if (!quizArea) return;
        quizArea.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = '';

        quizData.forEach((q) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = '1rem';
            qTitle.style.fontWeight = '600';
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.cssText = 'display:flex; flex-direction:column; gap:0.8rem;';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                btn.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-main); padding:1rem; border-radius:0.5rem; cursor:pointer; text-align:left; font-size:1rem; font-family:inherit; transition:all 0.2s;';
                btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.1)'; };
                btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.05)'; };
                btn.onclick = () => {
                    if (btn.disabled) return;
                    if (optIndex === q.correct) {
                        btn.style.background = 'var(--physics-color)';
                        btn.style.borderColor = 'var(--physics-color)';
                        btn.style.color = '#fff';
                        btn.classList.add('correct');
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>X Riprova!</strong>';
                        btn.disabled = true;
                        btn.style.opacity = '0.7';
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showScore() {
        const scoreEl = document.getElementById('quiz-score');
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--physics-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a disegnare il tuo prossimo sprite!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa storia, sprite e formati.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
