// Crisi della Fisica Classica - Interactive Components

const H = 6.62607015e-34; // Costante di Planck (J·s)
const C = 299792458; // Velocità luce (m/s)
const KB = 1.380649e-23; // Costante Boltzmann (J/K)
const E_CHARGE = 1.602176634e-19; // Carica elementare (C)

// ============================================================================
// CORPO NERO
// ============================================================================

function initBlackbody() {
    const tempSlider = document.getElementById('bb-temp');
    const tempVal = document.getElementById('bb-temp-val');
    const peakVal = document.getElementById('bb-peak');
    const canvas = document.getElementById('bb-canvas');
    const ctx = canvas.getContext('2d');

    function drawBlackbody() {
        const T = parseFloat(tempSlider.value);
        tempVal.textContent = T + ' K';

        // Wien's displacement law: λ_max = b / T
        const wienConstant = 2.897771955e-3; // m·K
        const lambdaMax = wienConstant / T;
        const lambdaMaxNm = lambdaMax * 1e9;
        peakVal.textContent = lambdaMaxNm.toFixed(0) + ' nm';

        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;
        const graphWidth = w - padding * 2;
        const graphHeight = h - padding * 2;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw axes
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, h - padding);
        ctx.lineTo(w - padding, h - padding);
        ctx.stroke();

        // Grid lines and labels
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Wavelength (nm)', w / 2, h - 10);
        ctx.save();
        ctx.translate(15, h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Intensity', 0, 0);
        ctx.restore();

        // Draw classical Rayleigh-Jeans (diverges at high frequency)
        ctx.strokeStyle = 'rgba(100,150,255,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < graphWidth; x += 2) {
            const lambda = 100 + (x / graphWidth) * 4000; // 100-4100 nm
            const freq = C / (lambda * 1e-9);

            // Rayleigh-Jeans: I ∝ T/λ⁴ (classical, wrong at high freq)
            let intensity = (T / Math.pow(lambda, 4)) * 1e12;
            intensity = Math.min(intensity, graphHeight * 0.9); // Cap it

            const canvasX = padding + x;
            const canvasY = h - padding - intensity;
            if (x === 0) ctx.moveTo(canvasX, canvasY);
            else ctx.lineTo(canvasX, canvasY);
        }
        ctx.stroke();

        // Draw Planck's law (correct)
        ctx.strokeStyle = 'rgba(16,185,129,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < graphWidth; x += 2) {
            const lambda = 100 + (x / graphWidth) * 4000;
            const lambdaM = lambda * 1e-9;
            const freq = C / lambdaM;

            // Planck formula: I = (2hc²/λ⁵) / (exp(hc/λkT) - 1)
            const numerator = (2 * H * C * C) / Math.pow(lambdaM, 5);
            const exponent = (H * C) / (lambdaM * KB * T);
            const denominator = Math.exp(exponent) - 1;
            let intensity = (numerator / denominator) * 1e-12;

            intensity = Math.min(intensity, graphHeight * 0.9);

            const canvasX = padding + x;
            const canvasY = h - padding - intensity;
            if (x === 0) ctx.moveTo(canvasX, canvasY);
            else ctx.lineTo(canvasX, canvasY);
        }
        ctx.stroke();

        // Mark peak
        ctx.fillStyle = 'rgba(16,185,129,0.6)';
        ctx.beginPath();
        const peakX = padding + ((lambdaMaxNm - 100) / 4000) * graphWidth;
        ctx.arc(peakX, h - padding - graphHeight * 0.5, 5, 0, Math.PI * 2);
        ctx.fill();

        // Legend
        ctx.fillStyle = 'rgba(100,150,255,0.6)';
        ctx.fillRect(w - 220, padding + 10, 200, 15);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Classical (Rayleigh-Jeans)', w - 210, padding + 22);

        ctx.fillStyle = 'rgba(16,185,129,0.6)';
        ctx.fillRect(w - 220, padding + 30, 200, 15);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('Planck (Quantum)', w - 210, padding + 42);
    }

    tempSlider.addEventListener('input', drawBlackbody);
    drawBlackbody();
}

// ============================================================================
// EFFETTO FOTOELETTRICO
// ============================================================================

function initPhotoelectric() {
    const freqSlider = document.getElementById('pe-freq');
    const freqVal = document.getElementById('pe-freq-val');
    const eResult = document.getElementById('pe-e');
    const phiResult = document.getElementById('pe-phi');
    const keResult = document.getElementById('pe-ke');

    const metals = {
        'sodio': 2.28,
        'potassio': 2.30,
        'cesio': 2.10,
        'rame': 4.65,
        'tungsteno': 4.63
    };

    const workFunction = metals['sodio']; // eV (sodium)

    function updatePhotoelectric() {
        const freqFactor = parseFloat(freqSlider.value);
        const freqHz = freqFactor * 1e14;
        freqVal.textContent = freqFactor.toFixed(1) + ' × 10¹⁴ Hz';

        // Energy of photon: E = hf
        const ePhoton = (H * freqHz) / E_CHARGE; // Convert to eV
        eResult.textContent = ePhoton.toFixed(2) + ' eV';

        phiResult.textContent = workFunction.toFixed(2) + ' eV';

        // Kinetic energy: K = hf - Φ
        const ke = ePhoton - workFunction;
        keResult.textContent = ke.toFixed(2) + ' eV';

        // Color the result based on whether electrons are ejected
        if (ke < 0) {
            keResult.parentElement.style.borderLeftColor = 'rgba(255,100,100,0.8)';
        } else {
            keResult.parentElement.style.borderLeftColor = 'var(--physics-color)';
        }
    }

    freqSlider.addEventListener('input', updatePhotoelectric);
    updatePhotoelectric();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Cosa è la 'catastrofe ultravioletta'?",
            options: [
                "Una previsione della fisica classica che un corpo nero emetterebbe energia infinita ad alte frequenze",
                "L'effetto dei raggi UV sul corpo umano",
                "Una teoria sulla fine dell'universo",
                "Un fenomeno di assorbimento della luce"
            ],
            correct: 0
        },
        {
            q: "Come ha risolto Planck il problema del corpo nero?",
            options: [
                "Assumendo che l'energia sia quantizzata in pacchetti discreti E = hf",
                "Modificando la legge di Boltzmann",
                "Introducendo una nuova costante della natura",
                "Opzioni A e C sono corrette"
            ],
            correct: 3
        },
        {
            q: "Qual è l'effetto fotoelettrico?",
            options: [
                "La produzione di corrente illuminando un metallo",
                "La generazione di luce da parte di elettroni",
                "L'assorbimento di energia da parte degli atomi",
                "La riflessione della luce su superfici metalliche"
            ],
            correct: 0
        },
        {
            q: "Einstein ha vinto il Nobel nel 1921 per quale scoperta?",
            options: [
                "La relatività generale",
                "La relatività ristretta",
                "L'effetto fotoelettrico",
                "La costante di Planck"
            ],
            correct: 2
        },
        {
            q: "Cosa ha provato definitivamente l'effetto Compton nel 1923?",
            options: [
                "La natura ondulatoria della luce",
                "La natura corpuscolare della luce",
                "L'esistenza dei quanti",
                "La contrazione delle lunghezze"
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
    if (document.getElementById('bb-canvas')) initBlackbody();
    if (document.getElementById('pe-freq')) initPhotoelectric();
    if (document.getElementById('quiz-area')) initQuiz();
});
