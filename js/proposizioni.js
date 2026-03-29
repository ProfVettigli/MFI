/**
 * proposizioni.js
 * Gestisce l'interattività dei costruttori logici e delle tavole di verità.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Helper to toggle a V/F button
    function toggleTruthBtn(btn) {
        if (btn.classList.contains('t-true')) {
            btn.classList.remove('t-true');
            btn.classList.add('t-false');
            btn.textContent = 'F';
            return false;
        } else {
            btn.classList.remove('t-false');
            btn.classList.add('t-true');
            btn.textContent = 'V';
            return true;
        }
    }

    // Builder AND
    const builderAnd = document.getElementById('builder-and');
    if (builderAnd) {
        const btns = builderAnd.querySelectorAll('.truth-btn');
        let state = { p: true, q: true };
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prop = btn.getAttribute('data-prop');
                state[prop] = toggleTruthBtn(btn);
                
                const resultBox = document.getElementById('result-and');
                if (state.p && state.q) {
                    resultBox.textContent = "p ∧ q: VERO (Entrambe vere)";
                    resultBox.style.borderLeftColor = "var(--physics-color)";
                    resultBox.style.color = "var(--physics-color)";
                } else {
                    resultBox.textContent = "p ∧ q: FALSO (Serve che siano entrambe vere!)";
                    resultBox.style.borderLeftColor = "#EF4444";
                    resultBox.style.color = "#EF4444";
                }
            });
        });
    }

    // Builder OR
    const builderOr = document.getElementById('builder-or');
    if (builderOr) {
        const btns = builderOr.querySelectorAll('.truth-btn');
        let state = { p: false, q: true };
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prop = btn.getAttribute('data-prop');
                state[prop] = toggleTruthBtn(btn);
                
                const resultBox = document.getElementById('result-or');
                if (state.p || state.q) {
                    resultBox.textContent = "p ∨ q: VERO (Basta una sola affermazione vera per l'OR!)";
                    resultBox.style.borderLeftColor = "var(--physics-color)";
                    resultBox.style.color = "var(--physics-color)";
                } else {
                    resultBox.textContent = "p ∨ q: FALSO (Sono entrambe false...)";
                    resultBox.style.borderLeftColor = "#EF4444";
                    resultBox.style.color = "#EF4444";
                }
            });
        });
    }

    // Builder NOT
    const builderNot = document.getElementById('builder-not');
    if (builderNot) {
        const btn = builderNot.querySelector('.truth-btn');
        let stateP = true;
        
        btn.addEventListener('click', () => {
            stateP = toggleTruthBtn(btn);
            
            const resultBox = document.getElementById('result-not');
            if (!stateP) {
                // p is false, not p is true
                resultBox.textContent = "¬p: VERO (Hai ribaltato il falso in vero!)";
                resultBox.style.borderLeftColor = "var(--physics-color)";
                resultBox.style.color = "var(--physics-color)";
            } else {
                resultBox.textContent = "¬p: FALSO (I Jedi NON usano la spada laser)";
                resultBox.style.borderLeftColor = "#EF4444";
                resultBox.style.color = "#EF4444";
            }
        });
    }

    // Builder IMPLICATION
    const builderImpl = document.getElementById('builder-impl');
    if (builderImpl) {
        const btns = builderImpl.querySelectorAll('.truth-btn');
        let state = { p: true, q: true };
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prop = btn.getAttribute('data-prop');
                state[prop] = toggleTruthBtn(btn);
                
                const resultBox = document.getElementById('result-impl');
                // Implication is false ONLY when p=true and q=false
                if (state.p && !state.q) {
                    resultBox.innerHTML = "p → q: <strong>FALSO</strong> (Assurdo! Diventa biondo se è Goku SSJ!)";
                    resultBox.style.borderLeftColor = "#EF4444";
                    resultBox.style.color = "#EF4444";
                } else {
                    resultBox.innerHTML = "p → q: <strong>VERO</strong>";
                    resultBox.style.borderLeftColor = "var(--physics-color)";
                    resultBox.style.color = "var(--physics-color)";
                }
            });
        });
    }

    // TRUTH TABLES GUESSER
    const guessBtns = document.querySelectorAll('.t-guess');
    guessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // cycle: ? -> V -> F 
            const current = btn.textContent;
            let nextVal = 'V';
            if (current === 'V') nextVal = 'F';
            if (current === 'F') nextVal = 'V';
            
            btn.textContent = nextVal;
            
            // Check if correct
            const expected = btn.getAttribute('data-ans');
            if (nextVal === expected) {
                btn.classList.add('t-true');
                btn.classList.remove('t-false');
                btn.style.background = "var(--physics-color)";
                btn.style.borderColor = "var(--physics-color)";
            } else {
                btn.classList.add('t-false');
                btn.classList.remove('t-true');
                btn.style.background = "#EF4444";
                btn.style.borderColor = "#EF4444";
            }
        });
    });

    /* =========================================================
       QUIZ GENERATION (Propositions & Quantifiers)
       ========================================================= */
    const quizData = [
        {
            question: "1. Quale tra queste è una vera 'proposizione logica'?",
            options: [
                "Che ore sono?",
                "Pippo è un cane.",
                "Sbrigati a studiare!"
            ],
            correct: 1
        },
        {
            question: "2. Se p è VERO e q è FALSO, qual è il risultato dell'AND (p ∧ q)?",
            options: [
                "VERO",
                "FALSO",
                "Dipende"
            ],
            correct: 1
        },
        {
            question: "3. Quale quantificatore useresti per dire 'Tutti i gatti miagolano'?",
            options: [
                "∃ (Esiste)",
                "∄ (Non esiste)",
                "∀ (Per ogni)"
            ],
            correct: 2
        },
        {
            question: "4. L'operatore Logico OR (Disgiunzione) risulta FALSO solo quando:",
            options: [
                "Entrambe le proposizioni sono false",
                "Almeno una proposizione è falsa",
                "Entrambe le proposizioni sono vere"
            ],
            correct: 0
        },
        {
            question: "5. Cosa significa il simbolo '∃!' in logica matematica?",
            options: [
                "Esistono molti elementi che soddisfano la condizione",
                "Esiste uno e un solo elemento che soddisfa la condizione",
                "Attenzione, pericolo imminente"
            ],
            correct: 1
        },
        {
            question: "6. L'insieme di tutti i valori dell'incognita che rendono vera una proposizione aperta si chiama:",
            options: [
                "Insieme di Falsità",
                "Insieme di Verità",
                "Universo Parallelo"
            ],
            correct: 1
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
                    const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
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
                        let summary = "";
                        if (currentScore === quizData.length) {
                            summary = `COMPLIMENTI! Punteggio pieno (${currentScore}/${quizData.length}). Sei un vero maestro Jedi della Logica!`;
                            scoreEl.style.color = "var(--physics-color)";
                        } else {
                            summary = `Punteggio finale: ${currentScore}/${quizData.length}. Fai di nuovo un tentativo per diventare un maestro!`;
                            scoreEl.style.color = "#F59E0B";
                        }
                        
                        scoreEl.innerHTML = `<div>${summary}</div>`;
                        
                        // Add reset button
                        const resetBtn = document.createElement('button');
                        resetBtn.textContent = 'Riprova il Quiz';
                        resetBtn.className = 'btn-gen';
                        resetBtn.style.marginTop = '1.5rem';
                        resetBtn.style.background = 'var(--math-color)';
                        resetBtn.onclick = renderQuiz;
                        scoreEl.appendChild(resetBtn);
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
