document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('classifier-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let currentClass = 'blue';
    let points = [];
    let line = null;

    const btnBlue = document.getElementById('cls-blue');
    const btnGreen = document.getElementById('cls-green');
    const btnTrain = document.getElementById('cls-train');
    const btnClear = document.getElementById('cls-clear');
    const info = document.getElementById('cls-info');

    function drawClassifier() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        for (let x = 0; x < canvas.width; x += 40) {
            for (let y = 0; y < canvas.height; y += 40) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
        if (line) {
            const { w0, w1, b } = line;
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const x1 = 0;
            const x2 = canvas.width;
            const y1 = (-b - w0 * x1) / (w1 || 0.0001);
            const y2 = (-b - w0 * x2) / (w1 || 0.0001);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        points.forEach(p => {
            ctx.fillStyle = p.cls === 'blue' ? '#3B82F6' : '#10B981';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }

    if (canvas) {
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            points.push({ x, y, cls: currentClass });
            info.textContent = `Punti: ${points.length}`;
            drawClassifier();
        });
        drawClassifier();
    }

    if (btnBlue) btnBlue.addEventListener('click', () => {
        currentClass = 'blue';
        btnBlue.classList.add('active');
        btnGreen.classList.remove('active');
    });
    if (btnGreen) btnGreen.addEventListener('click', () => {
        currentClass = 'green';
        btnGreen.classList.add('active');
        btnBlue.classList.remove('active');
    });
    if (btnClear) btnClear.addEventListener('click', () => {
        points = [];
        line = null;
        info.textContent = 'Punti: 0';
        drawClassifier();
    });
    if (btnTrain) btnTrain.addEventListener('click', () => {
        if (points.length < 3) {
            info.textContent = 'Servono almeno 3 punti!';
            return;
        }
        let w0 = Math.random() - 0.5;
        let w1 = Math.random() - 0.5;
        let b = 0;
        const lr = 0.001;
        for (let epoch = 0; epoch < 500; epoch++) {
            points.forEach(p => {
                const target = p.cls === 'blue' ? 1 : -1;
                const pred = w0 * p.x + w1 * p.y + b;
                const err = target - Math.sign(pred || 1);
                w0 += lr * err * p.x;
                w1 += lr * err * p.y;
                b += lr * err * 50;
            });
        }
        line = { w0, w1, b };
        info.textContent = `Punti: ${points.length} — Modello allenato!`;
        drawClassifier();
    });

    const nnCanvas = document.getElementById('neural-canvas');
    const nnCtx = nnCanvas ? nnCanvas.getContext('2d') : null;
    let x1Val = 0.5, x2Val = 0.3;
    let weights1 = Array.from({ length: 4 }, () => [Math.random() * 2 - 1, Math.random() * 2 - 1]);
    let weights2 = Array.from({ length: 4 }, () => Math.random() * 2 - 1);
    let activations = { hidden: [0, 0, 0, 0], output: 0 };
    let pulsing = false;

    function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

    function computeNN() {
        const hidden = weights1.map(([a, b]) => sigmoid(a * x1Val + b * x2Val));
        const output = sigmoid(weights2.reduce((s, w, i) => s + w * hidden[i], 0));
        activations = { hidden, output };
    }

    function drawNN() {
        if (!nnCtx) return;
        nnCtx.clearRect(0, 0, nnCanvas.width, nnCanvas.height);
        const inputs = [{ x: 80, y: 110, val: x1Val }, { x: 80, y: 250, val: x2Val }];
        const hidden = activations.hidden.map((v, i) => ({ x: 300, y: 50 + i * 90, val: v }));
        const output = { x: 520, y: 180, val: activations.output };

        weights1.forEach((ws, i) => {
            ws.forEach((w, j) => {
                const from = inputs[j];
                const to = hidden[i];
                const intensity = Math.min(Math.abs(w), 1);
                nnCtx.strokeStyle = w > 0 ? `rgba(245,158,11,${0.2 + intensity * 0.6})` : `rgba(239,68,68,${0.2 + intensity * 0.6})`;
                nnCtx.lineWidth = 1 + intensity * 2;
                nnCtx.beginPath();
                nnCtx.moveTo(from.x, from.y);
                nnCtx.lineTo(to.x, to.y);
                nnCtx.stroke();
            });
        });
        weights2.forEach((w, i) => {
            const from = hidden[i];
            const intensity = Math.min(Math.abs(w), 1);
            nnCtx.strokeStyle = w > 0 ? `rgba(245,158,11,${0.2 + intensity * 0.6})` : `rgba(239,68,68,${0.2 + intensity * 0.6})`;
            nnCtx.lineWidth = 1 + intensity * 2;
            nnCtx.beginPath();
            nnCtx.moveTo(from.x, from.y);
            nnCtx.lineTo(output.x, output.y);
            nnCtx.stroke();
        });

        const drawNode = (n, color, label) => {
            const r = 28;
            nnCtx.fillStyle = `rgba(${color}, ${0.2 + n.val * 0.7})`;
            nnCtx.strokeStyle = `rgb(${color})`;
            nnCtx.lineWidth = 2;
            nnCtx.beginPath();
            nnCtx.arc(n.x, n.y, r, 0, Math.PI * 2);
            nnCtx.fill();
            nnCtx.stroke();
            nnCtx.fillStyle = '#F8FAFC';
            nnCtx.font = 'bold 13px monospace';
            nnCtx.textAlign = 'center';
            nnCtx.fillText(n.val.toFixed(2), n.x, n.y + 4);
            if (label) {
                nnCtx.fillStyle = '#94A3B8';
                nnCtx.font = '12px Inter';
                nnCtx.fillText(label, n.x, n.y - r - 8);
            }
        };

        inputs.forEach((n, i) => drawNode(n, '59,130,246', `X${i + 1}`));
        hidden.forEach((n, i) => drawNode(n, '245,158,11', `H${i + 1}`));
        drawNode(output, '16,185,129', 'Y');

        nnCtx.fillStyle = '#94A3B8';
        nnCtx.font = '11px Inter';
        nnCtx.textAlign = 'left';
        nnCtx.fillText('Input', 60, 305);
        nnCtx.fillText('Hidden Layer', 260, 25);
        nnCtx.fillText('Output', 500, 230);
    }

    function updateNNDisplay() {
        computeNN();
        drawNN();
        const out = document.getElementById('nn-output');
        if (out) out.textContent = `Output: ${activations.output.toFixed(3)}`;
    }

    const btnX1 = document.getElementById('nn-x1');
    const btnX2 = document.getElementById('nn-x2');
    const btnFire = document.getElementById('nn-fire');
    const btnRandom = document.getElementById('nn-randomize');

    if (btnX1) btnX1.addEventListener('click', () => {
        x1Val = Math.round(Math.random() * 100) / 100;
        btnX1.textContent = `Input X1 = ${x1Val.toFixed(2)}`;
        updateNNDisplay();
    });
    if (btnX2) btnX2.addEventListener('click', () => {
        x2Val = Math.round(Math.random() * 100) / 100;
        btnX2.textContent = `Input X2 = ${x2Val.toFixed(2)}`;
        updateNNDisplay();
    });
    if (btnFire) btnFire.addEventListener('click', () => {
        if (pulsing) return;
        pulsing = true;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step > 6) {
                clearInterval(interval);
                pulsing = false;
                updateNNDisplay();
                return;
            }
            updateNNDisplay();
            if (nnCtx) {
                nnCtx.fillStyle = `rgba(245,158,11,${0.3 - step * 0.04})`;
                nnCtx.fillRect(0, 0, nnCanvas.width, nnCanvas.height);
            }
        }, 120);
    });
    if (btnRandom) btnRandom.addEventListener('click', () => {
        weights1 = Array.from({ length: 4 }, () => [Math.random() * 2 - 1, Math.random() * 2 - 1]);
        weights2 = Array.from({ length: 4 }, () => Math.random() * 2 - 1);
        updateNNDisplay();
    });

    updateNNDisplay();

    const quizData = [
        {
            question: "1. Chi propose nel 1950 il test che oggi porta il suo nome per stabilire se una macchina e intelligente?",
            options: ["Alan Turing", "John McCarthy", "Geoffrey Hinton"],
            correct: 0
        },
        {
            question: "2. In quale anno e durante quale conferenza nasce ufficialmente il termine 'Artificial Intelligence'?",
            options: ["MIT, 1947", "Dartmouth, 1956", "Stanford, 1969"],
            correct: 1
        },
        {
            question: "3. Cosa caratterizza il Machine Learning rispetto alla programmazione tradizionale?",
            options: [
                "Il programmatore scrive regole esplicite",
                "Il modello impara pattern dai dati senza regole esplicite",
                "Le decisioni sono prese da un dado"
            ],
            correct: 1
        },
        {
            question: "4. Nell'analogia con il cervello, cosa rappresenta il 'peso' (weight) in un neurone artificiale?",
            options: [
                "L'importanza che il neurone da a un certo ingresso",
                "La massa fisica del neurone",
                "Il tempo di calcolo"
            ],
            correct: 0
        },
        {
            question: "5. Cosa fa la tokenizzazione in un LLM come ChatGPT?",
            options: [
                "Critta le password",
                "Spezza il testo in frammenti numerati per darli in pasto alla rete",
                "Cancella le parole censurate"
            ],
            correct: 1
        },
        {
            question: "6. Nel lore di Warhammer 40k, dove ha sede l'Adeptus Mechanicus?",
            options: ["La Luna", "Marte", "Venere"],
            correct: 1
        },
        {
            question: "7. Chi e l'Omnissiah nell'universo di Warhammer 40.000?",
            options: [
                "Un robot da combattimento",
                "Il Dio-Macchina venerato dai tecno-sacerdoti",
                "Un imperatore alieno"
            ],
            correct: 1
        },
        {
            question: "8. In che lingua comunicano tra loro i tech-priest dell'Adeptus Mechanicus?",
            options: [
                "Latino",
                "Lingua-Technis (codice binario emesso da vocoder)",
                "Esperanto"
            ],
            correct: 1
        },
        {
            question: "9. Quale rischio etico dell'IA si riferisce alla generazione di video falsi indistinguibili dalla realta?",
            options: ["Bias", "Deepfake", "Alignment"],
            correct: 1
        },
        {
            question: "10. Il problema dell'alignment riguarda principalmente:",
            options: [
                "Allineare le GPU in un data center",
                "Assicurarsi che un'IA persegua davvero gli obiettivi voluti dagli umani",
                "Sincronizzare i pixel di uno schermo"
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). L'Omnissiah ti benedice!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa storia, reti e Adeptus Mechanicus!`;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
