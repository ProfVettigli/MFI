/**
 * file-system.js
 * Logic for interactive folder tree and quiz about File System
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- INTERACTIVE DIRECTORY TREE --- */
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => {
        // Find the title element specifically to toggle, otherwise clicking children triggers it
        const titleSpan = folder.querySelector('.title');
        if (titleSpan) {
            titleSpan.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Toggle the open class which is mapped to display: block in CSS
                folder.classList.toggle('open');
            });
        }
    });

    // Make files inert for clicks, just prevent bubbling
    const files = document.querySelectorAll('.file');
    files.forEach(file => {
        const titleSpan = file.querySelector('.title');
        if(titleSpan) {
            titleSpan.addEventListener('click', (e) => {
                e.stopPropagation(); // Just so it doesn't trigger parent folders accidentaly
            });
        }
    });


    /* --- QUIZ (5 questions) --- */
    const quizData = [
        {
            q: "1. Senza un File System, come apparirebbe il disco rigido al computer?",
            a: ["Una libreria disposta perfettamente con indici ordinati.", "Una mappa interattiva mondiale.", "Un immenso e caotico oceano di singoli Byte privi di ogni ordine gerarchico o collegamento strutturato.", "Una cartella chiamata 'C:'."],
            c: 2
        },
        {
            q: "2. Su cosa si basa lo schema del File System nei sistemi operativi basati su Linux?",
            a: ["Sull'assegnare una lettera dell'alfabeto (A, C, D) ad ogni nuovo blocco o disco che inserisci.", "Su un unico grande albero la cui radice universale è un singolo slash '/' alla base di tutto.", "Sui comandi vocali.", "Su icone colorate nascoste."],
            c: 1
        },
        {
            q: "3. Molti dispositivi come iPhone (iOS) adottano la filosofia tecnica del 'Sandbox'. Cosa comporta all'utente?",
            a: ["Che può formattare la memoria interna liberamente se lo desidera.", "Che il File System gerarchico gli è deliberatamente precluso/nascosto e i file sono accessibili solo unicamente tramite le App pertinenti.", "Che ha ottenuto pieni poteri di 'Super Amministratore' sulla macchina.", "Che ogni foto occupa il 50% di spazio in più."],
            c: 1
        },
        {
            q: "4. A cosa serve il permesso di sola 'Lettura' (Read) imposto ad un file aziendale importante?",
            a: ["Permette agli impiegati autorizzati di prendere visione e copiare le informazioni, ma disabilita matematicamente il loro potere di modificarne il contenuto o distruggere il documento per sbaglio.", "A cambiare il nome del proprietario del computer.", "A far ruotare in orizzontale lo schermo mentre lo si legge.", "A trasformare qualsiasi file in un PDF."],
            c: 0
        },
        {
            q: "5. Se cerco un file in Windows, potrei trovare storicamente il percorso scritto con i famosi...",
            a: ["Cerchi rossi e parentesi graffe.", "Sbarramenti a forward slash '/' rossi.", "Backslash '\\' impiegati per scendere verticalmente nei vari rami (es. C:\\Utenti\\Mario).", "Numeri magici."],
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
