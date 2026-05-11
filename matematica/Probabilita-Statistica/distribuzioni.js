/**
 * distribuzioni.js
 * Interattività per la lezione di Distribuzioni Statistiche (MFI)
 * Visualizzazioni dinamiche (Gauss, Poisson, T-Student)
 */

/* =============================================
   STAT MATH FUNCTIONS
   ============================================= */

/** Normal Density: f(x) = (1 / sigma*sqrt(2pi)) * exp(-0.5 * ((x-mu)/sigma)^2) */
function normalPDF(x, mu, sigma) {
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

/** Lorentz Density: f(x) = (1 / (pi * gamma)) * (1 / (1 + ((x - x0) / gamma)^2)) */
function lorentzPDF(x, x0, gamma) {
    const term = (x - x0) / gamma;
    return (1 / (Math.PI * gamma)) * (1 / (1 + term * term));
}

/** T-Student Density Approximation */
function tStudentPDF(x, df) {
    // Exact Gamma formula is complex for JS without a library, 
    // we'll use a simplified power-law approximation for visualization
    const coeff = 1 / (Math.sqrt(df) * 3.14159); // Normalizing roughly
    return Math.pow(1 + (x * x) / df, -(df + 1) / 2) * (df < 5 ? 0.35 : 0.4);
}

/** Poisson P(k) = (lambda^k * exp(-lambda)) / k! */
function poissonPMF(k, lambda) {
    if (k < 0) return 0;
    // Factorial helper
    function fact(n) {
        let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
    }
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / fact(k);
}


/* =============================================
   CHART DRAWING
   ============================================= */

/** Draw continuous curve */
function drawCurve(canvasId, func, xRange, params, color, clear = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    if (clear) ctx.clearRect(0, 0, W, H);

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const xMin = xRange[0], xMax = xRange[1];
    const yMax = 0.5; // Fixed height for comparison

    function toX(x) { return padding.left + ((x - xMin) / (xMax - xMin)) * chartW; }
    function toY(y) { return H - padding.bottom - (y / yMax) * chartH; }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, H - padding.bottom); ctx.lineTo(W - padding.right, H - padding.bottom); ctx.stroke();

    // Curve
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < chartW; i++) {
        const xVal = xMin + (i / chartW) * (xMax - xMin);
        const yVal = func(xVal, ...params);
        if (i === 0) ctx.moveTo(toX(xVal), toY(yVal));
        else ctx.lineTo(toX(xVal), toY(yVal));
    }
    ctx.stroke();

    // Fill area
    ctx.lineTo(padding.left + chartW, H - padding.bottom);
    ctx.lineTo(padding.left, H - padding.bottom);
    ctx.fillStyle = color + '22';
    ctx.fill();
}

/** Draw discrete distribution (Bars) */
function drawPoisson(canvasId, lambda) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const kMax = Math.max(15, lambda * 2.5);
    const yMax = 0.4;
    const barW = chartW / kMax;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i <= 4; i++) {
        const y = H - padding.bottom - (i / 4) * chartH * (yMax/yMax);
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke();
    }

    // Bars
    for (let k = 0; k < kMax; k++) {
        const p = poissonPMF(k, lambda);
        const x = padding.left + k * barW;
        const h = (p / yMax) * chartH;
        const y = H - padding.bottom - h;

        const grad = ctx.createLinearGradient(x, y, x, H - padding.bottom);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(1, '#ec489944');
        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barW - 4, h);
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '10px Inter, sans-serif';
        if (k % 2 === 0) ctx.fillText(k, x + barW/2 - 2, H - padding.bottom + 18);
    }
}


/* =============================================
   GALTON BOARD SIMULATION (Interactive Machine)
   ============================================= */

let galtonInterval = null;
let galtonBalls = [];
let galtonBins = Array(15).fill(0);
const GALTON_ROWS = 12;

function startGalton() {
    if (galtonInterval) return;
    galtonInterval = setInterval(() => {
        if (galtonBalls.length < 500) { // Increased limit
            galtonBalls.push({
                x: 300, 
                y: 20, 
                vx: (Math.random() - 0.5) * 1.5, 
                vy: 2.5, 
                row: 0,
                finished: false
            });
        }
    }, 100);
    requestAnimationFrame(animateGalton);
}

function drop100Balls() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            galtonBalls.push({
                x: 300 + (Math.random() - 0.5) * 10, 
                y: 20 + Math.random() * 50, 
                vx: (Math.random() - 0.5) * 2, 
                vy: 2.5 + Math.random() * 2, 
                row: 0,
                finished: false
            });
        }, i * 20); // Faster drop than interval
    }
    if (!galtonInterval) requestAnimationFrame(animateGalton);
}

function resetGalton() {
    clearInterval(galtonInterval);
    galtonInterval = null;
    galtonBalls = [];
    galtonBins = Array(15).fill(0);
}

function animateGalton() {
    const canvas = document.getElementById('galton-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const binWidth = W / galtonBins.length;
    const startY = 60;
    const rowSpacing = 22;

    // Draw Pegs (Chiodi)
    ctx.fillStyle = '#444';
    for (let r = 0; r < GALTON_ROWS; r++) {
        const rowXStart = 300 - (r * 15);
        for (let i = 0; i <= r; i++) {
            ctx.beginPath();
            ctx.arc(rowXStart + i * 30, startY + r * rowSpacing, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Update & Draw Balls
    ctx.fillStyle = '#3b82f6';
    galtonBalls.forEach((b, index) => {
        if (b.finished) return;

        b.y += b.vy;
        b.x += b.vx;

        // Collision with pegs
        const currentRow = Math.floor((b.y - startY + 10) / rowSpacing);
        if (currentRow > b.row && currentRow < GALTON_ROWS) {
            b.row = currentRow;
            // Random bounce
            b.vx = (Math.random() > 0.5 ? 1 : -1) * 2.5; 
            // Correct position slightly to avoid getting stuck
            const rowXStart = 300 - (currentRow * 15);
            const nearestPegX = Math.round((b.x - rowXStart) / 30) * 30 + rowXStart;
            b.x = nearestPegX + (b.vx > 0 ? 2 : -2);
        }

        // Reach bottom
        if (b.y > H - 60) {
            b.finished = true;
            const binIdx = Math.floor(b.x / binWidth);
            if (binIdx >= 0 && binIdx < galtonBins.length) {
                galtonBins[binIdx]++;
            }
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Bins (Accumulation)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    galtonBins.forEach((count, i) => {
        const h = count * 4;
        ctx.fillRect(i * binWidth + 2, H - h, binWidth - 4, h);
    });

    if (galtonInterval || galtonBalls.some(b => !b.finished)) {
        requestAnimationFrame(animateGalton);
    }
}


/* =============================================
   INITIALIZATION & SLIDERS
   ============================================= */

function updateGauss() {
    const mu = parseFloat(document.getElementById('slider-mu').value);
    const sigma = parseFloat(document.getElementById('slider-sigma').value);
    document.getElementById('val-mu').textContent = mu.toFixed(1);
    document.getElementById('val-sigma').textContent = sigma.toFixed(1);
    drawCurve('normal-dist-chart', normalPDF, [-6, 6], [mu, sigma], '#3b82f6');
}

function updatePoisson() {
    const lambda = parseFloat(document.getElementById('slider-lambda').value);
    document.getElementById('val-lambda').textContent = lambda.toFixed(1);
    drawPoisson('poisson-dist-chart', lambda);
}

function updateTStudent() {
    const df = parseInt(document.getElementById('slider-df').value);
    document.getElementById('val-df').textContent = df;
    
    // Draw Normal as background for comparison
    drawCurve('t-student-chart', normalPDF, [-5, 5], [0, 1], 'rgba(255,255,255,0.15)');
    // Layer T-Student over it
    drawCurve('t-student-chart', tStudentPDF, [-5, 5], [df], '#3b82f6', false);
}

function updateLorentz() {
    const x0 = parseFloat(document.getElementById('slider-x0').value);
    const gamma = parseFloat(document.getElementById('slider-gamma').value);
    document.getElementById('val-x0').textContent = x0.toFixed(1);
    document.getElementById('val-gamma').textContent = gamma.toFixed(1);
    drawCurve('lorentz-dist-chart', lorentzPDF, [-7, 7], [x0, gamma], '#3b82f6');
}


/* =============================================
   QUIZ LOGIC
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            q: "1. Nella distribuzione Normale, quanta probabilità cade entro ±1 deviazione standard dalla media?",
            a: ["Circa il 50%", "Circa il 68%", "Circa il 95%", "Sempre il 100%"],
            c: 1
        },
        {
            q: "2. Cosa succede alla curva Gaussiana se aumentiamo la Deviazione Standard (σ)?",
            a: ["Diventa più alta e stretta.", "Si sposta verso destra.", "Diventa più bassa e larga.", "Non cambia forma."],
            c: 2
        },
        {
            q: "3. La distribuzione di Lorentz (Cauchy) è nota per avere:",
            a: ["Assenza di code.", "Code pesanti (maggior probabilità di valori estremi).", "Una varianza molto piccola.", "Solamente numeri interi."],
            c: 1
        },
        {
            q: "4. Quale distribuzione useresti per modellare l'arrivo dei clienti in un negozio in un'ora?",
            a: ["Gaussiana", "Poisson", "Lorentz", "Binomiale"],
            c: 1
        },
        {
            q: "5. Cosa rappresentano i 'gradi di libertà' nella distribuzione T-Student?",
            a: ["La velocità di calcolo.", "Sono legati alla dimensione del campione (n-1).", "Il numero di picchi della curva.", "La probabilità di errore."],
            c: 1
        },
        {
            q: "6. Se il P-Value di un test è 0.02, cosa significa?",
            a: ["L'effetto è puramente casuale.", "Il risultato è statisticamente significativo (p < 0.05).", "Il test è fallito.", "Dobbiamo rifare le misure."],
            c: 1
        },
        {
            q: "7. Quando la T-Student diventa indistinguibile da una Normale Standard?",
            a: ["Quando il campione è molto piccolo.", "Quando i gradi di libertà tendono a infinito.", "Sempre, sono lo stesso grafico.", "Solo se la media è zero."],
            c: 1
        },
        {
            q: "8. In una distribuzione con Asimmetria Positiva (Skewness > 0):",
            a: ["La coda è più lunga verso sinistra.", "Media, Mediana e Moda coincidono.", "La coda è più lunga verso destra (valori alti).", "La curva è perfettamente a campana."],
            c: 2
        },
        {
            q: "9. Secondo la Legge dei Grandi Numeri, cosa succede se lanciamo una moneta milioni di volte?",
            a: ["La frazione di teste oscillerà selvaggiamente.", "Otterremo esattamente il 50% di teste in ogni blocco di 10 lanci.", "La frequenza relativa di teste convergerà stabilmente al 50%.", "Il caso diventerà imprevedibile."],
            c: 2
        },
        {
            q: "10. Quale teorema spiega perché la Gaussiana è così comune in natura?",
            a: ["Teorema di Pitagora", "Legge di Murphy", "Teorema del Limite Centrale", "Teorema di Bayes"],
            c: 2
        },
        {
            q: "11. Al crescere del numero di prove (n), a quale distribuzione tende la Binomiale?",
            a: ["Lorentz", "Poisson", "Gaussiana", "Esponenziale"],
            c: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0, answered = 0;

    if (quizArea) {
        quizData.forEach((data) => {
            const card = document.createElement('div');
            card.style.cssText = 'margin-bottom:2.5rem; padding:1.5rem; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05)';
            card.innerHTML = `<h3 style="margin-bottom:1rem; font-size: 1.1rem;">${data.q}</h3>`;
            
            const group = document.createElement('div');
            group.style.cssText = 'display:flex; flex-direction:column; gap:10px;';
            
            data.a.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.textContent = opt;
                btn.style.cssText = 'text-align:left; padding:1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:8px; cursor:pointer; transition:0.3s; font-family:inherit;';
                
                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    if (idx === data.c) {
                        btn.style.background = '#10b981';
                        btn.style.borderColor = '#10b981';
                        btn.innerHTML += ' <strong>✓ Esatto!</strong>';
                        if (!card.classList.contains('attempted')) score++;
                        for (let s of group.children) { s.style.pointerEvents = 'none'; s.style.opacity = s === btn ? '1' : '0.5'; }
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.textContent = `Punteggio: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= 9 ? '#10b981' : '#f59e0b';
                        }
                    } else {
                        btn.style.background = '#ef4444';
                        btn.style.borderColor = '#ef4444';
                        btn.innerHTML += ' <strong>✗ Sbagliato</strong>';
                        btn.classList.add('picked');
                        btn.style.pointerEvents = 'none';
                        card.classList.add('attempted');
                    }
                };
                group.appendChild(btn);
            });
            card.appendChild(group);
            quizArea.appendChild(card);
        });
    }

    /* Initialize chart curves */
    updateGauss();
    updatePoisson();
    updateTStudent();
    updateLorentz();

    /* Slider Events */
    document.getElementById('slider-mu').addEventListener('input', updateGauss);
    document.getElementById('slider-sigma').addEventListener('input', updateGauss);
    document.getElementById('slider-x0').addEventListener('input', updateLorentz);
    document.getElementById('slider-gamma').addEventListener('input', updateLorentz);
    document.getElementById('slider-lambda').addEventListener('input', updatePoisson);
    document.getElementById('slider-df').addEventListener('input', updateTStudent);
});
