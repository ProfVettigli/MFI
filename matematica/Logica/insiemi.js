/**
 * insiemi.js
 * Gestisce la logica Drag & Drop e genera il quiz interattivo
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. DRAG AND DROP LOGIC
       ========================================================= */
    const draggableItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone, .drag-pool');
    
    let draggedItem = null;

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            // timeout per renderlo invisibile mentre viene trascinato
            setTimeout(() => {
                item.style.opacity = '0.5';
            }, 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.style.opacity = '1';
                draggedItem = null;
                checkGameState(); // Controlla la vittoria dopo ogni drop
            }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); 
        });

        zone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            zone.classList.remove('drag-over');
            if (draggedItem) {
                zone.appendChild(draggedItem);
            }
        });
    });

    /* =========================================================
       2. GAME STATE CHECKING
       ========================================================= */
    function checkGameState() {
        // --- Diagramma di Venn ---
        const vennPool = document.getElementById('venn-pool');
        const vennZone = document.getElementById('venn-zone');
        const vennFeedback = document.getElementById('venn-feedback');
        
        if (vennPool && vennZone && vennFeedback) {
            let hasVocaliInPool = false;
            let hasConsonantiInZone = false;
            
            Array.from(vennPool.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type === 'vocale') hasVocaliInPool = true;
            });
            
            // Note: need to capture either main zone or inner div if dropped inside
            Array.from(vennZone.querySelectorAll('.drag-item')).forEach(child => {
                if(child.dataset.type === 'consonante') hasConsonantiInZone = true;
            });

            if (hasConsonantiInZone) {
                vennFeedback.textContent = "Attenzione: c'è una consonante dentro l'Insieme V! Toglila dal diagramma riportandola fuori.";
                vennFeedback.style.color = "#EF4444";
            } else if (!hasVocaliInPool && vennZone.querySelectorAll('.drag-item').length > 0) {
                vennFeedback.textContent = "Perfetto! Hai rappresentato l'Insieme V inserendo solo le vocali nel diagramma e lasciando fuori le consonanti.";
                vennFeedback.style.color = "var(--physics-color)";
            } else {
                vennFeedback.textContent = "";
            }
        }

        // --- Geometria ---
        const geoPool = document.getElementById('geo-pool');
        const geoA = document.getElementById('geo-zone-a'); // quad
        const geoB = document.getElementById('geo-zone-b'); // not-quad
        const geoFeedback = document.getElementById('geo-feedback');

        if (geoPool.children.length === 0) {
            // Controlla se gli elementi sono nel posto giusto
            let geoWin = true;
            
            // Check Insieme A (deve avere solo 'quad')
            Array.from(geoA.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type !== 'quad') geoWin = false;
            });
            // Check Insieme B (deve avere solo 'not-quad')
            Array.from(geoB.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type !== 'not-quad') geoWin = false;
            });

            if(geoWin) {
                geoFeedback.textContent = "Bravissimo! Hai raggruppato correttamente le figure geometriche.";
                geoFeedback.style.color = "var(--physics-color)";
            } else {
                geoFeedback.textContent = "C'è qualche forma nell'insieme sbagliato! Riprova.";
                geoFeedback.style.color = "#EF4444";
            }
        } else {
            geoFeedback.textContent = "";
        }

        // --- Pokémon ---
        const pkmnPool = document.getElementById('pkmn-pool');
        const pkmnFuoco = document.getElementById('pkmn-zone-fuoco');
        const pkmnAcqua = document.getElementById('pkmn-zone-acqua');
        const pkmnErba = document.getElementById('pkmn-zone-erba');
        const pkmnFeedback = document.getElementById('pkmn-feedback');

        if (pkmnPool && pkmnPool.children.length === 0) {
            let pkmnWin = true;
            
            Array.from(pkmnFuoco.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type !== 'fuoco') pkmnWin = false;
            });
            Array.from(pkmnAcqua.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type !== 'acqua') pkmnWin = false;
            });
            Array.from(pkmnErba.children).filter(child => child.classList.contains('drag-item')).forEach(child => {
                if(child.dataset.type !== 'erba') pkmnWin = false;
            });

            if(pkmnWin) {
                pkmnFeedback.textContent = "Ottimo! I Pokémon sono tutti nei loro Habitat (Insiemi) ideali!";
                pkmnFeedback.style.color = "var(--physics-color)";
            } else {
                pkmnFeedback.textContent = "Attenzione, alcuni elementi non appartengono a quell'insieme.";
                pkmnFeedback.style.color = "#EF4444";
            }
        } else if(pkmnFeedback) {
            pkmnFeedback.textContent = "";
        }

        // --- Partizione ---
        const partPool = document.getElementById('part-pool');
        const partPari = document.getElementById('part-zone-pari');
        const partDispari = document.getElementById('part-zone-dispari');
        const partFeedback = document.getElementById('part-feedback');

        if (partPool) {
            if (partPool.children.length === 0) {
                let partWin = true;
                
                const dragPari = partPari.querySelectorAll('.drag-item');
                dragPari.forEach(child => {
                    if(child.dataset.type !== 'pari') partWin = false;
                });
                
                const dragDispari = partDispari.querySelectorAll('.drag-item');
                dragDispari.forEach(child => {
                    if(child.dataset.type !== 'dispari') partWin = false;
                });

                if(dragPari.length === 0 || dragDispari.length === 0) {
                    partFeedback.textContent = "Sbagliato: Nessun sottoinsieme deve essere vuoto!";
                    partFeedback.style.color = "#EF4444";
                } else if(partWin) {
                    partFeedback.textContent = "Bravissimo! Tutte e 3 le regole rispettate: Unione di tutti dà A, Intersezione è vuota, nessun insieme è vuoto. Partizione esatta!";
                    partFeedback.style.color = "var(--physics-color)";
                } else {
                    partFeedback.textContent = "Qualcosa non va, un numero è nel sottoinsieme sbagliato (c'è stata un'intersezione errata).";
                    partFeedback.style.color = "#EF4444";
                }
            } else if (partPool.children.length > 0 && partPool.children.length < 6) {
                partFeedback.textContent = "Continua, manca ancora qualcosa. Ricorda: l'Unione dei sottoinsiemi deve essere uguale all'insieme di partenza A!";
                partFeedback.style.color = "var(--text-muted)";
            } else if (partFeedback) {
                partFeedback.textContent = "";
            }
        }
    }


    /* =========================================================
       3. QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Cos'è un insieme in matematica?",
            options: [
                "Un mucchio disordinato di oggetti",
                "Un raggruppamento di elementi ben definiti con almeno una caratteristica in comune",
                "Un numero molto grande"
            ],
            correct: 1
        },
        {
            question: "2. Quale di questi NON è un insieme ben definito?",
            options: [
                "I numeri pari minori di 10",
                "Le lettere della parola 'GATTO'",
                "I film più belli di tutti i tempi"
            ],
            correct: 2
        },
        {
            question: "3. Se metto un quadrato, un rettangolo e un rombo in un Insieme A. Qual è la loro caratteristica comune?",
            options: [
                "Sono tutti poligoni regolari (lati e angoli uguali)",
                "Sono tutti quadrilateri (hanno 4 lati)",
                "Non hanno nulla in comune"
            ],
            correct: 1
        },
        {
            question: "4. L'Intersezione (A ∩ B) tra due insiemi contiene:",
            options: [
                "Solo gli elementi che appartengono ad A ma non a B",
                "Tutti gli elementi di A uniti a tutti gli elementi di B",
                "Solo gli elementi che appartengono contemporaneamente sia ad A che a B"
            ],
            correct: 2
        },
        {
            question: "5. Se tutti gli elementi dell'insieme A sono contenuti nell'insieme B, come definiamo A?",
            options: [
                "A è un sottoinsieme di B (A ⊆ B)",
                "A è una partizione di B",
                "A è la differenza di B"
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
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        
                        // Disabilita tutte le opzioni per questa domanda ora che è corretta
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'default';
                        });

                        // Conta il punto solo se non era stato già sbagliato
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) {
                            currentScore++;
                        }
                        
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            if (currentScore === quizData.length) {
                                scoreEl.textContent = `COMPLIMENTI! Hai ottenuto ${currentScore} / ${quizData.length}. Hai imparato cos'è un insieme!`;
                                scoreEl.style.color = "var(--physics-color)";
                            } else {
                                scoreEl.textContent = `Hai ottenuto ${currentScore} / ${quizData.length}. Ottimo lavoro nel completare tutte le sfide!`;
                                scoreEl.style.color = "#F59E0B";
                            }
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.disabled = true;
                        btn.style.opacity = "0.7";
                        btn.style.cursor = "not-allowed";
                    }
                };
                
                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
