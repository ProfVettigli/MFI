document.addEventListener('DOMContentLoaded', () => {

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

    let nandA = 1, nandB = 1;
    const nandOut = document.getElementById('nand-out');
    function updateNand() {
        const r = (nandA && nandB) ? 0 : 1;
        nandOut.textContent = `A NAND B = ${r}`;
        nandOut.className = `gate-output ${r ? 'out-1' : 'out-0'}`;
        nandOut.style.borderLeftColor = r ? 'var(--chem-color)' : '#EF4444';
        nandOut.style.color = r ? 'var(--chem-color)' : '#EF4444';
    }
    makeBitToggle('nand-a', v => { nandA = v; updateNand(); });
    makeBitToggle('nand-b', v => { nandB = v; updateNand(); });

    let xorA = 0, xorB = 1;
    const xorOut = document.getElementById('xor-out');
    function updateXor() {
        const r = xorA ^ xorB;
        xorOut.textContent = `A XOR B = ${r}`;
        xorOut.className = `gate-output ${r ? 'out-1' : 'out-0'}`;
        xorOut.style.borderLeftColor = r ? 'var(--physics-color)' : '#EF4444';
        xorOut.style.color = r ? 'var(--physics-color)' : '#EF4444';
    }
    makeBitToggle('xor-a', v => { xorA = v; updateXor(); });
    makeBitToggle('xor-b', v => { xorB = v; updateXor(); });

    let haA = 0, haB = 1;
    function updateHa() {
        const s = haA ^ haB;
        const c = haA && haB;
        document.getElementById('ha-s').textContent = s;
        document.getElementById('ha-c').textContent = c;
        document.getElementById('ha-bin').textContent = `${c}${s}`;
    }
    makeBitToggle('ha-a', v => { haA = v; updateHa(); });
    makeBitToggle('ha-b', v => { haB = v; updateHa(); });

    let muxD0 = 1, muxD1 = 0, muxS = 0;
    const muxOut = document.getElementById('mux-out');
    function updateMux() {
        const y = muxS ? muxD1 : muxD0;
        muxOut.textContent = `Y = D${muxS} = ${y}`;
        muxOut.className = `gate-output ${y ? 'out-1' : 'out-0'}`;
        muxOut.style.borderLeftColor = y ? 'var(--math-color)' : '#EF4444';
        muxOut.style.color = y ? 'var(--math-color)' : '#EF4444';
    }
    makeBitToggle('mux-d0', v => { muxD0 = v; updateMux(); });
    makeBitToggle('mux-d1', v => { muxD1 = v; updateMux(); });
    makeBitToggle('mux-s', v => { muxS = v; updateMux(); });

    const quizData = [
        { question: "1. Cosa rende speciale la porta NAND nell'elettronica digitale?", options: ["E la piu veloce in assoluto", "Da sola permette di costruire ogni altra porta logica", "Consuma piu corrente delle altre"], correct: 1 },
        { question: "2. NAND(A, A) e equivalente a:", options: ["AND(A, A)", "NOT(A)", "OR(A, 1)"], correct: 1 },
        { question: "3. La porta XOR vale 1 quando:", options: ["I due ingressi sono uguali", "I due ingressi sono diversi", "Almeno uno e 1"], correct: 1 },
        { question: "4. In un half adder, la cifra somma S corrisponde a:", options: ["A AND B", "A OR B", "A XOR B"], correct: 2 },
        { question: "5. In un half adder, il riporto C corrisponde a:", options: ["A XOR B", "A AND B", "NOT(A)"], correct: 1 },
        { question: "6. Cosa fa un multiplexer 2-a-1?", options: ["Somma due bit", "Sceglie quale dei due ingressi mandare in uscita in base al selettore", "Memorizza un bit"], correct: 1 },
        { question: "7. Quanti flip-flop servono per memorizzare 8 bit (1 byte)?", options: ["1", "8", "256"], correct: 1 },
        { question: "8. Quante porte NAND bastano per realizzare una NOT?", options: ["1", "2", "4"], correct: 0 },
        { question: "9. Quale circuito serve per la memoria RAM?", options: ["Half adder", "Flip-flop", "Multiplexer"], correct: 1 },
        { question: "10. Mettendo in cascata 32 full adder ottieni un sommatore a:", options: ["8 bit", "32 bit", "1024 bit"], correct: 1 }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0, questionsAnswered = 0;

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
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        if (optionsDiv.querySelectorAll('.wrong').length === 0) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>Riprova!</strong>';
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a progettare circuiti!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa le porte che ti hanno messo in difficolta!`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.style.cssText = 'display:block; margin-top:1.5rem; background:var(--chem-color); color:white; border:none; padding:0.8rem 1.5rem; border-radius:8px; font-weight:600; cursor:pointer;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
