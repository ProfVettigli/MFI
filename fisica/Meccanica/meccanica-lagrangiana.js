let lagrangeState = {
    totalEnergy: 50,
    position: 0,
    showMinimalAction: false,
    showVariedPaths: false
};

document.addEventListener('DOMContentLoaded', () => {
    initEnergyControls();
    initActionButtons();
    drawEnergyDiagram();
    drawActionCanvas();
    initQuiz();
});

function initEnergyControls() {
    const energySlider = document.getElementById('total-energy-slider');
    const positionSlider = document.getElementById('position-slider');

    if (energySlider) {
        energySlider.addEventListener('input', (e) => {
            lagrangeState.totalEnergy = parseFloat(e.target.value);
            document.getElementById('total-energy-display').textContent = lagrangeState.totalEnergy;
            updateEnergyReadouts();
            drawEnergyDiagram();
        });
    }

    if (positionSlider) {
        positionSlider.addEventListener('input', (e) => {
            lagrangeState.position = parseFloat(e.target.value);
            document.getElementById('position-display').textContent = lagrangeState.position.toFixed(1);
            updateEnergyReadouts();
            drawEnergyDiagram();
        });
    }
}

function initActionButtons() {
    const minBtn = document.getElementById('show-action-btn');
    const varBtn = document.getElementById('show-varied-btn');

    if (minBtn) {
        minBtn.addEventListener('click', () => {
            lagrangeState.showMinimalAction = !lagrangeState.showMinimalAction;
            lagrangeState.showVariedPaths = false;
            drawActionCanvas();
            minBtn.textContent = lagrangeState.showMinimalAction ? 'Nascondi Azione Minima' : 'Mostra Azione Minima';
        });
    }

    if (varBtn) {
        varBtn.addEventListener('click', () => {
            lagrangeState.showVariedPaths = !lagrangeState.showVariedPaths;
            lagrangeState.showMinimalAction = false;
            drawActionCanvas();
            varBtn.textContent = lagrangeState.showVariedPaths ? 'Nascondi Percorsi Variati' : 'Mostra Percorsi Variati';
        });
    }
}

// Potential energy function (harmonic oscillator)
function potentialEnergy(x) {
    return 0.5 * 10 * x * x; // V = 0.5 * k * x^2, k = 10
}

function updateEnergyReadouts() {
    const V = potentialEnergy(lagrangeState.position);
    const T = Math.max(0, lagrangeState.totalEnergy - V);

    document.getElementById('kinetic-energy').textContent = T.toFixed(1) + ' J';
    document.getElementById('potential-energy').textContent = V.toFixed(1) + ' J';
}

function drawEnergyDiagram() {
    const canvas = document.getElementById('energy-diagram');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 60;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Draw axes
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // Draw potential energy curve V(x)
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const x = -5 + (i / 100) * 10;
        const V = potentialEnergy(x);
        const px = padding + ((x + 5) / 10) * (w - 2 * padding);
        const py = h - padding - (V / 300) * (h - 2 * padding);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw total energy line
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const Eline = h - padding - (lagrangeState.totalEnergy / 300) * (h - 2 * padding);
    ctx.beginPath();
    ctx.moveTo(padding, Eline);
    ctx.lineTo(w - padding, Eline);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw kinetic energy area (between V and E)
    const x = lagrangeState.position;
    const V = potentialEnergy(x);
    const T = Math.max(0, lagrangeState.totalEnergy - V);

    ctx.fillStyle = 'rgba(150, 200, 100, 0.2)';
    const px = padding + ((x + 5) / 10) * (w - 2 * padding);
    const pyV = h - padding - (V / 300) * (h - 2 * padding);
    const pyE = h - padding - (lagrangeState.totalEnergy / 300) * (h - 2 * padding);
    ctx.fillRect(px - 10, pyE, 20, pyV - pyE);

    // Draw current position
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(px, pyV, 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = 'rgba(150, 200, 150, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Posizione x (m)', w / 2, h - 15);

    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energia (J)', 0, 0);
    ctx.restore();

    // Legend
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(w - padding - 120, padding, 10, 10);
    ctx.fillStyle = 'rgba(150, 200, 100, 0.6)';
    ctx.fillRect(w - padding - 120, padding + 20, 10, 10);
    ctx.fillStyle = '#6ee7b7';
    ctx.fillRect(w - padding - 120, padding + 40, 10, 10);

    ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('V(x)', w - padding - 105, padding + 10);
    ctx.fillText('T(x)', w - padding - 105, padding + 30);
    ctx.fillText('E total', w - padding - 105, padding + 50);
}

function drawActionCanvas() {
    const canvas = document.getElementById('action-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Draw space-time axes
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let i = 0; i <= 10; i++) {
        const y = (h / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        const x = (w / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    if (lagrangeState.showMinimalAction) {
        // Draw minimal action path (straight diagonal)
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w / 4, h / 4);
        ctx.lineTo((3 * w) / 4, (3 * h) / 4);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('Percorso di Minima Azione', w / 2 - 80, h / 2 - 20);
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText('S = minimo', w / 2 - 30, h / 2);
    } else if (lagrangeState.showVariedPaths) {
        // Draw multiple varied paths
        const paths = [
            { color: '#ff6b6b', amplitude: 0.15 },
            { color: '#ffd93d', amplitude: 0.1 },
            { color: '#6ee7b7', amplitude: 0.05 },
            { color: '#95e1d3', amplitude: 0 }
        ];

        paths.forEach((path) => {
            ctx.strokeStyle = path.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i <= 100; i++) {
                const t = i / 100;
                const x = (w / 4) + ((w / 2) * t) + (w / 8) * path.amplitude * Math.sin(Math.PI * t);
                const y = (h / 4) + ((h / 2) * t);

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Label
        ctx.fillStyle = '#aaa';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText('Percorsi variati (S aumenta)', w / 2 - 80, 30);
    } else {
        // Default: show start and end points
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(w / 4, h / 4, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc((3 * w) / 4, (3 * h) / 4, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#aaa';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Inizio', w / 4 - 30, h / 4 - 15);
        ctx.fillText('Fine', (3 * w) / 4 + 10, (3 * h) / 4 + 20);
        ctx.fillText('Premi i bottoni per visualizzare i percorsi', w / 2 - 120, h / 2);
    }
}

function initQuiz() {
    const quizContainer = document.getElementById('quiz-area');
    if (!quizContainer) return;

    const quizData = [
        {
            question: "Cosa rappresenta il Lagrangiano L?",
            options: [
                "La somma di energia cinetica e potenziale (T + V)",
                "La differenza tra energia cinetica e potenziale (T - V)",
                "Il prodotto di energia cinetica e potenziale",
                "Solo l'energia cinetica"
            ],
            correct: 1
        },
        {
            question: "Quale approccio usa la Meccanica Lagrangiana?",
            options: [
                "Forze e accelerazioni",
                "Energia e azione",
                "Momento e velocità",
                "Potenza e lavoro"
            ],
            correct: 1
        },
        {
            question: "Chi formulò la Meccanica Lagrangiana?",
            options: [
                "Isaac Newton",
                "Joseph-Louis Lagrange",
                "Albert Einstein",
                "Richard Feynman"
            ],
            correct: 1
        },
        {
            question: "Qual è l'Azione (S)?",
            options: [
                "La forza per il tempo",
                "L'integrale del Lagrangiano nel tempo",
                "L'energia totale",
                "La velocità media"
            ],
            correct: 1
        },
        {
            question: "Il Principio di Minima Azione afferma che:",
            options: [
                "Il sistema prende il percorso di massima energia",
                "Il sistema prende il percorso che rende l'azione stazionaria",
                "Il sistema segue sempre il percorso più breve",
                "Non c'è un percorso preferito"
            ],
            correct: 1
        },
        {
            question: "In un sistema conservativo, quale quantità rimane costante?",
            options: [
                "Energia cinetica sola",
                "Energia potenziale sola",
                "L'energia totale (T + V)",
                "Il Lagrangiano"
            ],
            correct: 2
        },
        {
            question: "Le Equazioni di Eulero-Lagrange si usano per:",
            options: [
                "Calcolare forze",
                "Derivare le equazioni di moto",
                "Misurare l'energia",
                "Tracciare traiettorie"
            ],
            correct: 1
        },
        {
            question: "Quale fra questi usa il formalismo Lagrangiano?",
            options: [
                "Solo Meccanica Classica",
                "Solo Meccanica Quantistica",
                "Sia Relatività che Meccanica Quantistica",
                "Nessuno dei precedenti"
            ],
            correct: 2
        }
    ];

    let html = '';
    quizData.forEach((q, idx) => {
        html += `<div class="quiz-question">
            <div class="quiz-question-text">${idx + 1}. ${q.question}</div>
            <div class="quiz-options">`;
        q.options.forEach((opt, optIdx) => {
            html += `<label class="quiz-option">
                <input type="radio" name="q${idx}" value="${optIdx}"> ${opt}
            </label>`;
        });
        html += `</div></div>`;
    });

    quizContainer.innerHTML = html;

    const scoreDiv = document.getElementById('quiz-score');
    const radios = quizContainer.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            let score = 0;
            quizData.forEach((q, idx) => {
                const selected = quizContainer.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && parseInt(selected.value) === q.correct) score++;
            });
            scoreDiv.textContent = `Punteggio: ${score}/${quizData.length}`;
            scoreDiv.style.color = score >= 6 ? '#10b981' : '#ef4444';
        });
    });
}
