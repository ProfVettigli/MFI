/**
 * prodotti-notevoli.js
 * Interactive logic for Special Products (Prodotti Notevoli).
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. SOMMA PER DIFFERENZA: PROVA TU
       ========================================================= */
    const btnCheckSxp = document.getElementById('btn-check-sxp');
    const inputSxp = document.getElementById('input-sxp');
    const feedbackSxp = document.getElementById('feedback-sxp');

    if (btnCheckSxp) {
        btnCheckSxp.addEventListener('click', () => {
            const ans = inputSxp.value.trim().replace(/\s/g, '').toLowerCase();
            const correct = "9x^2-4";
            
            if (ans === correct || ans === "9x²-4") {
                feedbackSxp.textContent = "Corretto! $(3x)^2 - (2)^2 = 9x^2 - 4$.";
                feedbackSxp.style.color = "var(--math-color)";
            } else if (!ans) {
                feedbackSxp.textContent = "Inserisci una risposta prima di verificare!";
                feedbackSxp.style.color = "#F59E0B";
            } else {
                feedbackSxp.textContent = "Non proprio. Ricorda: quadrato del primo meno quadrato del secondo.";
                feedbackSxp.style.color = "#EF4444";
            }
        });
    }

    /* =========================================================
       2. QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Qual è il risultato di $(a + b)(a - b)$?",
            options: [
                "$a^2 + b^2$",
                "$a^2 - b^2$",
                "$a^2 - 2ab + b^2$"
            ],
            correct: 1
        },
        {
            question: "2. Cosa manca in questa formula: $(x + y)^2 = x^2 + ... + y^2$?",
            options: [
                "$xy$",
                "$2xy$",
                "$x + y$"
            ],
            correct: 1
        },
        {
            question: "3. Quanto fa $(2x + 1)^2$?",
            options: [
                "$4x^2 + 1$",
                "$4x^2 + 4x + 1$",
                "$2x^2 + 2x + 1$"
            ],
            correct: 1
        },
        {
            question: "4. Geometricamente, il quadrato di un binomio $(a+b)^2$ rappresenta:",
            options: [
                "L'area di un quadrato di lato $a+b$.",
                "Il perimetro di un rettangolo.",
                "L'area di un cubo."
            ],
            correct: 0
        },
        {
            question: "5. Qual è la formula del cubo di un binomio $(a+b)^3$?",
            options: [
                "$a^3 + b^3$",
                "$a^3 + 3a^2b + 3ab^2 + b^3$",
                "$a^3 + a^2b + ab^2 + b^3$"
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
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. Sei un maestro delle scorciatoie algebriche! ⚡`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. Riguarda la parte sul doppio prodotto e la somma per differenza.`;
                            scoreEl.style.color = "#F59E0B";
                        }

                        // Reset button
                        const resetBtn = document.createElement('button');
                        resetBtn.textContent = "Riprova il Test 🔄";
                        resetBtn.className = "btn-check"; // Reuse styled button
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
