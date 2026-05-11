/**
 * insiemi-numerici.js
 * JS logic for the Numerical Sets drag & drop sorter.
 */

document.addEventListener('DOMContentLoaded', () => {

    const numItems = document.querySelectorAll('.num-item');
    const zones = document.querySelectorAll('.zone-box, #pool');
    
    let activeDrag = null;

    numItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            activeDrag = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                activeDrag.style.opacity = '1';
                activeDrag = null;
                checkStatus();
            }, 0);
        });
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        
        zone.addEventListener('dragenter', e => {
            e.preventDefault();
            if (zone.id !== 'pool') {
                zone.style.background = 'rgba(255,255,255,0.05)';
            }
        });
        
        zone.addEventListener('dragleave', () => {
             if (zone.id !== 'pool') {
                 zone.style.background = 'rgba(0,0,0,0.3)';
             }
        });
        
        zone.addEventListener('drop', () => {
             if (zone.id !== 'pool') {
                 zone.style.background = 'rgba(0,0,0,0.3)';
             }
             if (activeDrag) {
                zone.appendChild(activeDrag);
             }
        });
    });

    function checkStatus() {
        const pool = document.getElementById('pool');
        const feedback = document.getElementById('feedback');
        
        if (pool && pool.children.length === 0) {
            let isWin = true;
            
            const dropZones = document.querySelectorAll('.zone-box');
            dropZones.forEach(z => {
                 const targetType = z.dataset.target;
                 const itemsInZone = z.querySelectorAll('.num-item');
                 
                 itemsInZone.forEach(item => {
                      if (item.dataset.type !== targetType) {
                          isWin = false;
                      }
                 });
            });

            if (isWin) {
                feedback.textContent = "Bravissimo! Hai inserito ogni numero nella sua scatola primordiale corretta. Ottimo lavoro con N, Z, Q e R!";
                feedback.style.color = "#10B981";
            } else {
                feedback.textContent = "Ci sono degli errori di classificazione. Controlla bene: alcune costanti fisiche sono irrazionali (R), e ricorda che le frazioni e i decimali non interi vanno nei Razionali (Q)!";
                feedback.style.color = "#EF4444";
            }
        } else if (pool) {
            feedback.textContent = "";
        }
    }

    /* =========================================================
       QUIZ GENERATION INSIEMI
       ========================================================= */
    const quizData = [
        {
            question: "1. Quale operazione NON è sempre definita nell'insieme dei Numeri Naturali ℕ?",
            options: [
                "Addizione",
                "Sottrazione",
                "Moltiplicazione"
            ],
            correct: 1
        },
        {
            question: "2. Come hanno risolto i matematici il limite dell'operazione di divisione (es. 5 diviso 2)?",
            options: [
                "Hanno inventato i Numeri Relativi (ℤ).",
                "Hanno inventato i Numeri Complessi (ℂ).",
                "Hanno introdotto i Numeri Razionali (ℚ), le frazioni."
            ],
            correct: 2
        },
        {
            question: "3. Quale insieme numerico include numeri con sequenze decimali infinite e MAI ripetitive, come il Pi Greco?",
            options: [
                "L'insieme dei Numeri Reali (ℝ).",
                "L'insieme dei Numeri Razionali (ℚ).",
                "Nessun insieme, non si possono scrivere matematicamente."
            ],
            correct: 0
        },
        {
            question: "4. A quale scopo principale è stata inventata l'unità Immaginaria (i) e l'insieme dei Numeri Complessi (ℂ)?",
            options: [
                "Per eseguire divisioni per zero.",
                "Per calcolare le radici quadrate di numeri negativi.",
                "Per fare contabilità aziendale."
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
            // optionsDiv.style.gap = "0.8rem"; // gestito tramite bootstrap utility class margin o gap se supportato, usiamo inline
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
                            scoreEl.textContent = `Eccellente! Hai totalizzato ${currentScore}/${quizData.length}. Padroneggi le chiusure matematiche e gli insiemi!`;
                            scoreEl.style.color = "var(--math-color)";
                        } else {
                            scoreEl.textContent = `Punteggio finale: ${currentScore}/${quizData.length}. Rileggi con attenzione come sono nati i vari set di numeri.`;
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
