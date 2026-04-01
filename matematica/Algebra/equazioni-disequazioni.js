/**
 * equazioni-disequazioni.js
 * Quiz and logic for equations lesson.
 */

document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        {
            question: "1. Una proposizione aperta che contiene un'uguaglianza si chiama:",
            options: [
                "Espressione",
                "Equazione",
                "Identità"
            ],
            correct: 1
        },
        {
            question: "2. Cosa significa 'risolvere' un'equazione?",
            options: [
                "Semplificarla il più possibile",
                "Trovare l'Insieme di Verità",
                "Calcolare il valore della parte letterale"
            ],
            correct: 1
        },
        {
            question: "3. Se sommo 10 a entrambi i membri di un'equazione:",
            options: [
                "L'equazione cambia e diventa falsa",
                "L'equazione resta equivalente (in equilibrio)",
                "Il risultato raddoppia"
            ],
            correct: 1
        },
        {
            question: "4. Nelle disequazioni, quando moltiplico per -2 ambo i membri cosa devo fare?",
            options: [
                "Nulla, restano i segni uguali",
                "Devo invertire il verso (es. da > a <)",
                "Devo cambiare il segno solo al primo membro"
            ],
            correct: 1
        },
        {
            question: "5. \(x + 10 = 2\). Quanto vale \(x\)?",
            options: [
                "12",
                "8",
                "-8"
            ],
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
                btn.className = 'quiz-btn';
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
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    
                    if (optIndex === q.correct) {
                        btn.style.background = "var(--physics-color)";
                        btn.style.borderColor = "var(--physics-color)";
                        btn.style.color = "#fff";
                        btn.classList.add('correct');

                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = "not-allowed";
                            if (!b.classList.contains('correct')) b.style.opacity = "0.6";
                        });

                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) {
                            currentScore++;
                        }
                        
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            let summary = "";
                            if (currentScore === quizData.length) {
                                summary = `ECCELLENTE! (${currentScore}/${quizData.length}). Hai dominato l'equilibrio algebrico!`;
                                scoreEl.style.color = "var(--physics-color)";
                            } else {
                                summary = `Fine quiz: ${currentScore}/${quizData.length}. Ottimo lavoro nel completare tutte le sfide!`;
                                scoreEl.style.color = "#F59E0B";
                            }
                            
                            scoreEl.innerHTML = `<div>${summary}</div>`;
                            
                            // Reset button
                            const resetBtn = document.createElement('button');
                            resetBtn.textContent = 'Riprova il Quiz';
                            resetBtn.className = 'btn-gen';
                            resetBtn.style.marginTop = '1.5rem';
                            resetBtn.style.background = 'var(--math-color)';
                            resetBtn.onclick = renderQuiz;
                            scoreEl.appendChild(resetBtn);
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.disabled = true;
                        btn.style.opacity = "0.7";
                    }
                };
                
                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    renderQuiz();
});
