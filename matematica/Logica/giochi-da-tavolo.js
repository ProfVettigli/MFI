/**
 * giochi-da-tavolo.js
 * Quiz for logic in board games and AI.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- SUDOKU 4x4 MINI PUZZLE --- */
    const sudokuGrid = document.getElementById('sudoku-grid');
    if (sudokuGrid) {
        // Puzzle: 0 = empty cell. Solution: row-major order.
        // The puzzle:
        //  _  3  _  1
        //  1  _  3  _
        //  _  1  _  3
        //  3  _  1  _
        const puzzle = [
            0, 3, 0, 1,
            1, 0, 3, 0,
            0, 1, 0, 3,
            3, 0, 1, 0
        ];
        const solution = [
            2, 3, 4, 1,
            1, 4, 3, 2,
            4, 1, 2, 3,
            3, 2, 1, 4
        ];

        let cells = [];

        function buildGrid() {
            sudokuGrid.innerHTML = '';
            cells = [];
            puzzle.forEach((val, idx) => {
                const row = Math.floor(idx / 4);
                const col = idx % 4;
                const div = document.createElement('div');
                div.className = 'sudoku-cell';

                // Add thick borders for 2x2 box separation
                if (col === 1) div.classList.add('border-right-thick');
                if (row === 1) div.classList.add('border-bottom-thick');

                if (val !== 0) {
                    // Fixed cell
                    div.classList.add('fixed');
                    div.textContent = val;
                    cells.push({ el: div, fixed: true, value: val });
                } else {
                    // Editable cell
                    div.classList.add('editable');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.inputMode = 'numeric';
                    input.setAttribute('aria-label', `Riga ${row + 1}, Colonna ${col + 1}`);
                    input.addEventListener('input', (e) => {
                        let v = e.target.value.replace(/[^1-4]/g, '');
                        e.target.value = v;
                        div.classList.remove('error', 'correct');
                        clearFeedback();
                    });
                    input.addEventListener('keydown', (e) => {
                        // Allow navigation with arrow keys
                        const curIdx = cells.indexOf(cells.find(c => c.el === div));
                        let targetIdx = -1;
                        if (e.key === 'ArrowRight') targetIdx = curIdx + 1;
                        if (e.key === 'ArrowLeft') targetIdx = curIdx - 1;
                        if (e.key === 'ArrowDown') targetIdx = curIdx + 4;
                        if (e.key === 'ArrowUp') targetIdx = curIdx - 4;
                        if (targetIdx >= 0 && targetIdx < 16 && cells[targetIdx]) {
                            const targetCell = cells[targetIdx];
                            const targetInput = targetCell.el.querySelector('input');
                            if (targetInput) targetInput.focus();
                        }
                    });
                    div.appendChild(input);
                    cells.push({ el: div, fixed: false, input: input });
                }
                sudokuGrid.appendChild(div);
            });
        }

        function clearFeedback() {
            const fb = document.getElementById('sudoku-feedback');
            if (fb) { fb.textContent = ''; fb.style.color = ''; }
        }

        function checkSolution() {
            const fb = document.getElementById('sudoku-feedback');
            let allFilled = true;
            let allCorrect = true;

            cells.forEach((cell, idx) => {
                cell.el.classList.remove('error', 'correct');
                let userVal;
                if (cell.fixed) {
                    userVal = cell.value;
                } else {
                    userVal = parseInt(cell.input.value);
                    if (!userVal || isNaN(userVal)) {
                        allFilled = false;
                        return;
                    }
                }
                if (userVal !== solution[idx]) {
                    allCorrect = false;
                    if (!cell.fixed) cell.el.classList.add('error');
                } else {
                    if (!cell.fixed) cell.el.classList.add('correct');
                }
            });

            if (!allFilled) {
                fb.textContent = '⚠️ Completa tutte le celle prima di controllare!';
                fb.style.color = '#fbbf24';
            } else if (allCorrect) {
                fb.textContent = '🎉 Perfetto! Hai risolto il Sudoku!';
                fb.style.color = '#10b981';
            } else {
                fb.textContent = '❌ Ci sono degli errori (celle in rosso). Riprova!';
                fb.style.color = '#ef4444';
            }
        }

        function resetGrid() {
            cells.forEach(cell => {
                cell.el.classList.remove('error', 'correct');
                if (!cell.fixed) cell.input.value = '';
            });
            clearFeedback();
        }

        buildGrid();

        const checkBtn = document.getElementById('sudoku-check');
        const resetBtn = document.getElementById('sudoku-reset');
        if (checkBtn) checkBtn.addEventListener('click', checkSolution);
        if (resetBtn) resetBtn.addEventListener('click', resetGrid);
    }
    
    /* --- QUIZ: GIOCHI DA TAVOLO E AI (5 questions) --- */
    const quizData = [
        {
            q: "1. Come possiamo definire 'creatività' nel contesto di un gioco da tavolo altamente strutturato?",
            a: ["Imparare a barare senza farsi scoprire dagli arbitri.", "Trovare percorsi nuovi per raggiungere l'obiettivo rispettando rigorosamente e profondamente i limiti delle regole logiche.", "Ignorare le regole quando convengono a noi.", "Affidarsi esclusivamente alla fortuna dei dadi."],
            c: 1
        },
        {
            q: "2. Su cosa si basava principalmente il supercomputer Deep Blue per sconfiggere Garry Kasparov a scacchi?",
            a: ["Sull'intuizione dell'esperienza.", "Su una brutale e formidabile capacità di calcolo (forza bruta) in grado di esplorare milioni di mosse al secondo.", "Sulla capacità di barare alterando le pedine invisibilmente.", "Su una moderna rete neurale con deep learning."],
            c: 1
        },
        {
            q: "3. Perchè i computer tradizionali hanno fallito per anni nell'imparare a giocare a Go?",
            a: ["Perché le regole sono troppo complesse e difficili da tradurre in codice.", "Perché il numero di mosse possibili cresce così tanto che gli algoritmi a 'forza bruta' esaurivano tempo e risorse.", "Perché il gioco era protetto da copyright ed era illegale studiarlo al pc.", "Perché il Go non si gioca su una griglia."],
            c: 1
        },
        {
            q: "4. Qual è la differenza principale nell'approccio di AlphaGo rispetto ai vecchi programmi scacchistici?",
            a: ["Calcola il 100% delle mosse possibili con processori ancora più grossi.", "Usa reti neurali artificiali per 'valutare' intuitivamente la qualità di una posizione piuttosto che cercare di calcolarla fino all'estenuazione.", "Imbroglia l'avversario spegnendo le telecamere.", "Usa la sola matematica dei frattali."],
            c: 1
        },
        {
            q: "5. Cosa si richiede, alla base, per costruire un 'Sistema Logico' proprio come un gioco da tavolo?",
            a: ["Solo un obiettivo finale, le regole si inventano strada facendo.", "Un insieme definito, limitato e non contraddittorio di assiomi (le regole iniziali).", "Nessuna regola, solo creatività libera.", "Molti giocatori."],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2.5rem";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "12px";
            card.style.background = "rgba(255,255,255,0.02)";
            card.style.border = "1px solid rgba(255,255,255,0.05)";

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff; font-size: 1.1rem;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex";
            optionsGroup.style.flexDirection = "column";
            optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = option;
                btn.style.textAlign = "left";
                btn.style.padding = "1rem";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "white";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.transition = "0.3s";
                btn.style.fontSize = "0.95rem";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) {
                        return; // Non fare niente se questo bottone è già stato cliccato
                    }
                    
                    // Verifichiamo la correttezza, stile "trial and error"
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        
                        // Segniamo la risposta giusta e otteniamo il punto solo se non ci sono stati errori precedenti
                        if (!card.classList.contains('attempted')) {
                            score++;
                        }
                        
                        // Disabilita tutti per questa domanda
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }
                        
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= (quizData.length - 1) ? "#10B981" : "#F59E0B";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato, riprova</strong>";
                        btn.classList.add('picked');
                        btn.style.pointerEvents = "none";
                        card.classList.add('attempted'); // Segna come domanda con errore
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
});
