/**
 * fattori-primi.js
 * Interactive prime factorization lesson: live decomposition, quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. INTERACTIVE FACTORIZER
       ======================================================== */
    const factorBtn = document.getElementById('factor-run-btn');
    const factorInput = document.getElementById('factor-input');
    const factorOutput = document.getElementById('factor-output');

    function primeFactors(n) {
        const factors = [];
        let d = 2;
        while (d * d <= n) {
            while (n % d === 0) {
                factors.push(d);
                n = Math.floor(n / d);
            }
            d++;
        }
        if (n > 1) factors.push(n);
        return factors;
    }

    if (factorBtn) {
        factorBtn.addEventListener('click', () => {
            const n = parseInt(factorInput.value);
            let lines = [];

            if (isNaN(n) || n < 2 || n > 999999999) {
                lines.push(`<span style="color:#EF4444;">⚠ Inserisci un numero intero tra 2 e 999.999.999</span>`);
                factorOutput.innerHTML = lines.join('<br>');
                return;
            }

            lines.push(`<span style="color:#94A3B8;">▸ Numero da scomporre: <strong style="color:#fff;">${n.toLocaleString('it-IT')}</strong></span>`);
            lines.push(`<span style="color:#94A3B8;">─────────────────────────</span>`);

            let remaining = n;
            let d = 2;
            let step = 1;

            while (d * d <= remaining) {
                while (remaining % d === 0) {
                    const prev = remaining;
                    remaining = Math.floor(remaining / d);
                    lines.push(`<span style="color:#3b82f6;">  Passo ${step}: ${prev.toLocaleString('it-IT')} ÷ <strong style="color:#a855f7;">${d}</strong> = <strong style="color:#fff;">${remaining.toLocaleString('it-IT')}</strong></span>`);
                    step++;
                }
                d++;
            }
            if (remaining > 1) {
                lines.push(`<span style="color:#3b82f6;">  Passo ${step}: ${remaining.toLocaleString('it-IT')} è <strong style="color:#a855f7;">primo</strong> → fattore finale</span>`);
            }

            const factors = primeFactors(n);
            // Build grouped result
            const grouped = {};
            factors.forEach(f => { grouped[f] = (grouped[f] || 0) + 1; });
            const parts = Object.entries(grouped).map(([base, exp]) =>
                exp > 1 ? `${base}<sup>${exp}</sup>` : `${base}`
            );

            lines.push(`<span style="color:#94A3B8;">─────────────────────────</span>`);
            lines.push(`<span style="color:#10B981;">▸ Risultato: <strong style="font-size:1.1rem;">${n.toLocaleString('it-IT')} = ${parts.join(' × ')}</strong></span>`);

            // Show if prime
            if (factors.length === 1) {
                lines.push(`<span style="color:#f59e0b;">⭐ ${n.toLocaleString('it-IT')} è un numero primo!</span>`);
            }

            factorOutput.innerHTML = lines.join('<br>');
            factorOutput.style.animation = 'none';
            factorOutput.offsetHeight;
            factorOutput.style.animation = 'fadeIn 0.4s ease';
        });
    }

    /* ========================================================
       2. RSA DEMO — pre-computed known examples
       ======================================================== */
    const rsaDemoBtn = document.getElementById('rsa-demo-btn');
    const rsaOutput = document.getElementById('rsa-output');

    if (rsaDemoBtn) {
        let step = 0;
        const examples = [
            { digits: 2,  n: '15',              factors: '3 × 5',               time: '0,000001 sec', color: '#10b981' },
            { digits: 3,  n: '437',             factors: '19 × 23',             time: '0,00001 sec',  color: '#10b981' },
            { digits: 5,  n: '10.403',          factors: '101 × 103',           time: '0,0001 sec',   color: '#10b981' },
            { digits: 7,  n: '1.000.003',       factors: 'è primo!',            time: '0,003 sec',    color: '#3b82f6' },
            { digits: 10, n: '2.147.483.647',   factors: 'primo (Mersenne)!',   time: '0,1 sec',      color: '#3b82f6' },
            { digits: 15, n: '999.999.999.989', factors: 'è primo!',            time: '~15 sec',      color: '#f59e0b' },
            { digits: 20, n: '10^20 (prodotto)', factors: '2 primi da 10 cifre', time: '~2 ore',      color: '#f59e0b' },
            { digits: 50, n: '10^50 (prodotto)', factors: '2 primi da 25 cifre', time: '~1.000 anni', color: '#ef4444' },
            { digits: 100, n: 'RSA-100 (100 cifre)', factors: '2 primi da 50 cifre', time: '~milioni di anni', color: '#ef4444' },
            { digits: 617, n: 'RSA-2048 (617 cifre)', factors: '2 primi da 309 cifre', time: '∞ (impossibile)', color: '#ef4444' },
        ];

        rsaDemoBtn.addEventListener('click', () => {
            let lines = [];
            lines.push(`<span style="color:#a855f7; font-weight:700;">L'esplosione dei tempi di scomposizione</span>`);
            lines.push(`<span style="color:#94A3B8;">──────────────────────────────────────────────────</span>`);
            lines.push(`<span style="color:#64748b;">  Cifre │ Numero                    │ Tempo stimato</span>`);
            lines.push(`<span style="color:#94A3B8;">──────────────────────────────────────────────────</span>`);

            examples.forEach(ex => {
                const digitStr = String(ex.digits).padStart(5);
                lines.push(`<span style="color:${ex.color};">  ${digitStr} │ ${ex.n.padEnd(25)} │ <strong>${ex.time}</strong></span>`);
            });

            lines.push(`<span style="color:#94A3B8;">──────────────────────────────────────────────────</span>`);
            lines.push(`<span style="color:#ef4444; font-weight:600;">🔐 Le chiavi RSA-2048 usate da banche e WhatsApp hanno</span>`);
            lines.push(`<span style="color:#ef4444;">   617 cifre: NESSUN computer classico potrà mai scomporle!</span>`);

            rsaOutput.innerHTML = lines.join('<br>');
            rsaOutput.style.animation = 'none';
            rsaOutput.offsetHeight;
            rsaOutput.style.animation = 'fadeIn 0.4s ease';
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
            const w = Math.min(rect.width - 20, 480);
            flowCanvas.width = w * dpr;
            flowCanvas.height = 680 * dpr;
            flowCanvas.style.width = w + 'px';
            flowCanvas.style.height = '680px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawFlowchart();
        }

        function drawFlowchart() {
            const w = flowCanvas.width / dpr;
            ctx.clearRect(0, 0, w, 700);
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

            function diamond(dcx, dcy, dw, dh, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(dcx, dcy - dh / 2);
                ctx.lineTo(dcx + dw / 2, dcy);
                ctx.lineTo(dcx, dcy + dh / 2);
                ctx.lineTo(dcx - dw / 2, dcy);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function oval(ocx, ocy, orw, orh, fill, stroke) {
                ctx.beginPath();
                ctx.ellipse(ocx, ocy, orw, orh, 0, 0, Math.PI * 2);
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

            function text(str, tx, ty, color, size, align) {
                ctx.fillStyle = color || '#F8FAFC';
                ctx.font = `${size || 12}px Inter, sans-serif`;
                ctx.textAlign = align || 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(str, tx, ty);
            }

            // INIZIO
            oval(cx, 28, 45, 16, 'rgba(16,185,129,0.2)', '#10B981');
            text('INIZIO', cx, 28, '#10B981', 12);
            arrow(cx, 44, cx, 62, '#94A3B8');

            // LEGGI N, d←2
            roundRect(cx - 80, 62, 160, 36, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('LEGGI N', cx, 73, '#fff', 12);
            text('d ← 2', cx, 87, '#38bdf8', 11);
            arrow(cx, 98, cx, 125, '#94A3B8');

            // DIAMANTE 1: d×d ≤ N?
            diamond(cx, 158, 170, 66, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('d × d ≤ N ?', cx, 158, '#F59E0B', 12);

            // NO → destra → verso SE N>1
            arrow(cx + 85, 158, cx + 145, 158, '#EF4444');
            text('NO', cx + 108, 148, '#EF4444', 10);
            arrow(cx + 145, 158, cx + 145, 470, '#EF4444');
            // Linea orizzontale verso il diamante N>1
            ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx + 145, 470); ctx.lineTo(cx, 470); ctx.stroke();
            arrow(cx, 470, cx, 480, '#EF4444');

            // SÌ → giù
            arrow(cx, 191, cx, 225, '#10B981');
            text('SÌ', cx + 12, 205, '#10B981', 10);

            // DIAMANTE 2: N mod d = 0?
            diamond(cx, 258, 170, 66, 'rgba(168,85,247,0.15)', '#a855f7');
            text('N mod d = 0 ?', cx, 258, '#a855f7', 12);

            // SÌ → giù: SCRIVI d, N ← N÷d
            arrow(cx, 291, cx, 320, '#10B981');
            text('SÌ', cx + 12, 303, '#10B981', 10);

            roundRect(cx - 80, 320, 160, 50, 8, 'rgba(16,185,129,0.15)', '#10B981');
            text('SCRIVI d', cx, 335, '#10b981', 12);
            text('N ← N ÷ d', cx, 351, '#38bdf8', 11);

            // Loop back up to diamond 2
            arrow(cx, 370, cx, 385, '#94A3B8');
            const loopLeftX = cx - 115;
            ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, 385); ctx.lineTo(loopLeftX, 385); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(loopLeftX, 385); ctx.lineTo(loopLeftX, 258); ctx.stroke();
            arrow(loopLeftX, 258, cx - 85, 258, '#94A3B8');

            // NO → destra: d ← d + 1
            const rightProcX = cx + 130;
            arrow(cx + 85, 258, rightProcX, 258, '#EF4444');
            text('NO', cx + 100, 248, '#EF4444', 10);
            arrow(rightProcX, 258, rightProcX, 400, '#94A3B8');

            roundRect(rightProcX - 55, 400, 110, 36, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('d ← d + 1', rightProcX, 418, '#fff', 12);

            // Loop back up to diamond 1
            arrow(rightProcX, 436, rightProcX, 450, '#94A3B8');
            const loopRightX = rightProcX + 40;
            ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(rightProcX, 450); ctx.lineTo(loopRightX, 450); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(loopRightX, 450); ctx.lineTo(loopRightX, 120); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(loopRightX, 120); ctx.lineTo(cx, 120); ctx.stroke();
            arrow(cx, 120, cx, 125, '#94A3B8');

            // DIAMANTE 3: N > 1?
            diamond(cx, 510, 140, 56, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('N > 1 ?', cx, 510, '#F59E0B', 12);

            // SÌ → sinistra: SCRIVI N
            const leftOutX = cx - 110;
            arrow(cx - 70, 510, leftOutX, 510, '#10B981');
            text('SÌ', leftOutX + 25, 500, '#10B981', 10);
            roundRect(leftOutX - 55, 530, 110, 32, 8, 'rgba(16,185,129,0.15)', '#10B981');
            text('SCRIVI N', leftOutX, 546, '#10b981', 12);
            arrow(leftOutX, 562, leftOutX, 598, '#94A3B8');
            ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(leftOutX, 598); ctx.lineTo(cx, 598); ctx.stroke();

            // NO → giù
            arrow(cx, 538, cx, 598, '#EF4444');
            text('NO', cx + 12, 555, '#EF4444', 10);

            // FINE
            arrow(cx, 598, cx, 618, '#94A3B8');
            oval(cx, 638, 45, 16, 'rgba(16,185,129,0.2)', '#10B981');
            text('FINE', cx, 638, '#10B981', 12);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    /* ========================================================
       3. QUIZ (10 Domande)
       ======================================================== */
    const quizData = [
        {
            q: "1. Cosa significa 'scomporre un numero in fattori primi'?",
            a: ["Dividere un numero a metà.", "Esprimere un numero come prodotto di soli numeri primi.", "Trovare tutti i divisori di un numero.", "Calcolare la radice quadrata di un numero."],
            c: 1
        },
        {
            q: "2. Quale tra questi è un numero primo?",
            a: ["15", "21", "17", "9"],
            c: 2
        },
        {
            q: "3. La scomposizione in fattori primi di 60 è:",
            a: ["2 × 30", "2² × 3 × 5", "4 × 15", "6 × 10"],
            c: 1
        },
        {
            q: "4. Perché la scomposizione in fattori primi è fondamentale per la crittografia RSA?",
            a: ["Perché i numeri primi sono facili da moltiplicare ma estremamente difficili da ri-scomporre quando il numero è molto grande.", "Perché i numeri primi sono segreti.", "Perché i computer non sanno fare le divisioni.", "Perché la crittografia usa solo numeri pari."],
            c: 0
        },
        {
            q: "5. Nell'algoritmo di scomposizione, perché ci si ferma quando il divisore d supera la radice quadrata di N?",
            a: ["Perché oltre la radice quadrata non esistono più numeri.", "Perché se N non è stato diviso da nessun fattore fino a √N, allora N stesso è primo.", "Perché la radice quadrata è sempre un numero primo.", "Per risparmiare inchiostro nella stampa."],
            c: 1
        },
        {
            q: "6. Quale app usi ogni giorno che si basa sulla crittografia a chiave pubblica (RSA)?",
            a: ["La calcolatrice.", "WhatsApp con la crittografia end-to-end.", "Il blocco note.", "L'app meteo."],
            c: 1
        },
        {
            q: "7. Se il computer quantistico di domani riuscisse a scomporre velocemente numeri enormi, quale sarebbe la conseguenza?",
            a: ["I computer consumerebbero meno batteria.", "La crittografia RSA attuale diventerebbe insicura e andrebbe sostituita.", "I numeri primi smetterebbero di esistere.", "Internet funzionerebbe più veloce."],
            c: 1
        },
        {
            q: "8. Nel pseudocodice, l'istruzione 'N ← N ÷ d' serve a:",
            a: ["Calcolare il quadrato del numero.", "Dividere N per il divisore trovato e continuare la scomposizione col quoziente.", "Moltiplicare N per d.", "Verificare se d è un numero primo."],
            c: 1
        },
        {
            q: "9. Qual è la scomposizione di 84?",
            a: ["2 × 42", "2² × 3 × 7", "4 × 21", "7 × 12"],
            c: 1
        },
        {
            q: "10. Perché nel nostro algoritmo partiamo a dividere da d = 2?",
            a: ["Perché 2 è il più piccolo numero primo e qualsiasi numero pari lo contiene come fattore.", "Perché 1 non è un numero primo valido come fattore.", "Entrambe le risposte precedenti sono corrette.", "Perché 2 è il numero preferito dei programmatori."],
            c: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data) => {
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
                    if (btn.classList.contains('picked')) return;
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        if (!card.classList.contains('attempted')) score++;
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= (quizData.length - 1) ? "#10B981" : "#F59E0B";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato, riprova</strong>";
                        btn.classList.add('picked');
                        btn.style.pointerEvents = "none";
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
