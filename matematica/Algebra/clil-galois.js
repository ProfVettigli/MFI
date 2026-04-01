// Interactive Duel Simulation
let timerCount = 10;
let duelActive = false;
let currentProblem = null;

const duelProblems = [
    { q: "x - 5 = 12", a: 17, options: [13, 17, 7, 22] },
    { q: "2x + 4 = 10", a: 3, options: [2, 3, 4, 7] },
    { q: "x^2 - 4 = 0 (x > 0)", a: 2, options: [0, 2, 4, -2] },
    { q: "x/3 = 7", a: 21, options: [10, 21, 14, 28] }
];

function startDuel() {
    if (duelActive) return;
    duelActive = true;
    timerCount = 10;
    const btn = document.getElementById('start-duel-btn');
    btn.style.display = 'none';

    currentProblem = duelProblems[Math.floor(Math.random() * duelProblems.length)];
    document.getElementById('duel-problem').textContent = currentProblem.q;
    
    // Render options
    const optDiv = document.getElementById('duel-options');
    optDiv.innerHTML = '';
    currentProblem.options.forEach(opt => {
        const oBtn = document.createElement('button');
        oBtn.className = 'btn-op';
        oBtn.textContent = opt;
        oBtn.onclick = () => checkDuelAnswer(opt);
        optDiv.appendChild(oBtn);
    });

    const timerInterval = setInterval(() => {
        timerCount--;
        document.getElementById('duel-timer').textContent = `Time left: ${timerCount}s`;
        if (timerCount <= 0) {
            clearInterval(timerInterval);
            if (duelActive) endDuel(false);
        }
        if (!duelActive) clearInterval(timerInterval);
    }, 1000);
}

function checkDuelAnswer(val) {
    if (!duelActive) return;
    if (val === currentProblem.a) {
        endDuel(true);
    } else {
        endDuel(false);
    }
}

function endDuel(win) {
    duelActive = false;
    const feedback = document.getElementById('duel-problem');
    const timer = document.getElementById('duel-timer');
    const optDiv = document.getElementById('duel-options');
    const startBtn = document.getElementById('start-duel-btn');

    if (win) {
        feedback.textContent = "🏆 Victory! You won the honor! 🏆";
        feedback.style.color = "#10B981";
    } else {
        feedback.textContent = "💀 Defeated! The honor is lost. 💀";
        feedback.style.color = "#EF4444";
    }
    
    timer.textContent = "Duel Over.";
    optDiv.innerHTML = '';
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Challenge Again';
}

// Assessment Quiz (CLIL)
const quizData = [
    {
        q: "What age did Évariste Galois reach before he died?",
        options: ["30 years old", "20 years old", "40 years old", "18 years old"],
        correct: 1
    },
    {
        q: "How did mathematicians compete for honor and jobs centuries ago?",
        options: ["Through boxing matches", "Through mathematical duels and cartelli", "Through online forums", "They didn't compete at all"],
        correct: 1
    },
    {
        q: "What did Galois help discover?",
        options: ["Calculus", "Group Theory and insolvability of polynomials", "Pythagorean Theorem", "Differential equations"],
        correct: 1
    },
    {
        q: "What was the tragic cause of Galois's death?",
        options: ["Dying from old age", "Dying in a pistol duel over honor/love", "A shipwreck", "A flu outbreak"],
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

    quizData.forEach((q, qIndex) => {
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
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                
                if (optIndex === q.correct) {
                    btn.classList.add('correct');
                    btn.style.background = "#10B981";
                    btn.style.borderColor = "#10B981";
                    
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
                        showFinalFeedback();
                    }
                } else {
                    btn.classList.add('wrong');
                    btn.style.background = "#EF4444";
                    btn.style.borderColor = "#EF4444";
                    btn.innerHTML += " <strong>✗ Try again!</strong>";
                    btn.disabled = true;
                    btn.style.opacity = "0.7";
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
    
    if (currentScore === quizData.length) {
        message = "🏆 EXCELLENT! You are a master of Mathematical History!";
        feedback.style.background = "rgba(16, 185, 129, 0.2)";
        feedback.style.borderColor = "#10B981";
    } else {
        message = `Good effort! You answered ${currentScore} out of ${quizData.length} correctly.`;
        feedback.style.background = "rgba(245, 158, 11, 0.2)";
        feedback.style.borderColor = "#F59E0B";
    }
    
    feedback.innerHTML = `<div>${message}</div>`;
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Retry the Quiz';
    resetBtn.className = 'btn-gen';
    resetBtn.style.marginTop = '1.5rem';
    resetBtn.style.background = 'var(--galois-color)';
    resetBtn.onclick = initQuiz;
    feedback.appendChild(resetBtn);
}

window.onload = initQuiz;
