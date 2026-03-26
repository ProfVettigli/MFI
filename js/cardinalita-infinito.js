/**
 * cardinalita-infinito.js
 * Visualizzazioni 1-to-1 per N=Z e Cantor's zig zag per N=Q.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- N = Z BIJECTION --- */
    const numZ = 0; // next n index
    let currentN = 0;
    
    // N: 0, 1, 2,  3,  4,  5,  6
    // Z: 0, 1, -1, 2, -2, 3, -3
    
    const maxNRows = 8;
    const zContainer = document.getElementById('z-bijection-container');
    const zBtn = document.getElementById('btn-next-z');

    function getZ(n) {
        if (n === 0) return 0;
        if (n % 2 !== 0) return Math.ceil(n / 2);      // Dispari -> Positivi
        return -(n / 2);                               // Pari   -> Negativi
    }

    if (zBtn && zContainer) {
        zBtn.addEventListener('click', () => {
            if (currentN >= maxNRows) {
                zBtn.textContent = "L'elenco prosegue all'infinito...";
                zBtn.disabled = true;
                zBtn.style.opacity = "0.5";
                zBtn.style.cursor = "not-allowed";
                return;
            }

            const row = document.createElement('div');
            row.className = 'bijection-row';
            
            const zVal = getZ(currentN);
            row.innerHTML = `<span class="set-n" style="width:40px;text-align:right;">${currentN}</span> 
                             <span class="arrow">&harr;</span> 
                             <span class="set-z" style="width:40px;text-align:left;">${zVal}</span>`;
            
            zContainer.appendChild(row);
            currentN++;
        });
        
        // Clicca automaticamente il primo(0)
        zBtn.click();
    }


    /* --- CANTOR ZIG ZAG N = Q --- */
    const cantorGrid = document.getElementById('cantor-grid');
    const cantorBtn = document.getElementById('btn-cantor-step');
    
    // Costruiamo una griglia 5x5
    const SIZE = 5;
    
    // Generiamo l'HTML della griglia
    if (cantorGrid) {
        for(let r=1; r<=SIZE; r++) {
            for(let c=1; c<=SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = 'cantor-cell cantor-path';
                cell.id = `cantor-${r}-${c}`;
                cell.textContent = `${r}/${c}`;
                cantorGrid.appendChild(cell);
            }
        }
    }

    // Sequenza diagonale standard (ignorando riduzioni per semplicità visiva,
    // di solito 1/1, 1/2, 2/1, 3/1, 2/2X, 1/3, 1/4...
    // Qui mostriamo fisicamente il percorso sul 5x5 a zig zag:
    // (r, c) => (row y, col x)
    const zigzagPath = [
        [1,1], 
        [1,2], [2,1], 
        [3,1], [2,2], [1,3],
        [1,4], [2,3], [3,2], [4,1],
        [5,1], [4,2], [3,3], [2,4], [1,5]
    ];
    let cantorStep = 0;

    if (cantorBtn) {
        cantorBtn.addEventListener('click', () => {
            if (cantorStep >= zigzagPath.length) {
                cantorBtn.textContent = "Va avanti per tutti i Razionali!";
                cantorBtn.disabled = true;
                cantorBtn.style.opacity = "0.5";
                cantorBtn.style.cursor = "not-allowed";
                return;
            }

            const [r, c] = zigzagPath[cantorStep];
            const activeCell = document.getElementById(`cantor-${r}-${c}`);
            
            if (activeCell) {
                activeCell.classList.add('active-path');
                // Sovrascrive il testo mostrando il conteggio ("X. r/c")
                activeCell.innerHTML = `<span style="font-size:0.8rem;color:black;">N.${cantorStep}</span><br>${r}/${c}`;
            }

            cantorStep++;
        });
    }

    /* =========================================================
       QUIZ GENERATION CARDINALITÀ
       ========================================================= */
    const quizData = [
        {
            question: "1. Cosa significa che due insiemi hanno lo stesso 'numero' di elementi (stessa cardinalità)?",
            options: [
                "Che hanno entrambi un numero finito di elementi.",
                "Che è possibile stabilire una corrispondenza 1-a-1 (biiezione) tra i loro elementi.",
                "Che contengono esattamente gli stessi numeri."
            ],
            correct: 1
        },
        {
            question: "2. Quale di questi insiemi ha una cardinalità SUPERIORE a quella dei numeri Naturali (ℕ)?",
            options: [
                "L'insieme dei numeri Relativi (ℤ).",
                "L'insieme dei numeri Razionali (ℚ).",
                "L'insieme dei numeri Reali (ℝ)."
            ],
            correct: 2
        },
        {
            question: "3. Come ha dimostrato Cantor che i numeri Razionali possono essere messi in lista coi Naturali?",
            options: [
                "Usando il metodo del raddoppio.",
                "Usando il primo argomento diagonale (percorso a zig-zag).",
                "Dividendo ogni frazione per zero."
            ],
            correct: 1
        },
        {
            question: "4. Cosa afferma la Congettura del Continuo?",
            options: [
                "Che non esiste un infinito di dimensione intermedia tra ℕ e ℝ.",
                "Che l'universo è in continua espansione.",
                "Che i numeri reali sono infiniti."
            ],
            correct: 0
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = "2rem";
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = "1rem";
            qTitle.style.fontWeight = "600";
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.display = "flex";
            optionsDiv.style.flexDirection = "column";
            optionsDiv.style.gap = "0.8rem";

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.textContent = optText;
                
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "var(--text-main)";
                btn.style.padding = "1rem";
                btn.style.borderRadius = "0.5rem";
                btn.style.cursor = "pointer";
                btn.style.textAlign = "left";
                btn.style.fontSize = "1rem";
                btn.style.fontFamily = "inherit";
                btn.style.transition = "all 0.2s";
                
                btn.onmouseenter = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
                btn.onmouseleave = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

                btn.onclick = () => {
                    const allBtns = optionsDiv.querySelectorAll('button');
                    allBtns.forEach(b => {
                        b.disabled = true;
                        b.style.cursor = "not-allowed";
                    });
                    
                    if (optIndex === q.correct) {
                        btn.style.background = "var(--math-color)";
                        btn.style.borderColor = "var(--math-color)";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        allBtns[q.correct].style.background = "var(--math-color)";
                        allBtns[q.correct].style.borderColor = "var(--math-color)";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Perfetto! Hai totalizzato ${currentScore}/${quizData.length}. Sei un esperto di infiniti!`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio finale: ${currentScore}/${quizData.length}. Rileggi le sezioni su Cantor e sulla densità dei Reali.`;
                            scoreEl.style.color = "#F59E0B";
                        }
                    }
                };
                
                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

});
