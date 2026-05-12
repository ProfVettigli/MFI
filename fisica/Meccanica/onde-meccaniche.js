let waveState = {
    frequency: 2,
    amplitude: 50,
    time: 0,
    animating: true
};

let dopplerState = {
    sourceSpeed: 0,
    sourceFrequency: 440,
    soundSpeed: 343
};

document.addEventListener('DOMContentLoaded', () => {
    initWaveControls();
    initDopplerControls();
    initAnimationLoop();
    initQuiz();
    updateWaveReadout();
    updateDopplerReadout();
});

function initWaveControls() {
    const frequencySlider = document.getElementById('frequency-slider');
    const amplitudeSlider = document.getElementById('amplitude-slider');

    if (frequencySlider) {
        frequencySlider.addEventListener('input', (e) => {
            waveState.frequency = parseFloat(e.target.value);
            document.getElementById('frequency-display').textContent = waveState.frequency.toFixed(1);
            updateWaveReadout();
        });
    }

    if (amplitudeSlider) {
        amplitudeSlider.addEventListener('input', (e) => {
            waveState.amplitude = parseFloat(e.target.value);
            document.getElementById('amplitude-display').textContent = waveState.amplitude.toFixed(0);
            updateWaveReadout();
        });
    }
}

function initDopplerControls() {
    const speedSlider = document.getElementById('source-speed-slider');
    const freqSlider = document.getElementById('source-freq-slider');

    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            dopplerState.sourceSpeed = parseFloat(e.target.value);
            document.getElementById('source-speed-display').textContent = dopplerState.sourceSpeed.toFixed(0);
            updateDopplerReadout();
        });
    }

    if (freqSlider) {
        freqSlider.addEventListener('input', (e) => {
            dopplerState.sourceFrequency = parseFloat(e.target.value);
            document.getElementById('source-freq-display').textContent = dopplerState.sourceFrequency.toFixed(0);
            updateDopplerReadout();
        });
    }
}

function updateWaveReadout() {
    const period = 1 / waveState.frequency;
    const wavelength = (100 * dopplerState.soundSpeed) / waveState.frequency;

    document.getElementById('period-readout').textContent = period.toFixed(2) + ' s';
    document.getElementById('wavelength-readout').textContent = wavelength.toFixed(0) + ' px';
}

function updateDopplerReadout() {
    const v = dopplerState.soundSpeed;
    const vs = dopplerState.sourceSpeed;
    const f0 = dopplerState.sourceFrequency;

    const observedFreq = f0 * (v / (v - vs));
    const freqShift = observedFreq - f0;

    document.getElementById('observed-freq-readout').textContent = observedFreq.toFixed(0) + ' Hz';
    document.getElementById('freq-shift-readout').textContent = freqShift.toFixed(0) + ' Hz';
}

function initAnimationLoop() {
    setInterval(() => {
        waveState.time += 0.05;
        drawWave();
        drawDoppler();
    }, 50);
}

function drawWave() {
    const canvas = document.getElementById('wave-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = h / 2;
    const wavelength = (100 * dopplerState.soundSpeed) / waveState.frequency;

    for (let x = 0; x < w; x += 2) {
        const phase = (x / wavelength) * 2 * Math.PI - waveState.frequency * waveState.time * 2 * Math.PI;
        const y = centerY + waveState.amplitude * Math.sin(phase);

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    ctx.strokeStyle = '#60a5fa';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(w, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawDoppler() {
    const canvas = document.getElementById('doppler-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const sourceX = w * 0.3 + dopplerState.sourceSpeed * 2;
    const observerX = w * 0.7;
    const centerY = h / 2;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(sourceX, centerY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S', sourceX, centerY + 4);

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(observerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('O', observerX, centerY + 4);

    if (dopplerState.sourceSpeed > 0) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sourceX, centerY - 25);
        ctx.lineTo(sourceX + 20, centerY - 25);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(sourceX + 20, centerY - 25);
        ctx.lineTo(sourceX + 15, centerY - 30);
        ctx.lineTo(sourceX + 15, centerY - 20);
        ctx.fill();
    } else if (dopplerState.sourceSpeed < 0) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sourceX, centerY - 25);
        ctx.lineTo(sourceX - 20, centerY - 25);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(sourceX - 20, centerY - 25);
        ctx.lineTo(sourceX - 15, centerY - 30);
        ctx.lineTo(sourceX - 15, centerY - 20);
        ctx.fill();
    }

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    const numWaves = 3;
    for (let i = 1; i <= numWaves; i++) {
        const radius = 20 + i * 25 - (waveState.time * 50) % 25;
        if (radius > 0 && radius < 150) {
            ctx.beginPath();
            ctx.arc(sourceX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    ctx.setLineDash([]);
}

function initQuiz() {
    const quizData = [
        {
            question: 'Un\'onda trasversale oscilla:',
            options: [
                'Nella stessa direzione di propagazione',
                'Perpendicolarmente alla direzione di propagazione',
                'Verso il basso',
                'In cerchi'
            ],
            correct: 1
        },
        {
            question: 'La relazione tra velocità, frequenza e lunghezza d\'onda è:',
            options: [
                'v = f/λ',
                'v = f·λ',
                'v = λ/f',
                'v = f²/λ'
            ],
            correct: 1
        },
        {
            question: 'Il suono NON si propaga nel:',
            options: [
                'Aria',
                'Acqua',
                'Acciaio',
                'Vuoto'
            ],
            correct: 3
        },
        {
            question: 'L\'effetto Doppler causa:',
            options: [
                'Un cambio di ampiezza',
                'Un cambio di frequenza osservata',
                'Un cambio di lunghezza d\'onda della sorgente',
                'Un arresto dell\'onda'
            ],
            correct: 1
        },
        {
            question: 'La velocità del suono in aria (a 20°C) è approssimativamente:',
            options: [
                '100 m/s',
                '200 m/s',
                '343 m/s',
                '500 m/s'
            ],
            correct: 2
        },
        {
            question: 'Se una sorgente si muove verso un osservatore, la frequenza osservata:',
            options: [
                'Diminuisce',
                'Aumenta',
                'Rimane uguale',
                'Diventa zero'
            ],
            correct: 1
        },
        {
            question: 'L\'intervallo di frequenze udibili per l\'uomo è:',
            options: [
                '0 - 10 Hz',
                '20 - 20.000 Hz',
                '100 - 1.000 Hz',
                '20.000 - 100.000 Hz'
            ],
            correct: 1
        },
        {
            question: 'Una onda longitudinale è:',
            options: [
                'Un\'onda su una corda',
                'Un\'onda che oscilla parallelamente alla propagazione',
                'Un\'onda che non cambia velocità',
                'Una corda che vibra verticalmente'
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    quizArea.innerHTML = '';
    quizData.forEach((q, idx) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';

        const questionText = document.createElement('div');
        questionText.className = 'quiz-question-text';
        questionText.textContent = `${idx + 1}. ${q.question}`;
        qDiv.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';

        q.options.forEach((option, optIdx) => {
            const label = document.createElement('label');
            label.className = 'quiz-option';
            label.style.display = 'flex';
            label.style.alignItems = 'center';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `quiz-${idx}`;
            input.value = optIdx;
            input.addEventListener('change', () => checkQuizAnswer(idx, optIdx, q.correct));

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            optionsDiv.appendChild(label);
        });

        qDiv.appendChild(optionsDiv);
        quizArea.appendChild(qDiv);
    });
}

let quizAnswers = {};

function checkQuizAnswer(questionIdx, selectedIdx, correctIdx) {
    quizAnswers[questionIdx] = selectedIdx === correctIdx;
    updateQuizScore();
}

function updateQuizScore() {
    const correct = Object.values(quizAnswers).filter(v => v).length;
    const total = 8;
    const scoreDiv = document.getElementById('quiz-score');
    if (scoreDiv) {
        scoreDiv.textContent = `Risposte corrette: ${correct}/${total}`;
        scoreDiv.style.color = correct >= 6 ? '#10b981' : '#fbbf24';
    }
}
