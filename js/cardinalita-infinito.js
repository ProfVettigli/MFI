/**
 * cardinalita-infinito.js
 * Visualizzazioni 1-to-1 per N=Z e Cantor's zig zag per N=Q.
 */

// Funzione di inizializzazione
function initCardinalita() {
    /* --- N = Z BIJECTION --- */
    let currentN = 0;
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
    const SIZE = 5;
    
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
                activeCell.innerHTML = `<span style="font-size:0.8rem;color:black;">N.${cantorStep}</span><br>${r}/${c}`;
            }

            cantorStep++;
        });
    }
    /* --- HILBERT HOTEL SIMULATION --- */
    const hotelRoomsDiv = document.getElementById('hotel-rooms');
    const hotelMsg = document.getElementById('hotel-msg');
    const btnAddOne = document.getElementById('btn-add-one');
    const btnAddInf = document.getElementById('btn-add-infinite');
    const btnReset = document.getElementById('btn-reset-hotel');
    
    // Rooms array: 1 = occupied, 0 = free
    let rooms = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
    const numRooms = 10;

    function renderHotel() {
        if(!hotelRoomsDiv) return;
        hotelRoomsDiv.innerHTML = "";
        rooms.forEach((occ, i) => {
            const roomDiv = document.createElement('div');
            roomDiv.style.width = "45px";
            roomDiv.style.height = "60px";
            roomDiv.style.border = "1px solid rgba(255,255,255,0.2)";
            roomDiv.style.borderRadius = "4px";
            roomDiv.style.display = "flex";
            roomDiv.style.flexDirection = "column";
            roomDiv.style.alignItems = "center";
            roomDiv.style.justifyContent = "center";
            roomDiv.style.background = occ ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)";
            roomDiv.style.transition = "transform 0.4s ease, background 0.4s ease";
            
            const n = i + 1;
            roomDiv.innerHTML = `<span style="font-size:0.7rem;">S.${n}</span><span style="font-size:1.5rem;">${occ ? '👤' : '🚪'}</span>`;
            hotelRoomsDiv.appendChild(roomDiv);
        });
    }

    if(btnAddOne) {
        btnAddOne.onclick = () => {
            hotelMsg.textContent = "Spostiamo tutti: n -> n+1...";
            
            // Animation shift
            const cards = hotelRoomsDiv.children;
            for(let i=0; i<cards.length; i++) cards[i].style.transform = "translateX(20px)";
            
            setTimeout(() => {
                for(let i = numRooms - 1; i > 0; i--) {
                    rooms[i] = rooms[i-1];
                }
                rooms[0] = 1;
                renderHotel();
                hotelMsg.textContent = "Ospite sistemato nella Stanza 1!";
                hotelMsg.style.color = "#10B981";
            }, 500);
        };
    }

    if(btnAddInf) {
        btnAddInf.onclick = () => {
            hotelMsg.textContent = "Spostiamo tutti: n -> 2n...";
            
            setTimeout(() => {
                const oldRooms = [...rooms];
                rooms.fill(0);
                for(let i=0; i < numRooms/2; i++) {
                    if(oldRooms[i]) rooms[(i+1)*2 - 1] = 1; 
                }
                renderHotel();
                
                setTimeout(() => {
                    hotelMsg.textContent = "Ora tutte le stanze DISPARI sono libere! Facciamo entrare gli infiniti nuovi...";
                    hotelMsg.style.color = "#FCD34D";
                    
                    setTimeout(() => {
                        rooms.fill(1);
                        renderHotel();
                        hotelMsg.textContent = "Infiniti ospiti sistemati (nelle stanze dispari)!";
                        hotelMsg.style.color = "#10B981";
                    }, 1500);
                }, 1000);
            }, 500);
        };
    }

    if(btnReset) {
        btnReset.onclick = () => {
            rooms = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            hotelMsg.textContent = "L'hotel è pieno (ma pronto per l'infinito)!";
            hotelMsg.style.color = "#FCD34D";
            renderHotel();
        };
    }

    renderHotel();

    /* --- QUIZ GENERATION --- */
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
        quizArea.innerHTML = ""; // Pulisci se già presente
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
                        allBtns[q.correct].style.color = "#fff";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Perfetto! Hai totalizzato ${currentScore}/${quizData.length}. Sei un esperto di infiniti!`;
                            scoreEl.style.color = "var(--physics-color)";
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
}

// Avvio
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardinalita);
} else {
    initCardinalita();
}
