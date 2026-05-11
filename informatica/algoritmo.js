/**
 * algoritmo.js
 * Interactive lesson on Algorithms: pseudocode runner, flowchart drawer, hello world demo, quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. INTERACTIVE PSEUDOCODE RUNNER — Conditional
       ======================================================== */
    const condRunBtn = document.getElementById('cond-run-btn');
    const condInput = document.getElementById('cond-input');
    const condOutput = document.getElementById('cond-output');

    if (condRunBtn) {
        condRunBtn.addEventListener('click', () => {
            const eta = parseInt(condInput.value);
            let lines = [];
            lines.push(`<span style="color:#94A3B8;">▸ LEGGI età → <strong style="color:#fff;">${isNaN(eta) ? '?' : eta}</strong></span>`);
            if (isNaN(eta)) {
                lines.push(`<span style="color:#EF4444;">⚠ Errore: inserisci un numero valido!</span>`);
            } else if (eta >= 18) {
                lines.push(`<span style="color:#10B981;">▸ Condizione: ${eta} ≥ 18 → <strong>VERO</strong></span>`);
                lines.push(`<span style="color:#10B981;">▸ SCRIVI "Sei maggiorenne" ✓</span>`);
            } else {
                lines.push(`<span style="color:#F59E0B;">▸ Condizione: ${eta} ≥ 18 → <strong>FALSO</strong></span>`);
                lines.push(`<span style="color:#F59E0B;">▸ SCRIVI "Sei minorenne" ✓</span>`);
            }
            lines.push(`<span style="color:#94A3B8;">▸ FINE programma.</span>`);
            condOutput.innerHTML = lines.join('<br>');
            condOutput.style.animation = 'none';
            condOutput.offsetHeight;
            condOutput.style.animation = 'fadeIn 0.4s ease';
        });
    }

    /* ========================================================
       2. INTERACTIVE PSEUDOCODE RUNNER — Iterative
       ======================================================== */
    const iterRunBtn = document.getElementById('iter-run-btn');
    const iterInput = document.getElementById('iter-input');
    const iterOutput = document.getElementById('iter-output');

    if (iterRunBtn) {
        iterRunBtn.addEventListener('click', () => {
            const n = parseInt(iterInput.value);
            let lines = [];
            if (isNaN(n) || n < 1 || n > 20) {
                lines.push(`<span style="color:#EF4444;">⚠ Inserisci un numero tra 1 e 20.</span>`);
            } else {
                lines.push(`<span style="color:#94A3B8;">▸ LEGGI N → <strong style="color:#fff;">${n}</strong></span>`);
                lines.push(`<span style="color:#94A3B8;">▸ Imposta somma ← 0</span>`);
                let somma = 0;
                for (let i = 1; i <= n; i++) {
                    somma += i;
                    lines.push(`<span style="color:#3b82f6;">  ↻ Iterazione ${i}: somma = ${somma - i} + ${i} = <strong>${somma}</strong></span>`);
                }
                lines.push(`<span style="color:#10B981;">▸ SCRIVI "La somma è: <strong>${somma}</strong>" ✓</span>`);
                lines.push(`<span style="color:#94A3B8;">▸ FINE ciclo.</span>`);
            }
            iterOutput.innerHTML = lines.join('<br>');
            iterOutput.style.animation = 'none';
            iterOutput.offsetHeight;
            iterOutput.style.animation = 'fadeIn 0.4s ease';
        });
    }

    /* ========================================================
       3. FLOWCHART CANVAS DRAWING
       ======================================================== */
    const flowCanvas = document.getElementById('flowchart-canvas');
    if (flowCanvas) {
        const ctx = flowCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            const rect = flowCanvas.parentElement.getBoundingClientRect();
            flowCanvas.width = Math.min(rect.width - 20, 520) * dpr;
            flowCanvas.height = 540 * dpr;
            flowCanvas.style.width = Math.min(rect.width - 20, 520) + 'px';
            flowCanvas.style.height = '540px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawFlowchart();
        }

        function drawFlowchart() {
            const w = flowCanvas.width / dpr;
            const h = flowCanvas.height / dpr;
            ctx.clearRect(0, 0, w, h);
            const cx = w / 2;

            function roundRect(x, y, rw, rh, r, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + rw - r, y);
                ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
                ctx.lineTo(x + rw, y + rh - r);
                ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
                ctx.lineTo(x + r, y + rh);
                ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function diamond(cx, cy, dw, dh, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(cx, cy - dh / 2);
                ctx.lineTo(cx + dw / 2, cy);
                ctx.lineTo(cx, cy + dh / 2);
                ctx.lineTo(cx - dw / 2, cy);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function oval(cx, cy, rw, rh, fill, stroke) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function arrow(x1, y1, x2, y2, color) {
                ctx.strokeStyle = color || '#94A3B8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4));
                ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4));
                ctx.closePath();
                ctx.fillStyle = color || '#94A3B8';
                ctx.fill();
            }

            function text(str, x, y, color, size) {
                ctx.fillStyle = color || '#F8FAFC';
                ctx.font = `${size || 13}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(str, x, y);
            }

            oval(cx, 30, 50, 18, 'rgba(16,185,129,0.2)', '#10B981');
            text('INIZIO', cx, 30, '#10B981', 13);
            arrow(cx, 48, cx, 75, '#94A3B8');
            roundRect(cx - 75, 75, 150, 40, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('LEGGI età', cx, 95, '#fff', 14);
            arrow(cx, 115, cx, 155, '#94A3B8');
            diamond(cx, 195, 180, 80, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('età ≥ 18 ?', cx, 195, '#F59E0B', 14);
            const leftX = cx - 120;
            arrow(cx - 90, 195, leftX, 195, '#10B981');
            text('SÌ', leftX + 30, 185, '#10B981', 12);
            arrow(leftX, 195, leftX, 280, '#10B981');
            roundRect(leftX - 70, 280, 140, 40, 8, 'rgba(16,185,129,0.15)', '#10B981');
            text('"Maggiorenne"', leftX, 300, '#10B981', 13);
            const rightX = cx + 120;
            arrow(cx + 90, 195, rightX, 195, '#EF4444');
            text('NO', rightX - 30, 185, '#EF4444', 12);
            arrow(rightX, 195, rightX, 280, '#EF4444');
            roundRect(rightX - 70, 280, 140, 40, 8, 'rgba(239,68,68,0.15)', '#EF4444');
            text('"Minorenne"', rightX, 300, '#EF4444', 13);
            arrow(leftX, 320, leftX, 370, '#94A3B8');
            arrow(rightX, 320, rightX, 370, '#94A3B8');
            ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftX, 370); ctx.lineTo(rightX, 370); ctx.stroke();
            arrow(cx, 370, cx, 400, '#94A3B8');
            oval(cx, 425, 50, 18, 'rgba(16,185,129,0.2)', '#10B981');
            text('FINE', cx, 425, '#10B981', 13);

            ctx.textAlign = 'left';
            text('Legenda:', 15, 470, '#94A3B8', 12);
            oval(35, 490, 15, 10, 'rgba(16,185,129,0.2)', '#10B981');
            text('= Inizio/Fine', 60, 490, '#94A3B8', 11);
            roundRect(15, 505, 40, 18, 4, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('= Processo/I-O', 60, 514, '#94A3B8', 11);
            diamond(35, 535, 30, 18, 'rgba(245,158,11,0.15)', '#F59E0B');
            ctx.textAlign = 'left';
            text('= Decisione', 60, 535, '#94A3B8', 11);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    /* ========================================================
       4. HELLO WORLD TABS
       ======================================================== */
    const hwTabs = document.querySelectorAll('.hw-tab');
    const hwPanels = document.querySelectorAll('.hw-panel');

    hwTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            hwTabs.forEach(t => t.classList.remove('active'));
            hwPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('hw-' + tab.dataset.lang).classList.add('active');
        });
    });

    /* ========================================================
       5. OPTIMIZATION LAB (SUM OF FIRST N)
       ======================================================== */
    const labRunBtn = document.getElementById('lab-run-btn');
    const labInput = document.getElementById('lab-n-input');
    const outIter = document.getElementById('lab-output-iter');
    const outMath = document.getElementById('lab-output-math');
    const labInsight = document.getElementById('lab-insight');

    if (labRunBtn) {
        labRunBtn.addEventListener('click', () => {
            const n = parseInt(labInput.value);

            if (isNaN(n) || n < 1) {
                outIter.textContent = "⚠ Inserisci N > 0";
                return;
            }

            const startIter = performance.now();
            let sumIter = 0;
            for (let i = 1; i <= n; i++) {
                sumIter += i;
            }
            const endIter = performance.now();
            const timeIter = (endIter - startIter).toFixed(4);

            outIter.innerHTML = `
                <div style="color:#3b82f6; font-weight:bold; margin-bottom:5px;">ITERATIVO O(n)</div>
                Risultato: <strong>${sumIter.toLocaleString()}</strong><br>
                Tempo: <span style="color:#fff;">${timeIter} ms</span>
            `;

            const startMath = performance.now();
            const sumMath = (n * (n + 1)) / 2;
            const endMath = performance.now();
            const timeMath = (endMath - startMath).toFixed(4);

            outMath.innerHTML = `
                <div style="color:#10b981; font-weight:bold; margin-bottom:5px;">MATEMATICO O(1)</div>
                Risultato: <strong>${sumMath.toLocaleString()}</strong><br>
                Tempo: <span style="color:#fff;">${timeMath} ms</span>
            `;

            if (n > 100000) {
                labInsight.textContent = "Vedi? Con N molto grande, l'approccio matematico è istantaneo, mentre il ciclo richiede tempo fisico.";
            } else {
                labInsight.textContent = "Aumenta N a 1.000.000 per notare la differenza!";
            }
        });
    }

    /* ========================================================
       6. QUIZ COMPLETO
       ======================================================== */
    const quizData = [
        {
            q: "1. Qual è la definizione più corretta di 'algoritmo'?",
            a: ["Un programma Python.", "Una sequenza finita, ordinata e non ambigua di istruzioni.", "Un processore veloce.", "Un sistema operativo."],
            c: 1
        },
        {
            q: "2. Quale proprietà lo distingue da una ricetta?",
            a: ["L'algoritmo è solo per computer.", "L'assenza di ambiguità: le istruzioni sono univoche.", "La lunghezza del testo.", "Non ci sono differenze."],
            c: 1
        },
        {
            q: "3. Cosa garantisce la proprietà di 'finitezza'?",
            a: ["Poche righe di codice.", "Che termini in un numero finito di passi.", "Che usi poca memoria.", "Che sia scritto in inglese."],
            c: 1
        },
        {
            q: "4. In un IF/ELSE, cosa accade se la condizione è FALSA?",
            a: ["Errore fatale.", "Esecuzione del blocco ELSE o salto oltre.", "Riavvio del computer.", "Ciclo infinito."],
            c: 1
        },
        {
            q: "5. Quale tra queste è una struttura iterativa?",
            a: ["IF…THEN", "LEGGI variabile", "WHILE…DO", "INIZIO…FINE"],
            c: 2
        },
        {
            q: "6. Lo pseudocodice è:",
            a: ["Un codice criptato.", "Un modo informale e comprensibile di descrivere la logica.", "Un linguaggio per esperti.", "Un virus informatico."],
            c: 1
        },
        {
            q: "11. Perché la formula di Gauss S=n(n+1)/2 è migliore di un ciclo?",
            a: ["Più precisi.", "Riduce la complessità da O(n) a O(1).", "Permette i numeri romani.", "È più facile da scrivere."],
            c: 1
        },
        {
            q: "12. Cosa significa O(1)?",
            a: ["Esecuzione in 1 secondo.", "Tempo costante, indipendente dalla mole di dati (n).", "Una sola riga di codice.", "Immutabilità del codice."],
            c: 1
        },
        {
            q: "13. Se volessi sommare solo i numeri PARI fino a N usando un ciclo, quale istruzione dovrei inserire nel corpo?",
            a: ["SE n % 2 == 0 ALLORA somma = somma + i", "SE i % 2 == 0 ALLORA somma = somma + i", "SE i / 2 == 0 ALLORA somma = somma + i", "RIPETI 2 VOLTE"],
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
            card.style.marginBottom = "2rem";
            card.style.padding = "1.5rem";
            card.style.background = "rgba(255,255,255,0.03)";
            card.style.border = "1px solid rgba(255,255,255,0.1)";
            card.style.borderRadius = "12px";

            card.innerHTML = `<h3 style="margin-bottom:1.2rem; font-size:1.1rem; color:#fff;">${data.q}</h3>`;
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
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        if (!card.classList.contains('attempted')) score++;
                        answered++;
                        const btns = optionsGroup.querySelectorAll('button');
                        btns.forEach(b => b.style.pointerEvents = 'none');
                        if (answered === quizData.length) {
                            quizScore.textContent = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = "#10B981";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.classList.add('picked');
                        card.classList.add('attempted');
                    }
                };
                optionsGroup.appendChild(btn);
            });
            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
