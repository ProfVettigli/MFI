// Campo Elettrico - Calcolatore e Visualizzatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initCoulombCalculator();
    initFieldCanvas();
    initQuiz();
});

// ===== COULOMB CALCULATOR =====
function initCoulombCalculator() {
    const q1Slider = document.getElementById('coul-q1');
    const q2Slider = document.getElementById('coul-q2');
    const rSlider = document.getElementById('coul-r');
    const q1Val = document.getElementById('coul-q1-val');
    const q2Val = document.getElementById('coul-q2-val');
    const rVal = document.getElementById('coul-r-val');
    const resultDiv = document.getElementById('coul-result');

    if (!q1Slider) return;

    const k = 8.99e9; // Costante di Coulomb

    function updateCoulomb() {
        const q1 = parseFloat(q1Slider.value);
        const q2 = parseFloat(q2Slider.value);
        const r = parseFloat(rSlider.value);

        // Aggiorna labels
        q1Val.textContent = (q1 >= 0 ? '+' : '') + q1.toFixed(1) + ' μC';
        q2Val.textContent = (q2 >= 0 ? '+' : '') + q2.toFixed(1) + ' μC';
        rVal.textContent = r.toFixed(2) + ' m';

        // Calcola forza
        const q1_C = q1 * 1e-6;
        const q2_C = q2 * 1e-6;
        const F = k * Math.abs(q1_C * q2_C) / (r * r);

        // Determina tipo di forza
        const forceType = (q1 * q2 > 0) ? 'repulsiva' : 'attrattiva';

        resultDiv.innerHTML = `
            Forza F = <strong>${F.toFixed(3)} N</strong> &middot; Tipo: <strong>${forceType}</strong>
        `;
    }

    q1Slider.addEventListener('input', updateCoulomb);
    q2Slider.addEventListener('input', updateCoulomb);
    rSlider.addEventListener('input', updateCoulomb);

    updateCoulomb();
}

// ===== ELECTRIC FIELD CANVAS =====
function initFieldCanvas() {
    const canvas = document.getElementById('field-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let charges = [];
    let mode = 'positive';

    const modeButtons = {
        'pos': document.getElementById('mode-pos'),
        'neg': document.getElementById('mode-neg'),
        'clear': document.getElementById('mode-clear')
    };

    // Event listeners per buttons
    if (modeButtons.pos) {
        modeButtons.pos.addEventListener('click', () => {
            mode = 'positive';
            Object.values(modeButtons).forEach(btn => btn?.classList.remove('active'));
            modeButtons.pos.classList.add('active');
        });
    }
    if (modeButtons.neg) {
        modeButtons.neg.addEventListener('click', () => {
            mode = 'negative';
            Object.values(modeButtons).forEach(btn => btn?.classList.remove('active'));
            modeButtons.neg.classList.add('active');
        });
    }
    if (modeButtons.clear) {
        modeButtons.clear.addEventListener('click', () => {
            charges = [];
            draw();
        });
    }

    // Click per aggiungere cariche
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        charges.push({
            x,
            y,
            q: mode === 'positive' ? 1 : -1,
            strength: 20
        });
        draw();
    });

    function drawFieldLine(startX, startY, stepSize = 2) {
        const path = [];
        let x = startX, y = startY;
        const maxSteps = 200;
        let steps = 0;

        while (steps < maxSteps && x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
            path.push({ x, y });

            // Calcola il campo elettrico nel punto
            let ex = 0, ey = 0;
            for (const charge of charges) {
                const dx = x - charge.x;
                const dy = y - charge.y;
                const r2 = dx * dx + dy * dy + 1;
                const r = Math.sqrt(r2);

                const factor = (charge.q * charge.strength) / r2;
                ex += (dx / r) * factor;
                ey += (dy / r) * factor;
            }

            const mag = Math.sqrt(ex * ex + ey * ey) + 1;
            x += (ex / mag) * stepSize;
            y += (ey / mag) * stepSize;
            steps++;
        }

        return path;
    }

    function draw() {
        ctx.fillStyle = '#050810';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Linee di campo
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const path = drawFieldLine(x, y, 3);

                if (path.length > 1) {
                    ctx.strokeStyle = 'rgba(34,197,94,0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(path[0].x, path[0].y);
                    for (let i = 1; i < path.length; i++) {
                        ctx.lineTo(path[i].x, path[i].y);
                    }
                    ctx.stroke();

                    // Freccia finale
                    if (path.length > 2) {
                        const dx = path[path.length-1].x - path[path.length-2].x;
                        const dy = path[path.length-1].y - path[path.length-2].y;
                        const angle = Math.atan2(dy, dx);
                        const len = 5;
                        ctx.fillStyle = 'rgba(34,197,94,0.8)';
                        ctx.save();
                        ctx.translate(path[path.length-1].x, path[path.length-1].y);
                        ctx.rotate(angle);
                        ctx.fillRect(0, -2, len, 4);
                        ctx.restore();
                    }
                }
            }
        }

        // Disegna cariche
        charges.forEach(charge => {
            const color = charge.q > 0 ? 'rgba(239,68,68,0.8)' : 'rgba(100,150,255,0.8)';
            const label = charge.q > 0 ? '+' : '−';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(charge.x, charge.y, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, charge.x, charge.y);
        });
    }

    draw();
}

// ===== QUIZ =====
function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    const questions = [
        {
            q: "Chi formulò la legge della forza tra cariche elettriche?",
            options: ["Faraday", "Coulomb", "Gauss", "Ampère"],
            correct: 1
        },
        {
            q: "La forza di Coulomb è inversamente proporzionale a:",
            options: ["r (distanza)", "r² (quadrato della distanza)", "1/r", "r³"],
            correct: 1
        },
        {
            q: "Un campo elettrico è definito come:",
            options: ["La forza totale su una carica", "La forza per unità di carica di prova", "La tensione del circuito", "Il flusso di corrente"],
            correct: 1
        },
        {
            q: "Le linee di campo elettrico escono da:",
            options: ["Cariche negative", "Cariche positive", "Poli magnetici", "Resistenze"],
            correct: 1
        },
        {
            q: "Il teorema di Gauss afferma che il flusso di E attraverso una superficie chiusa è proporzionale a:",
            options: ["La distanza dal campo", "La carica interna", "La resistenza", "La corrente esterna"],
            correct: 1
        },
        {
            q: "L'unità di misura del campo elettrico è:",
            options: ["Tesla", "Coulomb", "N/C o V/m", "Ampere"],
            correct: 2
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
