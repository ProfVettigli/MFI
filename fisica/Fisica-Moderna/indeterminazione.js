// Principio di Indeterminazione - Interactive Components

const HBAR = 1.054571817e-34; // ℏ = h/(2π) (J·s)
const ME = 9.1093837015e-31; // Electron mass (kg)
const E_CHARGE = 1.602176634e-19; // Charge (C)

// ============================================================================
// VISUALIZZATORE DI INDETERMINAZIONE
// ============================================================================

function initUncertainty() {
    const dxSlider = document.getElementById('unc-dx');
    const dxVal = document.getElementById('unc-dx-val');
    const dpResult = document.getElementById('unc-dp');
    const ratioResult = document.getElementById('unc-ratio');
    const canvas = document.getElementById('unc-canvas');
    const ctx = canvas.getContext('2d');

    function drawUncertainty() {
        const dxFactor = parseFloat(dxSlider.value);
        const dxMeters = dxFactor * 1e-11; // Convert to meters
        dxVal.textContent = dxFactor.toFixed(1) + ' × 10⁻¹¹ m';

        // Uncertainty in momentum from Heisenberg
        const dpMin = HBAR / (2 * dxMeters);
        dpResult.textContent = dpMin.toExponential(2) + ' kg·m/s';

        // Ratio (should be at minimum ≥ 1)
        const ratio = (dxMeters * dpMin) / (HBAR / 2);
        ratioResult.textContent = ratio.toFixed(2);

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw position probability distribution (Gaussian, blue)
        ctx.strokeStyle = 'rgba(100,150,255,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            // Normalized Gaussian centered at cx
            const normalized_x = (x - cx) / (dxMeters * 3e11);
            const gaussian = Math.exp(-0.5 * normalized_x * normalized_x);
            const y = cy - 60 - gaussian * 80;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw momentum probability distribution (red, inverse width)
        ctx.strokeStyle = 'rgba(255,100,100,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const momentumWidth = (HBAR / dxMeters) * 5e-25; // Inverse relation
        for (let x = 0; x < w; x++) {
            const normalized_p = (x - cx) / (momentumWidth * 5e24);
            const gaussian = Math.exp(-0.5 * normalized_p * normalized_p);
            const y = cy + 60 + gaussian * 80;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw uncertainty ranges
        ctx.strokeStyle = 'rgba(100,150,255,0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        const dxDisplay = dxMeters * 3e11;
        ctx.moveTo(cx - dxDisplay, cy - 60 - 80);
        ctx.lineTo(cx - dxDisplay, cy - 60 + 80);
        ctx.moveTo(cx + dxDisplay, cy - 60 - 80);
        ctx.lineTo(cx + dxDisplay, cy - 60 + 80);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,100,100,0.4)';
        const dpDisplay = momentumWidth * 5e24;
        ctx.beginPath();
        ctx.moveTo(cx - dpDisplay, cy + 60 - 80);
        ctx.lineTo(cx - dpDisplay, cy + 60 + 80);
        ctx.moveTo(cx + dpDisplay, cy + 60 - 80);
        ctx.lineTo(cx + dpDisplay, cy + 60 + 80);
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = 'rgba(100,150,255,0.7)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Posizione (Δx)', cx, cy - 40);

        ctx.fillStyle = 'rgba(255,100,100,0.7)';
        ctx.fillText('Quantità di Moto (Δp)', cx, cy + 140);
    }

    dxSlider.addEventListener('input', drawUncertainty);
    drawUncertainty();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Quale è la formulazione del principio di indeterminazione di Heisenberg?",
            options: [
                "Δx · Δp < ℏ/2",
                "Δx · Δp ≥ ℏ/2",
                "Δx + Δp ≥ ℏ",
                "Δx · Δp = 0"
            ],
            correct: 1
        },
        {
            q: "Cosa rappresenta il principio di indeterminazione?",
            options: [
                "Un limite della nostra tecnologia di misura",
                "Un limite della precisione del laboratorio",
                "Una proprietà fondamentale della realtà quantistica",
                "Un errore matematico nella teoria di Heisenberg"
            ],
            correct: 2
        },
        {
            q: "Se localizzazione un elettrone in uno spazio très pequeño (Δx molto piccolo), cosa accade?",
            options: [
                "L'incertezza sulla quantità di moto aumenta",
                "L'incertezza sulla quantità di moto diminuisce",
                "La quantità di moto diventa esattamente zero",
                "Non succede nulla"
            ],
            correct: 0
        },
        {
            q: "Quale coppia di grandezze NON è soggetta al principio di indeterminazione?",
            options: [
                "Posizione e quantità di moto",
                "Energia e tempo",
                "Momento angolare lungo x e lungo y",
                "Nessuna — tutte le variabili coniugate sono soggette"
            ],
            correct: 3
        },
        {
            q: "Chi ha scoperto il principio di indeterminazione?",
            options: [
                "Schrödinger",
                "Werner Heisenberg",
                "Niels Bohr",
                "Max Born"
            ],
            correct: 1
        },
        {
            q: "Quale effetto è una diretta conseguenza dell'indeterminazione posizione-quantità di moto?",
            options: [
                "L'effetto fotoelettrico",
                "L'effetto tunnel",
                "L'effetto Compton",
                "La diffrazione della luce"
            ],
            correct: 1
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
    if (document.getElementById('unc-canvas')) initUncertainty();
    if (document.getElementById('quiz-area')) initQuiz();
});
