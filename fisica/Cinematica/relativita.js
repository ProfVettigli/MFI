// ═══════════════════════════════════════════════════════
// SIMULAZIONE: ARBITRARIETA' DEL SISTEMA DI RIFERIMENTO
// ═══════════════════════════════════════════════════════
const refCanvas = document.getElementById('refCanvas');
const ctx = refCanvas ? refCanvas.getContext('2d') : null;

const valX = document.getElementById('val-x');
const valY = document.getElementById('val-y');

let originX = 0;
let originY = 0;
const scale = 40; // 40px = 1 unita' di misura (metro)

// Posizione fissa dell'oggetto (stella) in coordinate assolute del canvas
let targetFixedX = 0;
let targetFixedY = 0;

let isDragging = false;

function initCanvas() {
    if(!refCanvas) return;
    refCanvas.width = refCanvas.parentElement.clientWidth;
}

function drawSystem() {
    if(!ctx) return;
    ctx.clearRect(0, 0, refCanvas.width, refCanvas.height);
    
    // Disegna Griglia magnetica agganciata all'origine
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    // vertical lines
    let offX = originX % scale;
    if(offX < 0) offX += scale;
    for(let x = offX; x < refCanvas.width; x += scale) {
        ctx.moveTo(x, 0); ctx.lineTo(x, refCanvas.height);
    }
    // horizontal lines
    let offY = originY % scale;
    if(offY < 0) offY += scale;
    for(let y = offY; y < refCanvas.height; y += scale) {
        ctx.moveTo(0, y); ctx.lineTo(refCanvas.width, y);
    }
    ctx.stroke();
    
    // Disegna Assi X e Y
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    // Asse X (Orizzontale)
    ctx.moveTo(0, originY);
    ctx.lineTo(refCanvas.width, originY);
    // Asse Y (Verticale)
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, refCanvas.height);
    ctx.stroke();
    
    // Frecce finali degli assi
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    // Arrow X
    ctx.moveTo(refCanvas.width - 10, originY - 5);
    ctx.lineTo(refCanvas.width, originY);
    ctx.lineTo(refCanvas.width - 10, originY + 5);
    ctx.fill();
    // Arrow Y
    ctx.moveTo(originX - 5, 10);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 5, 10);
    ctx.fill();
    
    // Disegna Ticks (Tacche numerate)
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px Inter, sans-serif';
    // X ticks
    for(let i = -20; i <= 20; i++) {
        if(i===0) continue;
        let px = originX + i * scale;
        if(px > 0 && px < refCanvas.width) {
            ctx.beginPath(); ctx.moveTo(px, originY - 4); ctx.lineTo(px, originY + 4); ctx.stroke();
            if(i % 5 === 0) ctx.fillText(i.toString(), px - 8, originY + 18);
        }
    }
    // Y ticks
    for(let i = -20; i <= 20; i++) {
        if(i===0) continue;
        let py = originY - i * scale;
        if(py > 0 && py < refCanvas.height) {
            ctx.beginPath(); ctx.moveTo(originX - 4, py); ctx.lineTo(originX + 4, py); ctx.stroke();
            if(i % 5 === 0) ctx.fillText(i.toString(), originX - 25, py + 4);
        }
    }
    
    // Punto Origine O (Rosso)
    ctx.fillStyle = '#ef4444'; 
    ctx.beginPath(); ctx.arc(originX, originY, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'white'; 
    ctx.font = 'bold 14px Inter';
    ctx.fillText('O', originX + 10, originY - 10);
    
    // Disegna Vettore Posizione
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // Arancione sfumato
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(originX, originY);
    ctx.lineTo(targetFixedX, targetFixedY);
    ctx.stroke();
    // Proiezioni X e Y
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.moveTo(targetFixedX, targetFixedY);
    ctx.lineTo(targetFixedX, originY);
    ctx.moveTo(targetFixedX, targetFixedY);
    ctx.lineTo(originX, targetFixedY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Disegna l'Oggetto reale (Evento / Stella dorata)
    ctx.fillStyle = '#f59e0b';
    ctx.font = '28px Arial';
    ctx.fillText('⭐', targetFixedX - 14, targetFixedY + 10);
    
    // Calcola visivamente le Coordinate Logiche e scrivile a schermo
    const coordX = (targetFixedX - originX) / scale;
    // Y è positivo verso l'alto nello spazio logico, mentre su canvas è verso il basso!
    const coordY = (originY - targetFixedY) / scale; 
    
    // Aggiorna interfaccia HTML della dashboard
    if(valX) valX.innerText = (coordX > 0 ? '+' : '') + coordX.toFixed(1);
    if(valY) valY.innerText = (coordY > 0 ? '+' : '') + coordY.toFixed(1);
}

// Listener Mouse/Touch per muovere l'Origine del Sistema
if(refCanvas) {
    initCanvas();
    
    // Starting defaults
    originX = refCanvas.width / 3;
    originY = refCanvas.height * 2/3;
    targetFixedX = refCanvas.width * 2/3;
    targetFixedY = refCanvas.height / 3;
    
    drawSystem();
    
    refCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateOrigin(e);
    });
    
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    refCanvas.addEventListener('mousemove', (e) => {
        if(isDragging) updateOrigin(e);
    });
    
    // Touch Devices
    refCanvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateOrigin(e.touches[0]);
    }, {passive:true});
    window.addEventListener('touchend', () => { isDragging = false; });
    refCanvas.addEventListener('touchmove', (e) => {
        if(isDragging) updateOrigin(e.touches[0]);
    }, {passive:true});
    
    window.addEventListener('resize', () => {
        const oldW = refCanvas.width;
        const oldH = refCanvas.height;
        initCanvas();
        // Aggiorna proporzionalmente se fanno resize pagina
        originX = originX * (refCanvas.width / oldW);
        originY = originY * (refCanvas.height / oldH);
        targetFixedX = targetFixedX * (refCanvas.width / oldW);
        targetFixedY = targetFixedY * (refCanvas.height / oldH);
        drawSystem();
    });
}

function updateOrigin(e) {
    const rect = refCanvas.getBoundingClientRect();
    originX = e.clientX - rect.left;
    originY = e.clientY - rect.top;
    drawSystem();
}

// ═══════════════════════════════════════════════════════
// GESTIONE QUIZ (Trial and Error)
// ═══════════════════════════════════════════════════════
const quizButtons = document.querySelectorAll('.quiz-btn');

quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const questionDiv = btn.closest('.quiz-question');
        const status = btn.getAttribute('data-status');
        const allBtns = questionDiv.querySelectorAll('.quiz-btn');

        if (status === 'correct') {
            btn.classList.add('correct');
            // Se corretta, disabilita tutti i bottoni di questa domanda
            allBtns.forEach(b => b.disabled = true);
        } else {
            btn.classList.add('wrong');
            // Permette di riprovare (trial and error)
        }
    });
});
