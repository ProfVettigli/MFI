let aeolipileState = {
    temperature: 80,
    mass: 500,
    rpm: 0,
    isRunning: false,
    angle: 0
};

let pressureRPMData = [];

document.addEventListener('DOMContentLoaded', () => {
    initAeolipileControls();
    initButtons();
    drawAeolipile();
    drawPressureRPMGraph();
    initQuiz();
    // Animate
    setInterval(update, 50);
});

function initAeolipileControls() {
    const tempSlider = document.getElementById('temp-slider');
    const massSlider = document.getElementById('mass-slider');

    if (tempSlider) {
        tempSlider.addEventListener('input', (e) => {
            aeolipileState.temperature = parseFloat(e.target.value);
            document.getElementById('temp-display').textContent = aeolipileState.temperature;
            updateAeolipileReadout();
            drawAeolipile();
            drawPressureRPMGraph();
        });
    }

    if (massSlider) {
        massSlider.addEventListener('input', (e) => {
            aeolipileState.mass = parseFloat(e.target.value);
            document.getElementById('mass-display').textContent = aeolipileState.mass;
            updateAeolipileReadout();
            drawAeolipile();
        });
    }
}

function initButtons() {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (startBtn) startBtn.addEventListener('click', () => {
        aeolipileState.isRunning = true;
        startBtn.textContent = 'Fuoco acceso...';
        startBtn.disabled = true;
    });

    if (stopBtn) stopBtn.addEventListener('click', () => {
        aeolipileState.isRunning = false;
        aeolipileState.rpm = 0;
        startBtn.disabled = false;
        startBtn.textContent = 'Accendi Fuoco';
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
        aeolipileState.temperature = 80;
        aeolipileState.mass = 500;
        aeolipileState.rpm = 0;
        aeolipileState.isRunning = false;
        aeolipileState.angle = 0;
        document.getElementById('temp-slider').value = 80;
        document.getElementById('mass-slider').value = 500;
        document.getElementById('temp-display').textContent = '80';
        document.getElementById('mass-display').textContent = '500';
        document.getElementById('start-btn').disabled = false;
        document.getElementById('start-btn').textContent = 'Accendi Fuoco';
        updateAeolipileReadout();
        drawAeolipile();
    });
}

function calculateVaporPressure(tempC) {
    // Approximate vapor pressure (bar) using simplified formula
    // P ≈ 0.01 * exp(0.05 * T) for T in Celsius
    if (tempC < 0) return 0;
    return Math.max(0.01, Math.exp((tempC - 100) / 30) * 1.013);
}

function updateAeolipileReadout() {
    const pressure = calculateVaporPressure(aeolipileState.temperature);
    const rpm = aeolipileState.isRunning ? pressure * 500 : 0;
    aeolipileState.rpm = Math.min(rpm, 3000);

    document.getElementById('pressure-aeolipile').textContent = pressure.toFixed(2) + ' bar';
    document.getElementById('rpm-display').textContent = Math.round(aeolipileState.rpm) + ' RPM';
}

function update() {
    if (aeolipileState.isRunning) {
        const pressure = calculateVaporPressure(aeolipileState.temperature);
        const targetRPM = pressure * 500;
        aeolipileState.rpm = Math.min(targetRPM, 3000);
        aeolipileState.angle += (aeolipileState.rpm / 60) * (50 / 1000); // increment in radians
        updateAeolipileReadout();
        drawAeolipile();
    }
}

function drawAeolipile() {
    const canvas = document.getElementById('aeolipile-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const sphereRadius = 80;
    const axisWidth = 150;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw support structure
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - axisWidth, cy - 120);
    ctx.lineTo(cx - axisWidth, cy + 120);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + axisWidth, cy - 120);
    ctx.lineTo(cx + axisWidth, cy + 120);
    ctx.stroke();

    // Draw horizontal axis
    ctx.beginPath();
    ctx.moveTo(cx - axisWidth, cy);
    ctx.lineTo(cx + axisWidth, cy);
    ctx.stroke();

    // Draw sphere
    ctx.fillStyle = 'rgba(200, 100, 50, 0.8)';
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d68a4a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw vapor jets
    const jetLength = 60;
    const jet1Angle = aeolipileState.angle;
    const jet2Angle = aeolipileState.angle + Math.PI;

    ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
    ctx.lineWidth = 4;

    // Jet 1
    const j1x = cx + Math.cos(jet1Angle) * sphereRadius;
    const j1y = cy + Math.sin(jet1Angle) * sphereRadius;
    ctx.beginPath();
    ctx.moveTo(j1x, j1y);
    ctx.lineTo(j1x + Math.cos(jet1Angle) * jetLength, j1y + Math.sin(jet1Angle) * jetLength);
    ctx.stroke();

    // Jet 2
    const j2x = cx + Math.cos(jet2Angle) * sphereRadius;
    const j2y = cy + Math.sin(jet2Angle) * sphereRadius;
    ctx.beginPath();
    ctx.moveTo(j2x, j2y);
    ctx.lineTo(j2x + Math.cos(jet2Angle) * jetLength, j2y + Math.sin(jet2Angle) * jetLength);
    ctx.stroke();

    // Draw flame if running
    if (aeolipileState.isRunning) {
        ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cx + (Math.random() - 0.5) * 100, cy + sphereRadius + 60 + Math.random() * 30, 15 + Math.random() * 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw rotation info
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(aeolipileState.rpm)} RPM`, cx, cy - sphereRadius - 40);
}

function drawPressureRPMGraph() {
    const canvas = document.getElementById('pressure-rpm-graph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 60;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Axes
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

    // Draw curve
    ctx.strokeStyle = '#6ee7b7';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let temp = 0; temp <= 200; temp += 5) {
        const pressure = calculateVaporPressure(temp);
        const rpm = pressure * 500;

        const px = padding + (temp / 200) * (w - 2 * padding);
        const py = (h - padding) - (rpm / 3000) * (h - 2 * padding);

        if (temp === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw point for current state if running
    if (aeolipileState.isRunning) {
        const pressure = calculateVaporPressure(aeolipileState.temperature);
        const rpm = pressure * 500;
        const px = padding + (aeolipileState.temperature / 200) * (w - 2 * padding);
        const py = (h - padding) - (rpm / 3000) * (h - 2 * padding);

        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Labels
    ctx.fillStyle = 'rgba(150, 200, 150, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Temperatura (°C)', w / 2, h - 15);

    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('RPM', 0, 0);
    ctx.restore();
}

function initQuiz() {
    const quizContainer = document.getElementById('quiz-area');
    if (!quizContainer) return;

    const quizData = [
        {
            question: "In che periodo visse Erone di Alessandria?",
            options: ["Ancient Rome (1 AD)", "Medieval (500 AD)", "Renaissance (1500 AD)", "Industrial (1700 AD)"],
            correct: 0
        },
        {
            question: "Quale legge di Newton governa il movimento dell'aeolipila?",
            options: ["Prima legge (inerzia)", "Seconda legge (F=ma)", "Terza legge (azione-reazione)", "Legge della gravità"],
            correct: 2
        },
        {
            question: "Che cosa crea la rotazione della sfera nell'aeolipila?",
            options: ["Magneti", "Vapore in uscita dai tubi", "Aria calda", "Acqua che cade"],
            correct: 1
        },
        {
            question: "Se aumenti la temperatura, cosa succede alla pressione del vapore?",
            options: ["Diminuisce", "Rimane costante", "Aumenta", "Varia casualmente"],
            correct: 2
        },
        {
            question: "Qual è la differenza principale tra l'aeolipila e un motore a vapore moderno?",
            options: [
                "Il motore moderno ricondensa il vapore per cicli continui",
                "L'aeolipila è più efficiente",
                "Non ci sono differenze significative",
                "Il motore moderno usa solo aria"
            ],
            correct: 0
        },
        {
            question: "Se uno sprinkler 'risucchiasse' acqua, cosa accadrebbe?",
            options: [
                "Non ruoterebbe",
                "Ruoterebbe nello stesso verso",
                "Ruoterebbe nel verso opposto",
                "Scoppiando il tubo"
            ],
            correct: 2
        },
        {
            question: "Per quale motivo l'aeolipila non fu industrializzata nell'Antichità?",
            options: [
                "La tecnologia non era sufficiente",
                "L'economia si basava sulla schiavitù",
                "Non era efficiente",
                "Mancavano i materiali"
            ],
            correct: 1
        },
        {
            question: "Quale delle seguenti è un'applicazione storica dell'invenzione di Erone?",
            options: [
                "Pompe per irrigazione",
                "Porte di templi automatiche",
                "Macchine industriali",
                "Veicoli"
            ],
            correct: 1
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
