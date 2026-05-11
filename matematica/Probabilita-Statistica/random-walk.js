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
       4. SIMULAZIONE CATENA DI MARKOV (METEO 3 STATI)
       ========================================================= */
    const STATES = [
        { name: 'Sole',    icon: '☀️', color: '#F59E0B' },
        { name: 'Pioggia', icon: '🌧️', color: '#3B82F6' },
        { name: 'Nebbia',  icon: '🌫️', color: '#94A3B8' }
    ];
    // Matrice di transizione P[da][a]
    const P = [
        [0.70, 0.20, 0.10],
        [0.30, 0.50, 0.20],
        [0.25, 0.35, 0.40]
    ];

    let markovState = 0;
    let markovDay   = 1;
    let markovCounts = [1, 0, 0]; // giorno 1 parte dal sole

    const markovChartEl = document.getElementById('markov-chart');
    const markovIconEl  = document.getElementById('markov-state-icon');
    const markovNameEl  = document.getElementById('markov-state-name');
    const markovDayEl   = document.getElementById('markov-day');

    function markovTransition() {
        const row = P[markovState];
        const r   = Math.random();
        let cum = 0;
        for (let i = 0; i < row.length; i++) {
            cum += row[i];
            if (r < cum) { markovState = i; break; }
        }
        markovDay++;
        markovCounts[markovState]++;
    }

    function markovUpdateUI() {
        const s = STATES[markovState];
        if (markovIconEl) markovIconEl.textContent = s.icon;
        if (markovNameEl) { markovNameEl.textContent = s.name; markovNameEl.style.color = s.color; }
        if (markovDayEl)  markovDayEl.textContent = 'Giorno ' + markovDay;
        const total = markovCounts.reduce((a,b)=>a+b, 0);
        [0,1,2].forEach(i => {
            const el = document.getElementById('markov-count-' + i);
            if (el) el.textContent = markovCounts[i];
        });
        const totEl = document.getElementById('markov-total');
        if (totEl) totEl.textContent = total;
        if (markovChartEl) drawMarkovChart(total);
    }

    function drawMarkovChart(total) {
        const canvas = markovChartEl;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.offsetWidth;
        const h = canvas.height = 180;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);

        const stationary = [0.533, 0.300, 0.167]; // distribuzione stazionaria teorica
        const barW = Math.floor(w / 3) - 20;
        const maxH = h - 60;

        STATES.forEach((s, i) => {
            const empFrac  = total > 0 ? markovCounts[i] / total : 0;
            const theoFrac = stationary[i];
            const x = i * (w / 3) + 10;

            // Barra teorica (trasparente)
            ctx.fillStyle = s.color + '33';
            ctx.fillRect(x, h - 40 - theoFrac * maxH, barW, theoFrac * maxH);
            ctx.strokeStyle = s.color + '88';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, h - 40 - theoFrac * maxH, barW, theoFrac * maxH);

            // Barra empirica (piena)
            ctx.fillStyle = s.color + 'CC';
            ctx.fillRect(x, h - 40 - empFrac * maxH, barW, empFrac * maxH);

            // Etichetta percentuale
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText((empFrac * 100).toFixed(1) + '%', x + barW / 2, h - 42 - empFrac * maxH - 4);

            // Nome stato
            ctx.fillStyle = s.color;
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(s.icon + ' ' + s.name, x + barW / 2, h - 20);

            // Teorica label
            ctx.fillStyle = '#64748B';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText('teorico: ' + (theoFrac * 100).toFixed(0) + '%', x + barW / 2, h - 6);
        });

        // Legenda
        ctx.fillStyle = '#475569';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('█ Misurato   □ Stazionaria Teorica', 10, 14);
    }

    function markovInit(startState) {
        markovState  = startState;
        markovDay    = 1;
        markovCounts = [0, 0, 0];
        markovCounts[startState] = 1;
        markovUpdateUI();
    }

    if (markovChartEl) {
        // Pulsanti di avvio con stato iniziale
        document.querySelectorAll('.markov-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                markovInit(parseInt(btn.dataset.state));
            });
        });

        const stepBtn    = document.getElementById('markov-step');
        const run100Btn  = document.getElementById('markov-run-100');
        const run1000Btn = document.getElementById('markov-run-1000');
        const resetBtn   = document.getElementById('markov-reset');

        stepBtn?.addEventListener('click', () => {
            markovTransition();
            markovUpdateUI();
        });
        run100Btn?.addEventListener('click', () => {
            for (let i = 0; i < 100; i++) markovTransition();
            markovUpdateUI();
        });
        run1000Btn?.addEventListener('click', () => {
            for (let i = 0; i < 1000; i++) markovTransition();
            markovUpdateUI();
        });
        resetBtn?.addEventListener('click', () => markovInit(0));

        // Init di default
        markovInit(0);
    }

    /* =========================================================
       5. QUIZ
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
        },
        {
            question: "5. La Random Walk 1D è una catena di Markov perché...",
            options: [
                "...la posizione al passo N+1 dipende solo dalla posizione al passo N, non dall'intera storia.",
                "...il cammino è completamente deterministo.",
                "...la distanza cresce sempre in modo regolare."
            ],
            correct: 0, feedback: "Esattamente! Questa è la proprietà di Markov: il futuro dipende solo dallo stato presente."
        },
        {
            question: "6. La 'distribuzione stazionaria' di una catena di Markov è...",
            options: [
                "La distribuzione dello stato iniziale.",
                "La distribuzione di probabilità a lungo termine degli stati, indipendente dal punto di partenza.",
                "La distribuzione solo se la catena è simmetrica."
            ],
            correct: 1, feedback: "Corretto! È il vettore π tale che πP = π. Il PageRank di Google è proprio questo per il grafo del web."
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl  = document.getElementById('quiz-score');
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
