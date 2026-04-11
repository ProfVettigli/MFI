const quizData = [
    {
        question: "Quale di queste relazioni definisce una funzione?",
        options: [
            "A ogni x è associato almeno un valore di y",
            "A ogni x è associato uno e un solo valore di y",
            "A ogni y è associato uno e un solo valore di x",
            "Tutti i valori di x hanno lo stesso valore di y"
        ],
        correct: 1
    },
    {
        question: "Se f(-x) = f(x), la funzione si dice:",
        options: [
            "Iniettiva",
            "Suriettiva",
            "Dispari",
            "Pari"
        ],
        correct: 3
    },
    {
        question: "Una funzione è biunivoca se è:",
        options: [
            "Solo iniettiva",
            "Solo suriettiva",
            "Sia iniettiva che suriettiva",
            "Simmetrica rispetto all'origine"
        ],
        correct: 2
    }
];

function loadQuiz() {
    const quizArea = document.getElementById('quiz-area');
    quizArea.innerHTML = quizData.map((q, i) => `
        <div class="quiz-question">
            <h3>${i + 1}. ${q.question}</h3>
            <div class="quiz-options">
                ${q.options.map((opt, j) => `
                    <button class="quiz-btn" onclick="checkAnswer(${i}, ${j}, this)">${opt}</button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

let score = 0;
let answered = 0;

window.checkAnswer = function(qIndex, optIndex, btn) {
    const options = btn.parentElement.querySelectorAll('.quiz-btn');
    options.forEach(b => b.disabled = true);

    if (optIndex === quizData[qIndex].correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        options[quizData[qIndex].correct].classList.add('correct');
    }

    answered++;
    if (answered === quizData.length) {
        const feedback = document.getElementById('quiz-score');
        feedback.innerText = `Hai totalizzato ${score} su ${quizData.length}! ${score === quizData.length ? 'Ottimo lavoro! 🚀' : 'Rileggi la lezione e riprova!'}`;
    }
};

// Funzione Macchina (Semplice demo)
function initMachine() {
    const inputs = [1, 2, 3, 4, 5, -1, -2];
    let currentIdx = 0;
    const inputEl = document.getElementById('machine-input');
    const outputEl = document.getElementById('machine-output');

    setInterval(() => {
        const x = inputs[currentIdx];
        inputEl.innerText = x;
        inputEl.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            outputEl.innerText = x * x;
            outputEl.style.transform = 'scale(1.2)';
            inputEl.style.transform = 'scale(1)';
            setTimeout(() => {
                outputEl.style.transform = 'scale(1)';
            }, 300);
        }, 800);

        currentIdx = (currentIdx + 1) % inputs.length;
    }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    initMachine();
});
