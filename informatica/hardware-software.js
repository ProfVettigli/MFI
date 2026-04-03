/**
 * hardware-software.js
 * Quiz for IT basics: Hardware and Software.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- QUIZ (5 questions) --- */
    const quizData = [
        {
            q: "1. Quale tra i seguenti componenti è considerato 'Hardware'?",
            a: ["Il sistema operativo Android.", "La memoria RAM.", "Un videogioco appena scaricato.", "Un documento di testo."],
            c: 1
        },
        {
            q: "2. Cosa si intende per Software 'Applicativo'?",
            a: ["Programmi che aiutano il computer ad accendersi in sicurezza.", "Programmi creati per far svolgere all'utente compiti specifici, come Word o Chrome.", "I circuiti fisici applicati alla scheda madre.", "Solo e unicamente l'interfaccia grafica del sistema operativo."],
            c: 1
        },
        {
            q: "3. Il Sistema Operativo (come Windows o macOS) appartiene alla categoria:",
            a: ["Hardware di periferica diretta.", "Software Applicativo per giocare.", "Software di Sistema.", "Hardware di memoria di massa."],
            c: 2
        },
        {
            q: "4. Qual è la funzione principale della CPU (Processore)?",
            a: ["Immagazzinare foto per molti anni anche a pc spento.", "Mostrare i pixel luminosi sullo schermo.", "Eseguire miliardi di operazioni logiche e calcoli al secondo.", "Raffreddare fisicamente i componenti interni."],
            c: 2
        },
        {
            q: "5. Senza il software, l'hardware di un computer...",
            a: ["...funziona bene ma è solo leggermente più lento.", "...può ancora navigare in internet basilare.", "...è del tutto inutile perché non ha istruzioni su cosa fare.", "...si surriscalda in modo esagerato."],
            c: 2
        },
        {
            q: "6. Qual è la causa principale del 'Collo di bottiglia di Von Neumann'?",
            a: ["Il fatto che la CPU non ha abbastanza pin metallici.", "Il fatto che Dati e Istruzioni risiedono nella stessa memoria e condividono lo stesso canale di trasmissione (Bus), mettendosi 'in fila'.", "I virus informatici che rallentano la lettura del disco.", "Il surriscaldamento eccessivo delle vecchie unità logiche."],
            c: 1
        },
        {
            q: "7. Nella 'Cipolla' dell'astrazione informatica, a cosa serve dividere il sistema in strati?",
            a: ["A nascondere la complessità del livello inferiore, permettendo al livello superiore di lavorare con molta più facilità.", "Per rendere i computer fisicamente più pesanti e sicuri dai furti.", "Solo per poter vendere più software all'utente.", "Per rallentare il sistema intenzionalmente."],
            c: 0
        },
        {
            q: "8. Come mai le GPU (Schede Video) NVIDIA oggi dominano il mercato dell'Intelligenza Artificiale?",
            a: ["Perché generano ologrammi per l'utente.", "Perché la loro architettura basata sul massiccio calcolo parallelo (nata per i pixel) si è rivelata perfetta per addestrare le Reti Neurali.", "Perché sono molto economiche ed ecocompatibili.", "Perché contengono un sistema operativo integrato."],
            c: 1
        },
        {
            q: "9. Dal punto di vista legale, qual è il cuore della filosofia Open Source applicata al software?",
            a: ["L'obbligo di pagare tasse alte agli sviluppatori originali.", "L'apertura pubblica del Codice Sorgente, permettendo a chiunque di studiare, modificare e distribuire liberamente i miglioramenti.", "Il fatto che il programma funzioni anche offline.", "Forzare gli sviluppatori a non inserire password di sicurezza nei database."],
            c: 1
        },
        {
            q: "10. Il progetto Arduino dimostra clamorosamente che:",
            a: ["L'informatica italiana produce solo software.", "È vietato condividere progetti fisici su internet.", "Anche l'Hardware può essere Open Source: gli schemi elettrici possono essere condivisi liberamente per permettere a chiunque la fabbricazione indipendente.", "I circuiti Arduino valgono milioni di dollari l'uno in brevetti chiusi."],
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
