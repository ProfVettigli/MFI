let buoyancyState = {
    objectDensity: 0.5,
    liquidDensity: 1.0,
    objectVolume: 10
};

let pressureState = {
    depth: 0.5,
    fluidDensity: 1000,
    g: 9.81
};

document.addEventListener('DOMContentLoaded', () => {
    initBuoyancyControls();
    initPressureControls();
    drawBuoyancy();
    drawPressure();
    initQuiz();
});

function initBuoyancyControls() {
    const objDensitySlider = document.getElementById('object-density-slider');
    const liquidDensitySlider = document.getElementById('liquid-density-slider');

    if (objDensitySlider) {
        objDensitySlider.addEventListener('input', (e) => {
            buoyancyState.objectDensity = parseFloat(e.target.value);
            document.getElementById('object-density-display').textContent = buoyancyState.objectDensity.toFixed(1);
            updateBuoyancyReadout();
            drawBuoyancy();
        });
    }

    if (liquidDensitySlider) {
        liquidDensitySlider.addEventListener('input', (e) => {
            buoyancyState.liquidDensity = parseFloat(e.target.value);
            document.getElementById('liquid-density-display').textContent = buoyancyState.liquidDensity.toFixed(1);
            updateBuoyancyReadout();
            drawBuoyancy();
        });
    }
}

function initPressureControls() {
    const depthSlider = document.getElementById('depth-slider');
    const fluidDensitySlider = document.getElementById('fluid-density-slider');

    if (depthSlider) {
        depthSlider.addEventListener('input', (e) => {
            pressureState.depth = parseFloat(e.target.value);
            document.getElementById('depth-display').textContent = pressureState.depth.toFixed(1);
            updatePressureReadout();
            drawPressure();
        });
    }

    if (fluidDensitySlider) {
        fluidDensitySlider.addEventListener('input', (e) => {
            pressureState.fluidDensity = parseFloat(e.target.value);
            document.getElementById('fluid-density-display').textContent = pressureState.fluidDensity.toFixed(0);
            updatePressureReadout();
            drawPressure();
        });
    }
}

function updateBuoyancyReadout() {
    const weight = buoyancyState.objectDensity * buoyancyState.objectVolume * 9.81;
    const buoyancy = buoyancyState.liquidDensity * buoyancyState.objectVolume * 9.81;

    document.getElementById('weight-readout').textContent = weight.toFixed(2) + ' N';
    document.getElementById('buoyancy-readout').textContent = buoyancy.toFixed(2) + ' N';
}

function updatePressureReadout() {
    const pressure = pressureState.fluidDensity * pressureState.g * pressureState.depth / 1000;
    document.getElementById('pressure-readout').textContent = pressure.toFixed(1) + ' kPa';
}

function drawBuoyancy() {
    const canvas = document.getElementById('buoyancy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a5f4a';
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, h * 0.6, w, h * 0.4);

    const containerX = w / 2 - 80;
    const containerY = h * 0.6;

    const objectSize = 40;
    const weight = buoyancyState.objectDensity * buoyancyState.objectVolume * 9.81;
    const buoyancy = buoyancyState.liquidDensity * buoyancyState.objectVolume * 9.81;

    let objectY;
    if (buoyancy > weight * 1.05) {
        objectY = containerY - objectSize;
    } else if (buoyancy < weight * 0.95) {
        objectY = containerY + 50;
    } else {
        objectY = containerY - objectSize / 2;
    }

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(w / 2 - objectSize / 2, objectY, objectSize, objectSize);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - objectSize / 2, objectY, objectSize, objectSize);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, objectY);
    ctx.lineTo(w / 2, objectY - 30);
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('F_A', w / 2 + 20, objectY - 20);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, objectY + objectSize);
    ctx.lineTo(w / 2, objectY + objectSize + 30);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('W', w / 2 + 20, objectY + objectSize + 30);
}

function drawPressure() {
    const canvas = document.getElementById('pressure-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#1a5f4a';
    ctx.fillRect(w * 0.15, h * 0.2, w * 0.7, h * 0.6);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.15, h * 0.2, w * 0.7, h * 0.6);

    const pressure = pressureState.fluidDensity * pressureState.g * pressureState.depth;
    const arrowSize = Math.min(30, Math.max(10, pressure / 50));

    for (let y = h * 0.3; y < h * 0.8; y += 40) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.2, y);
        ctx.lineTo(w * 0.2 + arrowSize, y);
        ctx.stroke();

        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(w * 0.2 + arrowSize, y);
        ctx.lineTo(w * 0.2 + arrowSize - 8, y - 5);
        ctx.lineTo(w * 0.2 + arrowSize - 8, y + 5);
        ctx.fill();

        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.8, y);
        ctx.lineTo(w * 0.8 - arrowSize, y);
        ctx.stroke();

        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(w * 0.8 - arrowSize, y);
        ctx.lineTo(w * 0.8 - arrowSize + 8, y - 5);
        ctx.lineTo(w * 0.8 - arrowSize + 8, y + 5);
        ctx.fill();
    }

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('Profondità: ' + pressureState.depth.toFixed(1) + ' m', w / 2, h * 0.15);
}

function initQuiz() {
    const quizData = [
        {
            question: 'Secondo il principio di Archimede, quale è la forza di galleggiamento?',
            options: [
                'Peso dell\'oggetto',
                'Peso del fluido spostato',
                'Peso del contenitore',
                'Peso totale del sistema'
            ],
            correct: 1
        },
        {
            question: 'Un oggetto con densità 0.8 g/cm³ immerso in acqua (1.0 g/cm³):',
            options: [
                'Galleggia parzialmente',
                'Affonda completamente',
                'Rimane in equilibrio',
                'Non è possibile determinarlo'
            ],
            correct: 0
        },
        {
            question: 'La pressione idrostatica è data da:',
            options: [
                'P = F·A',
                'P = ρgh',
                'P = v²/2',
                'P = mgh'
            ],
            correct: 1
        },
        {
            question: 'L\'equazione di Bernoulli descrive:',
            options: [
                'La conservazione della massa',
                'La conservazione dell\'energia in un fluido in movimento',
                'La viscosità dei fluidi',
                'La densità dell\'acqua'
            ],
            correct: 1
        },
        {
            question: 'La viscosità è:',
            options: [
                'La densità del fluido',
                'La resistenza al flusso di un fluido',
                'La velocità del fluido',
                'La pressione del fluido'
            ],
            correct: 1
        },
        {
            question: 'Un sommergibile si immerge controllando:',
            options: [
                'La velocità dell\'acqua',
                'I ballast (camere di acqua)',
                'La temperatura',
                'La pressione atmosferica'
            ],
            correct: 1
        },
        {
            question: 'La portanza di un\'ala è causata da:',
            options: [
                'La gravità',
                'Una differenza di pressione dovuta alla velocità (Bernoulli)',
                'La viscosità dell\'aria',
                'L\'attrito'
            ],
            correct: 1
        },
        {
            question: 'Se la densità di un oggetto è minore della densità del fluido:',
            options: [
                'L\'oggetto affonda',
                'L\'oggetto galleggia',
                'L\'oggetto rimane in equilibrio',
                'Dipende dalla forma'
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
