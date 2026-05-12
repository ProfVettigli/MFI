// Strumenti di Misura - Quiz Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

// ===== QUIZ =====
function initQuiz() {
    const quizData = [
        {
            question: "Come si collega un amperometro in un circuito?",
            options: ["In parallelo", "In serie", "Non importa", "Dipende dal circuito"],
            correct: 1
        },
        {
            question: "Quale deve essere la resistenza interna di un amperometro ideale?",
            options: ["Molto alta", "Zero", "Infinita", "1 ohm"],
            correct: 1
        },
        {
            question: "Come si collega un voltmetro per misurare la tensione di un resistore?",
            options: ["In serie con il resistore", "In parallelo ai capi del resistore", "Non si collega", "Dipende dal valore"],
            correct: 1
        },
        {
            question: "Quale deve essere la resistenza interna di un voltmetro ideale?",
            options: ["Zero", "Molto bassa", "Infinita", "1 megaohm"],
            correct: 2
        },
        {
            question: "Come si usa correttamente un ohmetro?",
            options: ["In parallelo nel circuito acceso", "In serie nel circuito", "Staccato dal circuito, con il circuito spento", "Solo per verifi­care la continuità"],
            correct: 2
        },
        {
            question: "Cosa accade se colleghi un amperometro in parallelo (sbagliato)?",
            options: ["Misura male", "Crea un cortocircuito e danneggia lo strumento", "Funziona comunque", "Misura la tensione"],
            correct: 1
        },
        {
            question: "Un multimetro è quale combinazione?",
            options: ["Solo voltmetro", "Amperometro + Voltmetro + Ohmetro", "Solo amperometro", "Un generatore di funzioni"],
            correct: 1
        },
        {
            question: "Se misuri una resistenza da 10 kΩ e il display mostra '1', quale scala hai selezionato?",
            options: ["Scala 1 Ω", "Scala 100 Ω", "Scala 10 kΩ", "Scala 1 MΩ"],
            correct: 2
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
        quizScore.textContent = `Risposte corrette: ${score} / ${quizData.length}`;
        if (score === quizData.length) {
            quizScore.style.color = '#22c55e';
        } else if (score >= quizData.length / 2) {
            quizScore.style.color = '#eab308';
        } else {
            quizScore.style.color = '#ef4444';
        }
    }
}
