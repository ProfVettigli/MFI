// Gestione del Simulatore di Dilatazione
const tempSlider = document.getElementById('temp-slider');
const tempVal = document.getElementById('temp-val');
const expVal = document.getElementById('exp-val');
const expansionBar = document.getElementById('expansion-bar');
const sliderFeedback = document.getElementById('slider-feedback');

tempSlider.addEventListener('input', function(e) {
    const deltaT = parseInt(e.target.value);
    tempVal.innerText = deltaT;

    const allungamento = (deltaT / 15) * 3;
    expVal.innerText = allungamento;

    expansionBar.style.width = (allungamento * 10) + 'px';

    if (deltaT === 0) {
        sliderFeedback.innerText = "Temperatura iniziale. Nessun allungamento.";
    } else if (deltaT === 15) {
        sliderFeedback.innerText = "A 15 °C, l'allungamento è di 3 mm.";
    } else if (deltaT === 30) {
        sliderFeedback.innerText = "Guarda! Raddoppiando la temperatura (30 °C), l'allungamento è esattamente IL DOPPIO (6 mm)!";
    } else if (deltaT === 60) {
        sliderFeedback.innerText = "Quadruplicando la temperatura iniziale (60 °C), anche l'allungamento quadruplica (12 mm)!";
    } else {
        sliderFeedback.innerText = "Osserva la proporzionalità diretta.";
    }
});

// Gestione dell'Esercizio Interattivo
function checkAnswer() {
    const answer = parseInt(document.getElementById('quiz-answer').value);
    const feedback = document.getElementById('quiz-feedback');

    if (isNaN(answer)) {
        feedback.innerText = "Per favore, inserisci un numero.";
        feedback.style.color = "orange";
        return;
    }

    if (answer === 8) {
        feedback.innerHTML = "<strong>Esatto!</strong> Hai usato la proporzionalità diretta: raddoppiando l'aumento di temperatura (da 20 a 40), raddoppia l'allungamento (da 4 mm a 8 mm). Eccellente!";
        feedback.style.color = "green";
    } else {
        feedback.innerHTML = "<strong>Sbagliato.</strong> Ricorda la regola: se l'aumento di temperatura raddoppia (da 20 a 40), cosa deve succedere esattamente all'allungamento (che prima era di 4 mm)? Riprova!";
        feedback.style.color = "red";
    }
}

// Gestione del Simulatore Calorimetro
function startCalorimeter() {
    const hotBlock = document.getElementById('hot-block');
    const coldBlock = document.getElementById('cold-block');
    const statusText = document.getElementById('calorimeter-status');
    const btn = document.getElementById('btn-calorimetro');

    btn.disabled = true;
    btn.style.background = "#95a5a6";
    btn.innerText = "Scambio in corso...";
    statusText.innerText = "Stato: Scambio termico in corso...";
    statusText.style.color = "#e67e22";

    let tempHot = 80;
    let tempCold = 20;
    const eqTemp = (tempHot + tempCold) / 2; 

    // Grafico setup
    const canvas = document.getElementById('calorimeter-chart');
    const ctx = canvas.getContext('2d');
    const history = [];
    
    // Pulisce Grafico
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const interval = setInterval(() => {
        history.push({h: parseFloat(tempHot), c: parseFloat(tempCold)});
        drawChart(ctx, canvas, history);

        // Modello Asintotico: variazione proporzionale alla differenza
        const k = 0.15; // Coefficiente di raffreddamento/riscaldamento
        const deltaH = (tempHot - eqTemp) * k;
        const deltaC = (eqTemp - tempCold) * k;

        tempHot -= deltaH;
        tempCold += deltaC;

        hotBlock.innerText = tempHot.toFixed(1) + "°C";
        coldBlock.innerText = tempCold.toFixed(1) + "°C";

        // Animazione colore (frazionata)
        const alpha = (tempHot - eqTemp) / (80 - eqTemp); // va da 1 a 0
        hotBlock.style.backgroundColor = `rgba(231, 76, 60, ${0.5 + 0.5*alpha})`;
        coldBlock.style.backgroundColor = `rgba(52, 152, 219, ${1 - 0.5*alpha})`;

        // Stop quando la differenza è trascurabile (0.2 gradi)
        if (tempHot - eqTemp < 0.2 && eqTemp - tempCold < 0.2) {
            tempHot = eqTemp;
            tempCold = eqTemp;
            hotBlock.innerText = "50.0°C";
            coldBlock.innerText = "50.0°C";
            
            clearInterval(interval);
            statusText.innerText = "Stato: Equilibrio Termico Raggiunto (50°C)";
            statusText.style.color = "#27ae60";
            btn.innerText = "Ripristina";
            btn.style.background = "#f39c12";
            btn.onclick = resetCalorimeter;
            btn.disabled = false;
        }
    }, 100); 
}

function resetCalorimeter() {
    const hotBlock = document.getElementById('hot-block');
    const coldBlock = document.getElementById('cold-block');
    const statusText = document.getElementById('calorimeter-status');
    const btn = document.getElementById('btn-calorimetro');

    hotBlock.innerText = "80.0°C";
    hotBlock.style.backgroundColor = "#e74c3c";

    coldBlock.innerText = "20.0°C";
    coldBlock.style.backgroundColor = "#3498db";

    statusText.innerText = "Stato: Isolati";
    statusText.style.color = "#2c3e50";

    btn.innerText = "Avvia Scambio Termico";
    btn.style.background = "#2ecc71";
    btn.onclick = startCalorimeter;

    // Reset Grafico
    const canvas = document.getElementById('calorimeter-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

function drawChart(ctx, canvas, history) {
    const w = canvas.width;
    const h = canvas.height;
    const pad = 30;

    ctx.clearRect(0, 0, w, h);
    
    // Griglia/Assi
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, h-pad);
    ctx.lineTo(w-pad, h-pad);
    ctx.stroke();

    // Etichette assi semplici
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px sans-serif";
    ctx.fillText("80°C", 5, pad+5);
    ctx.fillText("20°C", 5, h-pad);
    ctx.fillText("Tempo →", w/2 - 20, h-10);

    const steps = (80 - 20) / 2; // 30 step per arrivare a equilibrio
    const stepX = (w - 2*pad) / steps; 

    // Linea Caldo
    ctx.beginPath();
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    history.forEach((state, i) => {
        const x = pad + i * stepX;
        const y = (h-pad) - ( (state.h - 20) / (80 - 20) * (h - 2*pad) );
        if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Linea Freddo
    ctx.beginPath();
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 3;
    history.forEach((state, i) => {
        const x = pad + i * stepX;
        const y = (h-pad) - ( (state.c - 20) / (80 - 20) * (h - 2*pad) );
        if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

// --- QUESTIONARIO FINALE (STILE MFI) ---
const quizData = [
    {
        question: "1. Qual è la differenza fondamentale tra calore e temperatura?",
        options: [
            "La temperatura è energia in transito, il calore è uno stato.",
            "Il calore è energia in transito, la temperatura misura lo stato termico.",
            "Sono esattamente la stessa cosa, ma misurati con strumenti diversi."
        ],
        correct: 1
    },
    {
        question: "2. Se la temperatura di un binario aumenta del triplo, cosa succede al suo allungamento?",
        options: [
            "L'allungamento triplica.",
            "La lunghezza totale raddoppia.",
            "L'allungamento rimane lo stesso."
        ],
        correct: 0
    },
    {
        question: "3. Qual è lo scopo principale del calorimetro?",
        options: [
            "Evitare che il calore scambiato esca dal sistema per misurarlo con precisione.",
            "Mantenere costante la pressione del gas all'interno.",
            "Misurare la velocità della luce generata dal calore."
        ],
        correct: 0
    },
    {
        question: "4. Qual è la modalità di scambio termico tipica dei solidi (es. un cucchiaio in una pentola)?",
        options: [
            "Convezione",
            "Conduzione",
            "Irraggiamento"
        ],
        correct: 1
    },
    {
        question: "5. Come fa l'energia termica del Sole a raggiungere la Terra attraversando il vuoto?",
        options: [
            "Attraverso correnti d'aria calda (convezione).",
            "Per contatto diretto con l'atmosfera (conduzione).",
            "Tramite onde elettromagnetiche (irraggiamento)."
        ],
        correct: 2
    },
    {
        question: "6. Quale di questi fenomeni è un esempio di convezione?",
        options: [
            "Il manico che si scotta toccando la padella.",
            "Il riscaldamento di una stanza tramite correnti di aria calda provenienti dal termosifone.",
            "Sentire il calore del fuoco di un camino stando a distanza."
        ],
        correct: 1
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        // Disabilita tutte le opzioni per questa domanda ora che è corretta
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'default';
                        });

                        // Conta il punto solo se non era stato già sbagliato
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) {
                            currentScore++;
                        }
                        
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            if (currentScore === quizData.length) {
                                scoreEl.textContent = `ECCELLENTE! Hai ottenuto ${currentScore} / ${quizData.length}. Sei un esperto!`;
                                scoreEl.style.color = "var(--physics-color)";
                            } else {
                                scoreEl.textContent = `Hai ottenuto ${currentScore} / ${quizData.length}. Ottimo lavoro nel completare tutte le sfide!`;
                                scoreEl.style.color = "#F59E0B";
                            }
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.disabled = true;
                        btn.style.opacity = "0.7";
                        btn.style.cursor = "not-allowed";
                    }
                };
                
                optionsDiv.appendChild(btn);
            });

            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
