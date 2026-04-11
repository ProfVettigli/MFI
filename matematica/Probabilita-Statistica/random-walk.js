/**
 * random-walk.js - MFI Physics/Probability
 * Manual and Statistical simulations of Random Walks.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. SIMULAZIONE MANUALE (PASSAGGIO SINGOLO)
       ========================================================= */
    const manualCanvas = document.getElementById('manual-canvas');
    if (manualCanvas) {
        const mctx = manualCanvas.getContext('2d');
        const posEl = document.getElementById('manual-pos');
        const stepsEl = document.getElementById('manual-steps');
        const btnCoin = document.getElementById('btn-coin');
        const btnCoin10 = document.getElementById('btn-coin-10');
        const btnRes = document.getElementById('btn-manual-reset');

        const mw = manualCanvas.width = manualCanvas.offsetWidth;
        const mh = manualCanvas.height = 150;
        const mcx = mw / 2;
        const mcy = mh / 2;
        const mScale = 15; // Scala più grande per il singolo pallino

        let position = 0;
        let steps = 0;
        let history = [0];

        function drawManual() {
            mctx.clearRect(0, 0, mw, mh);
            
            // Assi
            mctx.strokeStyle = "rgba(255,255,255,0.1)";
            mctx.beginPath(); mctx.moveTo(0, mcy); mctx.lineTo(mw, mcy); mctx.stroke();
            mctx.beginPath(); mctx.moveTo(mcx, 0); mctx.lineTo(mcx, mh); mctx.stroke();

            // Scia
            mctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
            mctx.beginPath();
            history.forEach((pos, i) => {
                const x = mcx + pos * mScale;
                if (i === 0) mctx.moveTo(x, mcy);
                else mctx.lineTo(x, mcy - (history.length - i) * 2);
            });
            mctx.stroke();

            // Il "Pallino" (L'Ubriaco)
            mctx.shadowBlur = 15;
            mctx.shadowColor = "#3B82F6";
            mctx.fillStyle = "#fff";
            mctx.beginPath();
            mctx.arc(mcx + position * mScale, mcy, 8, 0, Math.PI * 2);
            mctx.fill();
            mctx.shadowBlur = 0;

            posEl.textContent = position;
            stepsEl.textContent = steps;
        }

        function step(n = 1) {
            for(let i=0; i<n; i++) {
                position += Math.random() < 0.5 ? -1 : 1;
                steps++;
                history.push(position);
                if(history.length > 50) history.shift();
            }
            drawManual();
        }

        btnCoin.addEventListener('click', () => step(1));
        btnCoin10.addEventListener('click', () => step(10));
        btnRes.addEventListener('click', () => {
            position = 0; steps = 0; history = [0]; drawManual();
        });

        drawManual();
    }

    /* =========================================================
       2. SIMULAZIONE STATISTICA (AUTAOMATICA + GRAFICO)
       ========================================================= */
    const rwCanvas = document.getElementById('rw-canvas');
    if (rwCanvas) {
        const ctx = rwCanvas.getContext('2d');
        const btnStart = document.getElementById('btn-start');
        const btnReset = document.getElementById('btn-reset');
        const stepsEl = document.getElementById('steps-count');
        const rmsEl = document.getElementById('rms-value');

        const width = rwCanvas.width = rwCanvas.offsetWidth;
        const height = rwCanvas.height = 250;
        const centerX = width / 2;
        const scale = 3;

        let walkers = [];
        const numWalkers = 150;
        let stepCount = 0;
        let animId = null;
        let isRunning = false;
        let lastUpdateTime = 0;
        const targetFPS = 30;

        let measuredDistances = [];
        let theoreticalDistances = [];

        function initWalkers() {
            walkers = Array.from({ length: numWalkers }, (_, i) => ({
                pos: 0,
                baseY: (height / numWalkers) * i,
                color: `hsla(${200 + Math.random() * 40}, 100%, 60%, 0.6)`
            }));
            stepCount = 0;
            measuredDistances = [];
            theoreticalDistances = [];
            updateStats();
            draw();
        }

        function update(timestamp) {
            if (!isRunning) return;

            if (timestamp - lastUpdateTime < 1000 / targetFPS) {
                animId = requestAnimationFrame(update);
                return;
            }
            lastUpdateTime = timestamp;

            stepCount++;
            let sumSq = 0;
            walkers.forEach(w => {
                w.pos += Math.random() < 0.5 ? -1 : 1;
                sumSq += w.pos * w.pos;
            });

            const rms = Math.sqrt(sumSq / numWalkers);
            
            if (stepCount % 2 === 0) {
                measuredDistances.push(rms);
                theoreticalDistances.push(Math.sqrt(stepCount));
                updateChart();
            }

            updateStats(rms);
            draw();
            animId = requestAnimationFrame(update);
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke();

            walkers.forEach(w => {
                ctx.fillStyle = w.color;
                ctx.beginPath(); ctx.arc(centerX + w.pos * scale, w.baseY, 2, 0, Math.PI * 2); ctx.fill();
            });
        }

        function updateStats(rms = 0) {
            stepsEl.textContent = stepCount;
            rmsEl.textContent = rms.toFixed(2);
        }

        btnStart.addEventListener('click', () => {
            if (isRunning) {
                isRunning = false;
                btnStart.textContent = "Riprendi Statistica";
            } else {
                isRunning = true;
                btnStart.textContent = "Pausa";
                update(performance.now());
            }
        });

        btnReset.addEventListener('click', () => {
            isRunning = false;
            cancelAnimationFrame(animId);
            btnStart.textContent = "Avvia Statistica";
            initWalkers();
            resetChart();
        });

        initWalkers();
    }

    /* =========================================================
       3. GRAFICO SCALATURA (CHART.JS)
       ========================================================= */
    let distChart = null;
    const chartCtx = document.getElementById('distance-chart');

    if (chartCtx) {
        distChart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Distanza Media Misurata',
                        data: [],
                        borderColor: '#3B82F6',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.1
                    },
                    {
                        label: 'Radice di N (Teorica)',
                        data: [],
                        borderColor: '#EC4899',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Lanci (N)' } },
                    y: { title: { display: true, text: 'Distanza' } }
                }
            }
        });
    }

    function updateChart() {
        if (!distChart) return;
        distChart.data.labels = measuredDistances.map((_, i) => i * 2);
        distChart.data.datasets[0].data = measuredDistances;
        distChart.data.datasets[1].data = theoreticalDistances;
        distChart.update('none');
    }

    function resetChart() {
        if (!distChart) return;
        distChart.data.labels = [];
        distChart.data.datasets[0].data = [];
        distChart.data.datasets[1].data = [];
        distChart.update();
    }

    /* =========================================================
       4. QUIZ
       ========================================================= */
    const quizData = [
        {
            question: "1. Nella Random Walk, se raddoppiamo il numero di passi, di quanto aumenta la distanza media?",
            options: ["Raddoppia", "Aumenta di circa 1.41 volte (√2)", "Quadruplica"],
            correct: 1, feedback: "Esatto! La distanza segue la legge della radice quadrata del tempo."
        },
        {
            question: "2. Cosa osservò Robert Brown al microscopio nel 1827?",
            options: ["Il battito cardiaco di una cellula", "Il movimento irregolare del polline in acqua", "La divisione cellulare"],
            correct: 1, feedback: "Corretto! Brown vide il moto frenetico, ma non ne capì subito la causa."
        },
        {
            question: "3. Chi dimostrò che il Moto Browniano era causato dall'urto di atomi invisibili?",
            options: ["Isaac Newton", "Albert Einstein", "Charles Darwin"],
            correct: 1, feedback: "Giusto! Einstein usò la Random Walk per dimostrare la realtà degli atomi."
        },
        {
            question: "4. Cosa sostiene l'ipotesi del 'Mercato Efficiente' in finanza?",
            options: ["Che le azioni salgono sempre", "Che i prezzi seguono una Random Walk e sono imprevedibili", "Che i computer decidono tutto"],
            correct: 1, feedback: "Esatto! È l'idea che il mercato incorpori subito ogni notizia, rendendo i movimenti futuri casuali."
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let answered = 0; let score = 0;

    if (quizArea) {
        quizData.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.innerHTML = `<h3>${q.question}</h3><div class="quiz-options"></div>`;
            const optionsDiv = qDiv.querySelector('.quiz-options');

            q.options.forEach((optText, optIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn'; btn.textContent = optText;
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    if (optIdx === q.correct) {
                        btn.classList.add('correct'); btn.innerHTML += ` ✅ ${q.feedback}`;
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);
                        if (!optionsDiv.querySelector('.wrong')) score++;
                        answered++;
                        if (answered === quizData.length) scoreEl.textContent = `Punteggio Finale: ${score}/${quizData.length}`;
                    } else {
                        btn.classList.add('wrong'); btn.innerHTML += " ✗ Riprova";
                    }
                };
                optionsDiv.appendChild(btn);
            });
            quizArea.appendChild(qDiv);
        });
    }

});
