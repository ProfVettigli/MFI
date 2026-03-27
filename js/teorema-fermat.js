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
                btn.className = "btn-gen";
                btn.style.textAlign = "left";
                btn.style.width = "100%";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.color = "white";

                btn.onclick = () => {
                    const allBtns = optsDiv.querySelectorAll('button');
                    allBtns.forEach(b => b.disabled = true);
                    
                    if (optIndex === q.correct) {
                        btn.style.background = "#8B5CF6";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        allBtns[q.correct].style.background = "#8B5CF6";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. ${currentScore === quizData.length ? 'Incredibile! Sei un vero matematico.' : 'Rileggi la storia di Wiles.'}`;
                        scoreEl.style.color = currentScore === quizData.length ? "#8B5CF6" : "#F59E0B";
                    }
                };
                optsDiv.appendChild(btn);
            });

            qDiv.appendChild(optsDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
