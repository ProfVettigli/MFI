let pendulumState = {
    length: 1.0,
    angle: 0.3,
    time: 0,
    g: 9.81,
    isAnimating: false
};

document.addEventListener('DOMContentLoaded', () => {
    initPendulumControls();
    initAnimationLoop();
    initQuiz();
    updatePeriodDisplay();
});

function initPendulumControls() {
    const lengthSlider = document.getElementById('length-slider');
    const angleSlider = document.getElementById('angle-slider');
    const gSlider = document.getElementById('g-slider');
    const playBtn = document.getElementById('play-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (lengthSlider) {
        lengthSlider.addEventListener('input', (e) => {
            pendulumState.length = parseFloat(e.target.value);
            document.getElementById('length-display').textContent = pendulumState.length.toFixed(2);
            updatePeriodDisplay();
            drawPendulum();
        });
    }

    if (angleSlider) {
        angleSlider.addEventListener('input', (e) => {
            pendulumState.angle = parseFloat(e.target.value);
            document.getElementById('angle-display').textContent = (pendulumState.angle * 180 / Math.PI).toFixed(1);
            updatePeriodDisplay();
            drawPendulum();
        });
    }

    if (gSlider) {
        gSlider.addEventListener('input', (e) => {
            pendulumState.g = parseFloat(e.target.value);
            document.getElementById('g-display').textContent = pendulumState.g.toFixed(2);
            updatePeriodDisplay();
            drawPendulum();
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            pendulumState.isAnimating = !pendulumState.isAnimating;
            playBtn.textContent = pendulumState.isAnimating ? 'Pausa' : 'Avvia';
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            pendulumState.time = 0;
            pendulumState.isAnimating = false;
            if (playBtn) playBtn.textContent = 'Avvia';
            drawPendulum();
        });
    }
}

function updatePeriodDisplay() {
    const T = 2 * Math.PI * Math.sqrt(pendulumState.length / pendulumState.g);
    const frequency = 1 / T;

    document.getElementById('period-readout').textContent = T.toFixed(3) + ' s';
    document.getElementById('frequency-readout').textContent = frequency.toFixed(2) + ' Hz';
}

function initAnimationLoop() {
    setInterval(() => {
        if (pendulumState.isAnimating) {
            const omega = Math.sqrt(pendulumState.g / pendulumState.length);
            pendulumState.time += 0.05;
            pendulumState.angle = (Math.PI / 6) * Math.cos(omega * pendulumState.time);
        }
        drawPendulum();
    }, 50);
}

function drawPendulum() {
    const canvas = document.getElementById('pendulum-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const pivotX = w / 2;
    const pivotY = h / 3;
    const scale = 100;
    const length = pendulumState.length * scale;

    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pivotX - 60, pivotY - 20);
    ctx.lineTo(pivotX + 60, pivotY - 20);
    ctx.stroke();

    const bobX = pivotX + length * Math.sin(pendulumState.angle);
    const bobY = pivotY + length * Math.cos(pendulumState.angle);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, pivotY + length);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#34d399';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('L = ' + pendulumState.length.toFixed(2) + ' m', pivotX + (bobX - pivotX) / 2 + 30, pivotY + (bobY - pivotY) / 2);

    const angle = pendulumState.angle * 180 / Math.PI;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'italic 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('θ = ' + angle.toFixed(1) + '°', 20, 30);
    ctx.fillText('T = ' + (2 * Math.PI * Math.sqrt(pendulumState.length / pendulumState.g)).toFixed(3) + ' s', 20, 50);
    ctx.fillText(pendulumState.isAnimating ? 'Animazione: ON' : 'Animazione: OFF', 20, 70);
}

function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    const quizzes = [
        {
            question: 'La formula del periodo di un pendolo semplice è:',
            options: [
                'T = 2π√(L/g)',
                'T = √(L·g)',
                'T = L/g',
                'T = 2π(L/g)'
            ],
            correct: 0
        },
        {
            question: 'Il periodo di un pendolo dipende da:',
            options: [
                'Solo dalla massa della pallina',
                'Solo dalla lunghezza e dalla gravità',
                'Dalla lunghezza, dalla gravità e dall\'ampiezza dell\'oscillazione',
                'Dalla velocità iniziale'
            ],
            correct: 1
        },
        {
            question: 'Se raddoppi la lunghezza di un pendolo, il periodo:',
            options: [
                'Raddoppia',
                'Aumenta di √2 (circa 1.414)',
                'Rimane uguale',
                'Si dimezza'
            ],
            correct: 1
        },
        {
            question: 'L\'isocronismo del pendolo significa:',
            options: [
                'Che il pendolo ritorna sempre al punto di partenza',
                'Che il periodo è indipendente dall\'ampiezza (per angoli piccoli)',
                'Che il pendolo non sente la gravità',
                'Che tutti i pendoli hanno lo stesso periodo'
            ],
            correct: 1
        },
        {
            question: 'Quale scienziato scoprì l\'isocronismo osservando una lampada in una chiesa?',
            options: [
                'Isaac Newton',
                'Galileo Galilei',
                'Christiaan Huygens',
                'Albert Einstein'
            ],
            correct: 1
        },
        {
            question: 'La frequenza di un pendolo è:',
            options: [
                'f = T',
                'f = 1/T',
                'f = T²',
                'f = 2T'
            ],
            correct: 1
        }
    ];

    let html = '';
    quizzes.forEach((q, i) => {
        html += `<div class="quiz-question">
            <div class="quiz-question-text">${i + 1}. ${q.question}</div>
            <div class="quiz-options">`;

        q.options.forEach((opt, j) => {
            html += `<label class="quiz-option">
                <input type="radio" name="q${i}" value="${j}"> ${opt}
            </label>`;
        });

        html += `</div></div>`;
    });

    quizArea.innerHTML = html;

    const scoreDiv = document.getElementById('quiz-score');
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Controlla Risposte';
    checkButton.style.cssText = 'padding:0.8rem 2rem; background:var(--physics-color); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; margin-top:1.5rem;';
    scoreDiv.parentNode.insertBefore(checkButton, scoreDiv);

    checkButton.addEventListener('click', () => {
        let score = 0;
        quizzes.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
                score++;
            }
        });

        const percentage = Math.round((score / quizzes.length) * 100);
        scoreDiv.textContent = `Hai ottenuto ${score}/${quizzes.length} (${percentage}%) `;
        scoreDiv.style.color = percentage >= 70 ? '#34d399' : '#f59e0b';
    });
}
