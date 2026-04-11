/**
 * teorema-fondamentale.js - MFI Algebra
 * Simulazione del piano complesso e Quiz di riepilogo.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================
       1. SIMULATORE PIANO COMPLESSO
       ========================================================= */
    const canvas = document.getElementById('complex-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const valReal = document.getElementById('val-real');
        const valImag = document.getElementById('val-imag');

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 40; // Pixel per unità

        function drawGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Assi
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            
            // Linee griglia
            for (let i = -6; i <= 6; i++) {
                // Verticali
                ctx.beginPath();
                ctx.moveTo(centerX + i * scale, 0);
                ctx.lineTo(centerX + i * scale, canvas.height);
                ctx.stroke();
                
                // Orizzontali
                ctx.beginPath();
                ctx.moveTo(0, centerY + i * scale);
                ctx.lineTo(canvas.width, centerY + i * scale);
                ctx.stroke();
            }

            // Assi Principali
            ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            ctx.lineWidth = 2;
            
            // Asse Reale (x)
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();
            
            // Asse Immaginario (y)
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, canvas.height);
            ctx.stroke();

            // Etichette
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "12px Inter";
            ctx.fillText("Reale", canvas.width - 40, centerY - 10);
            ctx.fillText("Immaginario (i)", centerX + 10, 20);
        }

        function updateComplex(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Converti in coordinate matematiche
            const a = (mouseX - centerX) / scale;
            const b = -(mouseY - centerY) / scale; // y invertita nel canvas

            drawGrid();

            // Disegna il punto Z
            ctx.fillStyle = "#F59E0B";
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Linee proiezione
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(mouseX, centerY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(centerX, mouseY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Linea origine-punto
            ctx.strokeStyle = "#F59E0B";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();

            // Aggiorna etichette
            valReal.textContent = a.toFixed(2);
            valImag.textContent = b.toFixed(2) + "i";
        }

        canvas.addEventListener('mousemove', updateComplex);
        drawGrid();
    }

    /* =========================================================
       2. SIMULATORE SOMMA (DRAG AND DROP)
       ========================================================= */
    const sumCanvas = document.getElementById('sum-canvas');
    if (sumCanvas) {
        const sctx = sumCanvas.getContext('2d');
        const z1Label = document.getElementById('val-z1');
        const z2Label = document.getElementById('val-z2');
        const sumLabel = document.getElementById('val-sum');

        const centerX = sumCanvas.width / 2;
        const centerY = sumCanvas.height / 2;
        const scale = 40;

        let z1 = { x: 2 * scale, y: -1 * scale, color: '#3B82F6', label: 'z₁' };
        let z2 = { x: -1 * scale, y: -2 * scale, color: '#10B981', label: 'z₂' };
        let dragging = null;

        function drawSum() {
            sctx.clearRect(0, 0, sumCanvas.width, sumCanvas.height);
            
            // Griglia
            sctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            sctx.lineWidth = 1;
            for(let i = -6; i <= 6; i++) {
                sctx.beginPath(); sctx.moveTo(centerX + i*scale, 0); sctx.lineTo(centerX + i*scale, sumCanvas.height); sctx.stroke();
                sctx.beginPath(); sctx.moveTo(0, centerY + i*scale); sctx.lineTo(sumCanvas.width, centerY + i*scale); sctx.stroke();
            }

            // Assi
            sctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            sctx.beginPath(); sctx.moveTo(0, centerY); sctx.lineTo(sumCanvas.width, centerY); sctx.stroke();
            sctx.beginPath(); sctx.moveTo(centerX, 0); sctx.lineTo(centerX, sumCanvas.height); sctx.stroke();

            // Calcolo Somma
            const sx = z1.x + z2.x;
            const sy = z1.y + z2.y;

            // Parallelogramma
            sctx.setLineDash([5, 5]);
            sctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            sctx.beginPath();
            sctx.moveTo(centerX + z1.x, centerY + z1.y);
            sctx.lineTo(centerX + sx, centerY + sy);
            sctx.lineTo(centerX + z2.x, centerY + z2.y);
            sctx.stroke();
            sctx.setLineDash([]);

            // Vettori
            drawVector(z1.x, z1.y, z1.color);
            drawVector(z2.x, z2.y, z2.color);
            drawVector(sx, sy, "#FBBF24", true); // Somma

            // Punti trascinabili
            drawPoint(z1);
            drawPoint(z2);

            // Update Testi
            z1Label.textContent = formatComplex(z1);
            z2Label.textContent = formatComplex(z2);
            sumLabel.textContent = `${(sx/scale).toFixed(1)}${(sy <= 0 ? '+' : '')}${(-sy/scale).toFixed(1)}i`;
        }

        function drawVector(x, y, color, isSum = false) {
            sctx.strokeStyle = color;
            sctx.lineWidth = isSum ? 3 : 2;
            sctx.beginPath();
            sctx.moveTo(centerX, centerY);
            sctx.lineTo(centerX + x, centerY + y);
            sctx.stroke();
            
            // Freccia semplice
            const angle = Math.atan2(y, x);
            sctx.beginPath();
            sctx.moveTo(centerX + x, centerY + y);
            sctx.lineTo(centerX + x - 10 * Math.cos(angle - 0.5), centerY + y - 10 * Math.sin(angle - 0.5));
            sctx.moveTo(centerX + x, centerY + y);
            sctx.lineTo(centerX + x - 10 * Math.cos(angle + 0.5), centerY + y - 10 * Math.sin(angle + 0.5));
            sctx.stroke();
        }

        function drawPoint(p) {
            sctx.fillStyle = p.color;
            sctx.beginPath();
            sctx.arc(centerX + p.x, centerY + p.y, 8, 0, Math.PI*2);
            sctx.fill();
            sctx.fillStyle = "#fff";
            sctx.font = "bold 12px Inter";
            sctx.fillText(p.label, centerX + p.x + 10, centerY + p.y - 10);
        }

        function formatComplex(p) {
            const a = (p.x/scale).toFixed(1);
            const b = (-p.y/scale).toFixed(1);
            return `${a}${parseFloat(b) >= 0 ? '+' : ''}${b}i`;
        }

        // Drag Logic
        sumCanvas.addEventListener('mousedown', (e) => {
            const rect = sumCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - centerX;
            const my = e.clientY - rect.top - centerY;
            
            if (Math.hypot(mx - z1.x, my - z1.y) < 15) dragging = z1;
            else if (Math.hypot(mx - z2.x, my - z2.y) < 15) dragging = z2;
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const rect = sumCanvas.getBoundingClientRect();
            dragging.x = e.clientX - rect.left - centerX;
            dragging.y = e.clientY - rect.top - centerY;
            drawSum();
        });

        window.addEventListener('mouseup', () => dragging = null);

        drawSum();
    }

    /* =========================================================
       3. SIMULATORE PRODOTTO (DRAG AND DROP)
       ========================================================= */
    const prodCanvas = document.getElementById('prod-canvas');
    if (prodCanvas) {
        const pctx = prodCanvas.getContext('2d');
        const p1Label = document.getElementById('val-p1');
        const p2Label = document.getElementById('val-p2');
        const prodLabel = document.getElementById('val-prod');

        const centerX = prodCanvas.width / 2;
        const centerY = prodCanvas.height / 2;
        const scale = 50;

        let p1 = { x: 1.2 * scale, y: -0.5 * scale, color: '#3B82F6', label: 'z₁' };
        let p2 = { x: 0.8 * scale, y: -1.2 * scale, color: '#A855F7', label: 'z₂' };
        let dragging = null;

        function drawProd() {
            pctx.clearRect(0, 0, prodCanvas.width, prodCanvas.height);
            
            // Griglia e Assi
            pctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            pctx.lineWidth = 1;
            for(let i = -5; i <= 5; i++) {
                pctx.beginPath(); pctx.moveTo(centerX + i*scale, 0); pctx.lineTo(centerX + i*scale, prodCanvas.height); pctx.stroke();
                pctx.beginPath(); pctx.moveTo(0, centerY + i*scale); pctx.lineTo(prodCanvas.width, centerY + i*scale); pctx.stroke();
            }
            pctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            pctx.beginPath(); pctx.moveTo(0, centerY); pctx.lineTo(prodCanvas.width, centerY); pctx.stroke();
            pctx.beginPath(); pctx.moveTo(centerX, 0); pctx.lineTo(centerX, prodCanvas.height); pctx.stroke();

            // Calcolo coordinate matematiche (divise per scale)
            const x1 = p1.x / scale; const y1 = -p1.y / scale;
            const x2 = p2.x / scale; const y2 = -p2.y / scale;

            // Prodotto: (x1+iy1)(x2+iy2) = (x1x2 - y1y2) + i(x1y2 + x2y1)
            const rx = x1 * x2 - y1 * y2;
            const ry = x1 * y2 + x2 * y1;

            const px = rx * scale;
            const py = -ry * scale;

            // Archi Angoli
            drawAngleArc(p1, "rgba(59, 130, 246, 0.3)");
            drawAngleArc(p2, "rgba(168, 85, 247, 0.3)");
            drawAngleArc({x: px, y: py}, "rgba(16, 185, 129, 0.2)", Math.hypot(rx, ry) * scale);

            // Vettori
            drawVector(p1.x, p1.y, p1.color);
            drawVector(p2.x, p2.y, p2.color);
            drawVector(px, py, "#10B981", true); // Prodotto

            // Punti
            drawPoint(p1);
            drawPoint(p2);

            // Update Testi
            p1Label.textContent = formatComplex(p1);
            p2Label.textContent = formatComplex(p2);
            prodLabel.textContent = `${rx.toFixed(2)}${(ry >= 0 ? '+' : '')}${ry.toFixed(2)}i`;
        }

        function drawAngleArc(p, color, radius = 30) {
            const angle = Math.atan2(p.y, p.x);
            pctx.strokeStyle = color;
            pctx.lineWidth = 2;
            pctx.beginPath();
            pctx.arc(centerX, centerY, radius, 0, angle, angle < 0);
            pctx.stroke();
        }

        function drawVector(x, y, color, isRes = false) {
            pctx.strokeStyle = color;
            pctx.lineWidth = isRes ? 3 : 2;
            pctx.beginPath(); pctx.moveTo(centerX, centerY); pctx.lineTo(centerX + x, centerY + y); pctx.stroke();
        }

        function drawPoint(p) {
            pctx.fillStyle = p.color;
            pctx.beginPath(); pctx.arc(centerX + p.x, centerY + p.y, 8, 0, Math.PI*2); pctx.fill();
            pctx.fillStyle = "#fff"; pctx.font = "bold 12px Inter";
            pctx.fillText(p.label, centerX + p.x + 10, centerY + p.y - 10);
        }

        function formatComplex(p) {
            const a = (p.x/scale).toFixed(1);
            const b = (-p.y/scale).toFixed(1);
            return `${a}${parseFloat(b) >= 0 ? '+' : ''}${b}i`;
        }

        prodCanvas.addEventListener('mousedown', (e) => {
            const rect = prodCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - centerX;
            const my = e.clientY - rect.top - centerY;
            if (Math.hypot(mx - p1.x, my - p1.y) < 20) dragging = p1;
            else if (Math.hypot(mx - p2.x, my - p2.y) < 20) dragging = p2;
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const rect = prodCanvas.getBoundingClientRect();
            dragging.x = e.clientX - rect.left - centerX;
            dragging.y = e.clientY - rect.top - centerY;
            drawProd();
        });

        window.addEventListener('mouseup', () => dragging = null);
        drawProd();
    }

    /* =========================================================
       4. QUIZ DI RIEPILOGO
       ========================================================= */
    const quizData = [
        {
            question: "1. Chi è considerato l'autore della prima solida dimostrazione del Teorema Fondamentale dell'Algebra?",
            options: [
                "Isaac Newton.",
                "Carl Friedrich Gauss.",
                "Pitagora."
            ],
            correct: 1,
            feedback: "Esatto! Gauss lo dimostrò nella sua tesi di dottorato nel 1799."
        },
        {
            question: "2. Cosa afferma il Teorema Fondamentale dell'Algebra?",
            options: [
                "Che ogni equazione ha sempre una soluzione intera.",
                "Che un polinomio di grado n ha esattamente n radici nel campo complesso.",
                "Che i numeri immaginari non esistono."
            ],
            correct: 1,
            feedback: "Proprio così! n radici per il grado n, contando le molteplicità."
        },
        {
            question: "3. Nel Rinascimento, come risolvevano i matematici le controversie?",
            options: [
                "Tramite duelli con la spada.",
                "Tramite pubbliche sfide matematiche (disfide).",
                "Non c'erano controversie tra matematici."
            ],
            correct: 1,
            feedback: "Corretto! Celebre fu la sfida tra Tartaglia e Fior sulla risoluzione delle equazioni di terzo grado."
        },
        {
            question: "4. Cosa spinse i matematici ad usare la radice quadrata di numeri negativi?",
            options: [
                "Volevano inventare una nuova lingua.",
                "Era l'unico modo per completare i calcoli delle equazioni di terzo grado.",
                "Le radici negative non sono mai state usate prima del 1900."
            ],
            correct: 1,
            feedback: "Giusto! Inizialmente era solo un 'trucco' algebrico che sembrava funzionare."
        },
        {
            question: "5. Qual è la definizione fondamentale dell'unità immaginaria 'i'?",
            options: [
                "i = 0",
                "i² = -1",
                "i = π"
            ],
            correct: 1,
            feedback: "Esatto! Questa è la base su cui è costruito l'intero sistema dei numeri complessi."
        },
        {
            question: "6. Come si chiama il piano usato per rappresentare i numeri complessi?",
            options: [
                "Piano Cartesiano Tradizionale.",
                "Piano di Argand-Gauss.",
                "Piano Euclideo Standard."
            ],
            correct: 1,
            feedback: "Corretto! L'asse orizzontale ospita la parte reale, quello verticale la parte immaginaria."
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let answeredCount = 0;
    let score = 0;

    if (quizArea) {
        quizData.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = "2.5rem";

            const title = document.createElement('h3');
            title.textContent = q.question;
            title.style.fontSize = "1.2rem";
            qDiv.appendChild(title);

            const optDiv = document.createElement('div');
            optDiv.className = 'quiz-options';

            q.options.forEach((optText, optIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;

                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;

                    if (optIdx === q.correct) {
                        btn.classList.add('correct');
                        btn.innerHTML += ` <span style="margin-left: 0.5rem;">✅ ${q.feedback}</span>`;
                        
                        // Blocca altri bottoni
                        optDiv.querySelectorAll('.quiz-btn').forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'default';
                        });

                        const alreadyWrong = optDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) score++;
                        
                        answeredCount++;
                        if (answeredCount === quizData.length) {
                            showScore();
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.style.opacity = "0.7";
                    }
                };
                optDiv.appendChild(btn);
            });

            qDiv.appendChild(optDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showScore() {
        if (score === quizData.length) {
            scoreEl.textContent = `ECCELLENTE! ${score}/${quizData.length}. Hai svelato i segreti del Teorema Fondamentale!`;
            scoreEl.style.color = "var(--physics-color)";
        } else {
            scoreEl.textContent = `COMPLETATO! Punteggio: ${score}/${quizData.length}. Ottimo ripasso su Gauss e i complessi!`;
            scoreEl.style.color = "#F59E0B";
        }
    }
});
