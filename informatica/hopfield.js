// Reti di Hopfield - Interactive Components

// ============================================================================
// HOPFIELD NETWORK
// ============================================================================

class HopfieldNetwork {
    constructor(n) {
        this.n = n;
        this.weights = Array.from({ length: n }, () => new Array(n).fill(0));
    }

    train(patterns) {
        const n = this.n;
        this.weights = Array.from({ length: n }, () => new Array(n).fill(0));
        for (const p of patterns) {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        this.weights[i][j] += (p[i] * p[j]) / n;
                    }
                }
            }
        }
    }

    update(state) {
        const next = state.slice();
        const order = Array.from({ length: this.n }, (_, i) => i).sort(() => Math.random() - 0.5);
        let changed = false;
        for (const i of order) {
            let h = 0;
            for (let j = 0; j < this.n; j++) h += this.weights[i][j] * state[j];
            const s = h >= 0 ? 1 : -1;
            if (s !== next[i]) { next[i] = s; changed = true; }
        }
        return { state: next, changed };
    }

    energy(state) {
        let e = 0;
        for (let i = 0; i < this.n; i++)
            for (let j = 0; j < this.n; j++)
                e -= 0.5 * this.weights[i][j] * state[i] * state[j];
        return e;
    }
}

// ============================================================================
// DEMO
// ============================================================================

function initDemo() {
    const N = 49; // 7x7

    // Patterns as +1/-1 flat arrays
    const PATTERNS = {
        T: [
             1, 1, 1, 1, 1, 1, 1,
            -1,-1,-1, 1,-1,-1,-1,
            -1,-1,-1, 1,-1,-1,-1,
            -1,-1,-1, 1,-1,-1,-1,
            -1,-1,-1, 1,-1,-1,-1,
            -1,-1,-1, 1,-1,-1,-1,
            -1,-1,-1, 1,-1,-1,-1
        ],
        L: [
             1,-1,-1,-1,-1,-1,-1,
             1,-1,-1,-1,-1,-1,-1,
             1,-1,-1,-1,-1,-1,-1,
             1,-1,-1,-1,-1,-1,-1,
             1,-1,-1,-1,-1,-1,-1,
             1,-1,-1,-1,-1,-1,-1,
             1, 1, 1, 1, 1, 1, 1
        ],
        H: [
             1,-1,-1,-1,-1,-1, 1,
             1,-1,-1,-1,-1,-1, 1,
             1,-1,-1,-1,-1,-1, 1,
             1, 1, 1, 1, 1, 1, 1,
             1,-1,-1,-1,-1,-1, 1,
             1,-1,-1,-1,-1,-1, 1,
             1,-1,-1,-1,-1,-1, 1
        ]
    };

    const net = new HopfieldNetwork(N);
    let currentState = new Array(N).fill(-1);
    let selectedPatterns = new Set();
    let trained = false;
    let recovering = false;

    // Build grid
    const grid = document.getElementById('hopfield-grid');
    const cells = [];
    for (let i = 0; i < N; i++) {
        const cell = document.createElement('div');
        cell.className = 'hop-cell off';
        cell.addEventListener('click', () => {
            if (recovering) return;
            currentState[i] = currentState[i] === 1 ? -1 : 1;
            renderGrid();
            updateEnergy();
        });
        grid.appendChild(cell);
        cells.push(cell);
    }

    function renderGrid() {
        for (let i = 0; i < N; i++) {
            cells[i].className = 'hop-cell ' + (currentState[i] === 1 ? 'on' : 'off');
        }
    }

    function updateEnergy() {
        const e = net.energy(currentState);
        document.getElementById('energy-display').textContent =
            trained ? `Energia E = ${e.toFixed(2)}` : 'Energia E: —';
    }

    // Pattern selection
    ['T', 'L', 'H'].forEach(key => {
        document.getElementById(`pat-${key}`).addEventListener('click', function () {
            if (selectedPatterns.has(key)) {
                selectedPatterns.delete(key);
                this.classList.remove('active');
            } else {
                selectedPatterns.add(key);
                this.classList.add('active');
            }
        });
    });

    // Memorizza
    document.getElementById('btn-memorize').addEventListener('click', () => {
        if (selectedPatterns.size === 0) {
            document.getElementById('msg-memorize').textContent = 'Seleziona almeno un pattern prima di memorizzare.';
            return;
        }
        const pats = [...selectedPatterns].map(k => PATTERNS[k]);
        net.train(pats);
        trained = true;
        document.getElementById('msg-memorize').textContent =
            `✓ ${selectedPatterns.size} pattern memorizzati (${[...selectedPatterns].join(', ')}).`;
        document.getElementById('trained-status').innerHTML =
            `<span class="trained-badge">Rete addestrata</span>`;
        updateEnergy();
    });

    // Load pattern buttons
    ['T', 'L', 'H'].forEach(key => {
        document.getElementById(`btn-load-${key}`).addEventListener('click', () => {
            if (recovering) return;
            currentState = PATTERNS[key].slice();
            renderGrid();
            updateEnergy();
            document.getElementById('msg-recover').textContent = `Pattern ${key} caricato.`;
        });
    });

    // Aggiungi rumore
    document.getElementById('btn-noise').addEventListener('click', () => {
        if (recovering) return;
        const flips = Math.round(N * 0.30);
        const indices = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, flips);
        indices.forEach(i => { currentState[i] *= -1; });
        renderGrid();
        updateEnergy();
        document.getElementById('msg-recover').textContent = `${flips} neuroni rumorosi aggiunti. Premi "Recupera!" per vedere la rete in azione.`;
    });

    // Recupera
    document.getElementById('btn-recover').addEventListener('click', () => {
        if (!trained) {
            document.getElementById('msg-recover').textContent = 'Prima memorizza i pattern!';
            return;
        }
        if (recovering) return;
        recovering = true;
        document.getElementById('btn-recover').disabled = true;
        document.getElementById('msg-recover').textContent = 'Recupero in corso…';

        let step = 0;
        const maxSteps = 20;

        function doStep() {
            const { state, changed } = net.update(currentState);
            currentState = state;
            renderGrid();
            updateEnergy();
            step++;
            if (!changed || step >= maxSteps) {
                recovering = false;
                document.getElementById('btn-recover').disabled = false;
                document.getElementById('msg-recover').textContent =
                    changed
                        ? `Fermato dopo ${step} passi (limite raggiunto).`
                        : `✓ Convergenza raggiunta in ${step} passi. Pattern recuperato!`;
            } else {
                setTimeout(doStep, 120);
            }
        }
        setTimeout(doStep, 120);
    });

    // Pulisci
    document.getElementById('btn-clear-grid').addEventListener('click', () => {
        if (recovering) return;
        currentState = new Array(N).fill(-1);
        renderGrid();
        updateEnergy();
        document.getElementById('msg-recover').textContent = '';
    });

    renderGrid();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "Chi ha pubblicato il modello delle reti neurali a memoria associativa nel 1982?",
            options: ["Geoffrey Hinton", "John Hopfield", "Donald Hebb", "Warren McCulloch"],
            correct: 1
        },
        {
            q: "Cosa afferma la regola di Hebb (1949)?",
            options: [
                "I neuroni si attivano in sequenza temporale",
                "Le connessioni si rafforzano tra neuroni che si attivano insieme",
                "Ogni neurone è collegato a tutti gli altri con peso uguale",
                "La rete minimizza sempre l'energia in un solo passo"
            ],
            correct: 1
        },
        {
            q: "Qual è il valore di un neurone in una rete di Hopfield classica?",
            options: ["0 oppure 1", "+1 oppure −1", "Qualsiasi valore reale", "Un numero complesso"],
            correct: 1
        },
        {
            q: "Cosa rappresenta la funzione energia E in una rete di Hopfield?",
            options: [
                "Il consumo energetico del calcolatore",
                "Una funzione che sale ad ogni aggiornamento",
                "Una funzione che scende durante il recupero, convergendo a un minimo",
                "La temperatura della rete"
            ],
            correct: 2
        },
        {
            q: "Per quale importante risultato Hopfield e Hinton hanno vinto il Nobel per la Fisica 2024?",
            options: [
                "Per la scoperta del bosone di Higgs",
                "Per i contributi fondazionali alle reti neurali artificiali",
                "Per lo sviluppo della fusione nucleare a confinamento magnetico",
                "Per la scoperta della meccanica quantistica"
            ],
            correct: 1
        },
        {
            q: "Cosa ha dimostrato Ramsauer et al. nel 2020 con le Modern Hopfield Networks?",
            options: [
                "Che la capacità di memoria è sempre 0.138·N pattern",
                "Che la rete di Hopfield è equivalente a una rete convoluzionale",
                "Che il meccanismo di Attention dei Transformer è formalmente equivalente a un aggiornamento di Hopfield",
                "Che le reti di Hopfield non convergono mai"
            ],
            correct: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => `
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
    `).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        if (ansIndex === correctIndex) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Eccellente! Hai risposto correttamente a tutte ${quizData.length} domande!`;
            quizScore.style.color = '#6366f1';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('hopfield-grid')) initDemo();
    if (document.getElementById('quiz-area')) initQuiz();
});
