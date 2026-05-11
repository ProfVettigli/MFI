// Interactions for Operazioni con i Naturali

// 1. Closure Check
function checkClosure() {
    const a = parseInt(document.getElementById('num-a').value);
    const b = parseInt(document.getElementById('num-b').value);
    const op = document.getElementById('op-select').value;
    const res = eval(`${a} ${op} ${b}`); // OK for simple ops in this sandbox
    const resultBox = document.getElementById('closure-result');

    const isNatural = Number.isInteger(res) && res >= 0;
    
    resultBox.innerHTML = `
        <p style="font-size: 1.5rem; color: #fff;">${a} ${op === '*' ? '&times;' : op} ${b} = ${res}</p>
        <p style="color: ${isNatural ? '#10B981' : '#EF4444'}; font-weight: 800;">
            ${isNatural ? 'L\'Insieme dei Naturali è CHIUSO rispetto a questo calcolo! ✅' : 'ATTENZIONE: Il risultato non è Naturale! 🚨 L\'Insieme NON è chiuso per questa operazione.' }
        </p>
    `;
    
    resultBox.style.background = isNatural ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
    resultBox.style.borderColor = isNatural ? "#10B981" : "#EF4444";
}

// 2. Commutative Property Simulation
let currentCommA = 3;
let currentCommB = 5;
let isCommSwapped = false;

function renderCommutative() {
    const container = document.getElementById('ball-box');
    const text = document.getElementById('comm-text');
    container.innerHTML = '';
    
    const a = isCommSwapped ? currentCommB : currentCommA;
    const b = isCommSwapped ? currentCommA : currentCommB;
    
    // Render group A
    for(let i=0; i<a; i++) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.background = isCommSwapped ? '#60A5FA' : '#3B82F6';
        container.appendChild(ball);
    }
    
    const op = document.createElement('span');
    op.className = 'op-anim';
    op.textContent = '+';
    container.appendChild(op);
    
    // Render group B
    for(let i=0; i<b; i++) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.background = isCommSwapped ? '#3B82F6' : '#60A5FA';
        container.appendChild(ball);
    }
    
    text.textContent = `${a} + ${b} = ${a + b}`;
}

function swapCommutative() {
    isCommSwapped = !isCommSwapped;
    renderCommutative();
}

// 3. Distributive Area Simulation
function renderDistributive() {
    const a = 3;
    const b = 4;
    const c = 5;
    const rect = document.getElementById('dist-rect');
    rect.style.gridTemplateColumns = `repeat(${b+c}, 25px)`;
    rect.innerHTML = '';
    
    for(let i=0; i<a; i++) {
        for(let j=0; j<b; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell a';
            rect.appendChild(cell);
        }
        for(let j=0; j<c; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell b';
            rect.appendChild(cell);
        }
    }
    document.getElementById('dist-text').textContent = `${a} × (${b} + ${c}) = ${a} × ${b+c} = ${a * (b+c)}`;
    document.getElementById('dist-split-text').textContent = `(${a} × ${b}) + (${a} × ${c}) = ${a*b} + ${a*c} = ${a * (b+c)}`;
}

// 4. Quiz
const quizQuestions = [
    {
        q: "L'insieme N è chiuso rispetto a quale operazione?",
        options: ["Sottrazione", "Moltiplicazione", "Divisione", "Estrazione di radice"],
        correct: 1
    },
    {
        q: "Qual è l'elemento neutro della moltiplicazione?",
        options: ["0", "1", "-1", "L'infinito"],
        correct: 1
    },
    {
        q: "La proprietà commutativa dice che:",
        options: ["Se moltiplico per 0 tutto si annulla", "L'ordine dei termini non cambia il risultato", "Posso raggruppare i termini come voglio", "Prima si fanno le parentesi"],
        correct: 1
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
    const feedback = document.getElementById('quiz-feedback');
    if (feedback) {
        feedback.style.display = "none";
        feedback.textContent = "";
    }

    quizQuestions.forEach((q, qIndex) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.style.marginBottom = "2rem";
        qDiv.style.background = "rgba(255,255,255,0.02)";
        qDiv.style.padding = "1.5rem";
        qDiv.style.borderRadius = "10px";
        
        const qTitle = document.createElement('p');
        qTitle.innerHTML = `<strong>${qIndex + 1}. ${q.q}</strong>`;
        qTitle.style.marginBottom = "1rem";
        qDiv.appendChild(qTitle);

        const optionsDiv = document.createElement('div');
        optionsDiv.style.display = "flex";
        optionsDiv.style.flexDirection = "column";
        optionsDiv.style.gap = "0.5rem";

        q.options.forEach((optText, optIndex) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.textContent = optText;
            
            btn.style.background = "rgba(255,255,255,0.05)";
            btn.style.border = "1px solid rgba(255,255,255,0.1)";
            btn.style.color = "#fff";
            btn.style.padding = "0.8rem";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
            btn.style.textAlign = "left";
            btn.style.transition = "all 0.2s";
            
            btn.onmouseenter = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
            btn.onmouseleave = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

            btn.onclick = () => {
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                
                if (optIndex === q.correct) {
                    btn.style.background = "#10B981";
                    btn.style.borderColor = "#10B981";
                    btn.classList.add('correct');
                    
                    const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                    allBtns.forEach(b => {
                        b.disabled = true;
                        b.style.cursor = "not-allowed";
                        if (!b.classList.contains('correct')) b.style.opacity = "0.6";
                    });

                    // Punto solo se primo tentativo
                    const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                    if (!alreadyWrong) {
                        currentScore++;
                    }
                } else {
                    btn.style.background = "#EF4444";
                    btn.style.borderColor = "#EF4444";
                    btn.classList.add('wrong');
                    btn.innerHTML += " <strong>✗ Riprova!</strong>";
                    btn.disabled = true;
                    btn.style.opacity = "0.7";
                }
                
                // Controlliamo se la domanda è stata "risolta" (cioè cliccata quella giusta)
                const hasCorrect = optionsDiv.querySelector('.correct');
                if (hasCorrect && !btn.dataset.counted) {
                    questionsAnswered++;
                    btn.dataset.counted = "true"; // Evitiamo doppi conteggi se si clicca di nuovo (anche se i bottoni saranno disabilitati)
                }

                if (questionsAnswered === quizQuestions.length) {
                    showFinalFeedback();
                }
            };
            
            optionsDiv.appendChild(btn);
        });

        qDiv.appendChild(optionsDiv);
        area.appendChild(qDiv);
    });
}

function showFinalFeedback() {
    const feedback = document.getElementById('quiz-feedback');
    feedback.style.display = "block";
    let message = "";
    
    if (currentScore === quizQuestions.length) {
        message = `ECCELLENTE! Hai risposto correttamente a tutte le domande (${currentScore}/${quizQuestions.length}). Hai dominato le basi dell'aritmetica naturale!`;
        feedback.style.background = "rgba(16, 185, 129, 0.2)";
        feedback.style.borderColor = "#10B981";
    } else {
        message = `Fine quiz: ${currentScore}/${quizQuestions.length}. Rivedi le proprietà e prova di nuovo!`;
        feedback.style.background = "rgba(245, 158, 11, 0.2)";
        feedback.style.borderColor = "#F59E0B";
    }
    
    feedback.innerHTML = `<div>${message}</div>`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Riprova il Quiz';
    resetBtn.className = 'btn-gen';
    resetBtn.style.marginTop = '1.5rem';
    resetBtn.style.background = 'var(--nat-color)';
    resetBtn.onclick = initQuiz;
    feedback.appendChild(resetBtn);
}


window.onload = function() {
    renderCommutative();
    renderDistributive();
    initQuiz();
};
