let simulationInterval;
let reservoirInterval;

// 1. SIMULATORE EQUILIBRIO TERMICO (MEDIA PONDERATA)
function startSimulation() {
    const mA = parseFloat(document.getElementById('mass-a').value);
    const cA = parseFloat(document.getElementById('cs-a').value);
    let tA = parseFloat(document.getElementById('temp-a').value);
    
    const mB = parseFloat(document.getElementById('mass-b').value);
    const cB = parseFloat(document.getElementById('cs-b').value);
    let tB = parseFloat(document.getElementById('temp-b').value);
    
    const blockA = document.getElementById('block-a');
    const blockB = document.getElementById('block-b');
    const statusText = document.getElementById('teq-display');
    const btn = document.getElementById('btn-start');
    
    if (isNaN(mA) || isNaN(cA) || isNaN(tA) || isNaN(mB) || isNaN(cB) || isNaN(tB)) {
        alert("Inserisci tutti i valori correttamente!"); return;
    }

    if (simulationInterval) clearInterval(simulationInterval);
    
    const C_A = mA * cA; 
    const C_B = mB * cB; 
    const T_eq = (C_A * tA + C_B * tB) / (C_A + C_B);
    
    statusText.innerText = T_eq.toFixed(1) + " °C";
    btn.disabled = true;
    btn.style.backgroundColor = "#95a5a6";
    btn.innerText = "Scambio asintotico in corso...";
    
    const initialMax = Math.max(tA, tB);
    const initialMin = Math.min(tA, tB);
    const range = initialMax - initialMin || 1; 
    
    function getColor(temp) {
        const ratio = (temp - initialMin) / range; 
        const r = Math.round(52 + ratio * (231 - 52));
        const g = Math.round(152 + ratio * (76 - 152));
        const b = Math.round(219 + ratio * (60 - 219));
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    const decayRate = 0.05; 
    
    simulationInterval = setInterval(() => {
        let diffA = T_eq - tA;
        let diffB = T_eq - tB;
        
        if (Math.abs(diffA) < 0.05 && Math.abs(diffB) < 0.05) {
            tA = T_eq; tB = T_eq;
            clearInterval(simulationInterval);
            btn.disabled = false;
            btn.style.backgroundColor = "#f39c12"; 
            btn.innerText = "Ripeti Esperimento";
        } else {
            tA += diffA * decayRate;
            tB += diffB * decayRate;
        }
        
        blockA.innerText = tA.toFixed(1) + " °C";
        blockB.innerText = tB.toFixed(1) + " °C";
        blockA.style.backgroundColor = getColor(tA);
        blockB.style.backgroundColor = getColor(tB);
        
    }, 100); 
}

// 2. SIMULATORE RESERVOIR (CURVA ESPONENZIALE)
function startReservoirSim() {
    if (reservoirInterval) clearInterval(reservoirInterval);
    
    const canvas = document.getElementById('coolingCanvas');
    const ctx = canvas.getContext('2d');
    const objDisplay = document.getElementById('obj-temp-display');
    const btn = document.getElementById('btn-reservoir');
    
    // Setup parametri
    let tempObj = 100;
    const tempRes = 20; // Il reservoir non cambia mai
    const decayConstant = 0.03; // Costante di raffreddamento "k" della formula
    
    let timeStep = 0;
    const dataPoints = [];
    
    // Prepariamo la tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    btn.disabled = true;
    btn.innerText = "Raffreddamento in corso...";
    
    reservoirInterval = setInterval(() => {
        // Applichiamo la legge di Newton: la variazione è proporzionale alla differenza di temperatura
        let deltaT = tempObj - tempRes;
        tempObj -= decayConstant * deltaT; 
        
        // Salviamo il punto per il grafico
        dataPoints.push({ x: timeStep, y: tempObj });
        
        // Aggiorniamo il display numerico
        objDisplay.innerText = tempObj.toFixed(1) + " °C";
        
        // Disegniamo il grafico
        drawGraph(ctx, canvas, dataPoints, tempRes);
        
        timeStep++;
        
        // Fermiamo quando siamo asintoticamente molto vicini (es. 20.1)
        if (tempObj - tempRes < 0.2 || timeStep > canvas.width) {
            clearInterval(reservoirInterval);
            btn.disabled = false;
            btn.innerText = "Ripeti Tuffo";
        }
    }, 50); // Frame veloci
}

// Funzione helper per disegnare il grafico sul canvas
function drawGraph(ctx, canvas, data, resTemp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disegna la linea tratteggiata del Reservoir (Asintoto)
    const yRes = canvas.height - ((resTemp / 100) * canvas.height); // Scala la y
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, yRes);
    ctx.lineTo(canvas.width, yRes);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.stroke();
    
    // Testo Asintoto
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("Temperatura Reservoir (20°C)", 10, yRes - 10);
    
    // Disegna la curva esponenziale rossa
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    
    for (let i = 0; i < data.length; i++) {
        // Mappa i valori sulle coordinate del canvas
        let x = data[i].x * 2; // Spaziatura orizzontale
        let y = canvas.height - ((data[i].y / 100) * canvas.height); 
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

// 3. FUNZIONE PER IL QUIZ
function checkAnswer(buttonClicked, isCorrect) {
    if (buttonClicked.classList.contains('correct') || buttonClicked.classList.contains('wrong')) return;

    if (isCorrect) {
        buttonClicked.style.backgroundColor = "#2ecc71"; 
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#27ae60";
        buttonClicked.classList.add('correct');
        if (!buttonClicked.innerHTML.includes("✓")) {
            buttonClicked.innerHTML += " <strong>✓ Esatto!</strong>";
        }
        
        const parentBlock = buttonClicked.parentElement;
        const allButtons = parentBlock.querySelectorAll('.quiz-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = "default";
            if (!btn.classList.contains('correct')) btn.style.opacity = "0.7";
        });
    } else {
        buttonClicked.style.backgroundColor = "#e74c3c"; 
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#c0392b";
        buttonClicked.classList.add('wrong');
        if (!buttonClicked.innerHTML.includes("✗")) {
            buttonClicked.innerHTML += " <strong>✗ Riprova!</strong>";
        }
        buttonClicked.disabled = true;
        buttonClicked.style.cursor = "not-allowed";
        buttonClicked.style.opacity = "0.7";
    }
}