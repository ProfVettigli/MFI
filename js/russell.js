document.addEventListener('DOMContentLoaded', () => {
    // Paradox logic
    const btnSelf = document.getElementById('btn-shave-himself');
    const btnNot = document.getElementById('btn-not-shave');
    const feedback = document.getElementById('paradox-feedback');

    if (btnSelf && btnNot && feedback) {
        btnSelf.addEventListener('click', () => {
            feedback.style.color = "#EF4444";
            feedback.innerHTML = "<strong>ERROR!</strong> If he shaves himself, he violates the law that says he can ONLY shave men who do not shave themselves!";
        });

        btnNot.addEventListener('click', () => {
            feedback.style.color = "#EF4444";
            feedback.innerHTML = "<strong>ERROR!</strong> If he does NOT shave himself, he falls into the group of men who don't shave themselves. Therefore, according to the law, the barber MUST shave him. But he IS the barber!";
        });
    }

    // CLIL Quiz Data
    const quizData = [
        {
            question: "1. What mathematical subject did Russell describe as 'dazzling as first love' when he was 11?",
            options: [
                "Algebra",
                "Geometry",
                "Calculus"
            ],
            correct: 1
        },
        {
            question: "2. The monumental book 'Principia Mathematica' was co-authored by Bertrand Russell and...",
            options: [
                "Albert Einstein",
                "A. N. Whitehead",
                "Georg Cantor"
            ],
            correct: 1
        },
        {
            question: "3. Which prestigious award did Russell win in 1950?",
            options: [
                "The Fields Medal",
                "The Nobel Prize in Physics",
                "The Nobel Prize in Literature"
            ],
            correct: 2
        },
        {
            question: "4. The concept that all mathematics can be derived from logical principles is known as:",
            options: [
                "Logicism",
                "Relativity",
                "Nihilism"
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
                
                btn.onmouseenter = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
                btn.onmouseleave = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

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
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Excellent! You scored ${currentScore}/${quizData.length}. You mastered this CLIL lesson!`;
                            scoreEl.style.color = "var(--physics-color)";
                        } else {
                            scoreEl.textContent = `Final Score: ${currentScore}/${quizData.length}. Review the text and try again!`;
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
});
