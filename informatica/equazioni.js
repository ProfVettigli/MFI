/**
 * equazioni.js
 * Interactive lesson on Quadratic Equations: Solver, Flowchart, Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. QUADRATIC SOLVER LOGIC
       ======================================================== */
    const inpA = document.getElementById('inp-a');
    const inpB = document.getElementById('inp-b');
    const inpC = document.getElementById('inp-c');
    const btnSolve = document.getElementById('btn-solve');
    const solveOutput = document.getElementById('solve-output');

    if (btnSolve) {
        btnSolve.addEventListener('click', () => {
            const a = parseFloat(inpA.value);
            const b = parseFloat(inpB.value);
            const c = parseFloat(inpC.value);

            if (isNaN(a) || isNaN(b) || isNaN(c)) {
                solveOutput.innerHTML = `<span style="color: #ef4444;">⚠ Errore: inserisci coefficienti validi!</span>`;
                return;
            }

            if (a === 0) {
                if (b === 0) {
                    solveOutput.innerHTML = c === 0 ? "Identità (0=0)" : "Impossibile (c=0)";
                } else {
                    const x = -c / b;
                    solveOutput.innerHTML = `L'equazione è di 1° grado: <strong>x = ${x.toFixed(2)}</strong>`;
                }
                return;
            }

            const delta = b * b - 4 * a * c;
            let resHTML = `<div><strong>Δ = ${delta.toFixed(2)}</strong></div>`;

            if (delta > 0) {
                const x1 = (-b + Math.sqrt(delta)) / (2 * a);
                const x2 = (-b - Math.sqrt(delta)) / (2 * a);
                resHTML += `<div style="color: #10b981;">Δ > 0: Due soluzioni reali e distinte:</div>`;
                resHTML += `<div style="font-size: 1.2rem; color: #fff;">x₁ = <strong>${x1.toFixed(3)}</strong>, x₂ = <strong>${x2.toFixed(3)}</strong></div>`;
            } else if (delta === 0) {
                const x = -b / (2 * a);
                resHTML += `<div style="color: #f59e0b;">Δ = 0: Due soluzioni reali e coincidenti:</div>`;
                resHTML += `<div style="font-size: 1.2rem; color: #fff;">x₁ = x₂ = <strong>${x.toFixed(3)}</strong></div>`;
            } else {
                resHTML += `<div style="color: #ef4444;">Δ < 0: Nessuna soluzione reale.</div>`;
            }

            solveOutput.innerHTML = resHTML;
        });
    }

    /* ========================================================
       2. FLOWCHART CANVAS (PREMIUM MFI STYLE)
       ======================================================== */
    const canvas = document.getElementById('quad-flowchart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 450 * dpr;
        canvas.height = 750 * dpr;
        canvas.style.width = '450px';
        canvas.style.height = '750px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        function drawQuadFlow() {
            const cx = 225;
            ctx.clearRect(0, 0, 450, 750);

            function roundRect(x, y, rw, rh, r, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(x + r, y); ctx.lineTo(x + rw - r, y);
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
                ctx.moveTo(dcx, dcy - dh / 2); ctx.lineTo(dcx + dw / 2, dcy);
                ctx.lineTo(dcx, dcy + dh / 2); ctx.lineTo(dcx - dw / 2, dcy);
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

            function arrow(x1, y1, x2, y2, label = "", color = "#94A3B8") {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath(); ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
                ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
                ctx.closePath(); ctx.fillStyle = color; ctx.fill();
                if (label) {
                    ctx.fillStyle = "#fff"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
                    ctx.fillText(label, (x1 + x2) / 2 + (x1 === x2 ? 18 : 0), (y1 + y2) / 2 - (x1 !== x2 ? 10 : 0));
                }
            }

            function text(str, tx, ty, color = "#F8FAFC", size = 12, align = "center") {
                ctx.fillStyle = color; ctx.font = `${size}px Inter, sans-serif`;
                ctx.textAlign = align; ctx.textBaseline = 'middle';
                ctx.fillText(str, tx, ty);
            }

            // INIZIO
            oval(cx, 30, 45, 16, 'rgba(16,185,129,0.2)', '#10B981');
            text('INIZIO', cx, 30, '#10B981', 12);
            arrow(cx, 46, cx, 80);

            // LEGGI a, b, c
            roundRect(cx - 80, 80, 160, 45, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('LEGGI a, b, c', cx, 102, '#fff', 13);
            arrow(cx, 125, cx, 160);

            // DIAMANTE 1: a == 0?
            diamond(cx, 210, 160, 100, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('a == 0?', cx, 210, '#F59E0B', 13);

            // SI (destra) -> Grado 1
            arrow(cx + 80, 210, 380, 210, "SÌ", "#10B981");
            arrow(380, 210, 380, 400);
            roundRect(380 - 65, 400, 130, 45, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('Eq. 1° Grado', 380, 422, '#fff', 12);

            // NO (giù) -> Delta
            arrow(cx, 260, cx, 300, "NO", "#EF4444");
            roundRect(cx - 85, 300, 170, 45, 8, 'rgba(168,85,247,0.15)', '#a855f7');
            text('Δ = b² - 4ac', cx, 322, '#fff', 13);
            arrow(cx, 345, cx, 380);

            // DIAMANTE 2: Δ > 0?
            diamond(cx, 430, 160, 100, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('Δ > 0?', cx, 430, '#F59E0B', 13);

            // SI (SINISTRA come richiesto)
            arrow(cx - 80, 430, 100, 430, "SÌ", "#10B981");
            arrow(100, 430, 100, 480);
            roundRect(100 - 65, 480, 130, 45, 8, 'rgba(16,185,129,0.15)', '#10B981');
            text('2 Sol. Reali', 100, 502, '#fff', 12);

            // NO (giù) -> Delta == 0?
            arrow(cx, 480, cx, 520, "NO", "#EF4444");
            diamond(cx, 570, 160, 100, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('Δ == 0?', cx, 570, '#F59E0B', 13);

            // SI (sinistra) -> 1 Sol. Reale
            arrow(cx - 80, 570, 100, 570, "SÌ", "#10B981");
            arrow(100, 570, 100, 600);
            roundRect(100 - 65, 600, 130, 45, 8, 'rgba(16,185,129,0.15)', '#10B981');
            text('Sol. Coincidente', 100, 622, '#fff', 12);

            // NO (giù) -> Nessuna sol. reale
            arrow(cx, 620, cx, 660, "NO", "#EF4444");
            roundRect(cx - 90, 660, 180, 40, 8, 'rgba(239,68,68,0.15)', '#EF4444');
            text('Nessuna sol. reale', cx, 680, '#EF4444', 12);

            // CONVERGENZA FINALE
            ctx.beginPath(); ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 2;
            // Case 1st degree
            ctx.moveTo(380, 445); ctx.lineTo(380, 710); ctx.lineTo(cx, 710); ctx.stroke();
            // Case Delta > 0
            ctx.moveTo(100, 525); ctx.lineTo(100, 710); ctx.lineTo(cx, 710); ctx.stroke();
            // Case Delta == 0
            ctx.moveTo(100, 645); ctx.lineTo(100, 710); ctx.stroke();
            // Case Delta < 0
            ctx.moveTo(cx, 700); ctx.lineTo(cx, 710); ctx.stroke();
            
            arrow(cx, 710, cx, 730);
            oval(cx, 735, 45, 15, 'rgba(16,185,129,0.2)', '#10B981');
            text('FINE', cx, 735, '#10B981', 12);
        }
        drawQuadFlow();
    }

    /* ========================================================
       3. QUIZ LOGIC
       ======================================================== */
    const quizData = [
        {
            q: "1. In quale blocco del flowchart calcoliamo il discriminante Δ?",
            a: ["Ellisse (Inizio/Fine).", "Rettangolo arrotondato (Processo).", "Rombo (Decisione).", "Parallelogramma (Input)."],
            c: 1
        },
        {
            q: "2. Cosa accade se Δ < 0 in un algoritmo di risoluzione reale?",
            a: ["L'algoritmo va in crash.", "L'algoritmo comunica che non ci sono soluzioni reali.", "Il computer si spegne.", "Vengono fornite 2 soluzioni coincidenti."],
            c: 1
        },
        {
            q: "3. Perché è necessario il controllo iniziale a == 0?",
            a: ["Per risparmiare memoria.", "Perché con a=0 la formula risolverebbe un'equazione di 1° grado o causerebbe divisione per zero.", "Perché lo richiede Python.", "Nessuna delle precedenti."],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizArea.innerHTML = "";
        quizData.forEach((data) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2rem"; card.style.padding = "1.5rem"; card.style.background = "rgba(255,255,255,0.03)"; card.style.border = "1px solid rgba(255,255,255,0.1)"; card.style.borderRadius = "12px";
            card.innerHTML = `<h3 style="margin-bottom:1.2rem; font-size:1.1rem; color:#fff;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex"; optionsGroup.style.flexDirection = "column"; optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn'; btn.textContent = option; btn.style.textAlign = "left"; btn.style.padding = "1rem"; btn.style.background = "rgba(255,255,255,0.05)"; btn.style.border = "1px solid rgba(255,255,255,0.1)"; btn.style.color = "white"; btn.style.borderRadius = "8px"; btn.style.cursor = "pointer"; btn.style.transition = "0.3s";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981"; btn.style.borderColor = "#10B981";
                        if (!card.classList.contains('attempted')) score++;
                        answered++;
                        const btns = optionsGroup.querySelectorAll('button');
                        btns.forEach(b => b.style.pointerEvents = 'none');
                        if (answered === quizData.length) {
                            quizScore.textContent = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = "#10B981";
                        }
                    } else {
                        btn.style.background = "#EF4444"; btn.style.borderColor = "#EF4444";
                        btn.classList.add('picked'); card.classList.add('attempted');
                    }
                };
                optionsGroup.appendChild(btn);
            });
            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
