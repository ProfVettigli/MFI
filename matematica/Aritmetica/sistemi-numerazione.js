/**
 * sistemi-numerazione.js
 * Logic for converting between Binary, Octal, Hexadecimal -> Decimal + Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. CONVERTITORI INTERATTIVI
       ========================================================= */
    const binInput = document.getElementById('bin-input');
    const binResult = document.getElementById('bin-result');

    const hexInput = document.getElementById('hex-input');
    const hexResult = document.getElementById('hex-result');

    const octInput = document.getElementById('oct-input');
    const octResult = document.getElementById('oct-result');

    // BINARIO -> DEC
    if (binInput) {
        binInput.addEventListener('input', () => {
            let val = binInput.value.trim();
            val = val.replace(/[^01]/g, '');
            binInput.value = val;
            if (val) {
                const dec = parseInt(val, 2);
                binResult.textContent = isNaN(dec) ? '?' : dec;
            } else {
                binResult.textContent = '0';
            }
        });
    }

    // DEC -> BINARIO
    const decToBinInput = document.getElementById('dec-to-bin-input');
    const binReverseResult = document.getElementById('bin-reverse-result');
    if (decToBinInput) {
        decToBinInput.addEventListener('input', () => {
            const val = parseInt(decToBinInput.value);
            if (!isNaN(val)) {
                binReverseResult.textContent = val.toString(2);
            } else {
                binReverseResult.textContent = '0';
            }
        });
    }

    // HEX -> DEC
    if (hexInput) {
        hexInput.addEventListener('input', () => {
            let val = hexInput.value.trim().toUpperCase();
            val = val.replace(/[^0-9A-F]/g, '');
            hexInput.value = val;
            if (val) {
                const dec = parseInt(val, 16);
                hexResult.textContent = isNaN(dec) ? '?' : dec;
            } else {
                hexResult.textContent = '0';
            }
        });
    }

    // DEC -> HEX
    const decToHexInput = document.getElementById('dec-to-hex-input');
    const hexReverseResult = document.getElementById('hex-reverse-result');
    if (decToHexInput) {
        decToHexInput.addEventListener('input', () => {
            const val = parseInt(decToHexInput.value);
            if (!isNaN(val)) {
                hexReverseResult.textContent = val.toString(16).toUpperCase();
            } else {
                hexReverseResult.textContent = '0';
            }
        });
    }

    // OCT -> DEC
    if (octInput) {
        octInput.addEventListener('input', () => {
            let val = octInput.value.trim();
            val = val.replace(/[^0-7]/g, '');
            octInput.value = val;
            if (val) {
                const dec = parseInt(val, 8);
                octResult.textContent = isNaN(dec) ? '?' : dec;
            } else {
                octResult.textContent = '0';
            }
        });
    }

    // DEC -> OCT
    const decToOctInput = document.getElementById('dec-to-oct-input');
    const octReverseResult = document.getElementById('oct-reverse-result');
    if (decToOctInput) {
        decToOctInput.addEventListener('input', () => {
            const val = parseInt(decToOctInput.value);
            if (!isNaN(val)) {
                octReverseResult.textContent = val.toString(8);
            } else {
                octReverseResult.textContent = '0';
            }
        });
    }

    /* =========================================================
       2. QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Chi ha introdotto i numeri indiani (0-9) nel mondo occidentale?",
            options: [
                "Gli antichi Greci.",
                "I matematici Arabi.",
                "Ettore Majorana."
            ],
            correct: 1
        },
        {
            question: "2. Qual è la caratteristica principale del sistema decimale?",
            options: [
                "È un sistema additivo puro.",
                "È un sistema posizionale.",
                "È un sistema inventato dai computer."
            ],
            correct: 1
        },
        {
            question: "3. Quanto vale il numero binario 1010 in decimale?",
            options: [
                "10",
                "12",
                "8"
            ],
            correct: 0
        },
        {
            question: "4. Perché OCT 31 = DEC 25?",
            options: [
                "È un errore del calendario.",
                "Perché in base 8, 3 decine (24) + 1 unità = 25.",
                "Perché i matematici amano gli scherzi."
            ],
            correct: 1
        },
        {
            question: "5. Cosa rappresentano le lettere A-F nel sistema esadecimale?",
            options: [
                "I numeri dal 10 al 15.",
                "Le costanti matematiche più importanti.",
                "I codici dei bit spenti."
            ],
            correct: 0
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let currentScore = 0;
    let questionsAnswered = 0;

    function generateQuiz() {
        if (!quizArea || !scoreEl) return;
        
        quizArea.innerHTML = '';
        scoreEl.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;

        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = "2rem";

            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = "1rem";
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.display = "flex";
            optionsDiv.style.flexDirection = "column";
            optionsDiv.style.gap = "0.8rem";

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.innerHTML = optText;
                
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "var(--text-main)";
                btn.style.padding = "1rem";
                btn.style.borderRadius = "0.5rem";
                btn.style.cursor = "pointer";
                btn.style.textAlign = "left";
                btn.style.fontSize = "1rem";
                btn.style.fontFamily = "inherit";
                btn.style.transition = "all 0.2s";

                btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
                btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

                btn.onclick = () => {
                    const allBtns = optionsDiv.querySelectorAll('button');
                    allBtns.forEach(b => {
                        b.disabled = true;
                        b.style.cursor = "not-allowed";
                    });

                    if (optIndex === q.correct) {
                        btn.style.background = "var(--math-color)"; // MFI Blue
                        btn.style.borderColor = "var(--math-color)";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        allBtns[q.correct].style.background = "var(--math-color)";
                        allBtns[q.correct].style.borderColor = "var(--math-color)";
                        allBtns[q.correct].style.color = "#fff";
                    }

                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. Sei un poliglotta dei numeri! 🗺️`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. Prova a rivedere i convertitori interattivi.`;
                            scoreEl.style.color = "#F59E0B";
                        }

                        // Reset button
                        const resetBtn = document.createElement('button');
                        resetBtn.textContent = "Ricomincia Quiz 🔄";
                        resetBtn.className = "btn-gen";
                        resetBtn.style.marginTop = "2rem";
                        resetBtn.style.display = "block";
                        resetBtn.onclick = generateQuiz;
                        scoreEl.appendChild(resetBtn);
                    }
                };

                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    // Initialize
    generateQuiz();

});
