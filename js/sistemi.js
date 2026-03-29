// Substitution Steps
let currentSubStep = 0;
const subSteps = [
    {
        html: `
        <span class="sys-bracket">{</span>
        <div class="sys-eqs">
            <div>\\(x = 5 - y\\)</div>
            <div>\\(2x + y = 7\\)</div>
        </div>
        `,
        explanation: "Isoliamo la \\(x\\) nella prima equazione (già fatto!)"
    },
    {
        html: `
        <span class="sys-bracket">{</span>
        <div class="sys-eqs">
            <div>\\(x = 5 - y\\)</div>
            <div>\\(2(5 - y) + y = 7\\)</div>
        </div>
        `,
        explanation: "Sostituiamo \\(5 - y\\) al posto di \\(x\\) nella seconda equazione."
    },
    {
        html: `
        <span class="sys-bracket">{</span>
        <div class="sys-eqs">
            <div>\\(x = 5 - y\\)</div>
            <div>\\(10 - 2y + y = 7\\)</div>
        </div>
        `,
        explanation: "Risolviamo la seconda equazione: espandiamo i calcoli."
    },
    {
        html: `
        <span class="sys-bracket">{</span>
        <div class="sys-eqs">
            <div>\\(x = 5 - y\\)</div>
            <div>\\(-y = -3 \\Rightarrow y = 3\\)</div>
        </div>
        `,
        explanation: "Abbiamo trovato il valore di \\(y\\)!"
    },
    {
        html: `
        <span class="sys-bracket">{</span>
        <div class="sys-eqs">
            <div>\\(x = 5 - (3) = 2\\)</div>
            <div>\\(y = 3\\)</div>
        </div>
        `,
        explanation: "Infine, sostituiamo \\(y = 3\\) nella prima equazione per trovare \\(x\\)."
    }
];

function nextSubStep() {
    if (currentSubStep < subSteps.length - 1) {
        currentSubStep++;
        updateSubUI();
    }
}

function resetSub() {
    currentSubStep = 0;
    updateSubUI();
}

function updateSubUI() {
    const box = document.getElementById('sub-box-inner');
    const expl = document.getElementById('sub-explanation');
    box.innerHTML = subSteps[currentSubStep].html;
    expl.innerHTML = subSteps[currentSubStep].explanation;
    
    // Crucial: define delimiters for KaTeX
    const katexOptions = {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError : false
    };

    if (window.renderMathInElement) {
        renderMathInElement(box, katexOptions);
        renderMathInElement(expl, katexOptions);
    }
}

// Live Editor
function updateLivePreview() {
    const input = document.getElementById('latex-input').value;
    const preview = document.getElementById('latex-preview');
    preview.innerHTML = "\\[" + input + "\\]";
    if (window.renderMathInElement) {
        renderMathInElement(preview, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError : false
        });
    }
}

// Cramer Solver
function solveCramer() {
    const a = parseFloat(document.getElementById('c-a').value);
    const b = parseFloat(document.getElementById('c-b').value);
    const c = parseFloat(document.getElementById('c-c').value);
    const ap = parseFloat(document.getElementById('c-ap').value);
    const bp = parseFloat(document.getElementById('c-bp').value);
    const cp = parseFloat(document.getElementById('c-cp').value);

    const D = a * bp - ap * b;
    const Dx = c * bp - cp * b;
    const Dy = a * cp - ap * c;

    const resultBox = document.getElementById('cramer-result');

    if (D === 0) {
        if (Dx === 0 && Dy === 0) {
            resultBox.innerHTML = "Sistema Indeterminato (Infinite soluzioni!)";
            resultBox.style.color = "#3B82F6";
        } else {
            resultBox.innerHTML = "Sistema Impossibile (Nessuna soluzione!)";
            resultBox.style.color = "#EF4444";
        }
    } else {
        const x = Dx / D;
        const y = Dy / D;
        resultBox.innerHTML = `Soluzione unica: (x = ${x.toFixed(2)}, y = ${y.toFixed(2)})`;
        resultBox.style.color = "#10B981";
    }
}

// Quiz
const quizQuestions = [
    {
        q: "Quante soluzioni può avere un sistema lineare di primo grado?",
        options: ["Solo una", "Zero, una o infinite", "Due o tre", "Sette"],
        correct: 1
    },
    {
        q: "Cosa si intende per 'soluzione' di un sistema con x e y?",
        options: ["Solo il valore di x", "Una coppia (x,y) che funzioni in tutte le equazioni", "Un piano cartesiano", "Lo zero della funzione"],
        correct: 1
    },
    {
        q: "Se il determinante Principale (D) di Cramer è diverso da zero, il sistema è:",
        options: ["Impossibile", "Indeterminato", "Determinato", "Simmetrico"],
        correct: 2
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
            btn.textContent = optText;
            
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
                const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                allBtns.forEach(b => {
                    b.disabled = true;
                    b.style.cursor = "not-allowed";
                    b.style.opacity = "0.6";
                });
                
                btn.style.opacity = "1";
                if (optIndex === q.correct) {
                    btn.style.background = "#10B981";
                    btn.style.borderColor = "#10B981";
                    currentScore++;
                } else {
                    btn.style.background = "#EF4444";
                    btn.style.borderColor = "#EF4444";
                    allBtns[q.correct].style.background = "#10B981";
                    allBtns[q.correct].style.borderColor = "#10B981";
                    allBtns[q.correct].style.opacity = "1";
                }
                
                questionsAnswered++;
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
        message = `🏆 ECCELLENTE! Hai risposto correttamente a tutte le domande (${currentScore}/${quizQuestions.length}). Sei pronto per regnare su Pollenatrocchia!`;
        feedback.style.background = "rgba(139, 92, 246, 0.2)";
        feedback.style.borderColor = "var(--sys-color)";
    } else if (currentScore > 0) {
        message = `Ottimo lavoro! Hai risposto correttamente a ${currentScore} domande su ${quizQuestions.length}.`;
        feedback.style.background = "rgba(245, 158, 11, 0.2)";
        feedback.style.borderColor = "#F59E0B";
    } else {
        message = `Non arrenderti! Rivedi i concetti e riprova. (${currentScore}/${quizQuestions.length})`;
        feedback.style.background = "rgba(239, 68, 68, 0.2)";
        feedback.style.borderColor = "#EF4444";
    }
    
    feedback.innerHTML = `<div>${message}</div>`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Riprova il Quiz';
    resetBtn.className = 'btn-gen';
    resetBtn.style.marginTop = '1.5rem';
    resetBtn.style.background = 'var(--sys-color)';
    resetBtn.onclick = initQuiz;
    feedback.appendChild(resetBtn);
}

// Inequality Simulator
function showLine1() {
    const l1 = document.getElementById('line-1');
    l1.style.background = "#3B82F6";
    document.getElementById('ineq-feedback').textContent = "Punti che soddisfano x > 2";
}

function showLine2() {
    const l2 = document.getElementById('line-2');
    l2.style.background = "#10B981";
    document.getElementById('ineq-feedback').textContent = "Punti che soddisfano x < 6";
}

function showOverlap() {
    const overlap = document.getElementById('overlap-area');
    overlap.style.display = "block";
    document.getElementById('ineq-feedback').textContent = "Intervallo comune: 2 < x < 6";
}

window.onload = function () {
    initQuiz();
    updateSubUI();
    // Reset inequality lines
    document.getElementById('line-1').style.background = "rgba(59, 130, 246, 0.1)";
    document.getElementById('line-2').style.background = "rgba(16, 185, 129, 0.1)";
};
