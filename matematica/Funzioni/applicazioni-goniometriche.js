// Applicazioni delle Funzioni Goniometriche - Interactive Components

// ============================================================================
// WAVE SYNTH
// ============================================================================

function initWaveSynth() {
    const canvas = document.getElementById('wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const getVal = id => parseFloat(document.getElementById(id).value);

    function draw() {
        const w = canvas.offsetWidth || 600;
        const h = canvas.height;
        canvas.width = w;
        ctx.clearRect(0, 0, w, h);

        const A1 = getVal('wave-A1');
        const W1 = getVal('wave-W1');
        const P1 = getVal('wave-P1');
        const enabled2 = document.getElementById('wave-enable2').checked;
        const A2 = enabled2 ? getVal('wave-A2') : 0;
        const W2 = enabled2 ? getVal('wave-W2') : 0;
        const P2 = enabled2 ? getVal('wave-P2') : 0;

        const midY = h / 2;
        const xScale = w / (2 * Math.PI * 2);
        const yScale = (h / 2) * 0.85 / 2;

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

        // Wave 1
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const t = px / xScale;
            const y = midY - A1 * Math.sin(W1 * t + P1) * yScale;
            px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Wave 2
        if (enabled2) {
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let px = 0; px < w; px++) {
                const t = px / xScale;
                const y = midY - A2 * Math.sin(W2 * t + P2) * yScale;
                px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
            }
            ctx.stroke();

            // Sum
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            for (let px = 0; px < w; px++) {
                const t = px / xScale;
                const y = midY - (A1 * Math.sin(W1 * t + P1) + A2 * Math.sin(W2 * t + P2)) * yScale;
                px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Formula
        const fStr = enabled2
            ? `f(t) = ${A1.toFixed(1)}·sin(${W1.toFixed(1)}t + ${P1.toFixed(2)}) + ${A2.toFixed(1)}·sin(${W2.toFixed(1)}t + ${P2.toFixed(2)})`
            : `f(t) = ${A1.toFixed(1)}·sin(${W1.toFixed(1)}t + ${P1.toFixed(2)})`;
        document.getElementById('wave-formula').textContent = fStr;
    }

    const updateVal = (sliderId, displayId, suffix) => {
        const el = document.getElementById(sliderId);
        const disp = document.getElementById(displayId);
        el.addEventListener('input', () => { disp.textContent = parseFloat(el.value).toFixed(2) + (suffix || ''); draw(); });
    };

    updateVal('wave-A1', 'wave-A1-val'); updateVal('wave-W1', 'wave-W1-val'); updateVal('wave-P1', 'wave-P1-val');
    updateVal('wave-A2', 'wave-A2-val'); updateVal('wave-W2', 'wave-W2-val'); updateVal('wave-P2', 'wave-P2-val');

    const comp2Controls = document.getElementById('wave-comp2-controls');
    document.getElementById('wave-enable2').addEventListener('change', e => {
        comp2Controls.style.display = e.target.checked ? 'block' : 'none';
        draw();
    });
    if (comp2Controls) comp2Controls.style.display = 'none';

    draw();
    window.addEventListener('resize', draw);
}

// ============================================================================
// CIRCULAR MOTION
// ============================================================================

function initCircularMotion() {
    const canvas = document.getElementById('circ-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let omega = 1.5;
    let t = 0;
    let rafId;

    function draw() {
        const w = canvas.offsetWidth || 400;
        const h = canvas.height;
        canvas.width = w;

        ctx.clearRect(0, 0, w, h);

        const cx = w * 0.38;
        const cy = h / 2;
        const R = Math.min(cx, cy) * 0.72;

        // Background circle
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - R - 10, cy); ctx.lineTo(cx + R + 10, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - R - 10); ctx.lineTo(cx, cy + R + 10); ctx.stroke();

        const angle = omega * t;
        const px = cx + R * Math.cos(angle);
        const py = cy - R * Math.sin(angle);

        // Radius line
        ctx.strokeStyle = 'rgba(99,102,241,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

        // Projections
        ctx.strokeStyle = 'rgba(59,130,246,0.5)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
        ctx.setLineDash([]);

        // x-projection bar
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(cx - 4, py - 4, 8, 8);
        // y-projection bar
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(px - 4, cy - 4, 8, 8);

        // Moving point
        ctx.fillStyle = '#6366f1';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * Math.PI); ctx.fill();
        ctx.shadowBlur = 0;

        // Right side: sine & cosine traces
        const traceX = cx + R + 30;
        const traceW = w - traceX - 10;
        if (traceW > 40) {
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(traceX, cy - R, traceW, 2 * R);

            const drawTrace = (fn, color) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let px2 = 0; px2 < traceW; px2++) {
                    const a2 = angle - (px2 / traceW) * 2 * Math.PI * 1.5;
                    const yy = cy - R * fn(a2);
                    px2 === 0 ? ctx.moveTo(traceX + px2, yy) : ctx.lineTo(traceX + px2, yy);
                }
                ctx.stroke();
            };
            drawTrace(Math.sin, '#3b82f6');
            drawTrace(Math.cos, '#f59e0b');

            ctx.fillStyle = '#3b82f6';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('sin', traceX + 4, cy - R + 14);
            ctx.fillStyle = '#f59e0b';
            ctx.fillText('cos', traceX + 4, cy - R + 28);
        }

        // Labels
        const x = Math.cos(angle).toFixed(2);
        const y = Math.sin(angle).toFixed(2);
        document.getElementById('circ-x').textContent = x;
        document.getElementById('circ-y').textContent = y;
        document.getElementById('circ-angle').textContent = (angle % (2 * Math.PI)).toFixed(2);

        t += 0.016;
        rafId = requestAnimationFrame(draw);
    }

    const wSlider = document.getElementById('circ-W');
    const wVal = document.getElementById('circ-W-val');
    wSlider.addEventListener('input', () => {
        omega = parseFloat(wSlider.value);
        wVal.textContent = omega.toFixed(1) + ' rad/s';
    });

    draw();
}

// ============================================================================
// AC CURRENT
// ============================================================================

function initACCurrent() {
    const canvas = document.getElementById('ac-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
        const w = canvas.offsetWidth || 600;
        const h = canvas.height;
        canvas.width = w;
        ctx.clearRect(0, 0, w, h);

        const f = parseFloat(document.getElementById('ac-f').value);
        const A = parseFloat(document.getElementById('ac-A').value);
        const midY = h / 2;
        const yScale = (h / 2) * 0.82;

        // 3 periods
        const periods = 3;
        const xScale = w / periods;

        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const tVal = (px / xScale);
            const y = midY - A * Math.sin(2 * Math.PI * tVal) * yScale;
            px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();

        // RMS line
        const rms = A / Math.sqrt(2);
        ctx.strokeStyle = 'rgba(251,191,36,0.7)';
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, midY - rms * yScale); ctx.lineTo(w, midY - rms * yScale); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, midY + rms * yScale); ctx.lineTo(w, midY + rms * yScale); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(251,191,36,0.9)';
        ctx.font = '11px monospace';
        ctx.fillText(`I_rms = ${rms.toFixed(3)}`, 8, midY - rms * yScale - 5);

        document.getElementById('ac-rms').textContent = `I₀/√2 = ${rms.toFixed(3)}`;
        document.getElementById('ac-formula').textContent = `I(t) = ${A.toFixed(1)}·sin(2π·${f}·t)`;
    }

    document.getElementById('ac-f').addEventListener('input', function () {
        document.getElementById('ac-f-val').textContent = this.value + ' Hz'; draw();
    });
    document.getElementById('ac-A').addEventListener('input', function () {
        document.getElementById('ac-A-val').textContent = parseFloat(this.value).toFixed(1); draw();
    });

    draw();
    window.addEventListener('resize', draw);
}

// ============================================================================
// FOURIER DEMO
// ============================================================================

function initFourierDemo() {
    const canvas = document.getElementById('fourier-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
        const w = canvas.offsetWidth || 600;
        const h = canvas.height;
        canvas.width = w;
        ctx.clearRect(0, 0, w, h);

        const checked = [...document.querySelectorAll('.fourier-harmonic:checked')].map(el => parseInt(el.value));

        const midY = h / 2;
        const yScale = (h / 2) * 0.82;
        const xScale = w / (2 * Math.PI * 2);

        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

        if (checked.length === 0) return;

        // Individual harmonics (faint)
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
        checked.forEach((n, idx) => {
            ctx.strokeStyle = colors[idx % colors.length];
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let px = 0; px < w; px++) {
                const t = px / xScale;
                const y = midY - (4 / (Math.PI * n)) * Math.sin(n * t) * yScale;
                px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
            }
            ctx.stroke();
        });
        ctx.globalAlpha = 1;

        // Sum
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const t = px / xScale;
            const y = midY - checked.reduce((sum, n) => sum + (4 / (Math.PI * n)) * Math.sin(n * t), 0) * yScale;
            px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Formula
        const terms = checked.map(n => `(4/π·${n})·sin(${n}t)`).join(' + ');
        document.getElementById('fourier-formula').textContent = `f(t) ≈ ${terms}`;
    }

    document.querySelectorAll('.fourier-harmonic').forEach(cb => {
        cb.addEventListener('change', draw);
    });

    draw();
    window.addEventListener('resize', draw);
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Quale formula descrive un'onda sinusoidale generica?",
            options: [
                "f(t) = A·cos(ωt²)",
                "f(t) = A·sin(ωt + φ)",
                "f(t) = A·tan(ωt)",
                "f(t) = A·e^(ωt)"
            ],
            correct: 1
        },
        {
            q: "Cosa rappresenta il valore efficace (RMS) della corrente alternata?",
            options: [
                "Il valore massimo della corrente",
                "Il valore medio della corrente (sempre zero per AC)",
                "Il valore equivalente di DC che produce la stessa potenza: I₀/√2",
                "La frequenza della corrente in Hz"
            ],
            correct: 2
        },
        {
            q: "Quale frequenza usa la rete elettrica europea?",
            options: ["60 Hz", "50 Hz", "100 Hz", "25 Hz"],
            correct: 1
        },
        {
            q: "In un moto circolare uniforme, le coordinate x(t) e y(t) del punto sono:",
            options: [
                "x(t) = R·tan(ωt), y(t) = R·sin(ωt)",
                "x(t) = R·sin(ωt), y(t) = R·cos(ωt)",
                "x(t) = R·cos(ωt), y(t) = R·sin(ωt)",
                "x(t) = ωt, y(t) = R"
            ],
            correct: 2
        },
        {
            q: "Il teorema di Fourier afferma che qualsiasi funzione periodica...",
            options: [
                "...è sempre una sinusoide pura",
                "...può essere scritta come somma (infinita) di sinusoidi a frequenze multiple",
                "...è sempre una funzione lineare",
                "...non può essere rappresentata matematicamente"
            ],
            correct: 1
        },
        {
            q: "L'onda quadra costruita con la serie di Fourier usa quali armoniche?",
            options: [
                "Solo i numeri pari: 2, 4, 6, ...",
                "Solo i numeri dispari: 1, 3, 5, ...",
                "Tutti i numeri interi: 1, 2, 3, ...",
                "Solo la fondamentale n=1"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => `
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
    `).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        if (ansIndex === correctIndex) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Eccellente! Hai risposto correttamente a tutte ${quizData.length} domande!`;
            quizScore.style.color = 'var(--math-color)';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    initWaveSynth();
    initCircularMotion();
    initACCurrent();
    initFourierDemo();
    if (document.getElementById('quiz-area')) initQuiz();
});
