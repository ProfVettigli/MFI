/**
 * espressioni-algebriche.js
 * Logic for translating Italian phrases to Algebraic expressions + Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. TRADUZIONE DALL'ITALIANO: LOGICA INPUT
       ========================================================= */
    const translationCards = document.querySelectorAll('.translation-card');

    translationCards.forEach(card => {
        const input = card.querySelector('.algebra-input');
        const btn = card.querySelector('.btn-check-sm');
        const correctAns = input.dataset.ans;

        btn.addEventListener('click', () => {
            let userAnswer = input.value.trim().replace(/\s/g, '').toLowerCase();
            let normalizedCorrect = correctAns.replace(/\s/g, '').toLowerCase();

            // Sostituzioni comuni
            userAnswer = userAnswer.replace('²', '^2'); // Supporto per tastiere mobili

            if (userAnswer === normalizedCorrect) {
                input.style.borderColor = "var(--physics-color)";
                input.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                btn.textContent = "✓ Bravo!";
                btn.style.background = "var(--physics-color)";
            } else if (!userAnswer) {
                input.style.borderColor = "#F59E0B";
            } else {
                input.style.borderColor = "#EF4444";
                input.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                btn.textContent = "!";
                btn.style.background = "#EF4444";
                setTimeout(() => {
                    btn.textContent = "Verifica";
                    btn.style.background = "var(--math-color)";
                }, 1500);
            }
        });
    });

    /* =========================================================
       2. REVEAL MEGA CHALLENGE
       ========================================================= */
    const btnReveal = document.getElementById('btn-reveal-mega');
    const megaSolution = document.getElementById('mega-solution');

    if (btnReveal) {
        btnReveal.addEventListener('click', () => {
            if (megaSolution.style.display === "none") {
                megaSolution.style.display = "block";
                btnReveal.textContent = "Nascondi Soluzione";
            } else {
                megaSolution.style.display = "none";
                btnReveal.textContent = "Svela la Soluzione";
            }
        });
    }

    /* =========================================================
       3. QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Come si traduce: 'Il triplo di x diminuito di 7'?",
            options: [
                "$3x + 7$",
                "$3x - 7$",
                "$x^3 - 7$"
            ],
            correct: 1
        },
        {
            question: "2. Cosa rappresenta l'espressione $a^2 + b^2$?",
            options: [
                "Il quadrato della loro somma.",
                "La somma dei loro quadrati.",
                "Il doppio prodotto dei loro quadrati."
            ],
            correct: 1
        },
        {
            question: "3. Se $n = 5$, qual è il valore di $2n - 3$?",
            options: [
                "7",
                "10",
                "13"
            ],
            correct: 0
        },
        {
            question: "4. Traduci: 'Il quadrato della metà di a'.",
            options: [
                "$(a/2)^2$",
                "$a^2 / 2$",
                "$a/2^2$"
            ],
            correct: 0
        },
        {
            question: "5. Come si chiama il numero che moltiplica la lettera (es. il 4 in $4x^2$)?",
            options: [
                "Esponente",
                "Coefficiente",
                "Invariante"
            ],
            correct: 1
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
            qTitle.innerHTML = q.question;
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
                        btn.style.background = "var(--physics-color)";
                        btn.style.borderColor = "var(--physics-color)";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        allBtns[q.correct].style.background = "var(--physics-color)";
                        allBtns[q.correct].style.borderColor = "var(--physics-color)";
                        allBtns[q.correct].style.color = "#fff";
                    }

                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. Parli l'algebrico come un nativo! 🖖`;
                            scoreEl.style.color = "var(--physics-color)";
                        } else {
                            scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. Ripassa la differenza tra somma di quadrati e quadrato di somma.`;
                            scoreEl.style.color = "#F59E0B";
                        }

                        // Reset button
                        const resetBtn = document.createElement('button');
                        resetBtn.textContent = "Ripeti Quiz 🔄";
                        resetBtn.className = "btn-check-sm"; // Reuse small button style but maybe make it bigger
                        resetBtn.style.padding = "1rem 2rem";
                        resetBtn.style.marginTop = "2rem";
                        resetBtn.style.display = "block";
                        resetBtn.style.background = "var(--math-color)";
                        resetBtn.onclick = generateQuiz;
                        scoreEl.appendChild(resetBtn);
                    }
                };

                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });

        // Re-run KaTeX for dynamic content
        if (window.renderMathInElement) {
            renderMathInElement(quizArea, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError : false
            });
        }
    }

    // Initialize
    generateQuiz();

});
