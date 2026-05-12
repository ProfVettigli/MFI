// Noether's Theorem - Interactive Components

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "What does Noether's Theorem connect?",
            options: [
                "Symmetries and conservation laws",
                "Mass and energy",
                "Quantum and classical mechanics",
                "Relativity and gravity"
            ],
            correct: 0
        },
        {
            q: "Which symmetry leads to conservation of momentum?",
            options: [
                "Time translation",
                "Spatial translation (homogeneity of space)",
                "Spatial rotation",
                "Gauge symmetry"
            ],
            correct: 1
        },
        {
            q: "Which symmetry leads to conservation of energy?",
            options: [
                "Spatial translation",
                "Spatial rotation",
                "Time translation (homogeneity of time)",
                "Gauge transformation"
            ],
            correct: 2
        },
        {
            q: "Which conservation law corresponds to rotational symmetry?",
            options: [
                "Conservation of momentum",
                "Conservation of angular momentum",
                "Conservation of energy",
                "Conservation of charge"
            ],
            correct: 1
        },
        {
            q: "Who proved Noether's Theorem?",
            options: [
                "Albert Einstein",
                "David Hilbert",
                "Emmy Noether",
                "Erwin Schrödinger"
            ],
            correct: 2
        },
        {
            q: "What is a gauge symmetry?",
            options: [
                "A spatial rotation",
                "A time translation",
                "A local symmetry that doesn't change physical observables",
                "A symmetry unique to classical mechanics"
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
