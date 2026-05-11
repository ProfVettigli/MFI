const quizQuestions = [
    {
        q: "Qual è la forma ridotta ai minimi termini della frazione \\( \\frac{24}{36} \\)?",
        options: [
            "\\( \\frac{12}{18} \\)",
            "\\( \\frac{4}{6} \\)",
            "\\( \\frac{2}{3} \\)",
            "\\( \\frac{6}{9} \\)"
        ],
        correct: 2,
        explanation: "Dividendo il 24 e il 36 per il loro M.C.D. (12), si ottiene proprio 2/3!"
    },
    {
        q: "Per calcolare la somma \\( \\frac{1}{4} + \\frac{1}{6} \\), qual è il minimo comune multiplo (m.c.m.) da usare al denominatore?",
        options: [
            "24",
            "10",
            "12",
            "2"
        ],
        correct: 2,
        explanation: "Il m.c.m. tra 4 e 6 è 12. Moltiplicare i denominatori darebbe 24, che non è il minimo."
    },
    {
        q: "Qual è il procedimento corretto per calcolare la divisione \\( \\frac{2}{5} \\div \\frac{3}{7} \\)?",
        options: [
            "Moltiplicare in orizzontale ottenere 6/35.",
            "Capovolgere la seconda frazione e moltiplicare: \\( \\frac{2}{5} \\cdot \\frac{7}{3} = \\frac{14}{15} \\)",
            "Calcolare l'm.c.m. tra 5 e 7 e sottrarre i numeratori.",
            "La divisione tra frazioni è impossibile nel campo dei razionali."
        ],
        correct: 1,
        explanation: "Dividere per una frazione equivale a moltiplicare per il suo reciproco."
    },
    {
        q: "In musica, la Terzina (raggruppamento anomalo di 3 note) a cosa corrisponde matematicamente?",
        options: [
            "A un tempo pari e regolare diviso per 2.",
            "A un tempo diviso esattamente in un intervallo non-lineare di 3, forzando la griglia standard.",
            "Un intervallo per cui le frequenze raddoppiano come 3/2.",
            "Un blocco ritmico in cui non esistono frazioni."
        ],
        correct: 1,
        explanation: "La terzina costringe l'uso del 3 temporale dove normalmente la notazione occidentale è divisa per 2/4/8."
    }
];

let currentScore = 0;
let questionsAnswered = 0;

function initQuiz() {
    const area = document.getElementById('quiz-area');
    if (!area) return;
    area.innerHTML = '';
    currentScore = 0;
    questionsAnswered = 0;
    const feedback = document.getElementById('quiz-score');
    if (feedback) {
        feedback.style.display = "none";
        feedback.textContent = "";
        feedback.innerHTML = "";
    }

    quizQuestions.forEach((q, qIndex) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.style.marginBottom = "2.5rem";
        qDiv.style.background = "rgba(255,255,255,0.02)";
        qDiv.style.padding = "1.5rem";
        qDiv.style.borderRadius = "12px";
        qDiv.style.border = "1px solid rgba(255,255,255,0.05)";
        
        const qTitle = document.createElement('p');
        qTitle.innerHTML = `<strong>${qIndex + 1}. ${q.q}</strong>`;
        qTitle.style.marginBottom = "1.2rem";
        qDiv.appendChild(qTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.style.display = "flex";
        optionsDiv.style.flexDirection = "column";
        optionsDiv.style.gap = "0.8rem";

        q.options.forEach((optText, optIndex) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.innerHTML = optText; // changed to innerHTML to trigger MathJax
            
            // Initial styling
            btn.style.background = "rgba(255,255,255,0.05)";
            btn.style.border = "1px solid rgba(255,255,255,0.1)";
            btn.style.color = "#fff";
            btn.style.padding = "1rem";
            btn.style.borderRadius = "8px";
            btn.style.cursor = "pointer";
            btn.style.textAlign = "left";
            btn.style.fontSize = "1rem";
            btn.style.fontFamily = "inherit";
            btn.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
            
            btn.onmouseenter = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
            btn.onmouseleave = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

            btn.onclick = () => {
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                
                if (optIndex === q.correct) {
                    btn.classList.add('correct');
                    btn.style.background = "#10B981";
                    btn.style.borderColor = "#10B981";
                    btn.innerHTML += ` <br><span style="display:block; margin-top:8px; font-size:0.9rem; color:#fff;">✓ Esatto! ${q.explanation}</span>`;
                    
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
                    if (questionsAnswered === quizQuestions.length) {
                        showFinalFeedback();
                    }
                } else {
                    btn.classList.add('wrong');
                    btn.style.background = "#EF4444";
                    btn.style.borderColor = "#EF4444";
                    btn.innerHTML += " <strong style='float:right;'>✗ Riprova!</strong>";
                    btn.disabled = true;
                    btn.style.opacity = "0.7";
                }
            };
            
            optionsDiv.appendChild(btn);
        });

        qDiv.appendChild(optionsDiv);
        area.appendChild(qDiv);
    });

    if (window.MathJax) {
        window.MathJax.typesetPromise();
    }
}

function showFinalFeedback() {
    const feedback = document.getElementById('quiz-score');
    feedback.style.display = "block";
    feedback.style.padding = "1.5rem";
    feedback.style.borderRadius = "8px";
    feedback.style.marginTop = "2rem";
    
    let message = "";
    
    if (currentScore === quizQuestions.length) {
        message = `🏆 ECCELLENTE! Hai risposto correttamente al primo colpo a tutte le domande (${currentScore}/${quizQuestions.length}).`;
        feedback.style.background = "rgba(16, 185, 129, 0.2)";
        feedback.style.border = "1px solid #10B981";
        feedback.style.color = "#10B981";
    } else if (currentScore > 0) {
        message = `Ottimo lavoro! Hai risposto correttamente a ${currentScore} domande su ${quizQuestions.length} al primo tentativo.`;
        feedback.style.background = "rgba(245, 158, 11, 0.2)";
        feedback.style.border = "1px solid #F59E0B";
        feedback.style.color = "#F59E0B";
    } else {
        message = `Non arrenderti! Rivedi le regole sulle frazioni e riprova. (${currentScore}/${quizQuestions.length})`;
        feedback.style.background = "rgba(239, 68, 68, 0.2)";
        feedback.style.border = "1px solid #EF4444";
        feedback.style.color = "#EF4444";
    }
    
    feedback.innerHTML = `<div>${message}</div>`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Riprova il Quiz';
    resetBtn.className = 'btn-gen';
    resetBtn.style.marginTop = '1.5rem';
    resetBtn.style.background = '#10B981'; // Green for fractions/math
    resetBtn.onclick = initQuiz;
    feedback.appendChild(resetBtn);
}

// Intercept window onload or execute now
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
