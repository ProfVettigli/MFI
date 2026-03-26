/**
 * espressioni-numeriche.js
 * Logica per il processore interattivo di espressioni.
 */

document.addEventListener('DOMContentLoaded', () => {

    const levels = [
        {
            // Level 1: 5 + 3 * 2
            htmlCode: `<span>5</span> <span class="op-btn" data-correct="false" data-err="Le moltiplicazioni si fanno PRIMA delle addizioni!">+</span> <span>3</span> <span class="op-btn" data-correct="true">×</span> <span>2</span>`,
            nextHtml: `<span>5</span> <span class="op-btn" data-correct="true">+</span> <span style="color:#10B981;">6</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">11</span>`,
            startMsg: "Sfida 1: Seleziona quale operatore va calcolato prima."
        },
        {
            // Level 2: 10 - ( 4 / 2 )
            htmlCode: `<span>10</span> <span class="op-btn" data-correct="false" data-err="Guarda bene, c'è una parentesi. Le parentesi hanno la precedenza MASSIMA!">-</span> <span style="color:#EC4899;">(</span> <span>4</span> <span class="op-btn" data-correct="true">÷</span> <span>2</span> <span style="color:#EC4899;">)</span>`,
            nextHtml: `<span>10</span> <span class="op-btn" data-correct="true">-</span> <span style="color:#10B981;">2</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">8</span>`,
            startMsg: "Sfida 2: Attenzione alle Parentesi!"
        },
        {
            // Level 3: 15 / 3 + 2 * 4
            htmlCode: `<span>15</span> <span class="op-btn" data-correct="true">÷</span> <span>3</span> <span class="op-btn" data-correct="false" data-err="Prima le moltiplicazioni e divisioni!">+</span> <span>2</span> <span class="op-btn" data-correct="true">×</span> <span>4</span>`,
            nextHtml: `<span>5</span> <span class="op-btn" data-correct="false" data-err="Ci sono ancora moltiplicazioni pendenti!">+</span> <span>2</span> <span class="op-btn" data-correct="true">×</span> <span>4</span>`,
            nextHtml2: `<span>5</span> <span class="op-btn" data-correct="true">+</span> <span style="color:#10B981;">8</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">13</span>`,
            startMsg: "Sfida 3: Due operazioni 'potenti' in una volta. Da dove inizi?"
        },
        {
            // Level 4: ( 10 - 2 * 4 ) + 5
            htmlCode: `<span style="color:#EC4899;">(</span> <span>10</span> <span class="op-btn" data-correct="false" data-err="Anche DENTRO la parentesi valgono le regole di precedenza (Prima la moltiplicazione!)">-</span> <span>2</span> <span class="op-btn" data-correct="true">×</span> <span>4</span> <span style="color:#EC4899;">)</span> <span class="op-btn" data-correct="false" data-err="Devi prima risolvere tutto ciò che c'è nella parentesi!">+</span> <span>5</span>`,
            nextHtml: `<span style="color:#EC4899;">(</span> <span>10</span> <span class="op-btn" data-correct="true">-</span> <span style="color:#10B981;">8</span> <span style="color:#EC4899;">)</span> <span class="op-btn" data-correct="false" data-err="Pulisci prima la parentesi">+</span> <span>5</span>`,
            nextHtml2: `<span style="color:#10B981;">2</span> <span class="op-btn" data-correct="true">+</span> <span>5</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">7</span>`,
            startMsg: "Sfida 4: Parentesi con Trabocchetto! (Ordine interno)"
        },
        {
            // Level 5: [ 3 + ( 2 ^ 3 ) ] * 2
            htmlCode: `<span style="color:#8B5CF6;">[</span> <span>3</span> <span class="op-btn" data-correct="false" data-err="Prima devi risolvere le parentesi TONDE interne!">+</span> <span style="color:#EC4899;">(</span> <span>2</span> <span class="op-btn" data-correct="true">^</span> <span>3</span> <span style="color:#EC4899;">)</span> <span style="color:#8B5CF6;">]</span> <span class="op-btn" data-correct="false" data-err="Fuori dalla quadra! È l'ultima cosa da fare.">×</span> <span>2</span>`,
            nextHtml: `<span style="color:#8B5CF6;">[</span> <span>3</span> <span class="op-btn" data-correct="true">+</span> <span style="color:#10B981;">8</span> <span style="color:#8B5CF6;">]</span> <span class="op-btn" data-correct="false" data-err="Risolvi prima dentro la quadra">×</span> <span>2</span>`,
            nextHtml2: `<span style="color:#10B981;">11</span> <span class="op-btn" data-correct="true">×</span> <span>2</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">22</span>`,
            startMsg: "Sfida 5 (Boss Finale): Parentesi annidate e potenze!"
        }
    ];

    let currentLvl = 0;
    let currentStep = 0;

    const exprContainer = document.getElementById('expr-container');
    const msg = document.getElementById('solver-msg');
    const nextBtn = document.getElementById('next-lvl-btn');

    function loadLevel(index) {
        currentLvl = index;
        currentStep = 0;
        exprContainer.innerHTML = levels[index].htmlCode;
        msg.textContent = levels[index].startMsg;
        msg.style.color = "var(--text-muted)";
        nextBtn.style.display = "none";
        document.querySelector('.solver-box h3').textContent = "Sfida Livello " + (index + 1);
        
        attachOpEvents();
    }

    function attachOpEvents() {
        const ops = exprContainer.querySelectorAll('.op-btn');
        ops.forEach(op => {
            op.addEventListener('click', () => {
                if(op.dataset.correct === "true") {
                    msg.innerHTML = "Esatto! Risoluzione del frammento...";
                    msg.style.color = "#10B981"; // Success Green
                    
                    setTimeout(() => {
                        advanceStep();
                    }, 500);

                } else {
                    msg.innerHTML = "<strong>Errore:</strong> " + op.dataset.err;
                    msg.style.color = "#EF4444"; // Error Red
                    // Shake animation effect
                    op.style.transform = "translateX(-5px)";
                    setTimeout(() => op.style.transform = "translateX(5px)", 50);
                    setTimeout(() => op.style.transform = "translateX(-5px)", 100);
                    setTimeout(() => op.style.transform = "scale(1)", 150);
                }
            });
        });
    }

    function advanceStep() {
        currentStep++;
        const lvlObj = levels[currentLvl];
        
        // Calcola dinamicamente la key (nextHtml, nextHtml2, nextHtml3...)
        const nextKey = currentStep === 1 ? 'nextHtml' : 'nextHtml' + currentStep;
        
        if(lvlObj[nextKey]) {
            exprContainer.innerHTML = lvlObj[nextKey];
            msg.textContent = "Seleziona la prossima operazione.";
            msg.style.color = "var(--text-muted)";
            attachOpEvents();
        } else {
            // Finito!
            exprContainer.innerHTML = lvlObj.finalHtml;
            msg.textContent = "Bravissimo! Espressione Matematica Risolta.";
            msg.style.color = "#10B981";
            
            if(currentLvl < levels.length - 1) {
                nextBtn.style.display = "block";
                nextBtn.textContent = "Prossimo Livello (Più Difficile!) \u2192";
                nextBtn.onclick = () => loadLevel(currentLvl + 1);
            } else {
                nextBtn.style.display = "block";
                nextBtn.textContent = "Hai completato il modulo Espressioni!";
                nextBtn.onclick = () => window.location.href = "notazione-esponenziale.html";
            }
        }
    }

    // Init
    if (exprContainer) {
        loadLevel(0);
    }
});
