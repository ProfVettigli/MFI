/**
 * probabilita.js
 * Interattività per la lezione di Probabilità (MFI)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- QUIZ FINALE --- */
    const quizData = [
        {
            q: "1. Cos'è lo spazio campionatorio Ω?",
            a: ["L'insieme di tutti i possibili risultati di un esperimento.", "La somma delle probabilità di tutti gli eventi.", "Il numero di volte che un evento si è verificato.", "L'area riservata all'allenamento dei Sayan."],
            c: 0
        },
        {
            q: "2. Quando si usa la definizione classica di probabilità?",
            a: ["Quando gli eventi hanno diversa probabilità.", "Quando tutti gli eventi sono equiprobabili (come un dado equo).", "Solo nei casi di vita o di morte.", "Quando non abbiamo dati storici."],
            c: 1
        },
        {
            q: "3. Se due eventi sono INDIPENDENTI, come calcoliamo la probabilità che accadano entrambi?",
            a: ["Sommando le loro probabilità.", "Sottraendo la probabilità dell'uno dall'altro.", "Moltiplicando le loro probabilità.", "Dividendo la probabilità maggiore per la minore."],
            c: 2
        },
        {
            q: "4. Qual è la probabilità condizionata P(A|B)?",
            a: ["La probabilità che A accada sapendo che B si è già verificato.", "La probabilità che A e B non accadano mai.", "La probabilità soggettiva di A.", "La probabilità che B accada sapendo che A si è verificato."],
            c: 0
        },
        {
            q: "5. Cosa rappresenta il teorema di Bayes?",
            a: ["Un modo per calcolare quante carte ha Yugi nel mazzo.", "Lo schema per contare le stelle di Bulma.", "Un metodo rigoroso per aggiornare le proprie credenze alla luce di nuove prove.", "La formula base per sommare due eventi certi."],
            c: 2
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
});

/* --- ESERCIZI INTERMEDI --- */

function showFeedback(elementId, isCorrect, message) {
    const feedbackEl = document.getElementById(elementId);
    feedbackEl.style.display = 'block';
    feedbackEl.textContent = message;
    feedbackEl.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
}

function checkSpazio() {
    let ans = document.getElementById('ans-spazio').value.replace(/\s/g, '');
    if (ans === '{1,2,3,4,5,6,7,8,9,10}' || ans === '1,2,3,4,5,6,7,8,9,10') {
        showFeedback('feed-spazio', true, "Esatto! Lo spazio campionatorio Ω include ogni singola domanda.");
    } else {
        showFeedback('feed-spazio', false, "Non proprio. Ricorda di elencare tutti i risultati tra parentesi graffe: {1, 2, ..., 10}");
    }
}

function checkClassica() {
    let ans = document.getElementById('ans-classica').value.replace(/\s/g, '');
    if (ans === '4/50' || ans === '2/25') {
        showFeedback('feed-classica', true, "Ottimo lavoro! 4 Imperatori (favorevoli) su 50 pirati nel mazzo (possibili).");
    } else {
        showFeedback('feed-classica', false, "Mancato! Il rapporto è 4 (Imperatori) fratto 50 (carte totali). Riprova!");
    }
}

function checkIndip() {
    let ans = document.getElementById('ans-indip').value.replace(/\s/g, '');
    if (ans === '1/400') {
        showFeedback('feed-indip', true, "Fantastico! (1/20) * (1/20) = 1/400. Hai appena tirato un colpo critico devastante!");
    } else {
        showFeedback('feed-indip', false, "Ricorda: devi moltiplicare le probabilità individuali (1/20 * 1/20).");
    }
}

function checkFreq() {
    let ans = parseFloat(document.getElementById('ans-freq').value.replace(',', '.'));
    if (ans === 0.5) {
        showFeedback('feed-freq', true, "Esatto! 10 drop su 2000 kill = 0.005, ovvero lo 0.5%.");
    } else {
        showFeedback('feed-freq', false, "Sbagliato. Dividi 10 per 2000 e moltiplica per 100 per ottenere la %.");
    }
}

function checkSogg() {
    let ans = document.getElementById('ans-sogg').value;
    if (ans === 'no') {
        showFeedback('feed-sogg', true, "Esatto! La probabilità soggettiva dipende dalle informazioni che ciascuno possiede.");
    } else {
        showFeedback('feed-sogg', false, "Pensaci bene: se ho visto un indizio che tu non hai visto, la mia fiducia nell'evento cambierà rispetto alla tua.");
    }
}