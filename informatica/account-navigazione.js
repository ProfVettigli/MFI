/**
 * account-navigazione.js
 * Quiz for IT basics: Safe Navigation, accounts, HTTP/HTTPS.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- QUIZ (9 questions) --- */
    const quizData = [
        {
            q: "1. Che cos'è fondamentalmente un 'Account' informatico?",
            a: ["L'insieme dell'hardware fisico presente nella stanza.", "Un programa per calcolare i conti matematici complessi.", "Il proprio spazio logico, protetto, che isola e definisce la tua identità e i tuoi permessi all'interno di un sistema o sito.", "Un virus benevolo del computer."],
            c: 2
        },
        {
            q: "2. Che cos'è fisicamente 'Internet'?",
            a: ["Una magia astratta fluttuante sopra le nuvole che non necessita di materia.", "La gigantesca rete fisica globale composta da chilometri di cavi sottomarini, router terrestri e server congelati nei datacenter.", "Un unico computer potentissimo posizionato alla Casa Bianca.", "Solo l'interfaccia grafica del browser Chrome."],
            c: 1
        },
        {
            q: "3. Come riescono spesso gli hacker a rubare incredibili quantità di password?",
            a: ["Sfonda tutti i server universitari fisicamente usando la forza bruta sui computer.", "Usa le 'Arti Jedi'.", "Spesso non calcolano codici, ma ingannano in modo puramente psicologico l'utente tramite false e-mail paurose (Phishing/Social Engineering).", "Cercano sotto i tappetini del mouse fisicamente nei bar."],
            c: 2
        },
        {
            q: "4. Quando nel browser scrivi un URL per arrivare a un sito, cosa significa HTTP?",
            a: ["È il protocollo Standard ma totalmente pericoloso (Testo non criptato). Ciò che invii viaggia nudo e può essere ascoltato da chiunque.", "È un prefisso decorativo.", "È il nuovo chip della Apple.", "Significa 'Hyper Tecnology' e garantisce che i server non si scarichino elettricamente."],
            c: 0
        },
        {
            q: "5. Perché cerchiamo sempre il simbolo del lucchetto (HTTPS)?",
            a: ["Perché blocca fisicamente i tasti della tastiera.", "Perché ci dà uno sconto quando compriamo oggetti su Amazon.", "Perché la 'S' sta per Secure: i dati (come la password o i soldi) vengono criptati pesantemente prima di passare sui cavi oceani e appariranno incomprensibili ad un hacker intercettatore.", "Per far riposare lo schermo spegnendolo se non lo tocchiamo."],
            c: 2
        },
        {
            q: "6. Qual è l'enorme vantaggio dell'Autenticazione a Due Fattori (2FA)?",
            a: ["Rende impossibile dimenticarsi la password della banca.", "Richiede non solo 'qualcosa che sai' (la password) ma anche 'qualcosa che hai' (il tuo smartphone fisico). Se l'hacker ruba la password online, resterà comunque bloccato senza il tuo telefono in mano.", "Raddoppia semplicemente la lunghezza minima della password da 8 a 16 caratteri.", "Evita il surriscaldamento del microprocessore."],
            c: 1
        },
        {
            q: "7. Quale tra questi linguaggi viene paragonato allo 'scheletro' (struttura) di una pagina web?",
            a: ["CSS", "JavaScript", "HTML (HyperText Markup Language)", "C++"],
            c: 2
        },
        {
            q: "8. Se voglio cambiare il colore di tutti i titoli della mia pagina in rosa, quale linguaggio devo usare?",
            a: ["HTML", "CSS (Cascading Style Sheets)", "Python", "SQL"],
            c: 1
        },
        {
            q: "9. A cosa serve JavaScript all'interno di un sito?",
            a: ["A definire quanto sono grandi i margini delle immagini.", "A scrivere il testo dei paragrafi.", "A gestire l'interattività e la logica, come far comparire un messaggio quando clicchi un tasto.", "È un antivirus che protegge la navigazione."],
            c: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizArea.innerHTML = ""; // Clear existing
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
                        return;
                    }
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        if (!card.classList.contains('attempted')) score++;
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= (quizData.length - 2) ? "#10B981" : "#F59E0B";
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

    /* --- WEB BUILDER LAB --- */
    const checkCss = document.getElementById('check-css');
    const checkJs = document.getElementById('check-js');
    const labButton = document.getElementById('lab-button');
    const labFeedback = document.getElementById('lab-feedback');

    function updateLab() {
        if (checkCss.checked) {
            labButton.style.padding = "12px 24px";
            labButton.style.backgroundColor = "#3b82f6";
            labButton.style.color = "white";
            labButton.style.border = "none";
            labButton.style.borderRadius = "8px";
            labButton.style.cursor = "pointer";
            labButton.style.fontWeight = "bold";
            labButton.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        } else {
            labButton.style = "all: revert;";
            labButton.style.display = "block";
        }
    }

    if (checkCss && checkJs && labButton) {
        checkCss.onchange = updateLab;
        labButton.onclick = () => {
            if (checkJs.checked) {
                labFeedback.textContent = "JavaScript attivo: Hai cliccato! 🎉";
                labFeedback.style.color = "#10b981";
            } else {
                labFeedback.textContent = "Logica assente: non succede nulla...";
                labFeedback.style.color = "#9ca3af";
            }
        };
    }
});
