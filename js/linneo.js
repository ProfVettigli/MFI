/**
 * linneo.js
 * Logica per l'attività Drag & Drop per la Tassonomia e per la generazione del Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       DRAG AND DROP LOGIC (Classificazione Animali Linneo)
       ========================================================= */
    const animalItems = document.querySelectorAll('.animal-item');
    const classZones = document.querySelectorAll('.class-zone, .animal-pool');
    
    let activeDrag = null;

    animalItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            activeDrag = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                activeDrag.style.opacity = '1';
                activeDrag = null;
                checkLinneoState(); // Controlla successo
            }, 0);
        });
    });

    classZones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        
        zone.addEventListener('dragenter', e => {
            e.preventDefault();
            if (zone.id !== 'animal-pool') {
                zone.style.background = 'rgba(255,255,255,0.1)';
            }
        });
        
        zone.addEventListener('dragleave', () => {
             if (zone.id !== 'animal-pool') {
                 zone.style.background = 'transparent';
             }
        });
        
        zone.addEventListener('drop', () => {
             if (zone.id !== 'animal-pool') {
                 zone.style.background = 'transparent';
             }
             if (activeDrag) {
                zone.appendChild(activeDrag);
             }
        });
    });

    function checkLinneoState() {
        const pool = document.getElementById('animal-pool');
        const feedback = document.getElementById('linneo-feedback');
        
        // Verifica se il pool è vuoto
        if (pool && pool.children.length === 0) {
            let isWin = true;
            
            // Loop per ogni zona di classificazione
            const zones = document.querySelectorAll('.class-zone');
            zones.forEach(zone => {
                 const targetType = zone.dataset.target;
                 const itemsInZone = zone.querySelectorAll('.animal-item');
                 
                 itemsInZone.forEach(item => {
                      if (item.dataset.class !== targetType) {
                          isWin = false;
                      }
                 });
            });

            if (isWin) {
                feedback.textContent = "Classificazione Perfetta! Hai utilizzato la logica esclusiva degli insiemi. Il delfino non ha branchie, quindi non è nei pesci, e il pipistrello allatta i cuccioli, quindi entra felicemente nei mammiferi!";
                feedback.style.color = "#10B981"; // Green biology
            } else {
                feedback.textContent = "C'è un errore nella classificazione. Controlla bene le definizioni logiche: fatti guidare dalle proprietà univoche!";
                feedback.style.color = "#EF4444"; // Red error
            }
        } else if (pool) {
            feedback.textContent = "";
        }
    }


    /* =========================================================
       QUIZ GENERATION LINNEO
       ========================================================= */
    const quizData = [
        {
            question: "1. Perché in biologia, secondo Linneo, è essenziale usare definizioni 'inequivocabili'?",
            options: [
                "Perché la biologia è una scienza astratta.",
                "Per stabilire in modo logico binario (Vero/Falso) se un animale appartiene o meno ad uno specifico insieme tassonomico.",
                "Per evitare che le persone usino nomi diversi in continenti diversi."
            ],
            correct: 1
        },
        {
            question: "2. Dal punto di vista della Teoria degli Insiemi, che cos'è la 'Classe' rispetto al 'Phylum'?",
            options: [
                "La Classe è un sottoinsieme del Phylum, poiché possiede regole più restrittive.",
                "La Classe è l'insieme che circonda e contiene il Phylum.",
                "Sono insiemi completamente disgiunti che non hanno intersezione."
            ],
            correct: 0
        },
        {
            question: "3. Il Delfino vive in mare, possiede pinne e non ha peli visibili, ma allatta e ha polmoni. Come risolviamo la classificazione logica?",
            options: [
                "Non possiamo classificarlo in nessun insieme.",
                "Rispettando rigorosamente la congiunzione logica (AND) della classe 'Mammiferi' che richiede l'allattamento e polmoni. Viene classificato nei Mammiferi.",
                "Creiamo un'eccezione logica inserendolo sia nei Pesci che nei Mammiferi."
            ],
            correct: 1
        },
        {
            question: "4. Cosa esprime in biologia il sistema della Nomenclatura Binomiale (es. Homo sapiens)?",
            options: [
                "L'intersezione tra la Famiglia e l'Ordine dell'organismo.",
                "L'appartenenza all'insieme 'Genere' (Homo) e al sottoinsieme specifico 'Specie' (sapiens).",
                "Un nome scelto casualmente basato sul luogo della scoperta."
            ],
            correct: 1
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
                btn.className = 'quiz-btn';
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
                    const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                    allBtns.forEach(b => {
                        b.disabled = true;
                        b.style.cursor = "not-allowed";
                    });
                    
                    if (optIndex === q.correct) {
                        btn.style.background = "#10B981"; // Green for Bio
                        btn.style.borderColor = "#10B981";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        // Color the correct one Green
                        allBtns[q.correct].style.background = "#10B981";
                        allBtns[q.correct].style.borderColor = "#10B981";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `Bravissimo! Hai totalizzato ${currentScore}/${quizData.length}. Hai capito perfettamente l'importazione logica della biologia!`;
                            scoreEl.style.color = "#10B981";
                        } else {
                            scoreEl.textContent = `Punteggio finale: ${currentScore}/${quizData.length}. Ricorda, la biologia usa forme strette di logica! Riprova gli esercizi.`;
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
