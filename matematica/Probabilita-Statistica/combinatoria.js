/**
 * combinatoria.js
 * Interattività per la lezione di Calcolo Combinatorio (MFI)
 * Pascal's Triangle canvas, Binomial Expander, exercises
 */

/* =============================================
   UTILITIES
   ============================================= */

function showFeedback(id, ok, msg) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    el.textContent = msg;
    el.className = ok ? 'feedback correct' : 'feedback incorrect';
}

function factorial(n) {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function binCoeff(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    // Optimize: use smaller k
    if (k > n - k) k = n - k;
    let r = 1;
    for (let i = 0; i < k; i++) {
        r = r * (n - i) / (i + 1);
    }
    return Math.round(r);
}


/* =============================================
   FACTORIAL CALCULATOR
   ============================================= */

function calcolaFattoriale() {
    const n = parseInt(document.getElementById('fact-input').value);
    const out = document.getElementById('factorial-output');
    if (isNaN(n) || n < 0 || n > 20) {
        out.innerHTML = '<span style="color:#EF4444">Inserisci un numero tra 0 e 20</span>';
        return;
    }
    if (n === 0) {
        out.innerHTML = '<span style="color:#818CF8;font-weight:700">0! = 1</span> <span style="color:var(--text-muted)">(per convenzione)</span>';
        return;
    }
    // Step-by-step
    let steps = [];
    for (let i = n; i >= 1; i--) steps.push(i);
    const result = factorial(n);
    const stepsStr = steps.join(' × ');
    out.innerHTML = `<span style="color:#818CF8;font-weight:700">${n}!</span> = ${stepsStr} = <strong style="color:#10B981;font-size:1.2rem">${result.toLocaleString('it-IT')}</strong>`;
}


/* =============================================
   PASCAL'S TRIANGLE (Canvas)
   ============================================= */

const COLORS_TRIANGLE = [
    '#6366F1', '#818CF8', '#A78BFA', '#C4B5FD',
    '#EC4899', '#F472B6', '#F9A8D4',
    '#3B82F6', '#60A5FA', '#93C5FD'
];

function drawPascalTriangle(numRows) {
    const canvas = document.getElementById('pascal-triangle');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cellSize = Math.min(50, W / (numRows + 2));
    const vertGap = Math.min(48, (H - 40) / numRows);
    const startY = 25;

    for (let row = 0; row < numRows; row++) {
        const y = startY + row * vertGap;
        const rowWidth = (row + 1) * cellSize;
        const startX = (W - rowWidth) / 2 + cellSize / 2;

        for (let k = 0; k <= row; k++) {
            const x = startX + k * cellSize;
            const val = binCoeff(row, k);

            // Circle background
            const radius = Math.min(cellSize / 2 - 2, 22);
            const intensity = Math.min(val / 20, 1);

            // Color based on value
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);

            if (val === 1) {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
            } else {
                const alpha = 0.15 + intensity * 0.3;
                ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
                ctx.strokeStyle = `rgba(236, 72, 153, ${0.4 + intensity * 0.3})`;
            }
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Number
            ctx.fillStyle = val === 1 ? 'rgba(255,255,255,0.7)' : '#fff';
            const fontSize = val >= 100 ? 10 : (val >= 10 ? 12 : 13);
            ctx.font = `bold ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x, y);
        }

        // Row label
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('n=' + row, 8, y);
    }

    // Connection lines (show sum relationship)
    if (numRows > 1) {
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let row = 0; row < numRows - 1; row++) {
            const y1 = startY + row * vertGap;
            const y2 = startY + (row + 1) * vertGap;
            const rowWidth1 = (row + 1) * cellSize;
            const startX1 = (W - rowWidth1) / 2 + cellSize / 2;
            const rowWidth2 = (row + 2) * cellSize;
            const startX2 = (W - rowWidth2) / 2 + cellSize / 2;
            const radius = Math.min(cellSize / 2 - 2, 22);

            for (let k = 0; k <= row; k++) {
                const x1 = startX1 + k * cellSize;
                // Line to left child
                const xL = startX2 + k * cellSize;
                ctx.beginPath();
                ctx.moveTo(x1, y1 + radius);
                ctx.lineTo(xL, y2 - radius);
                ctx.stroke();
                // Line to right child
                const xR = startX2 + (k + 1) * cellSize;
                ctx.beginPath();
                ctx.moveTo(x1, y1 + radius);
                ctx.lineTo(xR, y2 - radius);
                ctx.stroke();
            }
        }
    }
}

function aggiornaTriangolo() {
    const slider = document.getElementById('triangle-rows');
    const label = document.getElementById('triangle-rows-label');
    const n = parseInt(slider.value);
    label.textContent = n;
    drawPascalTriangle(n);
}


/* =============================================
   BINOMIAL EXPANDER
   ============================================= */

function expandBinomialLatex(n) {
    if (n === 0) return '1';
    let terms = [];
    for (let k = 0; k <= n; k++) {
        const coeff = binCoeff(n, k);
        const powA = n - k;
        const powB = k;

        let term = '';
        // Coefficient
        if (coeff !== 1 || (powA === 0 && powB === 0)) {
            term += coeff;
        }
        // a part
        if (powA > 0) {
            term += 'a';
            if (powA > 1) term += '^{' + powA + '}';
        }
        // b part
        if (powB > 0) {
            term += 'b';
            if (powB > 1) term += '^{' + powB + '}';
        }
        terms.push(term);
    }
    return terms.join(' + ');
}

function aggiornaBinomio() {
    const n = parseInt(document.getElementById('binom-n').value);
    const out = document.getElementById('expansion-output');
    const coeffsOut = document.getElementById('expansion-coeffs');

    if (isNaN(n) || n < 0 || n > 10) {
        out.innerHTML = '<span style="color:#EF4444">Inserisci n tra 0 e 10</span>';
        coeffsOut.textContent = '';
        return;
    }

    const latex = expandBinomialLatex(n);
    out.innerHTML = `$$(a+b)^{${n}} = ${latex}$$`;

    // Show coefficients
    let coeffs = [];
    for (let k = 0; k <= n; k++) coeffs.push(binCoeff(n, k));
    coeffsOut.textContent = `Coefficienti (riga ${n} del Triangolo): ${coeffs.join(', ')}  —  Somma: ${coeffs.reduce((a, b) => a + b, 0)} = 2^${n}`;

    // Re-render MathJax
    if (window.MathJax && MathJax.typeset) {
        MathJax.typeset([out]);
    }
}


/* =============================================
   EXERCISE CHECK FUNCTIONS
   ============================================= */

function checkFattoriale() {
    const ans = parseInt(document.getElementById('ans-fatt').value);
    if (ans === 5040) {
        showFeedback('feed-fatt', true, 'Esatto! 7! = 7×6×5×4×3×2×1 = 5040.');
    } else {
        showFeedback('feed-fatt', false, 'Non è corretto. Calcola 7×6×5×4×3×2×1. Riprova!');
    }
}

function checkPerm() {
    const ans = parseInt(document.getElementById('ans-perm').value);
    if (ans === 24) {
        showFeedback('feed-perm', true, 'Esatto! LUNA ha 4 lettere tutte diverse → P₄ = 4! = 24 anagrammi.');
    } else {
        showFeedback('feed-perm', false, 'Non è corretto. LUNA ha 4 lettere diverse, usa P₄ = 4!. Riprova!');
    }
}

function checkDisp() {
    const ans = parseInt(document.getElementById('ans-disp').value);
    if (ans === 720) {
        showFeedback('feed-disp', true, 'Esatto! D(10,3) = 10×9×8 = 720 podi diversi.');
    } else {
        showFeedback('feed-disp', false, 'Non è corretto. D(10,3) = 10!/(10-3)! = 10×9×8. Riprova!');
    }
}

function checkComb() {
    const ans = parseInt(document.getElementById('ans-comb').value);
    if (ans === 15) {
        showFeedback('feed-comb', true, 'Esatto! C(6,2) = 6!/(2!·4!) = (6×5)/(2×1) = 15 gruppi.');
    } else {
        showFeedback('feed-comb', false, 'Non è corretto. C(6,2) = 6!/(2!×4!) = (6×5)/(2×1). Riprova!');
    }
}

function checkTriangolo() {
    const ans = parseInt(document.getElementById('ans-triang').value);
    if (ans === 10) {
        showFeedback('feed-triang', true, 'Esatto! C(5,2) = 5!/(2!·3!) = (5×4)/(2×1) = 10.');
    } else {
        showFeedback('feed-triang', false, 'Non è corretto. Guarda la riga n=5: 1, 5, 10, 10, 5, 1. La posizione k=2 (terzo numero) è 10. Riprova!');
    }
}

function checkBinomio() {
    const ans = parseInt(document.getElementById('ans-binom').value);
    if (ans === 10) {
        showFeedback('feed-binom', true, 'Esatto! Il coefficiente di a³b² in (a+b)⁵ è C(5,2) = 10.');
    } else {
        showFeedback('feed-binom', false, 'Non è corretto. Il termine a^(n-k)·b^k ha coefficiente C(n,k). Qui k=2, quindi C(5,2) = 10. Riprova!');
    }
}

function checkEspansione() {
    const ans = parseInt(document.getElementById('ans-espansione').value);
    // (x+1)^3 = x³ + 3x² + 3x + 1 → coeff of x² is 3
    if (ans === 3) {
        showFeedback('feed-espansione', true, 'Esatto! (x+1)³ = x³ + 3x² + 3x + 1, quindi il coefficiente di x² è 3 = C(3,1)·1¹.');
    } else {
        showFeedback('feed-espansione', false, 'Non è corretto. Espandi (x+1)³ = x³ + 3x²·1 + 3x·1² + 1³. Il coefficiente di x² è C(3,1)×1 = 3. Riprova!');
    }
}


/* =============================================
   QUIZ FINALE (7 domande)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            q: "1. Quanto vale 0! (zero fattoriale)?",
            a: ["0", "1", "Non è definito", "Infinito"],
            c: 1
        },
        {
            q: "2. Quante permutazioni esistono di 4 oggetti distinti?",
            a: ["4", "16", "24", "256"],
            c: 2
        },
        {
            q: "3. Qual è la differenza fondamentale tra disposizioni e combinazioni?",
            a: ["Nelle disposizioni si usano tutti gli elementi.",
                "Nelle combinazioni l'ordine non conta, nelle disposizioni sì.",
                "Le combinazioni richiedono più calcoli.",
                "Non c'è differenza, sono sinonimi."],
            c: 1
        },
        {
            q: "4. Quanto vale C(5,3)?",
            a: ["60", "15", "10", "20"],
            c: 2
        },
        {
            q: "5. Nel triangolo di Tartaglia, ogni numero interno è:",
            a: ["Il prodotto dei due numeri sopra di lui.",
                "La somma dei due numeri sopra di lui.",
                "Il doppio del numero nella riga precedente.",
                "Sempre un numero primo."],
            c: 1
        },
        {
            q: "6. Il Binomio di Newton serve per:",
            a: ["Risolvere equazioni di secondo grado.",
                "Calcolare la radice quadrata.",
                "Espandere le potenze di un binomio (a+b)ⁿ.",
                "Trovare il massimo comun divisore."],
            c: 2
        },
        {
            q: "7. In (a−b)³, qual è il segno del termine con b³?",
            a: ["Positivo (+)", "Negativo (−)", "Dipende dai valori di a e b", "Zero"],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0, answered = 0;

    if (quizArea) {
        quizData.forEach((data) => {
            const card = document.createElement('div');
            card.style.cssText = 'margin-bottom:2.5rem;padding:1.5rem;border-radius:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05)';

            card.innerHTML = `<h3 style="margin-bottom:1rem;color:#fff;font-size:1.1rem">${data.q}</h3>`;
            const optGrp = document.createElement('div');
            optGrp.style.cssText = 'display:flex;flex-direction:column;gap:10px';

            data.a.forEach((opt, oIdx) => {
                const btn = document.createElement('button');
                btn.textContent = opt;
                btn.style.cssText = 'text-align:left;padding:1rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:white;border-radius:8px;cursor:pointer;transition:.3s;font-size:.95rem;font-family:inherit';

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    if (oIdx === data.c) {
                        btn.style.background = '#10B981';
                        btn.style.borderColor = '#10B981';
                        btn.innerHTML += ' <strong>✓ Esatto!</strong>';
                        if (!card.classList.contains('attempted')) score++;
                        for (let s of optGrp.children) {
                            s.style.pointerEvents = 'none';
                            s.style.opacity = s === btn ? '1' : '0.5';
                        }
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= quizData.length - 1 ? '#10B981' : '#F59E0B';
                        }
                    } else {
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.innerHTML += ' <strong>✗ Sbagliato, riprova</strong>';
                        btn.classList.add('picked');
                        btn.style.pointerEvents = 'none';
                        card.classList.add('attempted');
                    }
                };
                optGrp.appendChild(btn);
            });

            card.appendChild(optGrp);
            quizArea.appendChild(card);
        });
    }

    /* =============================================
       INIT: Draw triangle, compute factorial, expand binomial
       ============================================= */

    // Pascal's Triangle
    drawPascalTriangle(7);
    document.getElementById('triangle-rows').addEventListener('input', aggiornaTriangolo);

    // Default factorial
    calcolaFattoriale();

    // Default binomial expansion
    aggiornaBinomio();
});
