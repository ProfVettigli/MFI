/**
 * monomi-polinomi.js
 * Interactive logic for monomials and polynomials page.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. TROVA I MONOMI SIMILI
       ========================================================= */
    const similiGrid = document.getElementById('simili-grid');
    const btnCheckSimili = document.getElementById('btn-check-simili');
    const similiFeedback = document.getElementById('simili-feedback');

    if (similiGrid) {
        const btns = similiGrid.querySelectorAll('.simili-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                btn.classList.toggle('selected');
            });
        });
    }

    if (btnCheckSimili) {
        btnCheckSimili.addEventListener('click', () => {
            const btns = similiGrid.querySelectorAll('.simili-btn');
            let allCorrect = true;

            btns.forEach(btn => {
                const isSimilar = btn.dataset.similar === 'true';
                const isSelected = btn.classList.contains('selected');
                btn.classList.remove('selected');

                if (isSimilar && isSelected) {
                    // Correctly selected a similar monomial -> green
                    btn.classList.add('correct');
                } else if (!isSimilar && !isSelected) {
                    // Correctly ignored a non-similar -> no color (neutral)
                    // Don't add any class
                } else if (isSimilar && !isSelected) {
                    // Missed a similar monomial -> show it green so they see the answer
                    btn.classList.add('correct');
                    allCorrect = false;
                } else {
                    // Selected a non-similar monomial -> red
                    btn.classList.add('wrong');
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                similiFeedback.textContent = "Perfetto! Hai identificato correttamente tutti i monomi simili a 4x²y!";
                similiFeedback.style.color = "var(--math-color)";
            } else {
                similiFeedback.textContent = "Attenzione! I monomi simili hanno la stessa parte letterale (stesse lettere, stessi esponenti). Quelli verdi sono i simili corretti.";
                similiFeedback.style.color = "#EF4444";
            }

            btnCheckSimili.disabled = true;
            btnCheckSimili.style.opacity = "0.5";
        });
    }

    /* =========================================================
       2. SFIDE SOMMA
       ========================================================= */
    const btnCheckSum = document.getElementById('btn-check-sum');
    const sumFeedback = document.getElementById('sum-feedback');
    const sumAnswer = document.getElementById('sum-answer');
    const challengeBtns = document.querySelectorAll('.challenge-btn');
    let currentSumAnswer = null;

    challengeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSumAnswer = btn.dataset.ans;
            if (sumAnswer) sumAnswer.value = '';
            if (sumFeedback) sumFeedback.textContent = '';
            challengeBtns.forEach(b => b.style.borderColor = 'transparent');
            btn.style.borderColor = 'var(--math-color)';
        });
    });

    if (btnCheckSum) {
        btnCheckSum.addEventListener('click', () => {
            const userAnswer = sumAnswer ? sumAnswer.value.trim().replace(/\s/g, '') : '';

            if (!userAnswer) {
                sumFeedback.textContent = "Scrivi la tua risposta prima di verificare!";
                sumFeedback.style.color = "#F59E0B";
                return;
            }
            if (!currentSumAnswer) {
                sumFeedback.textContent = "Seleziona prima una sfida cliccando uno dei bottoni!";
                sumFeedback.style.color = "#F59E0B";
                return;
            }

            const normalise = (s) => s.replace(/\s/g, '').toLowerCase();
            if (normalise(userAnswer) === normalise(currentSumAnswer)) {
                sumFeedback.textContent = "Corretto! Ottimo lavoro! 🎉";
                sumFeedback.style.color = "var(--math-color)";
            } else {
                sumFeedback.textContent = `Non esatto. La risposta corretta è: ${currentSumAnswer}`;
                sumFeedback.style.color = "#EF4444";
            }
        });
    }

    /* =========================================================
       3. SFIDE MOLTIPLICAZIONE
       ========================================================= */
    const btnCheckMult = document.getElementById('btn-check-mult');
    const multFeedback = document.getElementById('mult-feedback');
    const multAnswer = document.getElementById('mult-answer');
    const multBtns = document.querySelectorAll('.mult-btn');
    let currentMultAnswer = null;

    multBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentMultAnswer = btn.dataset.ans;
            if (multAnswer) multAnswer.value = '';
            if (multFeedback) multFeedback.textContent = '';
            multBtns.forEach(b => b.style.borderColor = 'transparent');
            btn.style.borderColor = 'var(--math-color)';
        });
    });

    if (btnCheckMult) {
        btnCheckMult.addEventListener('click', () => {
            const userAnswer = multAnswer ? multAnswer.value.trim().replace(/\s/g, '') : '';

            if (!userAnswer) {
                multFeedback.textContent = "Scrivi la tua risposta prima di verificare!";
                multFeedback.style.color = "#F59E0B";
                return;
            }
            if (!currentMultAnswer) {
                multFeedback.textContent = "Seleziona prima una sfida cliccando uno dei bottoni!";
                multFeedback.style.color = "#F59E0B";
                return;
            }

            const normalise = (s) => s.replace(/\s/g, '').toLowerCase();
            if (normalise(userAnswer) === normalise(currentMultAnswer)) {
                multFeedback.textContent = "Corretto! Ottimo lavoro! 🎉";
                multFeedback.style.color = "var(--math-color)";
            } else {
                multFeedback.textContent = `Non esatto. La risposta corretta è: ${currentMultAnswer}`;
                multFeedback.style.color = "#EF4444";
            }
        });
    }

    /* =========================================================
       4. QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Qual è il grado del monomio 5x³y²?",
            options: [
                "Grado 5",
                "Grado 3",
                "Grado 2"
            ],
            correct: 0
        },
        {
            question: "2. Quali tra questi monomi sono simili?",
            options: [
                "3x²y e 7x²y",
                "3x²y e 3xy²",
                "3x²y e 3x²"
            ],
            correct: 0
        },
        {
            question: "3. Quanto fa (2x² + 3x) + (x² - x)?",
            options: [
                "3x² + 2x",
                "3x⁴ + 2x²",
                "2x² + 4x"
            ],
            correct: 0
        },
        {
            question: "4. Come si moltiplicano due monomi?",
            options: [
                "Si moltiplicano i coefficienti e si sommano gli esponenti delle variabili uguali.",
                "Si sommano i coefficienti e si moltiplicano gli esponenti.",
                "Si moltiplicano sia i coefficienti sia gli esponenti."
            ],
            correct: 0
        },
        {
            question: "5. Quanto fa 3x · 4x²?",
            options: [
                "12x³",
                "7x³",
                "12x²"
            ],
            correct: 0
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = "2rem";

            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = "1rem";
            qTitle.style.fontWeight = "600";
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.display = "flex";
            optionsDiv.style.flexDirection = "column";
            optionsDiv.style.gap = "0.8rem";

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.textContent = optText;

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
                        btn.style.background = "var(--math-color)";
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
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Eccellente! Hai totalizzato ${currentScore}/${quizData.length}. Padroneggi monomi e polinomi!`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. Rileggi le sezioni su simili e moltiplicazione.`;
                            scoreEl.style.color = "#F59E0B";
                        }
                    }
                };

                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    /* =========================================================
       5. RACCOGLIMENTO A FATTOR COMUNE
       ========================================================= */
    const btnCheckCommon = document.getElementById('btn-check-common');
    const commonInput = document.getElementById('common-factor-input');
    const commonFeedback = document.getElementById('common-feedback');
    const factoringStep1 = document.getElementById('factoring-step-1');

    if (btnCheckCommon) {
        btnCheckCommon.addEventListener('click', () => {
            const val = commonInput.value.trim().toLowerCase().replace(/\s/g, '');
            if (val === "4x^2" || val === "4x2") {
                commonFeedback.textContent = "Corretto! 4x² è il MCD tra 12x³ e 8x². Vedi come il resto rimane in parentesi?";
                commonFeedback.style.color = "var(--physics-color)";
                if (factoringStep1) factoringStep1.style.display = "inline";
                commonInput.style.borderColor = "var(--physics-color)";
            } else {
                commonFeedback.textContent = "Non esatto. Cerca il massimo divisore comune per i numeri (12, 8) e la potenza minima delle lettere comuni.";
                commonFeedback.style.color = "#EF4444";
                commonInput.style.borderColor = "#EF4444";
            }
        });
    }

    /* =========================================================
       6. RACCOGLIMENTO PARZIALE
       ========================================================= */
    const btnCheckPartial = document.getElementById('btn-check-partial');
    const partialInput = document.getElementById('partial-answer');
    const partialFeedback = document.getElementById('partial-feedback');

    if (btnCheckPartial) {
        btnCheckPartial.addEventListener('click', () => {
            const val = partialInput.value.trim().toLowerCase().replace(/\s/g, '');
            if (val === "(x+y)" || val === "x+y") {
                partialFeedback.textContent = "Esatto! Il binomio comune è (x+y). La scomposizione finale è (2+a)(x+y).";
                partialFeedback.style.color = "var(--physics-color)";
                partialInput.style.borderColor = "var(--physics-color)";
            } else {
                partialFeedback.textContent = "Riprova. Raggruppa i primi due termini estraendo il 2, e gli ultimi due estraendo la 'a'. Cosa resta?";
                partialFeedback.style.color = "#EF4444";
                partialInput.style.borderColor = "#EF4444";
            }
        });
    }

});

