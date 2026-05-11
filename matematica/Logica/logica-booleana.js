document.addEventListener('DOMContentLoaded', () => {

    // ── Helpers ──────────────────────────────────────────────────────────────

    function setBit(btn, val) {
        if (val) {
            btn.textContent = '1';
            btn.className = 'bit-btn on';
            btn.style.cssText = '';
        } else {
            btn.textContent = '0';
            btn.className = 'bit-btn off';
            btn.style.cssText = 'border-color:#EF4444; color:#EF4444; background:rgba(239,68,68,0.15);';
        }
    }

    function setOutput(el, val, labelPrefix) {
        el.textContent = `${labelPrefix} = ${val}`;
        el.className = `gate-output ${val ? 'out-1' : 'out-0'}`;
        if (val) {
            el.style.borderLeftColor = '';
            el.style.color = '';
        } else {
            el.style.borderLeftColor = '#EF4444';
            el.style.color = '#EF4444';
        }
    }

    function makeBitToggle(btnId, onChange) {
        const btn = document.getElementById(btnId);
        if (!btn) return null;
        let val = btn.classList.contains('on') ? 1 : 0;
        btn.addEventListener('click', () => {
            val = val ? 0 : 1;
            setBit(btn, val);
            onChange(val);
        });
        return { get: () => val };
    }

    // ── AND gate ─────────────────────────────────────────────────────────────

    const andOut = document.getElementById('and-out');
    let andA = 1, andB = 1;

    function updateAnd() {
        setOutput(andOut, andA && andB, 'A AND B');
    }

    makeBitToggle('and-a', v => { andA = v; updateAnd(); });
    makeBitToggle('and-b', v => { andB = v; updateAnd(); });

    // ── OR gate ──────────────────────────────────────────────────────────────

    const orOut = document.getElementById('or-out');
    let orA = 0, orB = 1;

    function updateOr() {
        const result = orA || orB;
        orOut.textContent = `A OR B = ${result}`;
        orOut.className = `gate-output ${result ? 'out-1' : 'out-0'}`;
        orOut.style.borderLeftColor = result ? 'var(--physics-color)' : '#EF4444';
        orOut.style.color = result ? 'var(--physics-color)' : '#EF4444';
    }

    makeBitToggle('or-a', v => { orA = v; updateOr(); });
    makeBitToggle('or-b', v => { orB = v; updateOr(); });

    // ── NOT gate ─────────────────────────────────────────────────────────────

    const notOut = document.getElementById('not-out');
    let notA = 1;

    function updateNot() {
        const result = notA ? 0 : 1;
        notOut.textContent = `NOT A = ${result}`;
        notOut.className = `gate-output ${result ? 'out-1' : 'out-0'}`;
        notOut.style.borderLeftColor = result ? 'var(--math-color)' : '#EF4444';
        notOut.style.color = result ? 'var(--math-color)' : '#EF4444';
    }

    makeBitToggle('not-a', v => { notA = v; updateNot(); });

    // ── Circuit simulator ────────────────────────────────────────────────────

    let cA = 1, cB = 1, cC = 0;
    const circResult = document.getElementById('circ-result');

    function updateCircuit() {
        const ab = cA && cB;
        const notC = cC ? 0 : 1;
        const out = ab || notC;

        document.getElementById('disp-a').textContent = `A=${cA}`;
        document.getElementById('disp-b').textContent = `B=${cB}`;
        document.getElementById('disp-c').textContent = `C=${cC}`;
        document.getElementById('step-ab').textContent = `${cA} AND ${cB} = ${ab}`;
        document.getElementById('step-c').textContent = `${cC} = ${notC}`;
        document.getElementById('step-final').textContent = `${ab} OR ${notC} = ${out}`;
        document.getElementById('step-final').style.color = out ? 'var(--math-color)' : '#EF4444';

        circResult.textContent = `Uscita del circuito: ${out}`;
        circResult.style.borderLeftColor = out ? 'var(--math-color)' : '#EF4444';
        circResult.style.color = out ? 'var(--math-color)' : '#EF4444';
    }

    function circBtnToggle(btnId, labelPrefix, getCurrent, setter) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            const next = getCurrent() ? 0 : 1;
            setter(next);
            btn.textContent = `${labelPrefix}=${next}`;
            setBit(btn, next);
            updateCircuit();
        });
    }

    circBtnToggle('circ-a', 'A', () => cA, v => { cA = v; });
    circBtnToggle('circ-b', 'B', () => cB, v => { cB = v; });
    circBtnToggle('circ-c', 'C', () => cC, v => { cC = v; });

    // ── Quiz ─────────────────────────────────────────────────────────────────

    const quizData = [
        {
            question: "1. Chi fu il primo a formalizzare matematicamente la logica binaria, dando vita all'algebra che porta il suo nome?",
            options: [
                "Alan Turing",
                "George Boole",
                "Claude Shannon"
            ],
            correct: 1
        },
        {
            question: "2. In quale anno Claude Shannon applicò l'algebra booleana ai circuiti elettrici nella sua celebre tesi magistrale?",
            options: [
                "1854",
                "1900",
                "1937"
            ],
            correct: 2
        },
        {
            question: "3. Quali sono i due soli valori possibili nell'algebra booleana?",
            options: [
                "0 e 1",
                "0, 1 e ½",
                "–1 e +1"
            ],
            correct: 0
        },
        {
            question: "4. La porta AND con ingressi A=1 e B=0 produce:",
            options: [
                "1",
                "0",
                "Dipende dalla tensione"
            ],
            correct: 1
        },
        {
            question: "5. La porta OR con ingressi A=0 e B=0 produce:",
            options: [
                "1",
                "0",
                "Indefinito"
            ],
            correct: 1
        },
        {
            question: "6. Qual è il risultato di NOT 0?",
            options: [
                "0",
                "–1",
                "1"
            ],
            correct: 2
        },
        {
            question: "7. Una porta NAND è equivalente a:",
            options: [
                "NOT( A OR B )",
                "NOT( A AND B )",
                "A AND (NOT B)"
            ],
            correct: 1
        },
        {
            question: "8. In Python, quale operatore corrisponde alla porta logica AND?",
            options: [
                "&&",
                "and",
                "AND"
            ],
            correct: 1
        },
        {
            question: "9. La porta OR produce 0 solo quando:",
            options: [
                "Tutti gli ingressi sono 0",
                "Almeno un ingresso è 0",
                "Tutti gli ingressi sono 1"
            ],
            correct: 0
        },
        {
            question: "10. Quanti transistor contiene approssimativamente un moderno chip Apple M-series?",
            options: [
                "Circa 1 milione",
                "Circa 25 miliardi",
                "Circa 500 mila"
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

        quizData.forEach((q, qIndex) => {
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
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--physics-color)' : '#F59E0B';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a costruire circuiti logici!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa le porte che ti hanno messo in difficoltà!`;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--math-color);';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
