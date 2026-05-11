/**
 * dimostrazioni.js
 * JS logic for the mathematical proof quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    const quizData = [
        {
            question: "1. Perché una dimostrazione matematica è diversa da un esperimento scientifico?",
            options: [
                "Perché è basata sulla logica deduttiva invece che sull'osservazione empirica.",
                "Perché in matematica non si usano mai i computer.",
                "Perché le dimostrazioni matematiche cambiano nel tempo."
            ],
            correct: 0
        },
        {
            question: "2. Com'è definita formalmente un numero dispari?",
            options: [
                "Un numero n multiplo di 3.",
                "Un numero n scrivibile come 2k + 1 (dove k è un intero).",
                "Un numero n che non si può dividere per zero."
            ],
            correct: 1
        },
        {
            question: "3. Cosa succede se sommiamo due numeri dispari?",
            options: [
                "Otteniamo sempre un numero dispari.",
                "Otteniamo sempre un numero pari (Pari = 2(n + m + 1)).",
                "Otteniamo un numero pari solo se i due dispari sono uguali."
            ],
            correct: 1
        },
        {
            question: "4. Qual è l'effetto di un numero pari in una moltiplicazione?",
            options: [
                "Basta un solo fattore pari affinché il prodotto sia pari.",
                "Se moltipichiamo un pari per un dispari, il risultato è dispari.",
                "Il prodotto di due pari è sempre dispari."
            ],
            correct: 0
        },
        {
            question: "5. Cosa dimostra che (2n)(2m+1) è un numero pari?",
            options: [
                "Il fatto che n ed m siano diversi.",
                "Il fatto che l'intera espressione può essere scritta come 2 * (n * (2m+1)).",
                "Il fatto che stiamo sommando invece di moltiplicare."
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
                            scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. Incredibile! Hai dimostrato di essere una mente rigorosa. 🎓`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio: ${currentScore}/${quizData.length}. La logica richiede precisione, rileggi le definizioni di n ed m. ✨`;
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
