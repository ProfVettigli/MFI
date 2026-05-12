// Corrente Alternata - Simulatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initACSimulator();
    initQuiz();
});

// ===== AC SIMULATOR =====
function initACSimulator() {
    const amplitudeSlider = document.getElementById('amplitude-slider');
    const frequencySlider = document.getElementById('frequency-slider');
    const canvas = document.getElementById('wave-canvas');

    const amplitudeValue = document.getElementById('amplitude-value');
    const frequencyValue = document.getElementById('frequency-value');
    const peakValue = document.getElementById('peak-value');
    const rmsValue = document.getElementById('rms-value');
    const periodValue = document.getElementById('period-value');

    if (!amplitudeSlider || !canvas) return;

    const ctx = canvas.getContext('2d');

    function drawWave() {
        const amplitude = parseFloat(amplitudeSlider.value);
        const frequency = parseFloat(frequencySlider.value);

        // Update labels
        amplitudeValue.textContent = amplitude.toFixed(0);
        frequencyValue.textContent = frequency.toFixed(0);

        const rms = amplitude / Math.sqrt(2);
        const period = 1000 / frequency; // ms

        peakValue.textContent = amplitude.toFixed(2) + ' V';
        rmsValue.textContent = rms.toFixed(2) + ' V';
        periodValue.textContent = period.toFixed(1) + ' ms';

        // Clear canvas
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        const gridSpacing = canvas.width / 10;
        for (let i = 0; i < canvas.width; i += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        // Draw zero line
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Draw wave
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const samplesPerPeriod = 100;
        const periodsShown = 3;
        const xStep = canvas.width / (samplesPerPeriod * periodsShown);

        for (let x = 0; x < canvas.width; x += xStep) {
            // Normalize x to 0-2π range for 3 periods
            const angle = (x / canvas.width) * 2 * Math.PI * periodsShown;
            const y = (Math.sin(angle) * amplitude) / (amplitude * 2) * canvas.height + canvas.height / 2;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Draw RMS level
        ctx.strokeStyle = 'rgba(34,197,94,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        const rmsY = (rms / (amplitude * 2)) * canvas.height + canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(0, rmsY);
        ctx.lineTo(canvas.width, rmsY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw peak level
        ctx.strokeStyle = 'rgba(239,68,68,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        const peakY = canvas.height / 2 - (amplitude / (amplitude * 2)) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, peakY);
        ctx.lineTo(canvas.width, peakY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw labels on canvas
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '12px monospace';
        ctx.fillText('Picco: ' + amplitude.toFixed(1) + ' V', 10, 20);
        ctx.fillText('RMS: ' + rms.toFixed(1) + ' V', 10, 40);
        ctx.fillText('Freq: ' + frequency.toFixed(0) + ' Hz', canvas.width - 150, 20);
    }

    amplitudeSlider.addEventListener('input', drawWave);
    frequencySlider.addEventListener('input', drawWave);

    // Set initial size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    drawWave();

    // Redraw on window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawWave();
    });
}

// ===== QUIZ =====
function initQuiz() {
    const quizData = [
        {
            question: "Qual è la principale differenza tra AC e DC?",
            options: ["AC è più potente", "AC cambia direzione periodicamente", "DC è più sicuro", "Non c'è differenza"],
            correct: 1
        },
        {
            question: "In Europa, la frequenza della corrente alternata è:",
            options: ["50 Hz", "60 Hz", "100 Hz", "25 Hz"],
            correct: 0
        },
        {
            question: "Qual è il valore RMS se il picco è 10 V?",
            options: ["10 V", "7.07 V", "14.14 V", "20 V"],
            correct: 1
        },
        {
            question: "A cosa serve il trasformatore?",
            options: ["Genera energia", "Cambia la tensione AC", "Accumula carica", "Converte AC in DC"],
            correct: 1
        },
        {
            question: "Perché si usa l'AC nella distribuzione elettrica?",
            options: ["È più economico", "Trasformatori riducono le perdite", "È più sicuro dei DC", "Tutti gli altri lo usano"],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');

    if (!quizArea) return;

    let score = 0;

    quizData.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '2rem';

        const questionTitle = document.createElement('h4');
        questionTitle.textContent = `${idx + 1}. ${q.question}`;
        questionTitle.style.marginBottom = '1rem';
        questionTitle.style.color = 'var(--text-main)';
        div.appendChild(questionTitle);

        q.options.forEach((opt, optIdx) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '0.5rem';
            label.style.cursor = 'pointer';
            label.style.padding = '0.7rem';
            label.style.borderRadius = '6px';
            label.style.transition = 'background 0.2s';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${idx}`;
            input.value = optIdx;

            input.addEventListener('change', () => {
                if (optIdx === q.correct) {
                    score++;
                    label.style.background = 'rgba(34,197,94,0.2)';
                    label.style.borderLeft = '3px solid #22c55e';
                } else {
                    label.style.background = 'rgba(239,68,68,0.2)';
                    label.style.borderLeft = '3px solid #ef4444';
                }
                updateScore();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opt));
            div.appendChild(label);
        });

        quizArea.appendChild(div);
    });

    function updateScore() {
        quizScore.textContent = `Risposte corrette: ${score} / ${quizData.length}`;
        if (score === quizData.length) {
            quizScore.style.color = '#22c55e';
        } else if (score >= quizData.length / 2) {
            quizScore.style.color = '#eab308';
        } else {
            quizScore.style.color = '#ef4444';
        }
    }
}
