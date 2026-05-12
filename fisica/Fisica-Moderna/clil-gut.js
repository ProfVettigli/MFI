// Grand Unified Theory - Interactive Components

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "How many fundamental forces does the Standard Model describe?",
            options: [
                "Two: electromagnetic and gravity",
                "Three: strong, electromagnetic, and weak",
                "Four: strong, electromagnetic, weak, and gravity",
                "Only one: they're all unified at all scales"
            ],
            correct: 2
        },
        {
            q: "What is electroweak unification?",
            options: [
                "A proven fact that all forces are identical",
                "A theoretical framework merging electromagnetic and weak forces at high energies",
                "The discovery that light and gravity are the same",
                "An observation made in everyday physics"
            ],
            correct: 1
        },
        {
            q: "What mechanism explains why W and Z bosons are massive while photons are massless?",
            options: [
                "Quantum confinement",
                "The Higgs mechanism (spontaneous symmetry breaking)",
                "Relativity effects",
                "They're not actually different masses"
            ],
            correct: 1
        },
        {
            q: "At what energy scale do GUT forces unify?",
            options: [
                "Around 100 GeV (current experiments)",
                "Around 10^6 GeV",
                "Around 10^15 GeV (far beyond LHC reach)",
                "Only in black holes"
            ],
            correct: 2
        },
        {
            q: "What is a key prediction of Grand Unification Theories?",
            options: [
                "Proton decay (but never observed)",
                "That gravity is an illusion",
                "That time is not real",
                "That quantum mechanics is wrong"
            ],
            correct: 0
        },
        {
            q: "How many dimensions does string theory require?",
            options: [
                "3 (like our everyday space)",
                "4 (space and time)",
                "10 or 11 (with extra compact dimensions)",
                "Infinite"
            ],
            correct: 2
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
            quizScore.textContent = `✓ Excellent! You answered all ${quizData.length} questions correctly!`;
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
