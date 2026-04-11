/**
 * strutture-algebriche.js - MFI Algebra
 * Logica del quiz di riepilogo in stile lista.
 */

document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            question: "1. Da dove deriva il termine 'al-jabr', base della parola Algebra?",
            options: [
                "Dalla lingua araba, col significato di 'restaurazione'.",
                "Dal greco antico, che significa 'lettera'.",
                "Dall'egizio, che significa 'campo fertile'."
            ],
            correct: 0,
            feedback: "Corretto! Si riferiva al riportare un termine negativo in positivo spostandolo di membro."
        },
        {
            question: "2. Cosa significa che un insieme è 'Chiuso' rispetto alla somma?",
            options: [
                "Che la somma è limitata a numeri piccolissimi.",
                "Che sommando due elementi dell'insieme, il risultato è ancora nell'insieme.",
                "Che l'insieme non ammette la somma come operazione."
            ],
            correct: 1,
            feedback: "Ottimo! La chiusura è il requisito base per definire un'operazione interna."
        },
        {
            question: "3. Quale di questi insiemi NON è chiuso rispetto alla sottrazione?",
            options: [
                "Gli Interi (ℤ)",
                "I Reali (ℝ)",
                "I Naturali (ℕ)"
            ],
            correct: 2,
            feedback: "Esatto! 2 - 5 = -3, e -3 non è un numero naturale."
        },
        {
            question: "4. Qual è la proprietà che definisce l'Elemento Neutro della somma?",
            options: [
                "a + 0 = a",
                "a + (-a) = 0",
                "a × 1 = a"
            ],
            correct: 0,
            feedback: "Giusto! Lo zero 'non muta' l'elemento a cui viene sommato."
        },
        {
            question: "5. Cosa differenzia un Anello da un Semianello?",
            options: [
                "L'Anello non ha lo zero.",
                "Nell'Anello esiste l'elemento opposto (-a), permettendo la sottrazione.",
                "Il Semianello ha solo numeri interi."
            ],
            correct: 1,
            feedback: "Proprio così! L'anello introduce la possibilità di tornare sempre 'indietro' tramite l'opposto."
        },
        {
            question: "6. Quale struttura permette sempre la divisione (tranne per lo zero)?",
            options: [
                "L'Anello",
                "Il Semianello",
                "Il Campo"
            ],
            correct: 2,
            feedback: "Esatto! Il Campo garantisce l'esistenza dell'inverso moltiplicativo (a⁻¹)."
        },
        {
            question: "7. Cos'è la Distributività nel Semianello?",
            options: [
                "Cambiando l'ordine degli addendi la somma non cambia.",
                "Il prodotto si applica a ogni termine di una somma: a(b+c) = ab + ac.",
                "La capacità di sommare tre numeri in qualsiasi ordine."
            ],
            correct: 1,
            feedback: "Corretto! È la proprietà che 'lega' le due operazioni della struttura."
        },
        {
            question: "8. Cosa caratterizza la 'Linearità' negli spazi vettoriali?",
            options: [
                "L'additività e l'omogeneità delle operazioni.",
                "La presenza di solo linee rette.",
                "Il fatto che i vettori siano tutti della stessa dimensione."
            ],
            correct: 0,
            feedback: "Bravissimo! Queste due proprietà garantiscono la coerenza del sistema."
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const scoreEl = document.getElementById('quiz-score');
    let questionsAnswered = 0;
    let score = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = "2.5rem";
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.fontSize = "1.2rem";
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        btn.innerHTML += ` <span style="margin-left: 0.5rem;">✅ ${q.feedback}</span>`;
                        
                        // Disable other buttons for this question
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'default';
                        });

                        // Check score
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) score++;
                        
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            showFinalScore();
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.style.opacity = "0.7";
                    }
                };
                
                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showFinalScore() {
        if (score === quizData.length) {
            scoreEl.textContent = `PERFETTO! ${score}/${quizData.length}. Sei un maestro delle strutture algebriche!`;
            scoreEl.style.color = "var(--physics-color)";
        } else {
            scoreEl.textContent = `COMPLETATO! Hai risposto correttamente a ${score} domande su ${quizData.length} al primo colpo. Ottimo lavoro!`;
            scoreEl.style.color = "#F59E0B";
        }
    }
});
