document.addEventListener('DOMContentLoaded', () => {

    const factN = document.getElementById('fact-n');
    const factResult = document.getElementById('fact-result');
    const factTime = document.getElementById('fact-time');

    function formatBig(n) {
        if (n < 1e15) return n.toLocaleString('it-IT');
        return n.toExponential(3);
    }
    function factorial(n) {
        if (n > 170) return Infinity;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }
    function describeTime(seconds) {
        if (!isFinite(seconds)) return 'più tempo dell\'età dell\'universo';
        if (seconds < 1) return `${(seconds * 1000).toFixed(2)} millisecondi`;
        if (seconds < 60) return `${seconds.toFixed(1)} secondi`;
        if (seconds < 3600) return `${(seconds/60).toFixed(1)} minuti`;
        if (seconds < 86400) return `${(seconds/3600).toFixed(1)} ore`;
        if (seconds < 31557600) return `${(seconds/86400).toFixed(1)} giorni`;
        const years = seconds / 31557600;
        if (years < 1e6) return `${years.toFixed(1)} anni`;
        if (years < 1e9) return `${(years/1e6).toFixed(2)} milioni di anni`;
        if (years < 1e15) return `${(years/1e9).toFixed(2)} miliardi di anni`;
        return `~${years.toExponential(2)} anni (più della vita dell'universo)`;
    }
    function updateFactorial() {
        const n = Math.max(0, Math.min(170, parseInt(factN.value, 10) || 0));
        const f = factorial(n);
        factResult.textContent = formatBig(f);
        const seconds = f / 1e9;
        factTime.textContent = `A 1 miliardo di permutazioni al secondo: ${describeTime(seconds)}.`;
    }
    if (factN) {
        factN.addEventListener('input', updateFactorial);
        updateFactorial();
    }

    const canvas = document.getElementById('map-canvas');
    const cityCountEl = document.getElementById('city-count');
    const bruteDistEl = document.getElementById('brute-dist');
    const nnDistEl = document.getElementById('nn-dist');
    let cities = [];
    let brutePath = null;
    let nnPath = null;

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        draw();
    }

    function dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function pathLength(path) {
        let total = 0;
        for (let i = 0; i < path.length - 1; i++) total += dist(cities[path[i]], cities[path[i+1]]);
        return total;
    }

    function nearestNeighbor() {
        if (cities.length < 2) return null;
        const visited = new Set([0]);
        const path = [0];
        while (visited.size < cities.length) {
            const last = path[path.length - 1];
            let best = -1, bestD = Infinity;
            for (let i = 0; i < cities.length; i++) {
                if (visited.has(i)) continue;
                const d = dist(cities[last], cities[i]);
                if (d < bestD) { bestD = d; best = i; }
            }
            path.push(best);
            visited.add(best);
        }
        path.push(0);
        return path;
    }

    function bruteForce() {
        if (cities.length < 2) return null;
        if (cities.length > 9) return 'TOO_BIG';
        const rest = [];
        for (let i = 1; i < cities.length; i++) rest.push(i);
        let bestPath = null, bestLen = Infinity;
        function permute(arr, start) {
            if (start === arr.length) {
                const p = [0, ...arr, 0];
                const len = pathLength(p);
                if (len < bestLen) { bestLen = len; bestPath = p.slice(); }
                return;
            }
            for (let i = start; i < arr.length; i++) {
                [arr[start], arr[i]] = [arr[i], arr[start]];
                permute(arr, start + 1);
                [arr[start], arr[i]] = [arr[i], arr[start]];
            }
        }
        permute(rest, 0);
        return bestPath;
    }

    function drawPath(path, color, lw) {
        if (!path || path.length < 2) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
        }
        ctx.stroke();
    }

    function draw() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = '#0B0E14';
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        if (nnPath) drawPath(nnPath, 'rgba(16,185,129,0.7)', 2);
        if (brutePath && brutePath !== 'TOO_BIG') drawPath(brutePath, 'rgba(245,158,11,0.9)', 2.5);

        cities.forEach((c, i) => {
            ctx.fillStyle = i === 0 ? '#EF4444' : '#F59E0B';
            ctx.beginPath();
            ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + '', c.x, c.y);
        });

        cityCountEl.textContent = cities.length;
    }

    if (canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (cities.length >= 20) return;
            cities.push({ x, y });
            brutePath = null;
            nnPath = null;
            bruteDistEl.textContent = '—';
            nnDistEl.textContent = '—';
            draw();
        });
    }

    document.getElementById('clear-map')?.addEventListener('click', () => {
        cities = [];
        brutePath = null;
        nnPath = null;
        bruteDistEl.textContent = '—';
        nnDistEl.textContent = '—';
        draw();
    });

    document.getElementById('random-cities')?.addEventListener('click', () => {
        cities = [];
        const W = canvas.width, H = canvas.height;
        for (let i = 0; i < 8; i++) {
            cities.push({ x: 40 + Math.random() * (W - 80), y: 40 + Math.random() * (H - 80) });
        }
        brutePath = null;
        nnPath = null;
        bruteDistEl.textContent = '—';
        nnDistEl.textContent = '—';
        draw();
    });

    document.getElementById('solve-brute')?.addEventListener('click', () => {
        if (cities.length < 2) {
            bruteDistEl.textContent = 'serve N≥2';
            return;
        }
        if (cities.length > 9) {
            bruteDistEl.textContent = 'troppo!';
            return;
        }
        brutePath = bruteForce();
        bruteDistEl.textContent = pathLength(brutePath).toFixed(0);
        draw();
    });

    document.getElementById('solve-nn')?.addEventListener('click', () => {
        if (cities.length < 2) {
            nnDistEl.textContent = 'serve N≥2';
            return;
        }
        nnPath = nearestNeighbor();
        nnDistEl.textContent = pathLength(nnPath).toFixed(0);
        draw();
    });

    const quizData = [
        {
            question: "1. In che cosa consiste il problema del commesso viaggiatore (TSP)?",
            options: [
                "Trovare il prodotto piu economico tra N negozi",
                "Visitare N citta minimizzando la distanza totale e tornare al punto di partenza",
                "Determinare quali citta sono raggiungibili tra loro"
            ],
            correct: 1
        },
        {
            question: "2. Quante permutazioni esistono per visitare N citta (a meno di simmetrie)?",
            options: ["N", "N²", "N!"],
            correct: 2
        },
        {
            question: "3. Quanto vale 10! (dieci fattoriale)?",
            options: ["100", "1.000", "3.628.800"],
            correct: 2
        },
        {
            question: "4. Cosa significa che il TSP e un problema NP-completo?",
            options: [
                "Si risolve velocemente con calcolatori quantistici",
                "Non si conosce algoritmo polinomiale per risolverlo, ma una soluzione si verifica velocemente",
                "Ha sempre piu di una soluzione ottima"
            ],
            correct: 1
        },
        {
            question: "5. La domanda P = NP e:",
            options: [
                "Risolta nel 2010 da Andrew Wiles",
                "Uno dei sette Millennium Prize Problems irrisolti",
                "Un teorema dimostrato da Turing"
            ],
            correct: 1
        },
        {
            question: "6. L'algoritmo Nearest Neighbor:",
            options: [
                "Trova sempre il percorso ottimo",
                "E' un'euristica veloce ma non garantisce l'ottimalita",
                "Funziona solo con citta in linea retta"
            ],
            correct: 1
        },
        {
            question: "7. Quale di questi NON e un problema NP-completo?",
            options: ["Sudoku N×N", "Knapsack (zaino)", "Ordinare un array con QuickSort"],
            correct: 2
        },
        {
            question: "8. Il sistema ORION di UPS, basato su euristici TSP, ha permesso di:",
            options: [
                "Eliminare i furgoni a benzina",
                "Risparmiare milioni di litri di carburante evitando svolte a sinistra",
                "Consegnare in giornata in tutto il mondo"
            ],
            correct: 1
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Amazon ti assumerebbe domani!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa TSP, complessita ed euristici.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
