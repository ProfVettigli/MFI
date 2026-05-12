// Relatività Generale - Interactive Components

const SOLAR_MASS = 1.989e30; // kg
const G = 6.674e-11; // m³/(kg·s²)
const C = 299792458; // m/s

// ============================================================================
// CURVATURA SPAZIO-TEMPO
// ============================================================================

function initSpacetimeCurve() {
    const massSlider = document.getElementById('curve-mass');
    const massVal = document.getElementById('curve-mass-val');
    const rsResult = document.getElementById('curve-rs');
    const canvas = document.getElementById('spacetime-canvas');
    const ctx = canvas.getContext('2d');

    function drawSpacetime() {
        const mass = parseFloat(massSlider.value);
        massVal.textContent = mass.toFixed(1) + ' M☉';

        // Schwarzschild radius
        const rsMeters = (2 * G * mass * SOLAR_MASS) / (C * C);
        const rsKm = rsMeters / 1000;
        rsResult.textContent = rsKm.toFixed(2) + ' km';

        // Draw spacetime grid with curvature
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = 0.08;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw curved grid lines
        ctx.strokeStyle = 'rgba(16,185,129,0.2)';
        ctx.lineWidth = 0.5;

        // Radial lines (bent by gravity)
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            ctx.beginPath();
            for (let r = 0; r < 150; r += 2) {
                const curveFactor = 1 + mass * 3 / (r + 5);
                const x = cx + r * Math.cos(angle) * curveFactor * scale;
                const y = cy + r * Math.sin(angle) * curveFactor * scale;
                if (r === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Concentric circles (deformed)
        for (let r = 20; r < 150; r += 20) {
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const curveFactor = 1 + mass * 3 / (r + 5);
                const x = cx + r * Math.cos(angle) * curveFactor * scale;
                const y = cy + r * Math.sin(angle) * curveFactor * scale;
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw the mass (Sun)
        const sunRadius = Math.max(8, 20 * Math.pow(mass / 5, 0.3));
        ctx.fillStyle = 'rgba(16,185,129,0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(16,185,129,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Schwarzschild radius indicator
        const rsDisplay = Math.max(8, rsKm * scale * 50);
        ctx.strokeStyle = 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, rsDisplay, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    massSlider.addEventListener('input', drawSpacetime);
    drawSpacetime();
}

// ============================================================================
// ONDE GRAVITAZIONALI
// ============================================================================

function initGravitationalWaves() {
    const distSlider = document.getElementById('wave-dist');
    const distVal = document.getElementById('wave-dist-val');
    const ampResult = document.getElementById('wave-amp');
    const canvas = document.getElementById('wave-canvas');
    const ctx = canvas.getContext('2d');
    let animationTime = 0;

    function drawWaves() {
        const dist = parseFloat(distSlider.value);
        distVal.textContent = dist.toFixed(1) + ' Gly';

        // Amplitude decreases with distance
        const amplitude = 1e-21 / Math.pow(dist, 1.5);
        ampResult.textContent = amplitude.toExponential(1);

        const w = canvas.width;
        const h = canvas.height;
        const centerY = h / 2;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw two polarization modes (+ and ×)
        ctx.strokeStyle = 'rgba(16,185,129,0.6)';
        ctx.lineWidth = 2;

        // + polarization
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
            const t = (x / 50 + animationTime * 0.05) % (Math.PI * 2);
            const y = centerY - 40 + Math.sin(t) * 30 * Math.pow(amplitude * 1e21, 0.5);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // × polarization (90° rotated)
        ctx.strokeStyle = 'rgba(255,200,100,0.6)';
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
            const t = (x / 50 + animationTime * 0.05 + Math.PI / 4) % (Math.PI * 2);
            const y = centerY + 40 + Math.sin(t) * 30 * Math.pow(amplitude * 1e21, 0.5);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw detector sensitivity zones
        ctx.strokeStyle = 'rgba(100,100,255,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, centerY - 50);
        ctx.lineTo(w, centerY - 50);
        ctx.moveTo(0, centerY + 50);
        ctx.lineTo(w, centerY + 50);
        ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '11px monospace';
        ctx.fillText('+ polarization', 10, centerY - 55);
        ctx.fillText('× polarization', 10, centerY + 65);

        animationTime++;
        requestAnimationFrame(drawWaves);
    }

    distSlider.addEventListener('input', drawWaves);
    drawWaves();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Qual è l'affermazione corretta sulla relatività generale?",
            options: [
                "La gravità è una forza invisibile che tira gli oggetti",
                "La gravità è una curvatura dello spazio-tempo causata da massa ed energia",
                "Non esiste gravità, gli oggetti cadono per inerzia",
                "La gravità è più veloce della luce"
            ],
            correct: 1
        },
        {
            q: "Cosa è il raggio di Schwarzschild?",
            options: [
                "La distanza massima a cui si avverte la gravità",
                "Il confine di un buco nero, punto di non ritorno per la luce",
                "La distanza media della Terra dal Sole",
                "La velocità di rotazione di un buco nero"
            ],
            correct: 1
        },
        {
            q: "Come si generano le onde gravitazionali?",
            options: [
                "Dal movimento ordinario di qualsiasi oggetto",
                "Solo dai buchi neri isolati",
                "Da masse accelerate, come la fusione di due stelle di neutroni",
                "Dalla rotazione del Sole"
            ],
            correct: 2
        },
        {
            q: "Che anno è stata la prima osservazione diretta di onde gravitazionali?",
            options: ["1916", "1974", "2000", "2015"],
            correct: 3
        },
        {
            q: "Quale fisico ha confermato la deflessione della luce nel 1919?",
            options: ["Newton", "Maxwell", "Eddington", "Schwarzschild"],
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
    if (document.getElementById('spacetime-canvas')) initSpacetimeCurve();
    if (document.getElementById('wave-canvas')) initGravitationalWaves();
    if (document.getElementById('quiz-area')) initQuiz();
});
