// Computer Quantistici - Interactive Components

// ============================================================================
// BLOCH SPHERE VISUALIZATION
// ============================================================================

function initBlochSphere() {
    const canvas = document.getElementById('bloch-canvas');
    const ctx = canvas.getContext('2d');

    function drawBlochSphere(theta, phi) {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.35;

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Draw sphere outline (circle)
        ctx.strokeStyle = 'rgba(20,184,166,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Draw axes
        ctx.strokeStyle = 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.7, cy);
        ctx.lineTo(cx + r * 0.7, cy);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(100,100,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.7);
        ctx.lineTo(cx, cy + r * 0.7);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(255,100,100,0.6)';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('x', cx + r * 0.75, cy + 5);

        ctx.fillStyle = 'rgba(100,100,255,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText('y', cx, cy - r * 0.8);

        // Poles
        ctx.fillStyle = 'rgba(100,200,100,0.7)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('|0⟩', cx, cy - r - 15);
        ctx.fillText('|1⟩', cx, cy + r + 15);

        // Draw state vector
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        const screenX = cx + x;
        const screenY = cy + z;

        ctx.strokeStyle = 'rgba(20,184,166,0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(20,184,166,0.8)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
        ctx.fill();

        // State info
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(1)}°`, 10, 20);
        ctx.fillText(`φ = ${(phi * 180 / Math.PI).toFixed(1)}°`, 10, 35);
    }

    // Animate Bloch sphere
    let time = 0;
    function animate() {
        time += 0.01;
        const theta = Math.PI / 3 + Math.sin(time) * Math.PI / 6;
        const phi = time % (2 * Math.PI);
        drawBlochSphere(theta, phi);
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Qual è la differenza fondamentale tra un bit classico e un qubit?",
            options: [
                "Un bit è 0, un qubit è 1",
                "Un bit è sempre 0 o 1; un qubit è in sovrapposizione fino alla misurazione",
                "Non c'è differenza, è solo un nome diverso",
                "Un qubit è più veloce di un bit"
            ],
            correct: 1
        },
        {
            q: "Qual è il vantaggio computazionale di N qubit?",
            options: [
                "Possono calcolare N volte più veloce",
                "Possono esplorare contemporaneamente 2^N stati (esecuzione parallela massiva)",
                "Eliminano la necessità di algoritmi efficienti",
                "Non c'è vantaggio reale"
            ],
            correct: 1
        },
        {
            q: "Chi scoprì l'algoritmo quantistico per la fattorizzazione?",
            options: [
                "David Deutsch",
                "Lov Grover",
                "Peter Shor",
                "Richard Feynman"
            ],
            correct: 2
        },
        {
            q: "Perché l'algoritmo di Shor è una minaccia per la crittografia?",
            options: [
                "Fattorizza numeri grandi in tempo polinomiale, rompendo RSA",
                "Crea numeri più grandi",
                "Non è in realtà una minaccia",
                "Funziona solo con numeri pari"
            ],
            correct: 0
        },
        {
            q: "Cosa è l'entanglement quantistico?",
            options: [
                "Quando due qubit sono magneticamente connessi",
                "Una stato dove qubit non possono essere descritti indipendentemente",
                "Un errore nei computer quantistici",
                "Un'operazione classica che simula il quantum"
            ],
            correct: 1
        },
        {
            q: "Qual è il principale ostacolo ai computer quantistici pratici?",
            options: [
                "Costa troppo",
                "La decoerenza: qubit perdono la sovrapposizione quantistica rapidamente",
                "Non sono teoricamente possibili",
                "La correzione degli errori è facile"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => {
        return `
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
        `;
    }).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        const isCorrect = ansIndex === correctIndex;
        if (isCorrect) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Eccellente! Hai risposto correttamente a tutte ${quizData.length} domande!`;
            quizScore.style.color = 'var(--physics-color)';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bloch-canvas')) initBlochSphere();
    if (document.getElementById('quiz-area')) initQuiz();
});
