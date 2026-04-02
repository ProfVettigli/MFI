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
