/**
 * cinetica-chimica.js
 * Particle collision simulation and 10-question quiz.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* --- PARTICLE SIMULATION --- */
    const canvas = document.getElementById('kinetics-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        let numParticles = 100;
        let animationId;

        // Simulation state
        let temperature = 300; // Kelvin
        let activationEnergy = 40; // kJ
        const baseSpeed = 2;

        let isRunning = false;
        const btnStart = document.getElementById('btn-start');

        const tempSlider = document.getElementById('temp-slider');
        const tempVal = document.getElementById('temp-val');
        const eaSlider = document.getElementById('ea-slider');
        const eaVal = document.getElementById('ea-val');
        const btnCatalyst = document.getElementById('btn-catalyst');
        const btnReset = document.getElementById('btn-reset');

        const reagCount = document.getElementById('reag-count');
        const prodCount = document.getElementById('prod-count');

        // Distanza riposo (Raggio)
        const radius = 5;

        class Particle {
            constructor() {
                this.x = Math.random() * (canvas.width - 2 * radius) + radius;
                this.y = Math.random() * (canvas.height - 2 * radius) + radius;

                // Direzione random
                const angle = Math.random() * Math.PI * 2;
                // Velocità basata sulla temperatura (semplificata)
                const speedMulti = Math.sqrt(temperature / 300) * baseSpeed;

                this.vx = Math.cos(angle) * speedMulti;
                this.vy = Math.sin(angle) * speedMulti;

                this.state = 'reactant'; // reactant (gray), product (green)
            }

            updateSpeedMulti() {
                const speedMulti = Math.sqrt(temperature / 300) * baseSpeed;
                const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (currentSpeed > 0) {
                    this.vx = (this.vx / currentSpeed) * speedMulti;
                    this.vy = (this.vy / currentSpeed) * speedMulti;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = this.state === 'reactant' ? '#94a3b8' : '#10b981';
                ctx.fill();
            }

            move() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce
                if (this.x - radius < 0 || this.x + radius > canvas.width) {
                    this.vx *= -1;
                    this.x = Math.max(radius, Math.min(this.x, canvas.width - radius));
                }
                if (this.y - radius < 0 || this.y + radius > canvas.height) {
                    this.vy *= -1;
                    this.y = Math.max(radius, Math.min(this.y, canvas.height - radius));
                }
            }
        }

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
            updateCounters();
        }

        function updateCounters() {
            const reacts = particles.filter(p => p.state === 'reactant').length;
            const prods = numParticles - reacts;
            reagCount.textContent = reacts;
            prodCount.textContent = prods;
        }

        function handleCollisions() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < radius * 2) {
                        // Resolve collision (elastic)
                        const nx = dx / distance;
                        const ny = dy / distance;

                        const dvx = p1.vx - p2.vx;
                        const dvy = p1.vy - p2.vy;

                        const dotProduct = dvx * nx + dvy * ny;

                        if (dotProduct > 0) {
                            p1.vx -= nx * dotProduct;
                            p1.vy -= ny * dotProduct;
                            p2.vx += nx * dotProduct;
                            p2.vy += ny * dotProduct;

                            // Reaction check!
                            const collisionEnergy = (Math.random() * 20) + (temperature / 10);

                            if (p1.state === 'reactant' && p2.state === 'reactant') {
                                // Reazione Diretta
                                if (collisionEnergy >= activationEnergy) {
                                    p1.state = 'product';
                                    p2.state = 'product';
                                    updateCounters();
                                }
                            } else if (p1.state === 'product' && p2.state === 'product') {
                                // Reazione Inversa: introduciamo un'Ea inversa leggermente più alta
                                // per simulare una reazione esotermica diretta favorita all'equilibrio
                                const reverseActivationEnergy = activationEnergy + 15;
                                if (collisionEnergy >= reverseActivationEnergy) {
                                    p1.state = 'reactant';
                                    p2.state = 'reactant';
                                    updateCounters();
                                }
                            }
                        }
                    }
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isRunning) {
                handleCollisions();
            }

            particles.forEach(p => {
                if (isRunning) {
                    p.move();
                }
                p.draw();
            });

            animationId = requestAnimationFrame(draw);
        }

        function resize() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 400;
            initParticles();
        }
        window.addEventListener('resize', resize);

        // Listeners for UI
        tempSlider.addEventListener('input', (e) => {
            temperature = parseInt(e.target.value);
            tempVal.textContent = temperature;
            particles.forEach(p => p.updateSpeedMulti());
        });

        eaSlider.addEventListener('input', (e) => {
            activationEnergy = parseInt(e.target.value);
            eaVal.textContent = activationEnergy;
        });

        btnCatalyst.addEventListener('click', () => {
            // Un catalizzatore abbassa l'energia di attivazione
            activationEnergy = Math.max(10, activationEnergy - 20); // Abbassiamo di 20
            eaSlider.value = activationEnergy;
            eaVal.textContent = activationEnergy;

            // Effetto grafico sul bottone
            btnCatalyst.style.background = "#22c55e";
            btnCatalyst.style.color = "white";
            btnCatalyst.textContent = "Catalizzatore Aggiunto!";
            setTimeout(() => {
                btnCatalyst.style.background = "#eab308";
                btnCatalyst.style.color = "black";
                btnCatalyst.textContent = "Aggiungi Catalizzatore (Abbassa Ea)";
            }, 3000);
        });

        // Start / Pause
        btnStart.addEventListener('click', () => {
            isRunning = !isRunning;
            if (isRunning) {
                btnStart.textContent = "Pausa Simulazione";
                btnStart.style.background = "#f59e0b"; // arancione
            } else {
                btnStart.textContent = "Avvia Simulazione";
                btnStart.style.background = "#3b82f6"; // blu
            }
        });

        btnReset.addEventListener('click', () => {
            isRunning = false;
            btnStart.textContent = "Avvia Simulazione";
            btnStart.style.background = "#3b82f6";

            initParticles();
            temperature = 300;
            activationEnergy = 40;
            tempSlider.value = temperature;
            eaSlider.value = activationEnergy;
            tempVal.textContent = temperature;
            eaVal.textContent = activationEnergy;
            particles.forEach(p => p.updateSpeedMulti());
        });

        // Initialize
        resize();
        draw();
    }

    /* --- QUIZ CINETICA CHIMICA (10 questions) --- */
    const quizData = [
        {
            q: "1. Come si definisce la velocità di reazione per un reagente?",
            a: ["Aumento della sua concentrazione nel tempo.", "Diminuzione della sua concentrazione nel tempo diviso Delta T.", "Il rapporto tra reagenti e prodotti divisi per T.", "La quantità di calore scambiata."],
            c: 1
        },
        {
            q: "2. Cosa ci dice la variazione di Energia Libera (Delta G) rispetto alla cinetica?",
            a: ["Ci dice quanto tempo impiega la reazione.", "Nulla sulla velocità, solo se la reazione è spontanea termodinamicamente.", "Misura esattamente la costante di velocità (k).", "Rappresenta l'energia cinetica delle molecole."],
            c: 1
        },
        {
            q: "3. Secondo la teoria degli urti, quali condizioni devono verificarsi per un urto EFFICACE?",
            a: ["Le molecole devono sfiorarsi lentamente.", "Deve esserci solo l'orientamento spaziale corretto, a prescindere dall'energia.", "Giusto orientamento spaziale e sufficiente energia per superare l'Energia di Attivazione.", "Le molecole devono avere la stessa massa."],
            c: 2
        },
        {
            q: "4. L'Energia di Attivazione (Ea) è...",
            a: ["L'energia prodotta alla fine della reazione.", "L'energia di massa relativistica delle molecole.", "L'energia minima necessaria per rompere i legami nei reagenti.", "Una barriera magnetica tra i nuclei."],
            c: 2
        },
        {
            q: "5. Come agisce un CATALIZZATORE su una reazione?",
            a: ["Aumenta l'energia interna del sistema.", "Offre un percorso di reazione alternativo con Energia di Attivazione minore.", "Alza la temperatura della stanza.", "Rende spontanea una reazione impossibile (Delta G > 0)."],
            c: 1
        },
        {
            q: "6. Nell'equazione di Arrhenius, k = A * e^(-Ea / RT), cosa indica 'A'?",
            a: ["Il fattore termodinamico di Arrhenius legata al calore locale.", "Il fattore pre-esponenziale (o di frequenza), legato alle collisioni totali e ai requisiti sterici.", "L'area totale del reattore.", "L'Accelerazione di gravità."],
            c: 1
        },
        {
            q: "7. Cosa succede matematicamente (e fisicamente) elevando la Temperatura (T) nell'equazione di Arrhenius?",
            a: ["Il termine esponenziale diventa più grande, indicando che una frazione maggiore di molecole ha energia > Ea.", "La costante K diminuisce quasi a zero.", "L'energia di attivazione scompare perché i legami si rompono da soli.", "Il volume diminuisce aumentandone la densità di urto."],
            c: 0
        },
        {
            q: "8. Un catalizzatore eterogeneo...",
            a: ["E' nella medesima fase (stato della materia) dei reagenti.", "Si discioglie completamente in acqua formandone un gel.", "Si trova in una fase diversa rispetto ai reagenti (ad es. un solido in un gas).", "Cambia colore durante lo svolgimento."],
            c: 2
        },
        {
            q: "9. Termodinamica vs Cinetica: chi vince? Il diamante a 298K si trasforma in grafite (Delta G negativo). Perché gli anelli di diamante non diventano matite?",
            a: ["Perché la termodinamica sbaglia a definire la grafite come favorita.", "Perché la reazione è così veloce che non ce ne accorgiamo.", "Perché l'Energia di Attivazione è così alta che, a temperatura ambiente, la reazione è infinitamente lenta (controllo cinetico).", "Nessuna delle precedenti."],
            c: 2
        },
        {
            q: "10. Qual è l'unità di misura nel Sistema Internazionale per la Temperatura nell'Equazione di Arrhenius?",
            a: ["Gradi Celsius (°C)", "Gradi Fahrenheit (°F)", "Joule (J)", "Kelvin (K)"],
            c: 3
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

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff; font-size: 1.1rem;">${data.q}</h3>`;
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
                btn.style.fontSize = "0.95rem";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) {
                        return; // Non fare niente se questo bottone è già stato cliccato
                    }

                    // Invece di disabilitare tutto, verifichiamo la correttezza, stile "trial and error" richiesto
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";

                        // Segniamo la risposta giusta e se è al primo tentativo otteniamo il punto
                        if (!card.classList.contains('attempted')) {
                            score++;
                        }

                        // Disabilita tutti per questa domanda
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }

                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= 7 ? "#10B981" : "#F59E0B";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato, riprova</strong>";
                        btn.classList.add('picked');
                        btn.style.pointerEvents = "none";
                        card.classList.add('attempted'); // Segna come domanda con errore
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
