document.addEventListener('DOMContentLoaded', () => {

    function f(x) { return x*x*x - x - 2; }
    function df(x) { return 3*x*x - 1; }

    const newtonCanvas = document.getElementById('newton-canvas');
    const newtonX0 = document.getElementById('newton-x0');
    const newtonIt = document.getElementById('newton-it');
    const newtonX0Val = document.getElementById('newton-x0-val');
    const newtonItVal = document.getElementById('newton-it-val');
    const newtonIters = document.getElementById('newton-iters');

    function setupAxes(canvas, xMin, xMax, yMin, yMax) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const toX = x => ((x - xMin) / (xMax - xMin)) * W;
        const toY = y => H - ((y - yMin) / (yMax - yMin)) * H;
        ctx.fillStyle = '#0B0E14';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = Math.floor(xMin); i <= xMax; i++) {
            ctx.beginPath(); ctx.moveTo(toX(i), 0); ctx.lineTo(toX(i), H); ctx.stroke();
        }
        for (let i = Math.floor(yMin); i <= yMax; i++) {
            ctx.beginPath(); ctx.moveTo(0, toY(i)); ctx.lineTo(W, toY(i)); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, toY(0)); ctx.lineTo(W, toY(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), H); ctx.stroke();
        return { ctx, toX, toY, W, H };
    }

    function drawFunction(ctx, fn, xMin, xMax, toX, toY, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        let first = true;
        for (let px = 0; px <= ctx.canvas.width; px++) {
            const x = xMin + (px / ctx.canvas.width) * (xMax - xMin);
            const y = fn(x);
            const py = toY(y);
            if (py < -1000 || py > ctx.canvas.height + 1000) { first = true; continue; }
            if (first) { ctx.moveTo(toX(x), py); first = false; }
            else ctx.lineTo(toX(x), py);
        }
        ctx.stroke();
    }

    function drawNewton() {
        const xMin = -3, xMax = 3, yMin = -8, yMax = 8;
        const { ctx, toX, toY } = setupAxes(newtonCanvas, xMin, xMax, yMin, yMax);
        drawFunction(ctx, f, xMin, xMax, toX, toY, '#F59E0B');

        const x0 = parseFloat(newtonX0.value);
        const N = parseInt(newtonIt.value, 10);
        newtonX0Val.textContent = x0.toFixed(2);
        newtonItVal.textContent = N;

        let x = x0;
        const points = [x];
        const rows = [];
        for (let i = 0; i < N; i++) {
            const fx = f(x);
            const dfx = df(x);
            rows.push({ n: i, x, fx });
            if (Math.abs(dfx) < 1e-10) break;
            x = x - fx / dfx;
            points.push(x);
        }
        rows.push({ n: N, x, fx: f(x) });

        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < points.length - 1; i++) {
            const xi = points[i], fxi = f(xi), dfxi = df(xi);
            const xn = points[i+1];
            ctx.beginPath();
            ctx.moveTo(toX(xi), toY(fxi));
            ctx.lineTo(toX(xn), toY(0));
            ctx.stroke();
            ctx.strokeStyle = 'rgba(59,130,246,0.4)';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(toX(xi), toY(fxi));
            ctx.lineTo(toX(xi), toY(0));
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#3B82F6';
        }

        points.forEach((px, i) => {
            ctx.fillStyle = i === 0 ? '#EF4444' : (i === points.length - 1 ? '#10B981' : '#FCD34D');
            ctx.beginPath();
            ctx.arc(toX(px), toY(0), 4.5, 0, Math.PI * 2);
            ctx.fill();
        });

        newtonIters.innerHTML = rows.map((r, i) => {
            const converged = Math.abs(r.fx) < 1e-6;
            return `<tr><td>${r.n}</td><td class="${converged ? 'converged' : ''}">${r.x.toFixed(6)}</td><td class="${converged ? 'converged' : ''}">${r.fx.toExponential(3)}</td></tr>`;
        }).join('');
    }

    if (newtonCanvas) {
        newtonX0.addEventListener('input', drawNewton);
        newtonIt.addEventListener('input', drawNewton);
        drawNewton();
    }

    const bisectCanvas = document.getElementById('bisect-canvas');
    const bisectIt = document.getElementById('bisect-it');
    const bisectItVal = document.getElementById('bisect-it-val');

    function drawBisection() {
        const xMin = -3, xMax = 3, yMin = -8, yMax = 8;
        const { ctx, toX, toY, H } = setupAxes(bisectCanvas, xMin, xMax, yMin, yMax);
        drawFunction(ctx, f, xMin, xMax, toX, toY, '#F59E0B');

        const N = parseInt(bisectIt.value, 10);
        bisectItVal.textContent = N;

        let a = 0, b = 3;
        const history = [];
        for (let i = 0; i < N; i++) {
            const c = (a + b) / 2;
            history.push({ a, b, c });
            if (f(a) * f(c) < 0) b = c;
            else a = c;
        }

        history.forEach((step, idx) => {
            const alpha = 0.2 + 0.8 * (idx / Math.max(1, history.length - 1));
            const y = -7 + idx * 0.6;
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(toX(step.a), toY(y));
            ctx.lineTo(toX(step.b), toY(y));
            ctx.stroke();
            ctx.fillStyle = `rgba(245,158,11,${alpha})`;
            ctx.beginPath();
            ctx.arc(toX(step.c), toY(y), 3.5, 0, Math.PI * 2);
            ctx.fill();
        });

        const final = history[history.length - 1];
        ctx.fillStyle = '#10B981';
        ctx.font = '13px monospace';
        ctx.fillText(`Stima zero: x ≈ ${final.c.toFixed(5)}`, 12, H - 12);
    }

    if (bisectCanvas) {
        bisectIt.addEventListener('input', drawBisection);
        drawBisection();
    }

    const intCanvas = document.getElementById('integral-canvas');
    const stripsEl = document.getElementById('strips');
    const stripsVal = document.getElementById('strips-val');
    const intMethod = document.getElementById('int-method');
    const intResult = document.getElementById('int-result');
    const intError = document.getElementById('int-error');

    function g(x) { return Math.sin(x) + 1.5; }
    const A = 0, B = Math.PI;
    const TRUE_INTEGRAL = Math.PI * 1.5 + 2;

    function drawIntegral() {
        const xMin = -0.3, xMax = Math.PI + 0.3, yMin = 0, yMax = 3;
        const { ctx, toX, toY } = setupAxes(intCanvas, xMin, xMax, yMin, yMax);

        const N = parseInt(stripsEl.value, 10);
        const method = intMethod.value;
        stripsVal.textContent = N;
        const h = (B - A) / N;

        let sum = 0;
        ctx.fillStyle = 'rgba(245,158,11,0.25)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1;

        for (let i = 0; i < N; i++) {
            const x0 = A + i * h;
            const x1 = x0 + h;
            if (method === 'rect') {
                const yMid = g((x0 + x1) / 2);
                sum += yMid * h;
                ctx.fillRect(toX(x0), toY(yMid), toX(x1) - toX(x0), toY(0) - toY(yMid));
                ctx.strokeRect(toX(x0), toY(yMid), toX(x1) - toX(x0), toY(0) - toY(yMid));
            } else {
                const y0 = g(x0), y1 = g(x1);
                sum += (y0 + y1) * h / 2;
                ctx.beginPath();
                ctx.moveTo(toX(x0), toY(0));
                ctx.lineTo(toX(x0), toY(y0));
                ctx.lineTo(toX(x1), toY(y1));
                ctx.lineTo(toX(x1), toY(0));
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }

        drawFunction(ctx, g, xMin, xMax, toX, toY, '#10B981');

        intResult.textContent = sum.toFixed(4);
        const err = Math.abs(sum - TRUE_INTEGRAL);
        intError.textContent = err.toFixed(5);
    }

    if (intCanvas) {
        stripsEl.addEventListener('input', drawIntegral);
        intMethod.addEventListener('change', drawIntegral);
        drawIntegral();
    }

    const quizData = [
        {
            question: "1. Perche servono i metodi numerici?",
            options: [
                "Per disegnare grafici",
                "Per risolvere equazioni che non hanno formula chiusa",
                "Per fare calcoli piu lenti"
            ],
            correct: 1
        },
        {
            question: "2. Il metodo di Newton-Raphson si basa sull'idea geometrica di:",
            options: [
                "Tracciare la tangente alla curva",
                "Calcolare la media di due punti",
                "Disegnare cerchi sempre piu piccoli"
            ],
            correct: 0
        },
        {
            question: "3. La formula iterativa di Newton-Raphson e:",
            options: [
                "xₙ₊₁ = xₙ + f(xₙ)",
                "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)",
                "xₙ₊₁ = (xₙ + xₙ₋₁)/2"
            ],
            correct: 1
        },
        {
            question: "4. Il metodo di bisezione richiede che nell'intervallo [a,b] la funzione:",
            options: [
                "Sia sempre positiva",
                "Cambi segno (f(a)·f(b) < 0)",
                "Sia lineare"
            ],
            correct: 1
        },
        {
            question: "5. Tra rettangoli e trapezi, quale e in genere piu accurato a parita di strisce?",
            options: ["Rettangoli", "Trapezi", "Sono identici"],
            correct: 1
        },
        {
            question: "6. L'errore relativo di un'approssimazione si calcola come:",
            options: [
                "|errore_assoluto| / |valore_vero|",
                "|valore_vero| · errore_assoluto",
                "errore_assoluto al quadrato"
            ],
            correct: 0
        },
        {
            question: "7. Quale applicazione NON usa metodi numerici?",
            options: [
                "Previsioni del meteo",
                "Calcolare 2 + 3 al supermercato",
                "Addestramento di ChatGPT"
            ],
            correct: 1
        },
        {
            question: "8. Newton-Raphson e detto a convergenza 'quadratica' perche:",
            options: [
                "Risolve solo equazioni di secondo grado",
                "Ad ogni iterazione il numero di cifre corrette raddoppia",
                "Procede a salti di lunghezza ²"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    function renderQuiz() {
        if (!quizArea) return;
        quizArea.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = '';

        quizData.forEach((q) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = '1rem';
            qTitle.style.fontWeight = '600';
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
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>X Riprova!</strong>';
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
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--physics-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Newton ti darebbe la sua mela!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa Newton, bisezione e integrazione numerica.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
