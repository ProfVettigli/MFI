/**
 * entropia.js
 * Particle simulation and 10-question quiz.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* --- PARTICLE SIMULATION --- */
    const canvas = document.getElementById('entropy-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 200;
        let running = false;
        let animationId;

        // Grid for entropy calculation
        const gridCells = 10; 
        
        function initParticles(ordered = true) {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                if (ordered) {
                    // Start in the top-left corner
                    particles.push({
                        x: Math.random() * 50 + 10,
                        y: Math.random() * 50 + 10,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
                    });
                } else {
                    particles.push({
                        x: Math.random() * (canvas.width - 20) + 10,
                        y: Math.random() * (canvas.height - 20) + 10,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
                    });
                }
            }
            updateStatDisplay();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                if (running) {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            updateStatDisplay();
            animationId = requestAnimationFrame(draw);
        }

        function calculateEntropy() {
            // Divide canvas into gridCells x gridCells and count particles in each
            const cellCounts = new Array(gridCells * gridCells).fill(0);
            const cellW = canvas.width / gridCells;
            const cellH = canvas.height / gridCells;

            particles.forEach(p => {
                const gx = Math.min(Math.floor(p.x / cellW), gridCells - 1);
                const gy = Math.min(Math.floor(p.y / cellH), gridCells - 1);
                cellCounts[gy * gridCells + gx]++;
            });

            // Shannon Entropy H = - sum(p * log(p))
            let h = 0;
            const total = particles.length;
            cellCounts.forEach(count => {
                if (count > 0) {
                    const p = count / total;
                    h -= p * Math.log2(p);
                }
            });

            // Max entropy is log2(total cells)
            const maxH = Math.log2(gridCells * gridCells);
            return (h / maxH) * 100;
        }

        function updateStatDisplay() {
            const entValue = calculateEntropy();
            // Stat update removed as per request
        }

        // Handle Resizing
        function resize() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 400;
            initParticles(true);
        }
        window.addEventListener('resize', resize);
        resize();
        draw();

        document.getElementById('btn-release').onclick = () => {
            running = true;
            document.getElementById('btn-release').disabled = true;
            document.getElementById('btn-release').style.opacity = "0.5";
        };

        document.getElementById('btn-reset').onclick = () => {
            running = false;
            initParticles(true);
            document.getElementById('btn-release').disabled = false;
            document.getElementById('btn-release').style.opacity = "1";
        };
    }

    /* --- BINOMIAL DISTRIBUTION CHART --- */
    const binomialCanvas = document.getElementById('binomial-chart');
    if (binomialCanvas) {
        const bCtx = binomialCanvas.getContext('2d');
        const nSlider = document.getElementById('n-slider');
        const nDisplay = document.getElementById('n-value-display');

        // Precompute log factorials for stability
        const maxN = 200;
        const logFactorial = new Array(maxN + 1).fill(0);
        for (let i = 2; i <= maxN; i++) {
            logFactorial[i] = logFactorial[i - 1] + Math.log(i);
        }

        function getBinomialProb(n, k) {
            // P(k) = (n! / (k! * (n-k)!)) * 0.5^n
            // log(P(k)) = log(n!) - log(k!) - log(n-k!) + n * log(0.5)
            const logP = logFactorial[n] - logFactorial[k] - logFactorial[n - k] + n * Math.log(0.5);
            return Math.exp(logP);
        }

        function drawBinomialChart() {
            const n = parseInt(nSlider.value);
            nDisplay.textContent = n;

            // Clear and resize if needed
            binomialCanvas.width = binomialCanvas.parentElement.clientWidth;
            binomialCanvas.height = 300;
            const w = binomialCanvas.width;
            const h = binomialCanvas.height;
            const padding = 40;

            bCtx.clearRect(0, 0, w, h);

            // Draw Background Grid
            bCtx.strokeStyle = "rgba(255,255,255,0.05)";
            bCtx.lineWidth = 1;
            for(let i=0; i<=4; i++) {
                let y = padding + (h - 2*padding) * (i/4);
                bCtx.beginPath();
                bCtx.moveTo(padding, y);
                bCtx.lineTo(w - padding, y);
                bCtx.stroke();
            }

            const probs = [];
            let maxProb = 0;
            for (let k = 0; k <= n; k++) {
                const p = getBinomialProb(n, k);
                probs.push(p);
                if (p > maxProb) maxProb = p;
            }

            // Normalizzazione: scaliamo il picco per occupare sempre l'80% dell'altezza
            // Questo permette di visualizzare bene come la curva si "stringe"
            const yScale = (h - 2 * padding) * 0.8 / (maxProb || 1); 

            bCtx.beginPath();
            bCtx.strokeStyle = "rgba(168, 85, 247, 1)"; // Purple
            bCtx.lineWidth = 3;
            bCtx.lineJoin = "round";

            const step = (w - 2 * padding) / n;
            
            probs.forEach((p, k) => {
                const x = padding + k * step;
                const y = h - padding - p * yScale;
                if (k === 0) bCtx.moveTo(x, y);
                else bCtx.lineTo(x, y);

                // Draw dots for small N
                if (n < 50) {
                    const originalFill = bCtx.fillStyle;
                    bCtx.fillStyle = "rgba(168, 85, 247, 0.5)";
                    bCtx.beginPath();
                    bCtx.arc(x, y, 2, 0, Math.PI * 2);
                    bCtx.fill();
                    bCtx.fillStyle = originalFill;
                }
            });
            bCtx.stroke();

            // Gradient Fill
            const gradient = bCtx.createLinearGradient(0, padding, 0, h - padding);
            gradient.addColorStop(0, "rgba(168, 85, 247, 0.3)");
            gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
            bCtx.lineTo(padding + n * step, h - padding);
            bCtx.lineTo(padding, h - padding);
            bCtx.fillStyle = gradient;
            bCtx.fill();

            // Labels
            bCtx.fillStyle = "rgba(255,255,255,0.5)";
            bCtx.font = "10px Inter";
            bCtx.textAlign = "center";
            bCtx.fillText("0%", padding, h - padding + 15);
            bCtx.fillText("50%", padding + (w - 2*padding)/2, h - padding + 15);
            bCtx.fillText("100% (Sinistra)", w - padding, h - padding + 15);
            
            bCtx.textAlign = "left";
            bCtx.fillText("P(k)", padding - 30, padding);
        }

        nSlider.oninput = drawBinomialChart;
        window.addEventListener('resize', drawBinomialChart);
        drawBinomialChart();
    }

    /* --- REVERSING BALL SIMULATION --- */
    const revCanvas = document.getElementById('reversing-ball-canvas');
    if (revCanvas) {
        const rCtx = revCanvas.getContext('2d');
        const btnInvert = document.getElementById('btn-invert-time');
        
        let ball = {
            x: 50,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 10,
            color: '#3b82f6'
        };

        let timeMultiplier = 1;

        function updateRev() {
            revCanvas.width = revCanvas.parentElement.clientWidth;
            revCanvas.height = 150;
            ball.y = revCanvas.height / 2;

            ball.x += ball.vx * timeMultiplier;

            // Bounce on x limits
            if (ball.x + ball.radius > revCanvas.width) {
                ball.x = revCanvas.width - ball.radius;
                ball.vx *= -1;
            }
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
            }

            // Draw
            rCtx.clearRect(0, 0, revCanvas.width, revCanvas.height);
            
            // Draw axis
            rCtx.strokeStyle = 'rgba(255,255,255,0.1)';
            rCtx.beginPath();
            rCtx.moveTo(0, revCanvas.height / 2);
            rCtx.lineTo(revCanvas.width, revCanvas.height / 2);
            rCtx.stroke();

            // Draw ball
            rCtx.beginPath();
            rCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            rCtx.fillStyle = ball.color;
            rCtx.shadowBlur = 15;
            rCtx.shadowColor = ball.color;
            rCtx.fill();
            rCtx.shadowBlur = 0;

            requestAnimationFrame(updateRev);
        }

        btnInvert.onclick = () => {
            timeMultiplier *= -1;
            btnInvert.textContent = timeMultiplier > 0 ? "Inverti Freccia del Tempo" : "Tempo Invertito! (Premi per tornare)";
            btnInvert.style.background = timeMultiplier > 0 ? "#3b82f6" : "#f59e0b";
        };

        updateRev();
    }

    /* --- QUIZ ENTROPIA (10 questions) --- */
    const quizData = [
        {
            q: "1. Qual è la definizione macroscopica corretta di variazione di entropia (dS)?",
            a: ["dQ/T", "dU + PdV", "dH - TdS"],
            c: 0
        },
        {
            q: "2. Quale potenziale termodinamico è definito come H - TS?",
            a: ["Entalpia", "Energia Libera di Gibbs", "Energia di Helmholtz"],
            c: 1
        },
        {
            q: "3. In un sistema isolato, l'entropia...",
            a: ["Diminuisce sempre.", "Può solo aumentare o restare costante.", "È sempre nulla."],
            c: 1
        },
        {
            q: "4. Cosa rappresenta 'W' nella celebre formula di Boltzmann S = k ln W?",
            a: ["Il lavoro (Work) totale.", "La temperatura in Kelvin.", "Il numero di microstati compatibili col macrostato."],
            c: 2
        },
        {
            q: "5. Cos'è un 'Macro-stato'?",
            a: ["La posizione di ogni singola molecola.", "L'insieme delle variabili osservabili (P, V, T).", "La velocità media dei neutroni."],
            c: 1
        },
        {
            q: "6. Perché l'entropia definisce la 'Freccia del Tempo'?",
            a: ["Perché le particelle si muovono più velocemente col tempo.", "Perché i processi naturali evolvono spontaneamente verso il disordine.", "Perché il tempo è una grandezza termodinamica."],
            c: 1
        },
        {
            q: "7. Nell'informazione di Shannon, l'entropia misura...",
            a: ["La velocità di internet.", "L'incertezza o sorpresa contenuta in un messaggio.", "Il calore dei processori."],
            c: 1
        },
        {
            q: "8. Quale di questi stati della materia ha solitamente l'entropia più BASSA?",
            a: ["Gas", "Liquido", "Cristallo Solido"],
            c: 2
        },
        {
            q: "9. Cosa afferma il Terzo Principio della Termodinamica?",
            a: ["L'entropia di un cristallo perfetto a 0 Kelvin è zero.", "L'entropia è infinita allo zero assoluto.", "Non si può mai scendere sotto i 100 Kelvin."],
            c: 0
        },
        {
            q: "10. In uno stato di EQUILIBRIO termodinamico, l'entropia è:",
            a: ["Minima", "Massima", "Oscillante"],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2.5rem";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "12px";
            card.style.background = "rgba(255,255,255,0.02)";
            card.style.border = "1px solid rgba(255,255,255,0.05)";

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex";
            optionsGroup.style.flexDirection = "column";
            optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = option;
                btn.style.textAlign = "left";
                btn.style.padding = "1rem";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "white";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.transition = "0.3s";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    
                    const sibs = optionsGroup.children;
                    for (let s of sibs) s.disabled = true;

                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        score++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato</strong>";
                        sibs[data.c].style.background = "#10B981";
                        sibs[data.c].style.opacity = "1";
                    }
                    
                    btn.classList.add('picked');
                    answered++;
                    if (answered === quizData.length) {
                        quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                        quizScore.style.color = score > 7 ? "#10B981" : "#F59E0B";
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
