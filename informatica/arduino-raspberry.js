document.addEventListener('DOMContentLoaded', () => {

    let ledState = false;
    let blinkInterval = null;

    const ledDisplay = document.getElementById('led-display');
    const btnOn = document.getElementById('btn-on');
    const btnOff = document.getElementById('btn-off');
    const btnBlink = document.getElementById('btn-blink');
    const btnStop = document.getElementById('btn-stop');

    function setLED(state) {
        ledState = state;
        if (state) {
            ledDisplay.classList.add('led-on');
        } else {
            ledDisplay.classList.remove('led-on');
        }
    }

    function clearBlink() {
        if (blinkInterval) {
            clearInterval(blinkInterval);
            blinkInterval = null;
        }
    }

    btnOn.addEventListener('click', () => {
        clearBlink();
        setLED(true);
    });

    btnOff.addEventListener('click', () => {
        clearBlink();
        setLED(false);
    });

    btnBlink.addEventListener('click', () => {
        clearBlink();
        setLED(false);
        blinkInterval = setInterval(() => {
            setLED(!ledState);
        }, 1000);
    });

    btnStop.addEventListener('click', () => {
        clearBlink();
        setLED(false);
    });

    const quizData = [
        {
            question: "1. In quale città è stato creato Arduino nel 2005?",
            options: ["Milano", "Ivrea", "Roma"],
            correct: 1
        },
        {
            question: "2. Quale fondazione ha inventato Raspberry Pi nel 2012?",
            options: ["Arduino Foundation", "Raspberry Pi Foundation", "OpenSource Foundation"],
            correct: 1
        },
        {
            question: "3. Qual è il principale tipo di componente al cuore di Arduino?",
            options: ["Processore ARM", "Microcontrollore ATmega", "SoC Broadcom"],
            correct: 1
        },
        {
            question: "4. Quanta memoria RAM ha un Arduino Uno?",
            options: ["2 KB", "256 MB", "1 GB"],
            correct: 0
        },
        {
            question: "5. A quale velocità di clock funziona Arduino Uno?",
            options: ["1 GHz", "500 MHz", "16 MHz"],
            correct: 2
        },
        {
            question: "6. Cosa fa la funzione digitalWrite(pin, HIGH)?",
            options: ["Legge un valore digitale", "Scrive 5V sul pin", "Resetta il microcontrollore"],
            correct: 1
        },
        {
            question: "7. Quale funzione Arduino viene eseguita una sola volta all'avvio?",
            options: ["loop()", "setup()", "delay()"],
            correct: 1
        },
        {
            question: "8. A quale velocità di clock funziona Raspberry Pi (mediamente)?",
            options: ["16 MHz", "500 MHz", "1-2 GHz"],
            correct: 2
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
        scoreEl.style.color = perfect ? 'var(--physics-color)' : '#F59E0B';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a programmeare Arduino e Raspberry!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa i concetti che ti hanno messo in difficoltà!`;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--math-color);';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
