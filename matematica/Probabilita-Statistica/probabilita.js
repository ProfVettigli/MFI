/**
 * probabilita.js
 * Interattività per la lezione di Probabilità (MFI)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- QUIZ FINALE (6 domande) --- */
    const quizData = [
        {
            q: "1. Cosa rappresenta il simbolo Ω (Omega)?",
            a: [
                "L'insieme di tutti i possibili risultati di un esperimento.",
                "La somma delle probabilità di tutti gli eventi.",
                "Il numero di volte che un evento si è verificato.",
                "La probabilità massima raggiungibile."
            ],
            c: 0
        },
        {
            q: "2. Quando si usa la definizione classica di probabilità?",
            a: [
                "Quando gli eventi hanno diversa probabilità.",
                "Quando tutti gli eventi sono equiprobabili (come un dado equo).",
                "Solo nei casi di vita o di morte.",
                "Quando non abbiamo dati storici."
            ],
            c: 1
        },
        {
            q: "3. Se A e B sono eventi INDIPENDENTI, quanto vale P(A ∩ B)?",
            a: [
                "P(A) + P(B)",
                "P(A) − P(B)",
                "P(A) · P(B)",
                "P(A) / P(B)"
            ],
            c: 2
        },
        {
            q: "4. Cosa indica la notazione P(A|B)?",
            a: [
                "La probabilità di A, sapendo che B si è già verificato.",
                "La probabilità che A e B accadano insieme.",
                "La probabilità di A diviso la probabilità di B.",
                "La probabilità che B accada dopo A."
            ],
            c: 0
        },
        {
            q: "5. Il teorema di Bayes permette di:",
            a: [
                "Calcolare quante carte ha Yugi nel mazzo.",
                "Sommare le probabilità di eventi incompatibili.",
                "Aggiornare le proprie credenze alla luce di nuove prove.",
                "Calcolare la probabilità di eventi certi."
            ],
            c: 2
        },
        {
            q: "6. Se P(E) = 0.4, quanto vale P(Ē), la probabilità dell'evento complementare?",
            a: [
                "0.4",
                "0.6",
                "1.4",
                "0"
            ],
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
                    if (btn.classList.contains('picked')) return;
                    
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        if (!card.classList.contains('attempted')) {
                            score++;
                        }
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
                        card.classList.add('attempted');
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }

    /* --- PARADOSSO STATISTICO --- */
    const paradoxBtns = document.querySelectorAll('.paradox-btn');
    const paradoxFeedback = document.getElementById('paradox-feedback');

    paradoxBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            let msg = "";

            if (val === "25") {
                msg = `<strong>Hai scelto 25%</strong>. Se la risposta fosse 25%, avresti ragione... ma ci sono DUE opzioni (A e C) che dicono 25%. Quindi scegliendo a caso avresti il 50% di probabilità, rendendo il 25% sbagliato!`;
            } else if (val === "50") {
                msg = `<strong>Hai scelto 50%</strong>. Se la risposta fosse 50%, avresti ragione... ma c'è solo UNA opzione (D) che dice 50%. Quindi scegliendo a caso avresti il 25% di probabilità, rendendo il 50% sbagliato!`;
            } else if (val === "0") {
                msg = `<strong>Hai scelto 0%</strong>. Se la risposta fosse 0%, non potresti mai indovinare. Ma scegliendo questa opzione a caso (1 su 4) avresti il 25% di probabilità di indovinare, rendendo lo 0% una contraddizione!`;
            }

            paradoxFeedback.innerHTML = msg;
            paradoxFeedback.className = 'feedback';
            paradoxFeedback.style.display = 'block';
            paradoxFeedback.style.background = 'rgba(236, 72, 153, 0.1)';
            paradoxFeedback.style.border = '1px solid #EC4899';
            paradoxFeedback.style.color = '#EC4899';
            
            // Highlight selected
            paradoxBtns.forEach(b => b.style.opacity = "0.6");
            btn.style.opacity = "1";
            btn.style.borderColor = "#EC4899";
        });
    });
});

/* --- ESERCIZI INTERMEDI --- */

function showFeedback(elementId, isCorrect, message) {
    const feedbackEl = document.getElementById(elementId);
    feedbackEl.style.display = 'block';
    feedbackEl.textContent = message;
    feedbackEl.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
}

/* --- 1. NOTAZIONE --- */
function checkNotazione() {
    const answers = {
        'not-1': 'a',   // Ω = insieme risultati
        'not-2': 'b',   // P(A ∩ B) = entrambi
        'not-3': 'b',   // P(A|B) = dato
        'not-4': 'b'    // P(Ē) = 0.7
    };
    let correct = 0;
    const total = Object.keys(answers).length;

    for (const [id, expected] of Object.entries(answers)) {
        const el = document.getElementById(id);
        if (el.value === expected) {
            correct++;
            el.style.borderColor = '#10B981';
            el.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.3)';
        } else {
            el.style.borderColor = '#EF4444';
            el.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.3)';
        }
    }

    if (correct === total) {
        showFeedback('feed-notazione', true, `Perfetto! ${correct}/${total} — Padroneggi il linguaggio della probabilità!`);
    } else {
        showFeedback('feed-notazione', false, `${correct}/${total} corretti. I campi in rosso sono da rivedere. Rileggi le card qui sopra e riprova!`);
    }
}

/* --- 2. SPAZIO CAMPIONATORIO --- */
function checkSpazio() {
    let ans = document.getElementById('ans-spazio').value.replace(/\s/g, '');
    if (ans === '{1,2,3,4,5,6,7,8,9,10,11,12}' || ans === '1,2,3,4,5,6,7,8,9,10,11,12') {
        showFeedback('feed-spazio', true, "Esatto! Lo spazio campionatorio Ω include tutte le 12 Poké Ball possibili.");
    } else {
        showFeedback('feed-spazio', false, "Non proprio. Ricorda di elencare tutti i risultati tra parentesi graffe: {1, 2, ..., 12}");
    }
}

/* --- 3. DEFINIZIONE CLASSICA --- */
function checkClassica() {
    let ans = document.getElementById('ans-classica').value.replace(/\s/g, '');
    if (ans === '4/40' || ans === '1/10') {
        showFeedback('feed-classica', true, "Ottimo lavoro! 4 Assi (favorevoli) su 40 carte totali (possibili). Pronto per una partita a Scopa?");
    } else {
        showFeedback('feed-classica', false, "Sbagliato! Il rapporto è 4 (Assi) fratto 40 (carte totali). Riprova!");
    }
}

/* --- 4. EVENTI INDIPENDENTI --- */
function checkIndip() {
    let ans = document.getElementById('ans-indip').value.replace(/\s/g, '');
    if (ans === '1/400') {
        showFeedback('feed-indip', true, "Fantastico! (1/20) × (1/20) = 1/400. Hai appena tirato un colpo critico devastante!");
    } else {
        showFeedback('feed-indip', false, "Ricorda: devi moltiplicare le probabilità individuali (1/20 × 1/20).");
    }
}

/* --- 5a. PROBABILITÀ CONDIZIONATA --- */
function checkCondiz() {
    let ans = document.getElementById('ans-condiz').value.replace(/\s/g, '');
    if (ans === '1/3') {
        showFeedback('feed-condiz', true, "Perfetto! Tra i 3 numeri pari {2, 4, 6}, solo uno è il 6. Quindi P(6|pari) = 1/3.");
    } else {
        showFeedback('feed-condiz', false, "Non proprio. Sapendo che è pari, i casi possibili si riducono a {2, 4, 6}. Di questi, quanti sono 6? Riprova!");
    }
}

/* --- 5b. TEOREMA DI BAYES --- */
function checkBayes() {
    let ans = document.getElementById('ans-bayes').value.replace(/\s/g, '').replace(',', '.');
    let num = parseFloat(ans);
    // Accetta 80, 80%, 4/5, 0.8
    if (num === 80 || ans === '4/5' || num === 0.8) {
        showFeedback('feed-bayes', true, "Esatto! P(Scatola B | Shiny) = 80%. La scatola con più shiny è la più probabile!");
    } else {
        showFeedback('feed-bayes', false, "Non proprio. Usa il Teorema di Bayes: P(B|Shiny) = P(Shiny|B)·P(B) / P(Shiny). Puoi anche aprire la soluzione guidata qui sopra!");
    }
}

/* --- 6. FREQUENTISTA --- */
function checkFreq() {
    let ans = parseFloat(document.getElementById('ans-freq').value.replace(',', '.'));
    if (ans === 0.5) {
        showFeedback('feed-freq', true, "Esatto! 10 drop su 2000 kill = 0.005, ovvero lo 0.5%.");
    } else {
        showFeedback('feed-freq', false, "Sbagliato. Dividi 10 per 2000 e moltiplica per 100 per ottenere la %.");
    }
}

/* --- 7. SOGGETTIVA --- */
function checkSogg() {
    let ans = document.getElementById('ans-sogg').value;
    if (ans === 'no') {
        showFeedback('feed-sogg', true, "Esatto! La probabilità soggettiva dipende dalle informazioni che ciascuno possiede.");
    } else {
        showFeedback('feed-sogg', false, "Pensaci bene: se ho visto un indizio che tu non hai visto, la mia fiducia nell'evento cambierà rispetto alla tua.");
    }
}