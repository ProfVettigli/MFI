let currentPlanet = { name: 'Terra', g: 9.81 };
const planets = [
    { name: 'Luna', g: 1.62 },
    { name: 'Marte', g: 3.71 },
    { name: 'Terra', g: 9.81 },
    { name: 'Giove', g: 24.79 },
    { name: 'Sole', g: 274 }
];

const planetData = [
    { name: 'Luna', g: 1.62 },
    { name: 'Marte', g: 3.71 },
    { name: 'Terra', g: 9.81 },
    { name: 'Giove', g: 24.79 },
    { name: 'Saturno', g: 10.44 },
    { name: 'Sole', g: 274 }
];

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSelector();
    initMassSlider();
    initSpringControls();
    populatePlanetTable();
    initQuiz();

    drawPlanetCanvas();
    drawSpringCanvas();
});

function initPlanetSelector() {
    const grid = document.getElementById('planet-grid');
    const buttons = grid.querySelectorAll('.planet-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const g = parseFloat(btn.dataset.g);
            const name = btn.dataset.name;
            currentPlanet = { name, g };

            document.getElementById('planet-name').textContent = name;
            updateReadout();
            drawPlanetCanvas();
        });
    });
}

function initMassSlider() {
    const slider = document.getElementById('mass-slider');
    const display = document.getElementById('mass-display');

    slider.addEventListener('input', (e) => {
        const mass = parseFloat(e.target.value);
        display.textContent = mass;
        updateReadout();
        drawPlanetCanvas();
    });
}

function updateReadout() {
    const mass = parseFloat(document.getElementById('mass-slider').value);
    const weight = (mass * currentPlanet.g).toFixed(1);

    document.getElementById('mass-readout').textContent = mass + ' kg';
    document.getElementById('weight-readout').textContent = weight + ' N';
}

function initSpringControls() {
    const massSlider = document.getElementById('spring-mass');
    const gSlider = document.getElementById('spring-g');

    massSlider.addEventListener('input', (e) => {
        document.getElementById('spring-mass-display').textContent = parseFloat(e.target.value).toFixed(1);
        updateSpringReadout();
        drawSpringCanvas();
    });

    gSlider.addEventListener('input', (e) => {
        document.getElementById('spring-g-display').textContent = parseFloat(e.target.value).toFixed(2);
        updateSpringReadout();
        drawSpringCanvas();
    });
}

function updateSpringReadout() {
    const mass = parseFloat(document.getElementById('spring-mass').value);
    const g = parseFloat(document.getElementById('spring-g').value);
    const k = 20;
    const force = mass * g;
    const delta = (force / k * 100).toFixed(1);

    document.getElementById('spring-force').textContent = force.toFixed(1) + ' N';
    document.getElementById('spring-delta').textContent = delta + ' cm';
}

function drawPlanetCanvas() {
    const canvas = document.getElementById('planet-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const mass = parseFloat(document.getElementById('mass-slider').value);
    const weight = mass * currentPlanet.g;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(16,185,129,0.1)';
    ctx.fillRect(20, canvas.height - 60, canvas.width - 40, 40);

    const platform = {
        x: canvas.width / 2 - 80,
        y: canvas.height - 100,
        w: 160,
        h: 30
    };

    ctx.fillStyle = '#10B981';
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.w, platform.h);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(platform.x + 40, platform.y - 40, 80, 40);

    ctx.fillStyle = '#fff';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(mass.toFixed(0) + ' kg', platform.x + 80, platform.y - 10);

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'italic 12px Inter, sans-serif';
    ctx.fillText(`g = ${currentPlanet.g.toFixed(2)} m/s²`, 50, 30);
    ctx.fillText(`Peso = ${weight.toFixed(1)} N`, canvas.width - 100, 30);
}

function drawSpringCanvas() {
    const canvas = document.getElementById('spring-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const mass = parseFloat(document.getElementById('spring-mass').value);
    const g = parseFloat(document.getElementById('spring-g').value);
    const k = 20;
    const force = mass * g;
    const stretch = (force / k) * 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchorX = canvas.width / 2;
    const anchorY = 40;

    ctx.fillStyle = '#888';
    ctx.fillRect(anchorX - 30, anchorY - 20, 60, 20);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);

    const coils = 8;
    const coilSpacing = (120 + stretch) / coils;
    for (let i = 0; i <= coils; i++) {
        const y = anchorY + i * coilSpacing;
        const offsetX = (i % 2 === 0) ? 15 : -15;
        ctx.lineTo(anchorX + offsetX, y);
    }
    ctx.stroke();

    const massY = anchorY + 120 + stretch;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(anchorX, massY, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mass.toFixed(1) + ' kg', anchorX, massY);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(anchorX + 50, anchorY + 120);
    ctx.lineTo(anchorX + 50, massY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#34d399';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Δx = ' + (stretch / 50).toFixed(2) + ' m', anchorX + 60, anchorY + 120 + stretch / 2);
}

function populatePlanetTable() {
    const tbody = document.getElementById('planet-table');
    if (!tbody) return;

    const mass = 70;
    const html = planetData.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.g.toFixed(2)}</td>
            <td>${mass}</td>
            <td class="num">${(mass * p.g).toFixed(1)}</td>
        </tr>
    `).join('');

    tbody.innerHTML = html;
}

function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    const quizzes = [
        {
            question: 'Qual è la differenza fondamentale tra massa e peso?',
            options: [
                'La massa è in kg, il peso è in grammi',
                'La massa è la quantità di materia, il peso è la forza gravitazionale',
                'Sono la stessa cosa, solo con nomi diversi',
                'La massa cambia da pianeta a pianeta'
            ],
            correct: 1
        },
        {
            question: 'Un astronauta di 80 kg va sulla Luna (g ≈ 1.62 m/s²). Qual è il suo peso?',
            options: [
                '80 N',
                '129.6 N',
                '784.8 N',
                '12.96 N'
            ],
            correct: 1
        },
        {
            question: 'Quale strumento misura davvero la massa?',
            options: [
                'Un dinamometro',
                'Una bilancia a bracci',
                'Una bilancia digitale di casa',
                'Un manometro'
            ],
            correct: 1
        },
        {
            question: 'Perché una bilancia a bracci funziona su qualsiasi pianeta?',
            options: [
                'Perché non risente della gravità',
                'Perché g si elide su entrambi i piatti',
                'Perché è programmata per ogni pianeta',
                'Perché misura il peso, non la massa'
            ],
            correct: 1
        },
        {
            question: 'Su Giove (g ≈ 24.79 m/s²), una persona di 70 kg pesa circa:',
            options: [
                '173 N',
                '686.7 N',
                '1735 N',
                '352 N'
            ],
            correct: 2
        },
        {
            question: 'Il "Grand K" è stato sostituito nel 2019 perché:',
            options: [
                'Era diventato inutile',
                'Stava perdendo peso per contaminazione',
                'Non era sufficientemente preciso',
                'Era fatto di materiale radioattivo'
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
