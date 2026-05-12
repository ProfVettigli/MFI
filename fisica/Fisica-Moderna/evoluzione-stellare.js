// Evoluzione Stellare - Interactive Components

// ============================================================================
// HERTZSPRUNG-RUSSELL DIAGRAM
// ============================================================================

function initHRDiagram() {
    const canvas = document.getElementById('hr-diagram');
    const ctx = canvas.getContext('2d');

    // Sample stellar data: (temperature in K, luminosity relative to Sun)
    const stars = [
        { name: 'Rigel', temp: 12100, lum: 120000, color: '#3366ff' },
        { name: 'Betelgeuse', temp: 3500, lum: 100000, color: '#ff4444' },
        { name: 'Sirius', temp: 9940, lum: 26, color: '#6699ff' },
        { name: 'Vega', temp: 9602, lum: 46, color: '#4488ff' },
        { name: 'Altair', temp: 7550, lum: 10.6, color: '#aabbff' },
        { name: 'Sun', temp: 5778, lum: 1, color: '#ffff00' },
        { name: 'Sirius B', temp: 8400, lum: 0.026, color: '#ffffff' },
        { name: 'Proxima', temp: 3042, lum: 0.0017, color: '#ff8844' },
        // Add many more for density
        ...Array(30).fill(0).map(() => ({
            temp: 3000 + Math.random() * 2000,
            lum: 0.01 + Math.random() * 0.05,
            color: '#ff6666'
        })), // Red dwarfs
        ...Array(25).fill(0).map(() => ({
            temp: 5000 + Math.random() * 2000,
            lum: 0.5 + Math.random() * 5,
            color: '#ffcc44'
        })), // G & K stars
        ...Array(20).fill(0).map(() => ({
            temp: 7000 + Math.random() * 2000,
            lum: 5 + Math.random() * 100,
            color: '#aaddff'
        })), // A & F stars
        ...Array(15).fill(0).map(() => ({
            temp: 9000 + Math.random() * 3000,
            lum: 100 + Math.random() * 10000,
            color: '#4488ff'
        })), // B & O stars (main sequence)
        ...Array(10).fill(0).map(() => ({
            temp: 3500 + Math.random() * 1000,
            lum: 100 + Math.random() * 100000,
            color: '#ff5555'
        })) // Giant branch
    ];

    function drawDiagram() {
        const w = canvas.width;
        const h = canvas.height;
        const padding = 50;
        const graphX = padding;
        const graphY = padding;
        const graphWidth = w - 2 * padding;
        const graphHeight = h - 2 * padding;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Axes (inverted temperature)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(graphX + graphWidth, graphY + graphHeight); // Origin at top-right
        ctx.lineTo(graphX, graphY + graphHeight); // Bottom axis
        ctx.moveTo(graphX + graphWidth, graphY);
        ctx.lineTo(graphX + graphWidth, graphY + graphHeight); // Right axis
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Temperature (K) →', graphX + graphWidth / 2, h - 5);
        ctx.save();
        ctx.translate(15, graphY + graphHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Luminosity (L☉) →');
        ctx.restore();

        // Tick marks and labels
        ctx.font = '9px sans-serif';
        const temps = [3000, 5000, 7000, 9000, 12000];
        for (let i = 0; i < temps.length; i++) {
            const x = graphX + graphWidth - ((temps[i] - 3000) / (12000 - 3000)) * graphWidth;
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, graphY);
            ctx.lineTo(x, graphY + graphHeight);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.textAlign = 'center';
            ctx.fillText(temps[i], x, graphY + graphHeight + 15);
        }

        const lums = [0.001, 0.01, 0.1, 1, 10, 100, 1000, 10000, 100000];
        for (let i = 0; i < lums.length; i++) {
            const y = graphY + graphHeight - (Math.log10(lums[i]) + 5) / 5 * graphHeight;
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(graphX, y);
            ctx.lineTo(graphX + graphWidth, y);
            ctx.stroke();
        }

        // Plot stars
        for (const star of stars) {
            const x = graphX + graphWidth - ((star.temp - 3000) / (12000 - 3000)) * graphWidth;
            const y = graphY + graphHeight - (Math.log10(star.lum) + 5) / 5 * graphHeight;

            ctx.fillStyle = star.color || '#ffff00';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Glow
            ctx.strokeStyle = star.color || '#ffff00';
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 8;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Label named stars
        const namedStars = stars.slice(0, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 9px sans-serif';
        for (const star of namedStars) {
            if (star.name) {
                const x = graphX + graphWidth - ((star.temp - 3000) / (12000 - 3000)) * graphWidth;
                const y = graphY + graphHeight - (Math.log10(star.lum) + 5) / 5 * graphHeight;
                ctx.textAlign = 'left';
                ctx.fillText(star.name, x + 8, y - 8);
            }
        }
    }

    drawDiagram();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Qual è il 90% della vita di una stella?",
            options: [
                "Fase gigante rossa",
                "Fase di sequenza principale (fusione di H)",
                "Fase di nana bianca",
                "Fase di protostella"
            ],
            correct: 1
        },
        {
            q: "Quali due scienziati svilupparono il diagramma Hertzsprung-Russell?",
            options: [
                "Einstein e Planck",
                "Rutherford e Bohr",
                "Hertzsprung e Russell",
                "Herschel e Messier"
            ],
            correct: 2
        },
        {
            q: "Quale reazione nucleare alimenta il Sole?",
            options: [
                "Fissione di uranio",
                "Fusione di idrogeno in elio",
                "Decadimento radioattivo",
                "Reazioni chimiche"
            ],
            correct: 1
        },
        {
            q: "Cosa causa il collasso di una stella massiccia in un buco nero?",
            options: [
                "Temperatura troppo bassa",
                "Perdita di carburante nucleare; la gravità non ha supporto",
                "Esplosione superficiale",
                "Rotazione troppo veloce"
            ],
            correct: 1
        },
        {
            q: "Qual è la densità approssimativa di una nana bianca?",
            options: [
                "Come il ferro (10 g/cm³)",
                "10⁶ kg/cm³",
                "10⁹ kg/cm³",
                "Infinita"
            ],
            correct: 2
        },
        {
            q: "Cos'è una stella di neutroni?",
            options: [
                "Una stella morta che non irradia",
                "Il nucleo di una stella che esplode in supernova",
                "Una stella composta principalmente di neutroni (densità ~10¹⁷ kg/cm³)",
                "Una stella ipotizzata ma mai osservata"
            ],
            correct: 2
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
    if (document.getElementById('hr-diagram')) initHRDiagram();
    if (document.getElementById('quiz-area')) initQuiz();
});
