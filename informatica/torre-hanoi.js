document.addEventListener('DOMContentLoaded', () => {

    const stage = document.getElementById('hanoi-stage');
    const moveCountEl = document.getElementById('move-count');
    const optimalEl = document.getElementById('optimal-moves');
    const statusEl = document.getElementById('game-status');
    const discsSelect = document.getElementById('num-discs');
    const resetBtn = document.getElementById('reset-game');
    const autoBtn = document.getElementById('auto-solve');

    let numDiscs = 4;
    let rods = [[], [], []];
    let selectedRod = null;
    let moveCount = 0;
    let autoRunning = false;

    const discColors = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#A855F7', '#EF4444', '#06B6D4'];

    function initGame() {
        numDiscs = parseInt(discsSelect.value, 10);
        rods = [[], [], []];
        for (let i = numDiscs; i >= 1; i--) rods[0].push(i);
        selectedRod = null;
        moveCount = 0;
        moveCountEl.textContent = '0';
        optimalEl.textContent = (Math.pow(2, numDiscs) - 1).toString();
        statusEl.textContent = 'Clicca una colonna per iniziare';
        statusEl.style.color = '';
        autoRunning = false;
        render();
    }

    function discWidth(size) {
        const minPct = 35;
        const maxPct = 95;
        const pct = minPct + (maxPct - minPct) * (size / numDiscs);
        return pct + '%';
    }

    function render() {
        const rodEls = stage.querySelectorAll('.hanoi-rod');
        rodEls.forEach((rodEl, i) => {
            rodEl.querySelectorAll('.disc').forEach(d => d.remove());
            rodEl.classList.toggle('selected', selectedRod === i);
            const stack = rods[i];
            stack.forEach((size, idx) => {
                const disc = document.createElement('div');
                disc.className = 'disc';
                if (idx === stack.length - 1) disc.classList.add('top');
                disc.style.width = discWidth(size);
                disc.style.background = `linear-gradient(135deg, ${discColors[size - 1]}, ${discColors[size - 1]}cc)`;
                disc.textContent = size;
                rodEl.insertBefore(disc, rodEl.querySelector('.hanoi-rod-label'));
            });
        });
    }

    function tryMove(from, to) {
        if (from === to) return false;
        if (rods[from].length === 0) return false;
        const disc = rods[from][rods[from].length - 1];
        const topTo = rods[to][rods[to].length - 1];
        if (topTo !== undefined && topTo < disc) return false;
        rods[from].pop();
        rods[to].push(disc);
        moveCount++;
        moveCountEl.textContent = moveCount.toString();
        return true;
    }

    function checkWin() {
        if (rods[2].length === numDiscs) {
            const optimal = Math.pow(2, numDiscs) - 1;
            statusEl.style.color = 'var(--physics-color)';
            if (moveCount === optimal) {
                statusEl.textContent = `PERFETTO! Soluzione ottimale in ${moveCount} mosse!`;
            } else {
                statusEl.textContent = `Vinto in ${moveCount} mosse (ottimale: ${optimal})`;
            }
            return true;
        }
        return false;
    }

    function handleRodClick(rodIdx) {
        if (autoRunning) return;
        if (rods[2].length === numDiscs) return;
        if (selectedRod === null) {
            if (rods[rodIdx].length === 0) {
                statusEl.textContent = 'Colonna vuota: scegline una con dischi';
                statusEl.style.color = '#EF4444';
                return;
            }
            selectedRod = rodIdx;
            statusEl.style.color = '';
            statusEl.textContent = `Selezionata colonna ${['A','B','C'][rodIdx]} — scegli dove spostare`;
            render();
        } else {
            if (selectedRod === rodIdx) {
                selectedRod = null;
                statusEl.textContent = 'Deselezionato';
                render();
                return;
            }
            const ok = tryMove(selectedRod, rodIdx);
            if (!ok) {
                statusEl.style.color = '#EF4444';
                statusEl.textContent = 'Mossa illegale: non si puo posare un disco grande su uno piccolo';
            } else {
                statusEl.style.color = '';
                statusEl.textContent = `Mossa eseguita`;
            }
            selectedRod = null;
            render();
            checkWin();
        }
    }

    stage.querySelectorAll('.hanoi-rod').forEach((rodEl) => {
        rodEl.addEventListener('click', () => {
            const idx = parseInt(rodEl.dataset.rod, 10);
            handleRodClick(idx);
        });
    });

    function computeMoves(n, from, via, to, list) {
        if (n === 0) return;
        computeMoves(n - 1, from, to, via, list);
        list.push([from, to]);
        computeMoves(n - 1, via, from, to, list);
    }

    function autoSolve() {
        if (autoRunning) return;
        const moves = [];
        rods = [[], [], []];
        for (let i = numDiscs; i >= 1; i--) rods[0].push(i);
        moveCount = 0;
        moveCountEl.textContent = '0';
        selectedRod = null;
        render();
        computeMoves(numDiscs, 0, 1, 2, moves);
        autoRunning = true;
        let i = 0;
        const speed = Math.max(80, 600 / numDiscs);
        const interval = setInterval(() => {
            if (i >= moves.length) {
                clearInterval(interval);
                autoRunning = false;
                checkWin();
                return;
            }
            tryMove(moves[i][0], moves[i][1]);
            render();
            i++;
        }, speed);
    }

    if (resetBtn) resetBtn.addEventListener('click', initGame);
    if (discsSelect) discsSelect.addEventListener('change', initGame);
    if (autoBtn) autoBtn.addEventListener('click', autoSolve);

    initGame();

    const traceN = document.getElementById('trace-n');
    const generateTraceBtn = document.getElementById('generate-trace');
    const traceOutput = document.getElementById('trace-output');

    function buildTrace(n, from, via, to, lines, level) {
        const indent = level;
        if (n === 0) {
            lines.push({ text: `hanoi(0): caso base, return`, level: indent });
            return;
        }
        lines.push({ text: `hanoi(${n}, ${from} -> ${to} via ${via})`, level: indent });
        buildTrace(n - 1, from, to, via, lines, level + 1);
        lines.push({ text: `sposta disco ${n} da ${from} a ${to}`, level: indent + 1 });
        buildTrace(n - 1, via, from, to, lines, level + 1);
    }

    function generateTrace() {
        const n = parseInt(traceN.value, 10);
        const lines = [];
        buildTrace(n, 'A', 'B', 'C', lines, 0);
        traceOutput.innerHTML = lines.map(l => {
            const cls = `level-${Math.min(l.level, 4)}`;
            return `<div class="${cls}">${l.text}</div>`;
        }).join('');
    }

    if (generateTraceBtn) {
        generateTraceBtn.addEventListener('click', generateTrace);
        generateTrace();
    }

    const calcN = document.getElementById('calc-n');
    const calcResult = document.getElementById('calc-result');
    const calcTime = document.getElementById('calc-time');

    function formatNumber(n) {
        if (n < 1000) return n.toString();
        return n.toLocaleString('it-IT');
    }

    function formatTime(seconds) {
        if (seconds < 60) return `${seconds.toFixed(0)} secondi`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minuti`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} ore`;
        if (seconds < 31557600) return `${(seconds / 86400).toFixed(1)} giorni`;
        const years = seconds / 31557600;
        if (years < 1000) return `${years.toFixed(1)} anni`;
        if (years < 1e6) return `${(years / 1000).toFixed(1)} mila anni`;
        if (years < 1e9) return `${(years / 1e6).toFixed(1)} milioni di anni`;
        return `${(years / 1e9).toFixed(2)} miliardi di anni`;
    }

    function updateCalc() {
        const n = parseInt(calcN.value, 10);
        if (isNaN(n) || n < 0 || n > 64) {
            calcResult.textContent = 'Inserisci 0-64';
            calcTime.textContent = '';
            return;
        }
        const moves = Math.pow(2, n) - 1;
        if (n <= 53) {
            calcResult.textContent = `${formatNumber(moves)} mosse`;
        } else {
            calcResult.textContent = `~2^${n} - 1 mosse (~${moves.toExponential(2)})`;
        }
        const seconds = moves;
        calcTime.textContent = `A una mossa al secondo: ${formatTime(seconds)}.`;
    }

    if (calcN) {
        calcN.addEventListener('input', updateCalc);
        updateCalc();
    }

    const quizData = [
        {
            question: "1. Secondo la leggenda, quanti dischi devono spostare i monaci di Hanoi nella sala segreta?",
            options: ["32", "64", "100"],
            correct: 1
        },
        {
            question: "2. Quale matematico francese invento davvero il rompicapo nel 1883?",
            options: ["Henri Poincare", "Edouard Lucas", "Joseph Fourier"],
            correct: 1
        },
        {
            question: "3. Quale di queste NON e una regola della Torre di Hanoi?",
            options: [
                "Si sposta un solo disco alla volta",
                "Non si puo mai mettere un disco grande sopra uno piccolo",
                "Bisogna passare prima per la colonna B"
            ],
            correct: 2
        },
        {
            question: "4. Quante mosse minime servono per risolvere il puzzle con 5 dischi?",
            options: ["25", "31", "32"],
            correct: 1
        },
        {
            question: "5. Qual e la formula generale per il numero minimo di mosse con N dischi?",
            options: ["N^2", "2^N - 1", "N!"],
            correct: 1
        },
        {
            question: "6. Cosa rende un algoritmo 'ricorsivo'?",
            options: [
                "Usa molti cicli for",
                "Chiama se stesso su istanze piu piccole del problema",
                "Funziona solo con i numeri pari"
            ],
            correct: 1
        },
        {
            question: "7. Nella soluzione ricorsiva di Hanoi, qual e il 'caso base' (la condizione di arresto)?",
            options: [
                "n == 1",
                "n == 0",
                "Quando tutti i dischi sono su C"
            ],
            correct: 1
        },
        {
            question: "8. La complessita della Torre di Hanoi e classificata come:",
            options: ["O(N)", "O(N log N)", "O(2^N) — esponenziale"],
            correct: 2
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). I monaci ti darebbero il loro tempio!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa ricorsione e complessita.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
