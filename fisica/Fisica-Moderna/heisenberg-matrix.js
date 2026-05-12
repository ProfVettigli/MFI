// Meccanica delle Matrici - Interactive Components

const PI = Math.PI;

// ============================================================================
// MATRIX OPERATOR VISUALIZER
// ============================================================================

function initMatrixOperator() {
    const nSlider = document.getElementById('matrix-n');
    const nVal = document.getElementById('matrix-n-val');
    const eigenResult = document.getElementById('eigenvalues');
    const hilbertDim = document.getElementById('hilbert-dim');
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function generateHamiltonian(n) {
        // Create a simple diagonal + off-diagonal matrix resembling quantum oscillator
        const H = [];
        for (let i = 0; i < n; i++) {
            H[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    H[i][j] = (i + 0.5); // Harmonic oscillator: E_n = (n+1/2)ℏω
                } else if (Math.abs(i - j) === 1) {
                    H[i][j] = 0.2 * Math.sqrt(Math.max(i, j)); // Coupling terms
                } else {
                    H[i][j] = 0;
                }
            }
        }
        return H;
    }

    function drawMatrix() {
        const n = parseInt(nSlider.value);
        nVal.textContent = 'n = ' + n;
        hilbertDim.textContent = 'ℋ = ℂ^' + n;

        const H = generateHamiltonian(n);

        // Estimate eigenvalues (simplified: diagonal elements dominate)
        let eigenvalues = H.map((row, i) => row[i]).sort((a, b) => a - b);
        eigenResult.textContent = eigenvalues.map((e, i) =>
            'E' + (i+1) + ' ≈ ' + e.toFixed(2) + 'ℏω'
        ).join(', ');

        const w = canvas.width;
        const h = canvas.height;
        const cellSize = Math.min((w - 20) / n, (h - 20) / n);
        const startX = (w - cellSize * n) / 2;
        const startY = (h - cellSize * n) / 2;

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, w, h);

        // Draw matrix
        const maxVal = Math.max(...H.flat().map(Math.abs));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const x = startX + j * cellSize;
                const y = startY + i * cellSize;
                const val = H[i][j];
                const intensity = Math.abs(val) / maxVal;

                const hue = val > 0 ? 0 : 240; // Red for positive, blue for negative
                ctx.fillStyle = `hsla(${hue}, 100%, ${50 - intensity * 30}%, 0.8)`;
                ctx.fillRect(x, y, cellSize, cellSize);

                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);

                // Label
                if (cellSize > 30) {
                    ctx.fillStyle = 'rgba(255,255,255,0.7)';
                    ctx.font = 'bold 9px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(val.toFixed(1), x + cellSize/2, y + cellSize/2);
                }
            }
        }

        // Title
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Matrice Hamiltoniana H', w / 2, 10);
    }

    nSlider.addEventListener('input', drawMatrix);
    drawMatrix();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Qual è la relazione fondamentale di commutazione tra posizione e momento?",
            options: [
                "[x̂, p̂] = 0",
                "[x̂, p̂] = iℏ",
                "[x̂, p̂] = ℏ",
                "[x̂, p̂] = ℏ²"
            ],
            correct: 1
        },
        {
            q: "Cosa rappresenta un autostato di un operatore?",
            options: [
                "Uno stato che non cambia nel tempo",
                "Uno stato dove la misurazione produce un valore certo (autovalore)",
                "Uno stato con energia zero",
                "Uno stato di sovrapposizione"
            ],
            correct: 1
        },
        {
            q: "Quale affermazione sulla meccanica di Heisenberg è corretta?",
            options: [
                "È completamente incompatibile con la meccanica di Schrödinger",
                "È una formulazione puramente algebrica equivalente alla formulazione ondulatoria",
                "Usa solo numeri reali, mentre Schrödinger usa complessi",
                "Fornisce risultati diversi da Schrödinger per fenomeni macroscopici"
            ],
            correct: 1
        },
        {
            q: "Se due operatori Â e B̂ commutano ([Â, B̂] = 0), cosa è vero?",
            options: [
                "Rappresentano la stessa quantità fisica",
                "Possono essere misurati contemporaneamente con precisione arbitraria",
                "Sono diagonalizzabili nella stessa base",
                "Sia b che c sono vere"
            ],
            correct: 3
        },
        {
            q: "Chi sviluppò la formulazione matriciale della meccanica quantistica?",
            options: [
                "Albert Einstein",
                "Werner Heisenberg",
                "Erwin Schrödinger",
                "Max Planck"
            ],
            correct: 1
        },
        {
            q: "Cosa è lo spazio di Hilbert in meccanica quantistica?",
            options: [
                "Uno spazio fisico tridimensionale",
                "Uno spazio vettoriale infinito-dimensionale dove risiedono gli stati quantistici",
                "Lo spazio delle energie possibili",
                "Un modello della struttura atomica"
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
    if (document.getElementById('matrix-canvas')) initMatrixOperator();
    if (document.getElementById('quiz-area')) initQuiz();
});
