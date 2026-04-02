// GESTIONE SIMULATORE TRASFORMAZIONI
const btnIsoterma = document.getElementById('btn-isoterma');
const btnIsobara = document.getElementById('btn-isobara');
const btnIsocora = document.getElementById('btn-isocora');

const simSlider = document.getElementById('sim-slider');
const simLabel = document.getElementById('sim-label');

const simP = document.getElementById('sim-p');
const simV = document.getElementById('sim-v');
const simT = document.getElementById('sim-t');

let mode = 'isoterma'; // Default
let P = 1.0, V = 1.0, T = 300;

function updateSimulatorDisplay() {
    simP.innerText = P.toFixed(2) + " atm";
    simV.innerText = V.toFixed(2) + " L";
    simT.innerText = Math.round(T) + " K";
    
    if (typeof drawClapeyron === 'function') {
        drawClapeyron();
    }
}

function setMode(newMode) {
    mode = newMode;
    // Reset variabili allo stato base per comodità visiva
    P = 1.0; 
    V = 1.0; 
    T = 300;
    
    // Reset stili
    btnIsoterma.style.background = mode === 'isoterma' ? 'var(--physics-color)' : '';
    btnIsobara.style.background = mode === 'isobara' ? 'var(--physics-color)' : '';
    btnIsocora.style.background = mode === 'isocora' ? 'var(--physics-color)' : '';

    if (mode === 'isoterma') {
        simSlider.min = 0.5;
        simSlider.max = 2.0;
        simSlider.step = 0.1;
        simSlider.value = 1.0;
        simLabel.innerText = "Varia Pressione (atm):";
    } else if (mode === 'isobara') {
        simSlider.min = 150;
        simSlider.max = 600;
        simSlider.step = 10;
        simSlider.value = 300;
        simLabel.innerText = "Varia Temperatura (K):";
    } else if (mode === 'isocora') {
        simSlider.min = 150;
        simSlider.max = 600;
        simSlider.step = 10;
        simSlider.value = 300;
        simLabel.innerText = "Varia Temperatura (K):";
    }
    
    updateSimulatorDisplay();
}

btnIsoterma.addEventListener('click', () => setMode('isoterma'));
btnIsobara.addEventListener('click', () => setMode('isobara'));
btnIsocora.addEventListener('click', () => setMode('isocora'));

simSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    
    if (mode === 'isoterma') {
        // T costante = 300
        // P * V = cost -> 1.0 * 1.0 = 1.0
        P = val;
        V = 1.0 / P;
    } else if (mode === 'isobara') {
        // P costante = 1.0
        // V / T = cost -> 1.0 / 300
        T = val;
        V = T / 300.0;
    } else if (mode === 'isocora') {
        // V costante = 1.0
        // P / T = cost -> 1.0 / 300
        T = val;
        P = T / 300.0;
    }
    
    updateSimulatorDisplay();
});

function drawClapeyron() {
    const canvas = document.getElementById('clapeyron-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const pad = 35; // Spazio per le etichette

    ctx.clearRect(0, 0, w, h);
    
    // Assi
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, 10); ctx.lineTo(pad, h-pad); // Asse Y (Pressione)
    ctx.lineTo(w-10, h-pad); // Asse X (Volume)
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "12px sans-serif";
    ctx.fillText("P (atm)", 5, 10);
    ctx.fillText("V (L)", w - 40, h - 5);

    // Mappatura coordinate (P min=0, max=2.5) (V min=0, max=4.5)
    const mapX = (vol) => pad + (vol / 4.5) * (w - pad - 20);
    const mapY = (pres) => (h - pad) - (pres / 2.5) * (h - pad - 20);

    // Disegna la traiettoria della trasformazione
    ctx.beginPath();
    ctx.strokeStyle = "rgba(100,200,255,0.3)";
    ctx.lineWidth = 3;
    if (mode === 'isoterma') {
        // Iperbole equilatera
        let started = false;
        for(let v = 0.2; v <= 4.5; v+=0.05) {
            let p = 1.0 / v; 
            if(p > 2.5) continue;
            let px = mapX(v);
            let py = mapY(p);
            if(!started) { ctx.moveTo(px, py); started = true; }
            else { ctx.lineTo(px, py); }
        }
    } else if (mode === 'isobara') {
        // Linea orizzontale
        let py = mapY(1.0);
        ctx.moveTo(mapX(0.2), py);
        ctx.lineTo(mapX(4.5), py);
    } else if (mode === 'isocora') {
        // Linea verticale
        let px = mapX(1.0);
        ctx.moveTo(px, mapY(0.2));
        ctx.lineTo(px, mapY(2.5));
    }
    ctx.stroke();

    // Coordinate stato attuale
    const currentX = mapX(V);
    const currentY = mapY(P);

    // Linee guida tratteggiate verso gli assi
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, currentY); ctx.lineTo(currentX, currentY); // Linea verso P
    ctx.moveTo(currentX, h-pad); ctx.lineTo(currentX, currentY); // Linea verso V
    ctx.stroke();
    ctx.setLineDash([]);

    // Punto di stato (pallino)
    ctx.fillStyle = "var(--physics-color, #e74c3c)";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, 2*Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Inizializza il grafico all'avvio
document.addEventListener('DOMContentLoaded', () => {
    drawClapeyron();
});


// --- QUESTIONARIO FINALE (STILE MFI) ---
const quizData = [
    {
        question: "1. Qual è una delle assunzioni per cui un gas viene considerato 'Perfetto'?",
        options: [
            "Le molecole sono grandissime e si intralciano costantemente.",
            "Esiste una forte attrazione magnetica tra tutte le molecole del gas.",
            "Gli urti tra le particelle e contro le pareti sono perfettamente elastici."
        ],
        correct: 2
    },
    {
        question: "2. Cosa ci dice la Legge di Boyle (Trasformazione Isoterma)?",
        options: [
            "A temperatura costante, pressione e volume sono inversamente proporzionali.",
            "All'aumentare del volume, aumenta anche la temperatura.",
            "A temperatura costante, la pressione rimane costante."
        ],
        correct: 0
    },
    {
        question: "3. Quale equazione rappresenta meglio l'Equazione di Stato dei Gas Perfetti?",
        options: [
            "P / V = n + R + T",
            "P \u00B7 V = n \u00B7 R \u00B7 T",
            "P = V \u00B7 T"
        ],
        correct: 1
    },
    {
        question: "4. Perché il calore specifico a pressione costante (Cp) è maggiore di quello a volume costante (Cv)?",
        options: [
            "Perché il gas si espande disperdendo il calore sotto forma di lavoro verso l'esterno.",
            "Perché a pressione costante le molecole pesano di più.",
            "È l'inversio, Cv è sempre maggiore di Cp nei gas."
        ],
        correct: 0
    },
    {
        question: "5. Cosa afferma la Relazione di Mayer formulata per i gas perfetti?",
        options: [
            "Cp + Cv = Zero",
            "Cp diviso Cv = R",
            "Cp - Cv = R"
        ],
        correct: 2
    },
    {
        question: "6. Nell'equazione dei Gas Reali di Van der Waals, a cosa serve il termine 'a' legato alla Pressione Interna?",
        options: [
            "Tiene conto del volume intrinseco occupato dalle singole molecole.",
            "Aggiunge una correzione alla pressione dovuta alle forze di attrazione tra le molecole.",
            "Sostituisce il numero di moli (n) quando il gas è puro."
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
                                scoreEl.textContent = `ECCELLENTE! Hai ottenuto ${currentScore} / ${quizData.length}. Sei un vero esperto di Gas Perfetti!`;
                                scoreEl.style.color = "var(--physics-color)";
                            } else {
                                scoreEl.textContent = `Hai completato il test con punteggio ${currentScore} / ${quizData.length}. Ottimo lavoro!`;
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
