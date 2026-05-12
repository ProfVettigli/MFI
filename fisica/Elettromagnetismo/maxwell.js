// Maxwell - Quiz Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    const questions = [
        {
            q: "Quale fisico scrisse le quattro equazioni fondamentali dell'elettromagnetismo nel 1865?",
            options: ["Michael Faraday", "James Clerk Maxwell", "André-Marie Ampère", "Carl Friedrich Gauss"],
            correct: 1
        },
        {
            q: "La legge di Gauss per il campo magnetico afferma che:",
            options: ["I poli magnetici isolati esistono", "Il flusso magnetico totale è zero", "I monopoli magnetici sono abbondanti", "B è sempre radiale"],
            correct: 1
        },
        {
            q: "Quale legge descrive come un campo magnetico variabile genera un campo elettrico?",
            options: ["Legge di Coulomb", "Legge di Ampère", "Legge di Faraday", "Legge di Gauss"],
            correct: 2
        },
        {
            q: "La velocità della luce nel vuoto si calcola come:",
            options: ["c = μ₀ε₀", "c = 1/(μ₀ε₀)", "c = √(μ₀ε₀)", "c = 1/√(μ₀ε₀)"],
            correct: 3
        },
        {
            q: "Un campo elettrico variabile genera:",
            options: ["Solo calore", "Un campo magnetico", "Onde sonore", "Cariche libere"],
            correct: 1
        },
        {
            q: "La legge di Ampère-Maxwell include il termine della corrente di spostamento per spiegare:",
            options: ["Il flusso magnetico", "Come E variabile genera B", "L'induzione magnetica", "La riflessione della luce"],
            correct: 1
        }
    ];

    let score = 0;
    let answered = 0;

    questions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '1.5rem';
        div.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 0.8rem;">${idx + 1}. ${q.q}</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${q.options.map((opt, i) => `
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="q${idx}" value="${i}" style="margin-right: 0.8rem;">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        `;
        quizArea.appendChild(div);

        const radios = div.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                answered++;
                if (parseInt(radio.value) === q.correct) {
                    score++;
                }
                if (answered === questions.length) {
                    const pct = Math.round((score / questions.length) * 100);
                    quizScore.textContent = `Risultato: ${score}/${questions.length} (${pct}%)`;
                    quizScore.style.color = pct >= 70 ? 'var(--physics-color)' : '#ef4444';
                }
            });
        });
    });
}
