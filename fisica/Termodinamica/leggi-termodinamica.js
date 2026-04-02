/**
 * Script per la simulazione del Principio Zero e Quiz interattivo
 * Modulo Termodinamica
 */

// Elementi DOM (Simulazione)
const btnAC = document.getElementById('btn-contact-AC');
const btnBC = document.getElementById('btn-contact-BC');
const btnConclusion = document.getElementById('btn-conclusion');
const statusText = document.getElementById('sim-status');
const resultBox = document.getElementById('sim-result');

const tempA = document.getElementById('temp-A');
const tempB = document.getElementById('temp-B');
const tempC = document.getElementById('temp-C');

const boxA = document.getElementById('box-A');
const boxB = document.getElementById('box-B');
const boxC = document.getElementById('box-C');

const lineAC = document.getElementById('line-AC');
const lineBC = document.getElementById('line-BC');

let state = {
    tempA: 90,
    tempB: 50,
    tempC: 10,
    step: 0
};

// --- SIMULATION LOGIC ---

function updateDisplay() {
    tempA.textContent = state.tempA + '°C';
    tempB.textContent = state.tempB + '°C';
    tempC.textContent = state.tempC + '°C';
    
    // update colors roughly based on temp
    // 10C = blue, 50C = yellow, 90C = red
    function getColor(t) {
        if(t <= 10) return '#3b82f6'; // blue
        if(t >= 90) return '#ef4444'; // red
        return '#f59e0b'; // yellow/orange  
    }
    
    boxA.style.backgroundColor = getColor(state.tempA);
    boxB.style.backgroundColor = getColor(state.tempB);
    boxC.style.backgroundColor = getColor(state.tempC);
}

function resetSim() {
    state.tempA = 90;
    state.tempB = 50;
    state.tempC = 10;
    state.step = 0;
    
    btnAC.disabled = false;
    btnBC.disabled = true;
    btnConclusion.disabled = true;
    
    lineAC.classList.remove('heat-flow-right', 'heat-flow-left');
    lineBC.classList.remove('heat-flow-right', 'heat-flow-left');
    lineAC.style.background = 'rgba(255, 255, 255, 0.2)';
    lineBC.style.background = 'rgba(255, 255, 255, 0.2)';
    
    boxA.style.borderColor = 'transparent';
    boxB.style.borderColor = 'transparent';
    boxC.style.borderColor = 'transparent';
    
    statusText.textContent = "Stato iniziale: Sistemi separati";
    resultBox.style.display = 'none';
    
    updateDisplay();
}

function simulateAC() {
    btnAC.disabled = true;
    statusText.textContent = "Flusso di calore da A verso C...";
    
    // Animation for flow A -> C
    lineAC.classList.add('heat-flow-right');
    lineAC.style.background = 'rgba(239, 68, 68, 0.5)'; // red-ish
    boxA.style.borderColor = 'white';
    boxC.style.borderColor = 'white';
    
    setTimeout(() => {
        // Calculate equilibrium (assuming equal mass and specific heat for simplicity)
        let eqTemp = (state.tempA + state.tempC) / 2;
        state.tempA = eqTemp;
        state.tempC = eqTemp;
        
        updateDisplay();
        lineAC.classList.remove('heat-flow-right');
        lineAC.style.background = '#10B981'; // green = equilibrium
        
        statusText.textContent = `Equilibrio raggiunto tra A e C a ${eqTemp}°C.`;
        btnBC.disabled = false;
    }, 2000);
}

function simulateBC() {
    btnBC.disabled = true;
    statusText.textContent = "Verifica contatto B e C...";
    boxB.style.borderColor = 'white';
    
    // Check difference
    if(state.tempB === state.tempC) {
        // Already equilibrium
        setTimeout(() => {
            lineBC.style.background = '#10B981';
            statusText.textContent = `Nessun flusso. B e C sono già in equilibrio a ${state.tempC}°C.`;
            btnConclusion.disabled = false;
        }, 1000);
    }
}

function checkAB() {
    btnConclusion.disabled = true;
    
    // Highlight all
    boxA.style.boxShadow = '0 0 20px #10B981';
    boxB.style.boxShadow = '0 0 20px #10B981';
    boxC.style.boxShadow = '0 0 20px #10B981';
    
    statusText.textContent = "Termine dell'esperimento.";
    resultBox.style.display = 'block';
}


// --- INTERACTIVE MODULES LOGIC ---
function calculateU() {
    const qVal = parseFloat(document.getElementById('input-q').value) || 0;
    const lVal = parseFloat(document.getElementById('input-l').value) || 0;
    const deltaU = qVal - lVal;
    
    document.getElementById('result-u').textContent = deltaU + " J";
    
    const bar = document.getElementById('bar-u');
    // For visual representation, let's assume a range of -1000 to +1000 maps to 0% to 100% width, centered at 50%
    let percentage = 50 + (deltaU / 20); // 1000 -> +50% -> 100%, -1000 -> -50% -> 0%
    if(percentage < 0) percentage = 0;
    if(percentage > 100) percentage = 100;
    
    bar.style.width = percentage + '%';
    
    if (deltaU > 0) {
        bar.style.background = '#10B981'; // Green for positive
        document.getElementById('result-u').style.color = '#10B981';
    } else if (deltaU < 0) {
        bar.style.background = '#EF4444'; // Red for negative
        document.getElementById('result-u').style.color = '#EF4444';
    } else {
        bar.style.background = '#F59E0B'; // Yellow for zero
        document.getElementById('result-u').style.color = '#F59E0B';
    }
}

function calculateEfficiency() {
    const tc = parseFloat(document.getElementById('input-tc').value) || 1; // avoid division by zero
    const th = parseFloat(document.getElementById('input-th').value) || 1;
    
    let eff = 0;
    if (th > tc && tc >= 0) {
        eff = 1 - (tc / th);
    } else if (tc > th) {
        // Just show 0 if they swap values wrongly
        eff = 0;
    }
    
    const effPercentage = (eff * 100).toFixed(1);
    document.getElementById('result-eff').textContent = effPercentage + " %";
}

// --- FUNZIONE PER IL QUIZ ---
function checkAnswer(buttonClicked, isCorrect) {
    if (buttonClicked.classList.contains('correct') || buttonClicked.classList.contains('wrong')) return;

    if (isCorrect) {
        buttonClicked.style.backgroundColor = "#2ecc71"; // Verde smeraldo morbido
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#27ae60";
        buttonClicked.classList.add('correct');
        if (!buttonClicked.innerHTML.includes("✓")) {
            buttonClicked.innerHTML += " <strong>✓ Esatto!</strong>";
        }
        
        // Disabilita e scurisci gli altri nello stesso blocco
        const parentBlock = buttonClicked.parentElement;
        const allButtons = parentBlock.querySelectorAll('.quiz-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = "default";
            if (!btn.classList.contains('correct')) btn.style.opacity = "0.7";
        });
    } else {
        buttonClicked.style.backgroundColor = "#e74c3c"; // Rosso alizarin
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#c0392b";
        buttonClicked.classList.add('wrong');
        if (!buttonClicked.innerHTML.includes("✗")) {
            buttonClicked.innerHTML += " <strong>✗ Riprova!</strong>";
        }
        buttonClicked.disabled = true; // disabilita solo il pulsante errato per permettere altri tentativi
        buttonClicked.style.cursor = "not-allowed";
        buttonClicked.style.opacity = "0.7";
    }
}

// Inizializzazione
window.onload = () => {
    updateDisplay();
    calculateU();
    calculateEfficiency();
};
