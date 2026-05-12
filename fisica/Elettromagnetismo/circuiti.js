// Circuiti Elettrici - Calcolatori Interattivi

document.addEventListener('DOMContentLoaded', () => {
    initSeriesCircuit();
    initParallelCircuit();
    initQuiz();
});

// ===== SERIES CIRCUIT =====
function initSeriesCircuit() {
    const r1Input = document.getElementById('series-r1');
    const r2Input = document.getElementById('series-r2');
    const r3Input = document.getElementById('series-r3');
    const vInput = document.getElementById('series-v');

    const rTotal = document.getElementById('series-r-total');
    const iResult = document.getElementById('series-i');
    const pResult = document.getElementById('series-p');

    if (!r1Input) return;

    function updateSeries() {
        const r1 = parseFloat(r1Input.value) || 0;
        const r2 = parseFloat(r2Input.value) || 0;
        const r3 = parseFloat(r3Input.value) || 0;
        const v = parseFloat(vInput.value) || 0;

        // R_totale = R1 + R2 + R3
        const rtot = r1 + r2 + r3;
        rTotal.textContent = rtot.toFixed(1) + ' Ω';

        if (rtot > 0) {
            const i = v / rtot;
            const p = v * i;

            iResult.textContent = i.toFixed(3) + ' A';
            pResult.textContent = p.toFixed(2) + ' W';
        } else {
            iResult.textContent = '0 A';
            pResult.textContent = '0 W';
        }
    }

    r1Input.addEventListener('input', updateSeries);
    r2Input.addEventListener('input', updateSeries);
    r3Input.addEventListener('input', updateSeries);
    vInput.addEventListener('input', updateSeries);

    updateSeries();
}

// ===== PARALLEL CIRCUIT =====
function initParallelCircuit() {
    const r1Input = document.getElementById('parallel-r1');
    const r2Input = document.getElementById('parallel-r2');
    const r3Input = document.getElementById('parallel-r3');
    const vInput = document.getElementById('parallel-v');

    const rTotal = document.getElementById('parallel-r-total');
    const iResult = document.getElementById('parallel-i');
    const pResult = document.getElementById('parallel-p');

    if (!r1Input) return;

    function updateParallel() {
        const r1 = parseFloat(r1Input.value) || Infinity;
        const r2 = parseFloat(r2Input.value) || Infinity;
        const r3 = parseFloat(r3Input.value) || Infinity;
        const v = parseFloat(vInput.value) || 0;

        // 1/R_totale = 1/R1 + 1/R2 + 1/R3
        const inv_r = (r1 > 0 ? 1/r1 : 0) + (r2 > 0 ? 1/r2 : 0) + (r3 > 0 ? 1/r3 : 0);

        let rtot = 0;
        if (inv_r > 0) {
            rtot = 1 / inv_r;
        }

        rTotal.textContent = rtot.toFixed(2) + ' Ω';

        if (rtot > 0) {
            const i = v / rtot;
            const p = v * i;

            iResult.textContent = i.toFixed(3) + ' A';
            pResult.textContent = p.toFixed(2) + ' W';
        } else {
            iResult.textContent = '0 A';
            pResult.textContent = '0 W';
        }
    }

    r1Input.addEventListener('input', updateParallel);
    r2Input.addEventListener('input', updateParallel);
    r3Input.addEventListener('input', updateParallel);
    vInput.addEventListener('input', updateParallel);

    updateParallel();
}

// ===== QUIZ =====
function initQuiz() {
    const quizData = [
        {
            question: "In una configurazione in serie, come si somma la resistenza?",
            options: ["R_tot = R1 + R2", "R_tot = (R1×R2)/(R1+R2)", "R_tot = 1/(1/R1 + 1/R2)", "R_tot = √(R1×R2)"],
            correct: 0
        },
        {
            question: "In una configurazione in parallelo, com'è la resistenza totale?",
            options: ["Uguale alla più grande", "Minore di tutti", "Uguale alla somma", "Dipende dalla tensione"],
            correct: 1
        },
        {
            question: "Cosa dice la legge dei nodi di Kirchhoff?",
            options: ["La somma delle tensioni è zero", "La corrente è conservata", "La potenza è massima", "Non ci sono perdite"],
            correct: 1
        },
        {
            question: "In una serie di resistori, com'è la corrente?",
            options: ["Diversa in ogni resistore", "Uguale in tutti", "Dimezza ad ogni resistore", "Dipende dalla potenza"],
            correct: 1
        },
        {
            question: "La formula della potenza è:",
            options: ["P = V/I", "P = I/V", "P = V × I", "P = V - I"],
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
