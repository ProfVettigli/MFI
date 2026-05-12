// CLIL: Tesla vs Edison - Interactive Quiz

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

// ===== QUIZ =====
function initQuiz() {
    const quizData = [
        {
            question: "Who championed DC technology and built the first commercial power station in America?",
            options: ["Nikola Tesla", "George Westinghouse", "Thomas Edison", "Nikola Tesla"],
            correct: 2
        },
        {
            question: "What was Nikola Tesla's most famous invention that changed electric motors forever?",
            options: ["The light bulb", "The induction motor", "The transformer", "The DC generator"],
            correct: 1
        },
        {
            question: "Why was AC better for long-distance power transmission than DC?",
            options: ["AC was safer", "AC used transformers to step up voltage, reducing current and losses", "AC was cheaper", "AC generators were simpler"],
            correct: 1
        },
        {
            question: "What landmark project proved AC's superiority over DC in 1895?",
            options: ["Pearl Street Station in NYC", "Niagara Falls power station", "The first transatlantic cable", "The Erie Canal"],
            correct: 1
        },
        {
            question: "What did Thomas Edison do to fight against AC technology?",
            options: ["Published scientific papers", "Publicly electrocuted animals to show AC's danger", "Stopped innovating", "Both A and B"],
            correct: 2
        },
        {
            question: "The power loss in transmission is proportional to which formula?",
            options: ["P_loss = V²/R", "P_loss = I²R", "P_loss = I/V", "P_loss = V/I"],
            correct: 1
        },
        {
            question: "What percentage of the world today uses AC for power distribution?",
            options: ["50%", "75%", "99%", "100%"],
            correct: 2
        },
        {
            question: "Who was the businessman that backed Tesla and invested in AC technology?",
            options: ["J.P. Morgan", "George Westinghouse", "Andrew Carnegie", "John D. Rockefeller"],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');

    if (!quizArea) return;

    let score = 0;

    quizData.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '2rem';

        const questionTitle = document.createElement('h4');
        questionTitle.textContent = `${idx + 1}. ${q.question}`;
        questionTitle.style.marginBottom = '1rem';
        questionTitle.style.color = 'var(--text-main)';
        div.appendChild(questionTitle);

        q.options.forEach((opt, optIdx) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '0.5rem';
            label.style.cursor = 'pointer';
            label.style.padding = '0.7rem';
            label.style.borderRadius = '6px';
            label.style.transition = 'background 0.2s';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${idx}`;
            input.value = optIdx;

            input.addEventListener('change', () => {
                if (optIdx === q.correct) {
                    score++;
                    label.style.background = 'rgba(34,197,94,0.2)';
                    label.style.borderLeft = '3px solid #22c55e';
                } else {
                    label.style.background = 'rgba(239,68,68,0.2)';
                    label.style.borderLeft = '3px solid #ef4444';
                }
                updateScore();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opt));
            div.appendChild(label);
        });

        quizArea.appendChild(div);
    });

    function updateScore() {
        quizScore.textContent = `Correct answers: ${score} / ${quizData.length}`;
        if (score === quizData.length) {
            quizScore.style.color = '#22c55e';
        } else if (score >= quizData.length / 2) {
            quizScore.style.color = '#eab308';
        } else {
            quizScore.style.color = '#ef4444';
        }
    }
}
