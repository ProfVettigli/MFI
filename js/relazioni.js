/**
 * relazioni.js
 * Gestisce l'attività di classificazione drag&drop (Equivalenza vs Ordine) e il Quiz.
 */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       DRAG AND DROP LOGIC (Classificazione Relazioni)
       ========================================================= */
    const dragItems = document.querySelectorAll('.drag-item-text');
    const zones = document.querySelectorAll('.class-zone, .drag-pool');
    
    let activeDrag = null;

    dragItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            activeDrag = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                activeDrag.style.opacity = '1';
                activeDrag = null;
                checkRelState(); // Controlla vittoria
            }, 0);
        });
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('dragenter', e => {
            e.preventDefault();
            zone.style.background = 'rgba(255,255,255,0.1)';
        });
        zone.addEventListener('dragleave', () => {
            zone.style.background = 'rgba(0,0,0,0.2)';
        });
        zone.addEventListener('drop', () => {
            zone.style.background = 'rgba(0,0,0,0.2)';
            if (activeDrag) {
                zone.appendChild(activeDrag);
            }
        });
    });

    function checkRelState() {
        const pool = document.getElementById('rel-pool');
        const eqZone = document.getElementById('zone-eq');
        const orZone = document.getElementById('zone-or');
        const feedback = document.getElementById('rel-feedback');

        if (pool && pool.children.length === 0) {
            let isWin = true;
            
            Array.from(eqZone.querySelectorAll('.drag-item-text')).forEach(child => {
                if(child.dataset.type !== 'eq') isWin = false;
            });
            Array.from(orZone.querySelectorAll('.drag-item-text')).forEach(child => {
                if(child.dataset.type !== 'or') isWin = false;
            });

            if (isWin) {
                feedback.textContent = "Bravissimo! Hai classificato correttamente le relazioni d'Equivalenza (simmetriche/alla pari) e le relazioni d'Ordine (asimmetriche/classifiche).";
                feedback.style.color = "var(--physics-color)";
            } else {
                feedback.textContent = "Attenzione, c'è un intruso in uno dei contenitori. Ricorda: l'ordine stabilisce una gerarchia rigida!";
                feedback.style.color = "#EF4444";
            }
        } else if (pool) {
            feedback.textContent = "";
        }
    }

    /* =========================================================
       QUIZ GENERATION
       ========================================================= */
    const quizData = [
        {
            question: "1. Affinché una relazione sia di Equivalenza, quali proprietà deve possedere?",
            options: [
                "Solo Simmetrica e Transitiva",
                "Riflessiva, Antisimmetrica, Transitiva",
                "Riflessiva, Simmetrica, Transitiva"
            ],
            correct: 2
        },
        {
            question: "2. Cosa caratterizza l'Antisimmetria?",
            options: [
                "È valida in entrambe le direzioni liberamente, senza restrizioni.",
                "Se vale sia A -> B che B -> A allora A e B sono per forza lo stesso elemento.",
                "Se A è legato a B, B non può mai essere legato a C."
            ],
            correct: 1
        },
        {
            question: "3. La relazione 'Essere Fratello di' che tipo di relazione è?",
            options: [
                "Una relazione di Equivalenza.",
                "Una relazione d'Ordine.",
                "Nessuna delle due."
            ],
            correct: 0
        },
        {
            question: "4. Qual è l'esempio principe di una Relazione d'Ordine?",
            options: [
                "Essere più grande o maggiore ( > )",
                "Avere gli stessi gusti musicali",
                "Appartenere allo stesso nucleo di gioco"
            ],
            correct: 0
        },
        {
            question: "5. Una funzione si dice 'Suriettiva' quando:",
            options: [
                "Gli elementi di A colpiscono tutti elementi diversi in B",
                "Ogni elemento del codominio B viene raggiunto da almeno una freccia",
                "Può essere piegata, ma non tagliata"
            ],
            correct: 1
        },
        {
            question: "6. Nella topologia, una tazza di caffè e una ciambella sono la stessa cosa perché:",
            options: [
                "Sono legati da un Omeomorfismo (possono essere deformati in modo continuo)",
                "Non hanno la proprietà Transitiva",
                "Sono un'immersione iniettiva nell'iperspazio"
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
                        btn.style.background = "var(--physics-color)";
                        btn.style.borderColor = "var(--physics-color)";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        allBtns[q.correct].style.background = "var(--physics-color)";
                        allBtns[q.correct].style.borderColor = "var(--physics-color)";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        if (currentScore === quizData.length) {
                            scoreEl.textContent = `COMPLIMENTI! Master Relazionale! (${currentScore}/${quizData.length})`;
                            scoreEl.style.color = "var(--physics-color)";
                        } else {
                            scoreEl.textContent = `Punteggio finale: ${currentScore}/${quizData.length}. Quasi perfetto, ma le Relazioni sono argomenti insidiosi!`;
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
