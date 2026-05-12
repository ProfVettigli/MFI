let simState = {
    mass: 5,
    force: 10,
    friction: 0
};

document.addEventListener('DOMContentLoaded', () => {
    initForceSimulator();
    initGraphCanvas();
    initQuiz();
    drawForceCanvas();
    drawGraph();
});

function initForceSimulator() {
    const massSlider = document.getElementById('mass-slider');
    const forceSlider = document.getElementById('force-slider');
    const frictionSlider = document.getElementById('friction-slider');

    if (massSlider) {
        massSlider.addEventListener('input', (e) => {
            simState.mass = parseFloat(e.target.value);
            document.getElementById('mass-display').textContent = simState.mass.toFixed(1);
            updateSimReadout();
            drawForceCanvas();
            drawGraph();
        });
    }

    if (forceSlider) {
        forceSlider.addEventListener('input', (e) => {
            simState.force = parseFloat(e.target.value);
            document.getElementById('force-display').textContent = simState.force.toFixed(1);
            updateSimReadout();
            drawForceCanvas();
            drawGraph();
        });
    }

    if (frictionSlider) {
        frictionSlider.addEventListener('input', (e) => {
            simState.friction = parseFloat(e.target.value);
            document.getElementById('friction-display').textContent = (simState.friction * 100).toFixed(0);
            updateSimReadout();
            drawForceCanvas();
        });
    }
}

function updateSimReadout() {
    const netForce = simState.force - simState.friction * simState.force;
    const acceleration = simState.mass > 0 ? netForce / simState.mass : 0;

    document.getElementById('force-readout').textContent = netForce.toFixed(2) + ' N';
    document.getElementById('accel-readout').textContent = acceleration.toFixed(2) + ' m/s²';
    document.getElementById('mass-readout').textContent = simState.mass.toFixed(1) + ' kg';
}

function drawForceCanvas() {
    const canvas = document.getElementById('simulator-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const groundY = h - 80;
    ctx.fillStyle = 'rgba(100,100,100,0.3)';
    ctx.fillRect(0, groundY, w, 80);

    const boxX = w / 2 - 60;
    const boxY = groundY - 60;
    const boxW = 120;
    const boxH = 60;

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(simState.mass.toFixed(1) + ' kg', boxX + boxW / 2, boxY + boxH / 2 + 5);

    const arrowScale = 40;
    const forceArrowLength = Math.min(simState.force * arrowScale, 150);

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boxX - 20, boxY + boxH / 2);
    ctx.lineTo(boxX - 20 - forceArrowLength, boxY + boxH / 2);
    ctx.stroke();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(boxX - 20 - forceArrowLength, boxY + boxH / 2);
    ctx.lineTo(boxX - 20 - forceArrowLength + 10, boxY + boxH / 2 - 8);
    ctx.lineTo(boxX - 20 - forceArrowLength + 10, boxY + boxH / 2 + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('F = ' + simState.force.toFixed(1) + ' N', boxX - 20 - forceArrowLength / 2, boxY - 20);

    if (simState.friction > 0) {
        const frictionLength = forceArrowLength * simState.friction;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(boxX + boxW / 2, boxY + boxH + 20);
        ctx.lineTo(boxX + boxW / 2, boxY + boxH + 20 + frictionLength * 0.3);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText('attrito', boxX + boxW / 2 + 40, boxY + boxH + 40);
    }

    const accel = simState.mass > 0 ? (simState.force - simState.friction * simState.force) / simState.mass : 0;
    if (accel > 0.1) {
        ctx.fillStyle = 'rgba(52,211,153,0.3)';
        ctx.fillRect(boxX + boxW + 20, boxY + boxH / 2 - 20, accel * 30, 40);

        ctx.fillStyle = '#34d399';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('accelerazione', boxX + boxW + 40 + accel * 15, boxY + boxH / 2 + 40);
    }
}

function drawGraph() {
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const marginL = 60;
    const marginB = 60;
    const graphW = w - marginL - 20;
    const graphH = h - marginB - 20;

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginL, 20);
    ctx.lineTo(marginL, h - marginB);
    ctx.lineTo(w - 20, h - marginB);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Forza (N)', w - 30, h - 30);

    ctx.textAlign = 'right';
    ctx.fillText('Accelerazione (m/s²)', 20, 15);

    const maxForce = 50;
    const maxAccel = maxForce / Math.max(simState.mass, 0.5);

    for (let f = 0; f <= maxForce; f += 10) {
        const x = marginL + (f / maxForce) * graphW;
        const a = f / Math.max(simState.mass, 0.5);
        const y = h - marginB - (a / maxAccel) * graphH;

        ctx.fillStyle = 'rgba(52,211,153,0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const f0 = 0;
    const a0 = f0 / Math.max(simState.mass, 0.5);
    const x0 = marginL + (f0 / maxForce) * graphW;
    const y0 = h - marginB - (a0 / maxAccel) * graphH;
    ctx.moveTo(x0, y0);

    for (let f = 1; f <= maxForce; f += 1) {
        const a = f / Math.max(simState.mass, 0.5);
        const x = marginL + (f / maxForce) * graphW;
        const y = h - marginB - (a / maxAccel) * graphH;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    const currentF = simState.force;
    const currentA = currentF / Math.max(simState.mass, 0.5);
    const curX = marginL + (currentF / maxForce) * graphW;
    const curY = h - marginB - (currentA / maxAccel) * graphH;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Punto attuale', curX, curY - 20);
}

function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    const quizzes = [
        {
            question: 'Quale affermazione rappresenta il primo principio di Newton?',
            options: [
                'Un corpo accelera se la forza netta è positiva',
                'Un corpo in quiete rimane in quiete se nessuna forza agisce su di esso',
                'L\'accelerazione è inversamente proporzionale alla massa',
                'Azione e reazione sono sempre uguali'
            ],
            correct: 1
        },
        {
            question: 'La formula F = ma rappresenta:',
            options: [
                'Il primo principio di Newton',
                'Il secondo principio della dinamica',
                'La legge di conservazione dell\'energia',
                'Il principio di azione e reazione'
            ],
            correct: 1
        },
        {
            question: 'Se raddoppi la massa di un corpo, l\'accelerazione prodotta dalla stessa forza:',
            options: [
                'Raddoppia',
                'Rimane uguale',
                'Si dimezza',
                'Quadruplica'
            ],
            correct: 2
        },
        {
            question: 'Quale principio spiega perché ti inclini in avanti quando una macchina frena bruscamente?',
            options: [
                'Il primo principio (inerzia)',
                'Il secondo principio',
                'Il terzo principio',
                'La gravità'
            ],
            correct: 0
        },
        {
            question: 'Il terzo principio afferma:',
            options: [
                'Ogni azione ha una reazione uguale e opposta',
                'La forza risultante determina l\'accelerazione',
                'Un corpo tende a rimanere nel suo stato',
                'L\'accelerazione dipende dalla massa'
            ],
            correct: 0
        },
        {
            question: 'Un sistema inerziale è:',
            options: [
                'Un sistema che ruota',
                'Un sistema privo di accelerazione',
                'Un sistema dove non agiscono forze',
                'Un sistema sulla Terra'
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
