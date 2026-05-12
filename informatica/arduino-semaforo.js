document.addEventListener('DOMContentLoaded', () => {

    const ledRed = document.getElementById('led-red');
    const ledYellow = document.getElementById('led-yellow');
    const ledGreen = document.getElementById('led-green');
    const statusDisplay = document.getElementById('status-display');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');

    let cycleRunning = false;

    function clearAllLEDs() {
        ledRed.classList.remove('red');
        ledYellow.classList.remove('yellow');
        ledGreen.classList.remove('green');
    }

    function setStatus(text) {
        statusDisplay.textContent = `Stato: ${text}`;
    }

    function showRed() {
        clearAllLEDs();
        ledRed.classList.add('red');
        setStatus('ROSSO - STOP (5 sec)');
    }

    function showYellow() {
        clearAllLEDs();
        ledYellow.classList.add('yellow');
        setStatus('GIALLO - ATTENZIONE (2 sec)');
    }

    function showGreen() {
        clearAllLEDs();
        ledGreen.classList.add('green');
        setStatus('VERDE - VIA LIBERA (5 sec)');
    }

    async function runCycle() {
        if (cycleRunning) return;
        cycleRunning = true;
        btnStart.disabled = true;

        while (cycleRunning) {
            showRed();
            await new Promise(r => setTimeout(r, 5000));
            if (!cycleRunning) break;

            showYellow();
            await new Promise(r => setTimeout(r, 2000));
            if (!cycleRunning) break;

            showGreen();
            await new Promise(r => setTimeout(r, 5000));
        }

        btnStart.disabled = false;
    }

    btnStart.addEventListener('click', () => {
        if (!cycleRunning) {
            runCycle();
        }
    });

    btnStop.addEventListener('click', () => {
        cycleRunning = false;
        clearAllLEDs();
        setStatus('Fermato');
        btnStart.disabled = false;
    });

    clearAllLEDs();
    setStatus('Pronto');

    const quizData = [
        {
            question: "1. Quali colori ha un semaforo standard?",
            options: ["Rosso, Blu, Verde", "Rosso, Giallo, Verde", "Verde, Arancione, Rosso"],
            correct: 1
        },
        {
            question: "2. Quanti secondi rimane rosso il semaforo nel codice?",
            options: ["2 secondi", "3 secondi", "5 secondi"],
            correct: 2
        },
        {
            question: "3. Quale comando accende un LED su un pin di Arduino?",
            options: ["digitalWrite(pin, LOW)", "digitalWrite(pin, HIGH)", "analogWrite(pin, 255)"],
            correct: 1
        },
        {
            question: "4. A cosa serve una resistenza nel circuito LED?",
            options: ["Aumentare la luminosità", "Limitare la corrente", "Accelerare la velocità"],
            correct: 1
        },
        {
            question: "5. Qual è il valore di una resistenza protettiva per un LED?",
            options: ["10 Ohm", "220 Ohm", "1000 Ohm"],
            correct: 1
        },
        {
            question: "6. Cosa significa PWM (Pulse Width Modulation)?",
            options: ["Modulazione della larghezza d'impulso", "Protezione dei cavi", "Programmazione wireless"],
            correct: 0
        },
        {
            question: "7. Quali pin di Arduino supportano PWM?",
            options: ["Soltanto pin 13", "3, 5, 6, 9, 10, 11 e altri", "A0-A5"],
            correct: 1
        },
        {
            question: "8. Cosa fa delay(2000) nel codice Arduino?",
            options: ["Pausa il programma per 2 secondi", "Pausa il programma per 2 millisecondi", "Invia un segnale ritardato"],
            correct: 0
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a costruire un semaforo reale!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa il codice e la teoria!`;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--math-color);';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
