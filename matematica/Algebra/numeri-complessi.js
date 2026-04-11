/**
 * numeri-complessi.js - MFI Algebra
 * Gestisce i simulatori del piano di Gauss (Punto, Somma, Prodotto) e il quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- HELPERS --- */
    function formatComplex(val, im) {
        return `${val.toFixed(1)}${im >= 0 ? '+' : ''}${im.toFixed(1)}i`;
    }

    /* =========================================================
       1. SIMULATORE PIANO COMPLESSO (MOUSE)
       ========================================================= */
    const canvas = document.getElementById('complex-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const vReal = document.getElementById('val-real');
        const vImag = document.getElementById('val-imag');
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const scale = 35;

        function drawGrid(c, ct, center_x, center_y) {
            ct.clearRect(0, 0, c.width, c.height);
            ct.strokeStyle = "rgba(255, 255, 255, 0.1)";
            for(let i = -10; i <= 10; i++) {
                ct.beginPath(); ct.moveTo(center_x + i*scale, 0); ct.lineTo(center_x + i*scale, c.height); ct.stroke();
                ct.beginPath(); ct.moveTo(0, center_y + i*scale); ct.lineTo(c.width, center_y + i*scale); ct.stroke();
            }
            ct.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ct.beginPath(); ct.moveTo(0, center_y); ct.lineTo(c.width, center_y); ct.stroke();
            ct.beginPath(); ct.moveTo(center_x, 0); ct.lineTo(center_x, c.height); ct.stroke();
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const a = (mx - cx) / scale;
            const b = -(my - cy) / scale;

            drawGrid(canvas, ctx, cx, cy);
            
            ctx.fillStyle = "#F59E0B";
            ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = "#F59E0B"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke();
            
            vReal.textContent = a.toFixed(2);
            vImag.textContent = b.toFixed(2) + "i";
        });
        drawGrid(canvas, ctx, cx, cy);
    }

    /* =========================================================
       2. SIMULATORE SOMMA (DRAGGABLE)
       ========================================================= */
    const sumCanvas = document.getElementById('sum-canvas');
    if (sumCanvas) {
        const sctx = sumCanvas.getContext('2d');
        const sLabel = document.getElementById('val-sum');
        const scx = sumCanvas.width / 2;
        const scy = sumCanvas.height / 2;
        const scale = 30;

        let z1 = { x: 2 * scale, y: -2 * scale, color: '#3B82F6', label: 'z₁' };
        let z2 = { x: -1 * scale, y: -3 * scale, color: '#10B981', label: 'z₂' };
        let dragging = null;

        function drawSum() {
            sctx.clearRect(0, 0, sumCanvas.width, sumCanvas.height);
            // Assi
            sctx.strokeStyle = "rgba(255,255,255,0.2)";
            sctx.beginPath(); sctx.moveTo(0, scy); sctx.lineTo(sumCanvas.width, scy); sctx.stroke();
            sctx.beginPath(); sctx.moveTo(scx, 0); sctx.lineTo(scx, sumCanvas.height); sctx.stroke();

            const sx = z1.x + z2.x; const sy = z1.y + z2.y;

            // Parallelogramma
            sctx.setLineDash([5, 5]);
            sctx.strokeStyle = "rgba(255,255,255,0.2)";
            sctx.beginPath(); sctx.moveTo(scx + z1.x, scy + z1.y); sctx.lineTo(scx + sx, scy + sy);
            sctx.lineTo(scx + z2.x, scy + z2.y); sctx.stroke();
            sctx.setLineDash([]);

            // Vettori
            drawVec(sctx, scx, scy, z1.x, z1.y, z1.color);
            drawVec(sctx, scx, scy, z2.x, z2.y, z2.color);
            drawVec(sctx, scx, scy, sx, sy, "#FBBF24", 3);

            // Drag points
            sctx.fillStyle = z1.color; sctx.beginPath(); sctx.arc(scx + z1.x, scy + z1.y, 8, 0, Math.PI*2); sctx.fill();
            sctx.fillStyle = z2.color; sctx.beginPath(); sctx.arc(scx + z2.x, scy + z2.y, 8, 0, Math.PI*2); sctx.fill();

            sLabel.textContent = formatComplex(sx/scale, -sy/scale);
        }

        sumCanvas.addEventListener('mousedown', (e) => {
            const rect = sumCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - scx; const my = e.clientY - rect.top - scy;
            if(Math.hypot(mx-z1.x, my-z1.y) < 15) dragging = z1;
            else if(Math.hypot(mx-z2.x, my-z2.y) < 15) dragging = z2;
        });

        window.addEventListener('mousemove', (e) => {
            if(!dragging) return;
            const rect = sumCanvas.getBoundingClientRect();
            dragging.x = e.clientX - rect.left - scx; dragging.y = e.clientY - rect.top - scy;
            drawSum();
        });
        window.addEventListener('mouseup', () => dragging = null);
        drawSum();
    }

    /* =========================================================
       3. SIMULATORE PRODOTTO (DRAGGABLE)
       ========================================================= */
    const prodCanvas = document.getElementById('prod-canvas');
    if (prodCanvas) {
        const pctx = prodCanvas.getContext('2d');
        const pLabel = document.getElementById('val-prod');
        const pcx = prodCanvas.width / 2;
        const pcy = prodCanvas.height / 2;
        const scale = 40;

        let p1 = { x: 1 * scale, y: -0.5 * scale, color: '#3B82F6' };
        let p2 = { x: 0.5 * scale, y: -0.8 * scale, color: '#A855F7' };
        let dragging = null;

        function drawProd() {
            pctx.clearRect(0, 0, prodCanvas.width, prodCanvas.height);
            pctx.strokeStyle = "rgba(255,255,255,0.2)";
            pctx.beginPath(); pctx.moveTo(0, pcy); pctx.lineTo(prodCanvas.width, pcy); pctx.stroke();
            pctx.beginPath(); pctx.moveTo(pcx, 0); pctx.lineTo(pcx, prodCanvas.height); pctx.stroke();

            const x1 = p1.x/scale; const y1 = -p1.y/scale;
            const x2 = p2.x/scale; const y2 = -p2.y/scale;
            const rx = x1*x2 - y1*y2; const ry = x1*y2 + x2*y1;

            drawVec(pctx, pcx, pcy, p1.x, p1.y, p1.color);
            drawVec(pctx, pcx, pcy, p2.x, p2.y, p2.color);
            drawVec(pctx, pcx, pcy, rx*scale, -ry*scale, "#10B981", 3);

            pctx.fillStyle = p1.color; pctx.beginPath(); pctx.arc(pcx+p1.x, pcy+p1.y, 8, 0, Math.PI*2); pctx.fill();
            pctx.fillStyle = p2.color; pctx.beginPath(); pctx.arc(pcx+p2.x, pcy+p2.y, 8, 0, Math.PI*2); pctx.fill();

            pLabel.textContent = formatComplex(rx, ry);
        }

        prodCanvas.addEventListener('mousedown', (e) => {
            const rect = prodCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left - pcx; const my = e.clientY - rect.top - pcy;
            if(Math.hypot(mx-p1.x, my-p1.y) < 15) dragging = p1;
            else if(Math.hypot(mx-p2.x, my-p2.y) < 15) dragging = p2;
        });
        window.addEventListener('mousemove', (e) => {
            if(!dragging) return;
            const rect = prodCanvas.getBoundingClientRect();
            dragging.x = e.clientX - rect.left - pcx; dragging.y = e.clientY - rect.top - pcy;
            drawProd();
        });
        window.addEventListener('mouseup', () => dragging = null);
        drawProd();
    }

    function drawVec(ct, cx, cy, vx, vy, color, width=2) {
        ct.strokeStyle = color; ct.lineWidth = width;
        ct.beginPath(); ct.moveTo(cx, cy); ct.lineTo(cx + vx, cy + vy); ct.stroke();
    }

    /* =========================================================
       4. QUIZ
       ========================================================= */
    const quizData = [
        {
            question: "1. Qual è la caratteristica fondamentale dell'unità immaginaria i?",
            options: ["i = 0", "i² = -1", "i = π"],
            correct: 1, feedback: "Esatto! Questa è la definizione che rende possibile tutto il calcolo complesso."
        },
        {
            question: "2. Come si rappresenta graficamente un numero complesso z = a + bi?",
            options: ["Come una retta", "Come un punto nel piano di Gauss", "Come un cerchio"],
            correct: 1, feedback: "Corretto! L'asse reale è orizzontale, quello immaginario verticale."
        },
        {
            question: "3. Quanto vale la somma (3 + 2i) + (1 + 4i)?",
            options: ["4 + 6i", "3 + 7i", "5 + i"],
            correct: 0, feedback: "Giusto! Si sommano le parti reali (3+1) e le parti immaginarie (2+4)."
        },
        {
            question: "4. A cosa serve l'unità immaginaria in Elettrotecnica?",
            options: ["A misurare il calore", "A studiare la corrente alternata e lo sfasamento", "A pesare i cavi"],
            correct: 1, feedback: "Esatto! I numeri complessi sono fondamentali per descrivere i circuiti in CA."
        },
        {
            question: "5. Quale di queste applicazioni NON usa i numeri complessi?",
            options: ["Meccanica Quantistica", "Sistemi Radar e 5G", "Cucinare una torta"],
            correct: 2, feedback: "Ovviamente! Anche se la torta richiede precisione, i numeri complessi sono più per segnali e atomi."
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let answered = 0; let score = 0;

    if (quizArea) {
        quizData.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.innerHTML = `<h3>${q.question}</h3>`;
            const optDiv = document.createElement('div');
            optDiv.className = 'quiz-options';

            q.options.forEach((optText, optIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn'; btn.textContent = optText;
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    if (optIdx === q.correct) {
                        btn.classList.add('correct'); btn.innerHTML += ` ✅ ${q.feedback}`;
                        optDiv.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);
                        if (!optDiv.querySelector('.wrong')) score++;
                        answered++;
                        if (answered === quizData.length) scoreEl.textContent = `Punteggio: ${score}/${quizData.length}`;
                    } else {
                        btn.classList.add('wrong'); btn.innerHTML += " ✗ Riprova";
                    }
                };
                optDiv.appendChild(btn);
            });
            qDiv.appendChild(optDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
