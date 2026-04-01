/**
 * teorema-fermat.js
 */

document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        {
            question: "1. Per quale valore di 'n' esistono infinite soluzioni intere?",
            options: [
                "n = 2 (Teorema di Pitagora)",
                "n = 3",
                "Per tutti i numeri pari"
            ],
            correct: 0
        },
        {
            question: "2. Chi ha finalmente dimostrato il teorema nel 1994?",
            options: [
                "Pierre de Fermat",
                "Andrew Wiles",
                "Isaac Newton"
            ],
            correct: 1
        },
        {
            question: "3. Cosa rappresenta il 'falso controesempio' dei Simpson?",
            options: [
                "Una prova che Fermat aveva torto.",
                "Un trucco matematico che sembra corretto solo per limiti di precisione delle calcolatrici.",
                "La scomposizione di un numero primo."
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.style.marginBottom = "2rem";
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = "1rem";
            qTitle.style.fontSize = "1.1rem";
            qDiv.appendChild(qTitle);

            const optsDiv = document.createElement('div');
            optsDiv.style.display = "flex";
            optsDiv.style.flexDirection = "column";
            optsDiv.style.gap = "0.5rem";

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
                    const allBtns = optsDiv.querySelectorAll('button');
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
                        scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. ${currentScore === quizData.length ? 'Incredibile! Sei un vero matematico.' : 'Rileggi la storia di Wiles.'}`;
                        scoreEl.style.color = currentScore === quizData.length ? "var(--math-color)" : "#F59E0B";
                    }
                };
                optsDiv.appendChild(btn);
            });

            qDiv.appendChild(optsDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
