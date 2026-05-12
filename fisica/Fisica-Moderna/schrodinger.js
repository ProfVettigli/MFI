// Equazione di Schrödinger - Interactive Components

const HBAR = 1.054571817e-34; // ℏ (J·s)
const ME = 9.1093837015e-31; // Electron mass (kg)
const PI = Math.PI;

// ============================================================================
// PARTICELLA IN UNA SCATOLA
// ============================================================================

function initParticleInBox() {
    const nSlider = document.getElementById('box-n');
    const nVal = document.getElementById('box-n-val');
    const eResult = document.getElementById('box-e');
    const nodesResult = document.getElementById('box-nodes');
    const canvas = document.getElementById('box-canvas');
    const ctx = canvas.getContext('2d');

    const L = 1e-10; // Box width: 1 Ångström

    function drawBox() {
        const n = parseInt(nSlider.value);
        nVal.textContent = 'n = ' + n;

        // Energy level (in units of π²ℏ²/(2mL²))
        const eUnit = (PI * PI * HBAR * HBAR) / (2 * ME * L * L);
        const energy = eUnit * n * n;
        eResult.textContent = 'E' + n + ' = ' + n + '² × π²ℏ²/(2mL²) = ' + (energy / 1.602176634e-19).toExponential(2) + ' eV';

        const nodes = n - 1;
        nodesResult.textContent = nodes;

        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;
        const graphX = padding;
        const graphY = padding;
        const graphWidth = w - padding * 2;
        const graphHeight = h - padding * 2;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw box walls (potential)
        ctx.strokeStyle = 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(graphX, graphY);
        ctx.lineTo(graphX, graphY + graphHeight);
        ctx.moveTo(graphX + graphWidth, graphY);
        ctx.lineTo(graphX + graphWidth, graphY + graphHeight);
        ctx.stroke();

        // Center line (x=L/2)
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(graphX + graphWidth / 2, graphY);
        ctx.lineTo(graphX + graphWidth / 2, graphY + graphHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw wavefunction ψ(x) = sqrt(2/L) sin(nπx/L)
        ctx.strokeStyle = 'rgba(100,150,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const centerY = graphY + graphHeight / 2;
        const amplitude = graphHeight * 0.3;

        for (let px = 0; px <= graphWidth; px += 1) {
            const x = px / graphWidth; // Normalized position 0 to 1
            const psi = Math.sqrt(2 / L) * Math.sin(n * PI * x);
            const psiNorm = psi / Math.sqrt(2 / L); // Normalize for display
            const y = centerY - psiNorm * amplitude;

            if (px === 0) ctx.moveTo(graphX + px, y);
            else ctx.lineTo(graphX + px, y);
        }
        ctx.stroke();

        // Draw probability density |ψ(x)|²
        ctx.strokeStyle = 'rgba(255,150,100,0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let px = 0; px <= graphWidth; px += 1) {
            const x = px / graphWidth;
            const psi = Math.sqrt(2 / L) * Math.sin(n * PI * x);
            const psiSq = psi * psi;
            const psiSqNorm = psiSq / (2 / L); // Normalize for display
            const y = centerY - psiSqNorm * amplitude * 0.5;

            if (px === 0) ctx.moveTo(graphX + px, y);
            else ctx.lineTo(graphX + px, y);
        }
        ctx.stroke();

        // Mark nodes
        for (let i = 1; i < n; i++) {
            const nodeX = graphX + (i / n) * graphWidth;
            ctx.fillStyle = 'rgba(255,100,100,0.5)';
            ctx.beginPath();
            ctx.arc(nodeX, centerY, 4, 0, PI * 2);
            ctx.fill();
        }

        // Legend
        ctx.fillStyle = 'rgba(100,150,255,0.6)';
        ctx.fillRect(w - 180, padding + 10, 160, 15);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ψ(x) wavefunction', w - 170, padding + 22);

        ctx.fillStyle = 'rgba(255,150,100,0.6)';
        ctx.fillRect(w - 180, padding + 30, 160, 15);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('|ψ(x)|² probability', w - 170, padding + 42);
    }

    nSlider.addEventListener('input', drawBox);
    drawBox();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Che cosa rappresenta la funzione d'onda ψ(x)?",
            options: [
                "La posizione esatta della particella",
                "L'ampiezza di probabilità; il quadrato |ψ|² è la densità di probabilità",
                "L'energia della particella",
                "La velocità della particella"
            ],
            correct: 1
        },
        {
            q: "Quale è la forma generale dell'equazione di Schrödinger dipendente dal tempo?",
            options: [
                "iℏ (∂ψ/∂t) = −(ℏ²/2m) (∂²ψ/∂x²) + V(x) ψ",
                "mψ̈ = F",
                "E = mc²",
                "Δx · Δp ≥ ℏ/2"
            ],
            correct: 0
        },
        {
            q: "Cosa significa 'sovrapposizione' in meccanica quantistica?",
            options: [
                "Una particella è in due posti contemporaneamente",
                "Una particella può trovarsi in una combinazione lineare di stati, finché non viene misurata",
                "La particella si muove su una traiettoria",
                "La particella non esiste"
            ],
            correct: 1
        },
        {
            q: "Per una particella in una scatola di larghezza L, quale è il livello di energia minimo?",
            options: [
                "E = 0",
                "E = π²ℏ²/(2mL²)",
                "E = hf",
                "E = mc²"
            ],
            correct: 1
        },
        {
            q: "Qual è il significato del gatto di Schrödinger?",
            options: [
                "Un gatto davvero è intrappolato in una scatola",
                "Una critica all'interpretazione probabilistica: un sistema macroscopico non può essere in sovrapposizione reale",
                "Una dimostrazione che i gatti obbediscono alla meccanica quantistica",
                "Una spiegazione di come misurare le particelle"
            ],
            correct: 1
        },
        {
            q: "Chi ha proposto l'interpretazione probabilistica della funzione d'onda?",
            options: [
                "Schrödinger",
                "Heisenberg",
                "Max Born",
                "Dirac"
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
    if (document.getElementById('box-canvas')) initParticleInBox();
    if (document.getElementById('quiz-area')) initQuiz();
});
