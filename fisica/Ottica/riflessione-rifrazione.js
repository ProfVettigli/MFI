document.addEventListener('DOMContentLoaded', () => {

    const snellCanvas = document.getElementById('snellCanvas');
    const snellCtx = snellCanvas.getContext('2d');
    const angleSlider = document.getElementById('angleSlider');
    const angleVal = document.getElementById('angleVal');
    const med1 = document.getElementById('medium1');
    const med2 = document.getElementById('medium2');
    const lhsVal = document.getElementById('lhsVal');
    const rhsVal = document.getElementById('rhsVal');
    const refractedAngleEl = document.getElementById('refractedAngle');
    const totalRefMsg = document.getElementById('totalRefMsg');

    function drawSnell() {
        const W = snellCanvas.width, H = snellCanvas.height;
        const cx = W / 2, cy = H / 2;
        snellCtx.clearRect(0, 0, W, H);

        const n1 = parseFloat(med1.value);
        const n2 = parseFloat(med2.value);
        const theta1 = parseFloat(angleSlider.value) * Math.PI / 180;

        snellCtx.fillStyle = `rgba(59,130,246,${0.04 + 0.04 * (n1 - 1)})`;
        snellCtx.fillRect(0, 0, W, cy);
        snellCtx.fillStyle = `rgba(16,185,129,${0.04 + 0.04 * (n2 - 1)})`;
        snellCtx.fillRect(0, cy, W, cy);

        snellCtx.strokeStyle = 'rgba(255,255,255,0.6)';
        snellCtx.lineWidth = 2;
        snellCtx.beginPath();
        snellCtx.moveTo(0, cy);
        snellCtx.lineTo(W, cy);
        snellCtx.stroke();

        snellCtx.setLineDash([6, 6]);
        snellCtx.strokeStyle = 'rgba(255,255,255,0.3)';
        snellCtx.beginPath();
        snellCtx.moveTo(cx, 20);
        snellCtx.lineTo(cx, H - 20);
        snellCtx.stroke();
        snellCtx.setLineDash([]);

        snellCtx.fillStyle = 'rgba(255,255,255,0.7)';
        snellCtx.font = '13px Inter, sans-serif';
        snellCtx.fillText(`Mezzo 1 (n=${n1.toFixed(3)})`, 12, 24);
        snellCtx.fillText(`Mezzo 2 (n=${n2.toFixed(3)})`, 12, cy + 24);

        const rayLen = 170;
        const ix = cx - Math.sin(theta1) * rayLen;
        const iy = cy - Math.cos(theta1) * rayLen;

        snellCtx.strokeStyle = '#fcd34d';
        snellCtx.lineWidth = 3;
        snellCtx.beginPath();
        snellCtx.moveTo(ix, iy);
        snellCtx.lineTo(cx, cy);
        snellCtx.stroke();

        drawArrow(snellCtx, ix + (cx - ix) * 0.55, iy + (cy - iy) * 0.55, Math.atan2(cy - iy, cx - ix), '#fcd34d');

        const reflX = cx + Math.sin(theta1) * rayLen;
        const reflY = cy - Math.cos(theta1) * rayLen;
        snellCtx.strokeStyle = 'rgba(252,211,77,0.55)';
        snellCtx.lineWidth = 2;
        snellCtx.setLineDash([4, 4]);
        snellCtx.beginPath();
        snellCtx.moveTo(cx, cy);
        snellCtx.lineTo(reflX, reflY);
        snellCtx.stroke();
        snellCtx.setLineDash([]);

        const sinTheta2 = (n1 / n2) * Math.sin(theta1);
        let totalReflection = false;
        let theta2 = 0;

        if (Math.abs(sinTheta2) > 1) {
            totalReflection = true;
            snellCtx.strokeStyle = '#ef4444';
            snellCtx.lineWidth = 3;
            const rx = cx + Math.sin(theta1) * rayLen;
            const ry = cy - Math.cos(theta1) * rayLen;
            snellCtx.beginPath();
            snellCtx.moveTo(cx, cy);
            snellCtx.lineTo(rx, ry);
            snellCtx.stroke();
            drawArrow(snellCtx, cx + (rx - cx) * 0.6, cy + (ry - cy) * 0.6, Math.atan2(ry - cy, rx - cx), '#ef4444');
        } else {
            theta2 = Math.asin(sinTheta2);
            const tx = cx + Math.sin(theta2) * rayLen;
            const ty = cy + Math.cos(theta2) * rayLen;
            snellCtx.strokeStyle = '#10B981';
            snellCtx.lineWidth = 3;
            snellCtx.beginPath();
            snellCtx.moveTo(cx, cy);
            snellCtx.lineTo(tx, ty);
            snellCtx.stroke();
            drawArrow(snellCtx, cx + (tx - cx) * 0.6, cy + (ty - cy) * 0.6, Math.atan2(ty - cy, tx - cx), '#10B981');
        }

        snellCtx.strokeStyle = 'rgba(252,211,77,0.5)';
        snellCtx.lineWidth = 1.5;
        snellCtx.beginPath();
        snellCtx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + theta1, false);
        snellCtx.stroke();
        snellCtx.fillStyle = '#fcd34d';
        snellCtx.font = '12px Inter';
        snellCtx.fillText(`θ₁=${(theta1 * 180 / Math.PI).toFixed(0)}°`, cx - Math.sin(theta1 / 2) * 55 - 25, cy - Math.cos(theta1 / 2) * 55);

        if (!totalReflection) {
            snellCtx.strokeStyle = 'rgba(16,185,129,0.6)';
            snellCtx.beginPath();
            snellCtx.arc(cx, cy, 38, Math.PI / 2 - theta2, Math.PI / 2, false);
            snellCtx.stroke();
            snellCtx.fillStyle = '#10B981';
            snellCtx.fillText(`θ₂=${(theta2 * 180 / Math.PI).toFixed(0)}°`, cx + 15, cy + 60);
        }

        const lhs = n1 * Math.sin(theta1);
        lhsVal.textContent = lhs.toFixed(3);
        if (totalReflection) {
            rhsVal.textContent = '— impossibile —';
            refractedAngleEl.textContent = 'nessuno (riflessione totale)';
            totalRefMsg.style.display = 'block';
        } else {
            rhsVal.textContent = (n2 * sinTheta2).toFixed(3);
            refractedAngleEl.textContent = `${(theta2 * 180 / Math.PI).toFixed(1)}°`;
            totalRefMsg.style.display = 'none';
        }
        angleVal.textContent = `${angleSlider.value}°`;
    }

    function drawArrow(ctx, x, y, ang, color) {
        const size = 8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(ang) * size - Math.sin(ang) * size * 0.5,
                   y - Math.sin(ang) * size + Math.cos(ang) * size * 0.5);
        ctx.lineTo(x - Math.cos(ang) * size + Math.sin(ang) * size * 0.5,
                   y - Math.sin(ang) * size - Math.cos(ang) * size * 0.5);
        ctx.closePath();
        ctx.fill();
    }

    [angleSlider, med1, med2].forEach(el => el.addEventListener('input', drawSnell));
    drawSnell();

    const prismCanvas = document.getElementById('prismCanvas');
    const pctx = prismCanvas.getContext('2d');
    const prismAngle = document.getElementById('prismAngle');
    const prismAngleVal = document.getElementById('prismAngleVal');

    const colors = [
        { name: 'rosso',   n: 1.512, color: '#ff3b3b' },
        { name: 'arancio', n: 1.514, color: '#ff8c2a' },
        { name: 'giallo',  n: 1.517, color: '#ffd23b' },
        { name: 'verde',   n: 1.519, color: '#3bff7e' },
        { name: 'azzurro', n: 1.522, color: '#3bb6ff' },
        { name: 'indaco',  n: 1.526, color: '#5d3bff' },
        { name: 'violetto',n: 1.530, color: '#a23bff' }
    ];

    function drawPrism() {
        const W = prismCanvas.width, H = prismCanvas.height;
        pctx.clearRect(0, 0, W, H);

        const px = W / 2, py = H / 2;
        const side = 130;
        const A = { x: px, y: py - side * 0.6 };
        const B = { x: px - side * 0.55, y: py + side * 0.45 };
        const C = { x: px + side * 0.55, y: py + side * 0.45 };

        pctx.fillStyle = 'rgba(255,255,255,0.04)';
        pctx.strokeStyle = 'rgba(255,255,255,0.4)';
        pctx.lineWidth = 2;
        pctx.beginPath();
        pctx.moveTo(A.x, A.y);
        pctx.lineTo(B.x, B.y);
        pctx.lineTo(C.x, C.y);
        pctx.closePath();
        pctx.fill();
        pctx.stroke();

        const inAng = parseFloat(prismAngle.value) * Math.PI / 180;
        prismAngleVal.textContent = `${prismAngle.value}°`;

        const entryX = (A.x + B.x) / 2 - 10;
        const entryY = (A.y + B.y) / 2 + 15;

        const startX = 30;
        const startY = entryY - (entryX - startX) * Math.tan(inAng * 0.4);

        pctx.strokeStyle = '#ffffff';
        pctx.lineWidth = 2;
        pctx.beginPath();
        pctx.moveTo(startX, startY);
        pctx.lineTo(entryX, entryY);
        pctx.stroke();

        const exitBaseX = entryX + 150;
        for (let i = 0; i < colors.length; i++) {
            const c = colors[i];
            const spread = (i - 3) * 0.018 + 0.05;
            const exitAng = inAng + spread * (c.n - 1.5) * 20 + i * 0.012;

            const innerEndX = (A.x + C.x) / 2 - 5;
            const innerEndY = entryY + (i - 3) * 1.2;

            pctx.strokeStyle = c.color;
            pctx.globalAlpha = 0.85;
            pctx.lineWidth = 2.2;
            pctx.beginPath();
            pctx.moveTo(entryX, entryY);
            pctx.lineTo(innerEndX, innerEndY);
            pctx.stroke();

            const finalX = W - 20;
            const finalY = innerEndY + (finalX - innerEndX) * Math.tan(exitAng);
            pctx.beginPath();
            pctx.moveTo(innerEndX, innerEndY);
            pctx.lineTo(finalX, finalY);
            pctx.stroke();
        }
        pctx.globalAlpha = 1;

        pctx.fillStyle = 'rgba(255,255,255,0.7)';
        pctx.font = '12px Inter';
        pctx.fillText('luce bianca', startX - 5, startY - 8);
        pctx.fillText('spettro', W - 80, py - 50);
    }

    prismAngle.addEventListener('input', drawPrism);
    drawPrism();

    const quizData = [
        {
            question: "1. La legge di Snell mette in relazione gli angoli di incidenza e rifrazione attraverso:",
            options: [
                "Il prodotto delle distanze percorse",
                "Il rapporto fra gli indici di rifrazione moltiplicati per i seni degli angoli",
                "La differenza fra le velocità della luce"
            ],
            correct: 1
        },
        {
            question: "2. Chi pubblicò per primo la legge di rifrazione, anche se Snell l'aveva scoperta prima?",
            options: [
                "Isaac Newton",
                "Galileo Galilei",
                "René Descartes"
            ],
            correct: 2
        },
        {
            question: "3. L'indice di rifrazione del diamante è circa 2.42. Significa che la luce nel diamante viaggia:",
            options: [
                "2.42 volte più veloce che nel vuoto",
                "2.42 volte più lenta che nel vuoto",
                "Allo stesso modo del vuoto"
            ],
            correct: 1
        },
        {
            question: "4. La riflessione totale interna avviene quando:",
            options: [
                "La luce passa da un mezzo meno denso a uno più denso a qualsiasi angolo",
                "La luce passa da un mezzo più denso a uno meno denso con angolo maggiore di quello critico",
                "Il raggio è perpendicolare alla superficie"
            ],
            correct: 1
        },
        {
            question: "5. Newton dimostrò con un prisma che:",
            options: [
                "La luce viaggia in linea retta",
                "La luce bianca è composta da tutti i colori dell'arcobaleno",
                "Lo specchio inverte i raggi"
            ],
            correct: 1
        },
        {
            question: "6. Gli angoli nelle leggi dell'ottica vengono misurati sempre rispetto a:",
            options: [
                "La superficie",
                "La normale alla superficie",
                "Il piano orizzontale"
            ],
            correct: 1
        },
        {
            question: "7. Una cannuccia immersa nell'acqua sembra spezzata. Il fenomeno responsabile è:",
            options: [
                "La diffrazione",
                "La rifrazione",
                "L'interferenza"
            ],
            correct: 1
        },
        {
            question: "8. L'angolo critico per il sistema vetro-aria è circa:",
            options: [
                "10°",
                "41°",
                "75°"
            ],
            correct: 1
        },
        {
            question: "9. Nel prisma, quale colore viene deviato di più?",
            options: [
                "Il rosso, perché ha lunghezza d'onda maggiore",
                "Il violetto, perché ha indice di rifrazione leggermente maggiore",
                "Il verde, perché è al centro dello spettro"
            ],
            correct: 1
        },
        {
            question: "10. La riflessione totale interna è il principio fisico fondamentale di:",
            options: [
                "Gli specchi convessi",
                "Le lampade fluorescenti",
                "Le fibre ottiche"
            ],
            correct: 2
        }
    ];

    runQuiz(quizData);

    function runQuiz(data) {
        const quizArea = document.getElementById('quiz-area');
        let currentScore = 0;
        let questionsAnswered = 0;

        function render() {
            quizArea.innerHTML = '';
            currentScore = 0;
            questionsAnswered = 0;
            const scoreEl = document.getElementById('quiz-score');
            scoreEl.textContent = '';

            data.forEach(q => {
                const qDiv = document.createElement('div');
                qDiv.className = 'quiz-question';

                const qTitle = document.createElement('h3');
                qTitle.textContent = q.question;
                qDiv.appendChild(qTitle);

                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'quiz-options';
                optionsDiv.style.cssText = 'display:flex; flex-direction:column; gap:0.8rem;';

                q.options.forEach((optText, optIndex) => {
                    const btn = document.createElement('button');
                    btn.className = 'quiz-btn';
                    btn.textContent = optText;
                    btn.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-main); padding:1rem; border-radius:0.5rem; cursor:pointer; text-align:left; font-size:1rem; font-family:inherit; transition:all 0.2s;';

                    btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.1)'; };
                    btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.05)'; };

                    btn.onclick = () => {
                        if (btn.disabled) return;
                        if (optIndex === q.correct) {
                            btn.style.background = 'var(--physics-color)';
                            btn.style.borderColor = 'var(--physics-color)';
                            btn.style.color = '#fff';
                            btn.classList.add('correct');
                            const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                            allBtns.forEach(b => {
                                b.disabled = true;
                                b.style.cursor = 'not-allowed';
                                if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                            });
                            const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                            if (!alreadyWrong) currentScore++;
                            questionsAnswered++;
                            if (questionsAnswered === data.length) showScore();
                        } else {
                            btn.classList.add('wrong');
                            btn.style.background = '#EF4444';
                            btn.style.borderColor = '#EF4444';
                            btn.style.color = '#fff';
                            btn.innerHTML += ' <strong>✗ Riprova!</strong>';
                            btn.disabled = true;
                            btn.style.opacity = '0.7';
                        }
                    };
                    optionsDiv.appendChild(btn);
                });
                qDiv.appendChild(optionsDiv);
                quizArea.appendChild(qDiv);
            });
        }

        function showScore() {
            const scoreEl = document.getElementById('quiz-score');
            const perfect = currentScore === data.length;
            scoreEl.style.color = perfect ? 'var(--physics-color)' : '#F59E0B';
            scoreEl.innerHTML = perfect
                ? `PERFETTO! Punteggio pieno (${currentScore}/${data.length}). Ora sai piegare la luce!`
                : `Punteggio: ${currentScore}/${data.length}. Ripassa Snell e prova di nuovo!`;
            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Riprova il Quiz';
            resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--physics-color); color:white; border:none; padding:0.7rem 1.4rem; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:600;';
            resetBtn.onclick = render;
            scoreEl.appendChild(document.createElement('br'));
            scoreEl.appendChild(resetBtn);
        }
        render();
    }
});
