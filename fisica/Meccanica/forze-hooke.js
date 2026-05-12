let springState = {
    k: 15,
    extension: 0.05,
    maxExtension: 0.3
};

document.addEventListener('DOMContentLoaded', () => {
    initSpringSliders();
    initGraphCanvas();
    initQuiz();
    drawSpringSimulation();
    drawForceGraph();
});

function initSpringSliders() {
    const kSlider = document.getElementById('k-slider');
    const extSlider = document.getElementById('extension-slider');

    if (kSlider) {
        kSlider.addEventListener('input', (e) => {
            springState.k = parseFloat(e.target.value);
            document.getElementById('k-display').textContent = springState.k.toFixed(1);
            updateSpringReadout();
            drawSpringSimulation();
            drawForceGraph();
        });
    }

    if (extSlider) {
        extSlider.addEventListener('input', (e) => {
            springState.extension = parseFloat(e.target.value);
            document.getElementById('ext-display').textContent = (springState.extension * 100).toFixed(1);
            updateSpringReadout();
            drawSpringSimulation();
            drawForceGraph();
        });
    }
}

function updateSpringReadout() {
    const force = springState.k * springState.extension;
    const elasticEnergy = 0.5 * springState.k * springState.extension * springState.extension;

    document.getElementById('force-readout').textContent = force.toFixed(2) + ' N';
    document.getElementById('energy-readout').textContent = elasticEnergy.toFixed(2) + ' J';
}

function drawSpringSimulation() {
    const canvas = document.getElementById('spring-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const anchorX = 60;
    const anchorY = h / 2;
    const restLength = 120;
    const currentLength = restLength + springState.extension * 200;

    ctx.fillStyle = '#666';
    ctx.fillRect(anchorX - 20, anchorY - 25, 20, 50);

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);

    const coils = 10;
    const coilSpacing = currentLength / coils;
    for (let i = 0; i <= coils; i++) {
        const x = anchorX + i * coilSpacing;
        const offsetY = (i % 2 === 0) ? 15 : -15;
        ctx.lineTo(x, anchorY + offsetY);
    }
    ctx.stroke();

    const massX = anchorX + currentLength;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(massX, anchorY, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('massa', massX, anchorY);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY - 50);
    ctx.lineTo(anchorX + restLength, anchorY - 50);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#34d399';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Lunghezza di riposo', anchorX + restLength / 2, anchorY - 65);

    if (springState.extension > 0) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(anchorX + restLength, anchorY + 50);
        ctx.lineTo(massX, anchorY + 50);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Δx = ' + (springState.extension * 100).toFixed(1) + ' cm', (anchorX + restLength + massX) / 2, anchorY + 70);
    }

    const force = springState.k * springState.extension;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(massX, anchorY);
    ctx.lineTo(massX + Math.min(force * 20, 100), anchorY);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(massX + Math.min(force * 20, 100), anchorY);
    ctx.lineTo(massX + Math.min(force * 20, 100) - 8, anchorY - 6);
    ctx.lineTo(massX + Math.min(force * 20, 100) - 8, anchorY + 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('F = ' + force.toFixed(2) + ' N', massX + 110, anchorY - 15);
}

function drawForceGraph() {
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const marginL = 70;
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
    ctx.fillText('Allungamento (m)', w - 30, h - 20);

    ctx.textAlign = 'right';
    ctx.fillText('Forza (N)', 30, 15);

    const maxExt = 0.3;
    const maxForce = springState.k * maxExt;

    for (let ext = 0; ext <= maxExt; ext += 0.05) {
        const force = springState.k * ext;
        const x = marginL + (ext / maxExt) * graphW;
        const y = h - marginB - (force / maxForce) * graphH;

        ctx.fillStyle = 'rgba(52,211,153,0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const x0 = marginL;
    const y0 = h - marginB;
    ctx.moveTo(x0, y0);

    for (let ext = 0.01; ext <= maxExt; ext += 0.01) {
        const force = springState.k * ext;
        const x = marginL + (ext / maxExt) * graphW;
        const y = h - marginB - (force / maxForce) * graphH;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    const curForce = springState.k * springState.extension;
    const curX = marginL + (springState.extension / maxExt) * graphW;
    const curY = h - marginB - (curForce / maxForce) * graphH;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curX, curY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Punto attuale', curX, curY - 20);
}

function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    const quizzes = [
        {
            question: 'La legge di Hooke stabilisce che:',
            options: [
                'La forza è proporzionale al quadrato dell\'allungamento',
                'La forza è proporzionale all\'allungamento: F = -kx',
                'Tutte le molle hanno la stessa costante elastica',
                'L\'allungamento dipende dalla temperatura'
            ],
            correct: 1
        },
        {
            question: 'Cosa rappresenta la costante elastica k?',
            options: [
                'La lunghezza della molla',
                'La resistenza della molla all\'allungamento',
                'Il massimo allungamento possibile',
                'La massa della molla'
            ],
            correct: 1
        },
        {
            question: 'Se raddoppi l\'allungamento di una molla, la forza:',
            options: [
                'Rimane uguale',
                'Si dimezza',
                'Raddoppia',
                'Quadruplica'
            ],
            correct: 2
        },
        {
            question: 'Una molla con k elevato è:',
            options: [
                'Più elastica',
                'Più difficile da allungare',
                'Più lunga',
                'Meno resistente'
            ],
            correct: 1
        },
        {
            question: 'L\'energia immagazzinata in una molla allungata è:',
            options: [
                'E = kx',
                'E = (1/2)kx²',
                'E = kx³',
                'E = x/k'
            ],
            correct: 1
        },
        {
            question: 'Quale limite impedisce di estendere indefinitamente una molla?',
            options: [
                'La gravità',
                'La resistenza dell\'aria',
                'Il limite elastico del materiale',
                'La velocità della luce'
            ],
            correct: 2
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
