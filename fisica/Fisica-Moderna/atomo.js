// Struttura dell'Atomo - Interactive Components

const PI = Math.PI;
const BOHR = 0.53e-10; // Bohr radius (m)

// ============================================================================
// ORBITAL VISUALIZER
// ============================================================================

function initOrbitalVisualizer() {
    const nSlider = document.getElementById('orbital-n');
    const lSlider = document.getElementById('orbital-l');
    const nVal = document.getElementById('orbital-n-val');
    const lVal = document.getElementById('orbital-l-val');
    const canvas = document.getElementById('orbital-canvas');
    const ctx = canvas.getContext('2d');

    const orbitalNames = ['s', 'p', 'd', 'f'];

    function radialProbability(r, n, l) {
        // Simplified radial probability function for hydrogen
        // P(r) ∝ r² |R(r)|²
        const rho = 2 * r / (n * BOHR);
        const factor = Math.exp(-rho / 2);
        const laguerre = 1; // Simplified: ignore Laguerre polynomial details
        return r * r * factor * factor * laguerre;
    }

    function drawOrbital() {
        const n = parseInt(nSlider.value);
        const l = parseInt(lSlider.value);

        // Update limits
        const maxL = n - 1;
        if (l > maxL) {
            lSlider.value = maxL;
            lSlider.max = maxL;
        } else {
            lSlider.max = maxL;
        }

        const lName = orbitalNames[l] || '?';
        nVal.textContent = 'n=' + n;
        lVal.textContent = 'l=' + l + ' (' + lName + ')';

        const w = canvas.width;
        const h = canvas.height;
        const padding = 30;
        const graphX = padding;
        const graphY = padding;
        const graphWidth = w - 2 * padding;
        const graphHeight = h - 2 * padding;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphHeight);
        ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
        ctx.moveTo(graphX, graphY);
        ctx.lineTo(graphX, graphY + graphHeight);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('|R(r)|²', graphX - 5, graphY + 5);
        ctx.textAlign = 'center';
        ctx.fillText('Distance (Bohr radii)', graphX + graphWidth / 2, h - 5);

        // Plot radial probability
        ctx.strokeStyle = 'rgba(244,113,33,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const maxR = n * n * 3 * BOHR;
        const maxProb = radialProbability(n * BOHR, n, l);

        for (let px = 0; px < graphWidth; px += 2) {
            const r = (px / graphWidth) * maxR;
            const prob = radialProbability(r, n, l);
            const y = graphY + graphHeight - (prob / maxProb) * graphHeight * 0.8;

            if (px === 0) ctx.moveTo(graphX + px, y);
            else ctx.lineTo(graphX + px, y);
        }
        ctx.stroke();

        // Fill under curve
        ctx.fillStyle = 'rgba(244,113,33,0.1)';
        ctx.fill();

        // Mark Bohr radius
        const bohrX = graphX + (BOHR / maxR) * graphWidth;
        ctx.strokeStyle = 'rgba(100,200,100,0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(bohrX, graphY);
        ctx.lineTo(bohrX, graphY + graphHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(100,200,100,0.6)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('a₀', bohrX, graphY + graphHeight + 15);

        // Info
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        const energy = -13.6 / (n * n);
        ctx.fillText(`Energia: ${energy.toFixed(2)} eV`, padding + 5, padding + 15);
    }

    function updateLimits() {
        const n = parseInt(nSlider.value);
        const maxL = n - 1;
        lSlider.max = maxL;
        if (parseInt(lSlider.value) > maxL) {
            lSlider.value = maxL;
        }
        drawOrbital();
    }

    nSlider.addEventListener('input', updateLimits);
    lSlider.addEventListener('input', drawOrbital);
    drawOrbital();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Quale scienziato scoprì il nucleo atomico con l'esperimento della lamina d'oro?",
            options: [
                "J.J. Thomson",
                "Niels Bohr",
                "Ernest Rutherford",
                "Erwin Schrödinger"
            ],
            correct: 2
        },
        {
            q: "Che cosa rappresenta il numero quantico n?",
            options: [
                "La forma dell'orbitale",
                "L'orientamento nello spazio",
                "L'energia e la grandezza dell'orbitale",
                "Lo spin dell'elettrone"
            ],
            correct: 2
        },
        {
            q: "Qual è la forma di un orbitale s?",
            options: [
                "Una campana",
                "Una sfera",
                "Un lobo",
                "Una treccia"
            ],
            correct: 1
        },
        {
            q: "Chi formulò il Principio di Esclusione?",
            options: [
                "Max Planck",
                "Werner Heisenberg",
                "Wolfgang Pauli",
                "Niels Bohr"
            ],
            correct: 2
        },
        {
            q: "Cosa afferma il Principio di Esclusione?",
            options: [
                "Un atomo non può avere due nucle",
                "Due elettroni non possono occupare lo stesso stato quantistico",
                "Gli orbitali non possono interagire",
                "Solo un elemento per tavola periodica"
            ],
            correct: 1
        },
        {
            q: "Come variano i periodi della tavola periodica?",
            options: [
                "Random",
                "Secondo il numero di protoni",
                "Secondo il riempimento degli orbitali esterni",
                "Non c'è pattern"
            ],
            correct: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => {
        return `
            <div class="quiz-item" style="margin-bottom: 2rem;">
                <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">${i + 1}. ${item.q}</p>
                <div style="display: grid; gap: 0.8rem;">
                    ${item.options.map((opt, j) => `
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 0.8rem; background: rgba(0,0,0,0.2); border-radius: 8px; transition: all 0.3s;">
                            <input type="radio" name="q${i}" value="${j}" style="margin-right: 1rem; cursor: pointer;" onchange="checkQuizAnswer(${i}, ${j}, ${item.correct})">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        const isCorrect = ansIndex === correctIndex;
        if (isCorrect) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Eccellente! Hai risposto correttamente a tutte ${quizData.length} domande!`;
            quizScore.style.color = 'var(--physics-color)';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('orbital-canvas')) initOrbitalVisualizer();
    if (document.getElementById('quiz-area')) initQuiz();
});
