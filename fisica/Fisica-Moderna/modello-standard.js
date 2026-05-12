// Modello Standard - Interactive Components

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Quanti tipi di quark esistono nel Modello Standard?",
            options: [
                "2: su e giù",
                "4: su, giù, strano, incantato",
                "6: up, down, charm, strange, top, bottom",
                "Infiniti, dipende dall'energia"
            ],
            correct: 2
        },
        {
            q: "Quale bosone media l'interazione elettromagnetica?",
            options: [
                "Gluone",
                "Fotone",
                "Bosone W",
                "Bosone di Higgs"
            ],
            correct: 1
        },
        {
            q: "In che anno fu scoperto il bosone di Higgs?",
            options: [
                "1964 (predizione teorica)",
                "1983 (bosone W/Z)",
                "2012 (scoperta sperimentale al CERN LHC)",
                "Non è mai stato scoperto"
            ],
            correct: 2
        },
        {
            q: "Quale forza NON è inclusa nel Modello Standard?",
            options: [
                "Forza forte (nucleare)",
                "Forza debole",
                "Elettromagnetismo",
                "Gravità"
            ],
            correct: 3
        },
        {
            q: "Quale è la carica elettrica di un quark up?",
            options: [
                "+1",
                "+2/3",
                "−1/3",
                "0"
            ],
            correct: 1
        },
        {
            q: "Quale percentuale dell'universo è materia oscura e energia oscura?",
            options: [
                "Circa 5% della massa totale",
                "Circa 25% materia oscura, 68% energia oscura",
                "Meno del 1%",
                "Non conosco, ma è un grande mistero"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => {
        return `
            <div class="quiz-item" style="margin-bottom: 2rem;">
                <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">${i + 1}. ${item.q}</p>
                <div style="display: grid; gap: 0.8rem;">
                    ${item.options.map((opt, j) => `
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 0.8rem; background: rgba(0,0,0,0.2); border-radius: 8px; transition: all 0.3s;">
                            <input type="radio" name="q${i}" value="${j}" style="margin-right: 1rem; cursor: pointer;" onchange="checkQuizAnswer(${i}, ${j}, ${item.correct})">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        const isCorrect = ansIndex === correctIndex;
        if (isCorrect) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Eccellente! Hai risposto correttamente a tutte ${quizData.length} domande!`;
            quizScore.style.color = 'var(--physics-color)';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('quiz-area')) initQuiz();
});
