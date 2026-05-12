// Onde Elettromagnetiche - Visualizzatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initWaveVisualizer();
    initQuiz();
});

// ===== WAVE VISUALIZER =====
function initWaveVisualizer() {
    const slider = document.getElementById('freq-slider');
    const freqVal = document.getElementById('freq-val');
    const wavelengthVal = document.getElementById('wavelength');
    const radType = document.getElementById('rad-type');
    const canvas = document.getElementById('wave-canvas');
    if (!canvas) return;

    const c = 3e8; // m/s
    const ctx = canvas.getContext('2d');
    let animFrame = 0;

    function getRadiationType(freq) {
        const exponent = Math.floor(Math.log10(freq));
        const wavelength = c / freq;

        if (exponent <= 6) return { type: '📻 Onde Radio', color: '#FF6347' };
        if (exponent <= 9) return { type: '🍕 Microonde', color: '#FFD700' };
        if (exponent <= 12) return { type: '🔴 Infrarosso', color: '#FF6347' };
        if (exponent <= 15) {
            if (wavelength > 700e-9) return { type: '🔴 Rosso visibile', color: '#FF0000' };
            if (wavelength > 600e-9) return { type: '🟠 Arancione visibile', color: '#FF7F00' };
            if (wavelength > 500e-9) return { type: '🟡 Giallo visibile', color: '#FFFF00' };
            if (wavelength > 450e-9) return { type: '🟢 Verde visibile', color: '#00FF00' };
            if (wavelength > 400e-9) return { type: '🔵 Blu/Viola visibile', color: '#0000FF' };
            return { type: '👁️ Luce visibile', color: '#FFFFFF' };
        }
        if (exponent <= 18) return { type: '☀️ Ultravioletto', color: '#9370DB' };
        if (exponent <= 21) return { type: '🦴 Raggi X', color: '#4B0082' };
        return { type: '☢️ Raggi Gamma', color: '#000080' };
    }

    function updateDisplay() {
        const exponent = parseFloat(slider.value);
        const freq = Math.pow(10, exponent);
        const wavelength = c / freq;

        // Aggiorna valori
        const expStr = exponent.toFixed(1);
        freqVal.textContent = `10^${exponent.toFixed(1)} Hz`;

        // Formatta lunghezza d'onda
        let wlStr;
        if (wavelength < 1e-9) {
            wlStr = (wavelength * 1e12).toFixed(2) + ' pm';
        } else if (wavelength < 1e-6) {
            wlStr = (wavelength * 1e9).toFixed(2) + ' nm';
        } else if (wavelength < 1e-3) {
            wlStr = (wavelength * 1e6).toFixed(2) + ' μm';
        } else if (wavelength < 1) {
            wlStr = (wavelength * 1e3).toFixed(2) + ' mm';
        } else {
            wlStr = wavelength.toFixed(2) + ' m';
        }
        wavelengthVal.textContent = wlStr;

        const radInfo = getRadiationType(freq);
        radType.textContent = radInfo.type;

        // Disegna onda
        drawWave(wavelength, radInfo.color);
    }

    function drawWave(wavelength, color) {
        ctx.fillStyle = '#050810';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const amplitude = 80;
        const centerY = canvas.height / 2;
        const frequency = 2 * Math.PI / wavelength;
        const offset = (animFrame * 2) % (wavelength * 2 * Math.PI);

        // E field (blu)
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
            const y = centerY + amplitude * Math.sin(frequency * x - offset);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // B field (rosso, sfasato di 90°)
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.7)';
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
            const y = centerY + amplitude * Math.cos(frequency * x - offset);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Asse centrale
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('E (blu)', 10, 30);
        ctx.fillText('B (rosso)', 10, 50);

        // Direzione di propagazione
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('→ Propagazione', canvas.width - 10, canvas.height - 20);

        animFrame++;
        requestAnimationFrame(() => drawWave(wavelength, color));
    }

    slider.addEventListener('input', updateDisplay);
    updateDisplay();
}

// ===== QUIZ =====
function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    const questions = [
        {
            q: "Quale è la velocità di propagazione delle onde elettromagnetiche nel vuoto?",
            options: ["1.5 × 10⁸ m/s", "3.0 × 10⁸ m/s", "6.6 × 10³⁴ J·s", "9.8 m/s²"],
            correct: 1
        },
        {
            q: "La relazione tra frequenza (f) e lunghezza d'onda (λ) per un'onda EM è:",
            options: ["c = f / λ", "c = f × λ", "c = λ² / f", "c = f + λ"],
            correct: 1
        },
        {
            q: "Quale tipo di radiazione EM ha la frequenza più alta?",
            options: ["Onde radio", "Infrarosso", "Luce visibile", "Raggi Gamma"],
            correct: 3
        },
        {
            q: "La luce visibile occupa quale parte dello spettro EM?",
            options: ["La maggior parte", "Una piccola frazione", "Circa il 50%", "Nessuna parte significativa"],
            correct: 1
        },
        {
            q: "Quale radiazione EM è usata per le radiografie mediche?",
            options: ["Microonde", "Infrarosso", "Raggi X", "Onde radio"],
            correct: 2
        },
        {
            q: "Due campi oscillano perpendiacolarmente in un'onda EM. Quali sono?",
            options: ["Magnetico e gravitazionale", "Elettrico e magnetico", "Elettrico e nucleare", "Magnetico e debole"],
            correct: 1
        }
    ];

    let score = 0;
    let answered = 0;

    questions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '1.5rem';
        div.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 0.8rem;">${idx + 1}. ${q.q}</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${q.options.map((opt, i) => `
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="q${idx}" value="${i}" style="margin-right: 0.8rem;">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        `;
        quizArea.appendChild(div);

        const radios = div.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                answered++;
                if (parseInt(radio.value) === q.correct) {
                    score++;
                }
                if (answered === questions.length) {
                    const pct = Math.round((score / questions.length) * 100);
                    quizScore.textContent = `Risultato: ${score}/${questions.length} (${pct}%)`;
                    quizScore.style.color = pct >= 70 ? 'var(--physics-color)' : '#ef4444';
                }
            });
        });
    });
}
