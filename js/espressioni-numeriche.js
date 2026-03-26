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
            startMsg: "Seleziona quale operatore va calcolato prima."
        },
        {
            // Level 2: 10 - ( 4 / 2 )
            htmlCode: `<span>10</span> <span class="op-btn" data-correct="false" data-err="Guarda bene, c'è una parentesi. Le parentesi hanno la precedenza MASSIMA!">-</span> <span style="color:#EC4899;">(</span> <span>4</span> <span class="op-btn" data-correct="true">÷</span> <span>2</span> <span style="color:#EC4899;">)</span>`,
            nextHtml: `<span>10</span> <span class="op-btn" data-correct="true">-</span> <span style="color:#10B981;">2</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">8</span>`,
            startMsg: "Livello 2: Attenzione alle Parentesi!"
        },
        {
            // Level 3: 15 / 3 + 2 * 4
            htmlCode: `<span>15</span> <span class="op-btn" data-correct="true">÷</span> <span>3</span> <span class="op-btn" data-correct="false" data-err="Prima le moltiplicazioni e divisioni!">+</span> <span>2</span> <span class="op-btn" data-correct="true">×</span> <span>4</span>`,
            nextHtml: `<span>5</span> <span class="op-btn" data-correct="false" data-err="Ci sono ancora moltiplicazioni pendenti!">+</span> <span>2</span> <span class="op-btn" data-correct="true">×</span> <span>4</span>`,
            nextHtml2: `<span>5</span> <span class="op-btn" data-correct="true">+</span> <span style="color:#10B981;">8</span>`,
            finalHtml: `<span style="color:#10B981; font-size:4rem; font-weight:900;">13</span>`,
            startMsg: "Livello 3: Due operazioni 'potenti' in una volta. Da dove inizi?"
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
        
        attachOpEvents();
    }

    function attachOpEvents() {
        const ops = exprContainer.querySelectorAll('.op-btn');
        ops.forEach(op => {
            op.addEventListener('click', () => {
                if(op.dataset.correct === "true") {
                    msg.innerHTML = "Esatto! Risoluzione del pezzo...";
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
        
        if(currentStep === 1 && lvlObj.nextHtml) {
            exprContainer.innerHTML = lvlObj.nextHtml;
            msg.textContent = "Seleziona la prossima operazione.";
            msg.style.color = "var(--text-muted)";
            attachOpEvents();
        } else if(currentStep === 2 && lvlObj.nextHtml2) {
            exprContainer.innerHTML = lvlObj.nextHtml2;
            msg.textContent = "Seleziona la prossima operazione.";
            msg.style.color = "var(--text-muted)";
            attachOpEvents();
        } else {
            // Finito!
            exprContainer.innerHTML = lvlObj.finalHtml;
            msg.textContent = "Bravissimo! Espressione Risolta.";
            msg.style.color = "#10B981";
            
            if(currentLvl < levels.length - 1) {
                nextBtn.style.display = "block";
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
