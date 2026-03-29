/**
 * clil-gauss.js
 * Interactive logic for the Gauss life & sum calculation page.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. INTERACTIVE SUMMATION SLIDER
       ========================================================= */
    const slider = document.getElementById('gauss-range');
    const displayN = document.getElementById('gauss-n-display');
    const displayRes = document.getElementById('gauss-res');
    const displayExplain = document.getElementById('gauss-pairs-explain');

    if (slider) {
        slider.oninput = function () {
            const n = parseInt(this.value);
            const sum = (n * (n + 1)) / 2;
            const pairs = n / 2;
            const pairSum = n + 1;

            displayN.innerHTML = `n = ${n}`;
            displayRes.innerHTML = sum.toLocaleString();
            displayExplain.innerHTML = `Calculation: (${n} * ${n + 1}) / 2 = ${n / 2} pairs of ${n + 1}.`;
        };
        // Initial trigger
        slider.oninput();
    }

    /* =========================================================
       2. QUIZ GENERATION (CLIL)
       ========================================================= */
    const quizData = [
        {
            question: "1. What does 'Princeps Mathematicorum' mean in Latin?",
            options: [
                "The King of Mathematicians.",
                "The Prince of Mathematicians.",
                "The First Mathematician."
            ],
            correct: 1
        },
        {
            question: "2. How old was Gauss when he found the error in his father's bookkeeping?",
            options: [
                "Only 3 years old.",
                "7 years old.",
                "15 years old."
            ],
            correct: 0
        },
        {
            question: "3. What is the sum of all numbers from 1 to 100?",
            options: [
                "1000",
                "101",
                "5050"
            ],
            correct: 2
        },
        {
            question: "4. What is the formula for the sum of the first 'n' natural numbers?",
            options: [
                "n * (n + 1) / 2",
                "n² + 1 / 2",
                "n * (n - 1) / 2"
            ],
            correct: 0
        },
        {
            question: "5. Deep philosophical question: Is Chuck Norris stronger or is Gauss smarter?",
            options: [
                "Chuck Norris is stronger (He divided by zero).",
                "Gauss is smarter (He doesn't need to prove his theorems).",
            ],
            correct: -1 // Both (all) are considered wrong according to the paradox!
        }
    ];
    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let currentScore = 0;
    let questionsAnswered = 0;

    function generateQuiz() {
        if (!quizArea) return;

        // Reset state
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
            qTitle.style.fontWeight = "600";
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.display = "flex";
            optionsDiv.style.flexDirection = "column";
            optionsDiv.style.gap = "0.8rem";

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.innerHTML = optText; // Use innerHTML to allow KaTeX symbols

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
                        if (q.correct !== -1 && allBtns[q.correct]) {
                            allBtns[q.correct].style.background = "var(--math-color)";
                            allBtns[q.correct].style.borderColor = "var(--math-color)";
                            allBtns[q.correct].style.color = "#fff";
                        }
                    }

                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Score: ${currentScore}/${quizData.length}. You are a mini-Gauss! 👑`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Score: ${currentScore}/${quizData.length}. Try reading Gauss's "Princeps" method again. 📜`;
                            scoreEl.style.color = "#F59E0B";
                        }

                        // Add RESET button
                        const resetBtn = document.createElement('button');
                        resetBtn.textContent = "Restart Quiz 🔄";
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

        // Re-run KaTeX for the newly created elements
        if (window.renderMathInElement) {
            renderMathInElement(quizArea, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false
            });
        }
    }

    // Initialize
    generateQuiz();

});
