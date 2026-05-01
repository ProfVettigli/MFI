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

// ═══════════════════════════════════════════════════════
// SIMULAZIONE: LA MOSCA NEL VAGONE DEL TRENO
// ═══════════════════════════════════════════════════════
(function() {
    const canvas = document.getElementById('flyTrainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const trainSpeedSlider = document.getElementById('trainSpeed');
    const flySpeedSlider   = document.getElementById('flySpeed');
    const trainSpeedVal    = document.getElementById('trainSpeedVal');
    const flySpeedVal      = document.getElementById('flySpeedVal');
    const flyInTrainEl     = document.getElementById('flyInTrain');
    const trainOnGroundEl  = document.getElementById('trainOnGround');
    const flyOnGroundEl    = document.getElementById('flyOnGround');

    // Stato animazione
    let trainV = 200; // km/h
    let flyV   = 5;   // km/h relativa al vagone

    // Posizioni "normalizzate" 0..1 per canvas indipendente dalla larghezza
    // Vagone: x sinistra del vagone (si muove)
    let wagonX = 0.1;   // 0..1 relativo alla larghezza canvas
    let flyRelX = 0.4;  // posizione mosca relativa all'interno del vagone (0..1 del vagone)

    // Per l'osservatore esterno (marciapiede) solo la mosca è mostrata
    let flyAbsX = 0.1;  // posizione assoluta mosca dal punto di vista esterno

    function resize() {
        canvas.width = canvas.parentElement.clientWidth || 600;
    }
    resize();
    window.addEventListener('resize', () => { resize(); });

    function updateDisplays() {
        const total = trainV + flyV;
        trainSpeedVal.textContent = trainV + ' km/h';
        flySpeedVal.textContent   = (flyV >= 0 ? '+' : '') + flyV + ' km/h';
        flyInTrainEl.textContent  = (flyV >= 0 ? '+' : '') + flyV + ' km/h';
        trainOnGroundEl.textContent = trainV + ' km/h';
        flyOnGroundEl.textContent = total + ' km/h';
    }

    trainSpeedSlider.addEventListener('input', () => {
        trainV = parseInt(trainSpeedSlider.value);
        updateDisplays();
    });
    flySpeedSlider.addEventListener('input', () => {
        flyV = parseInt(flySpeedSlider.value);
        updateDisplays();
    });

    updateDisplays();

    // ── Colori ──────────────────────────────────
    const COL_BG_TOP    = '#0f172a';
    const COL_BG_BOT    = '#1e293b';
    const COL_TRAIN     = '#f59e0b';
    const COL_FLY       = '#10b981';
    const COL_FLY_ABS   = '#a855f7';
    const COL_GROUND    = '#475569';
    const COL_SKY       = '#1e3a5f';
    const COL_WHITE     = 'rgba(255,255,255,0.85)';

    // ── Velocità di scorrimento per animazione ──
    // Usiamo unità arbitrarie: trainV -> px/frame
    function trainPxPerFrame(v) { return v / 350 * 4; }
    function flyPxPerFrame(v)   { return v / 350 * 4; }

    let lastTime = null;

    function draw(ts) {
        const W = canvas.width;
        const H = canvas.height;

        // dt in ms (capped)
        const dt = lastTime ? Math.min(ts - lastTime, 50) : 16;
        lastTime = ts;

        // ── Aggiorna posizioni ─────────────────────────
        const trainPx = trainPxPerFrame(trainV);
        const flyRelPx = flyPxPerFrame(flyV); // relativa al vagone
        const flyAbsPx = trainPx + flyRelPx;  // assoluta (Galileo!)

        // Vagone: scorre verso destra
        wagonX += trainPx / W;
        if (wagonX > 1.1) wagonX = -0.7; // loop

        // Mosca relativa al vagone (rimane dentro)
        flyRelX += flyRelPx / W;
        if (flyRelX > 1.0) flyRelX = 0.0;
        if (flyRelX < 0.0) flyRelX = 1.0;

        // Mosca assoluta (marciapiede)
        flyAbsX += flyAbsPx / W;
        if (flyAbsX > 1.15) flyAbsX = -0.05;

        // ── Sfondo ────────────────────────────────────
        ctx.fillStyle = COL_BG_TOP;
        ctx.fillRect(0, 0, W, H);

        // ── PANNELLO SUPERIORE: Vista dal Vagone (S') ─
        const panH = H / 2 - 4;
        const panY = 0;

        // Sky inside wagon
        ctx.fillStyle = COL_SKY;
        ctx.fillRect(0, panY, W, panH);

        // Label
        ctx.fillStyle = COL_WHITE;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText("📦 Vista dall'interno del vagone (S')", 10, panY + 18);

        // Pavimento
        const floorY = panY + panH - 30;
        ctx.fillStyle = COL_GROUND;
        ctx.fillRect(0, floorY, W, 30);

        // Pareti del vagone
        const wX = wagonX * W;
        const wW = W * 0.7; // larghezza vagone in px
        ctx.strokeStyle = COL_TRAIN;
        ctx.lineWidth = 3;
        ctx.strokeRect(wX, panY + 30, wW, floorY - (panY + 30));
        ctx.fillStyle = 'rgba(245,158,11,0.05)';
        ctx.fillRect(wX, panY + 30, wW, floorY - (panY + 30));

        // Sedili fissi (label treno)
        ctx.fillStyle = COL_TRAIN;
        ctx.font = '11px Inter';
        ctx.fillText('🚂', wX + 8, panY + 55);
        ctx.fillText('🪑', wX + wW * 0.2, floorY - 5);
        ctx.fillText('🪑', wX + wW * 0.5, floorY - 5);
        ctx.fillText('🪑', wX + wW * 0.8, floorY - 5);

        // Mosca dentro il vagone (posizione relativa al vagone)
        const flyInWagonX = wX + flyRelX * wW;
        const flyInWagonY = panY + panH * 0.45;
        ctx.font = '22px Arial';
        ctx.fillText('🪰', flyInWagonX - 11, flyInWagonY);

        // Vettore velocità mosca
        const arrowLen = Math.abs(flyV / 30 * 60);
        const arrowDir = flyV >= 0 ? 1 : -1;
        ctx.strokeStyle = COL_FLY;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flyInWagonX, flyInWagonY - 8);
        ctx.lineTo(flyInWagonX + arrowDir * arrowLen, flyInWagonY - 8);
        ctx.stroke();
        // punta freccia
        if (arrowLen > 5) {
            ctx.beginPath();
            ctx.fillStyle = COL_FLY;
            const aX = flyInWagonX + arrowDir * arrowLen;
            ctx.moveTo(aX, flyInWagonY - 14);
            ctx.lineTo(aX + arrowDir * 8, flyInWagonY - 8);
            ctx.lineTo(aX, flyInWagonY - 2);
            ctx.fill();
        }
        ctx.fillStyle = COL_FLY;
        ctx.font = '11px Inter';
        ctx.fillText("v' = " + flyV + " km/h", flyInWagonX + arrowDir * (arrowLen + 4) - (flyV < 0 ? 70 : 0), flyInWagonY - 12);

        // ── Separatore ────────────────────────────────
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, H / 2 - 4, W, 8);

        // ── PANNELLO INFERIORE: Vista dal Marciapiede (S) ─
        const pan2Y = H / 2 + 4;
        const pan2H = H - pan2Y;

        ctx.fillStyle = '#111827';
        ctx.fillRect(0, pan2Y, W, pan2H);

        // Label
        ctx.fillStyle = COL_WHITE;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('🚉 Vista dal marciapiede (S) — Osservatore fisso a terra', 10, pan2Y + 18);

        // Suolo
        const groundY2 = pan2Y + pan2H - 25;
        // Binari
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, groundY2, W, 8);
        // Traverse binario che scorrono
        ctx.fillStyle = '#475569';
        const trackOff = (wagonX * W * 2) % 40;
        for (let x = -40 + trackOff % 40; x < W + 40; x += 40) {
            ctx.fillRect(x, groundY2 - 2, 28, 14);
        }

        // Treno che scorre (visto da fuori)
        ctx.fillStyle = 'rgba(245,158,11,0.15)';
        ctx.strokeStyle = COL_TRAIN;
        ctx.lineWidth = 2;
        ctx.strokeRect(wX, pan2Y + 30, wW, groundY2 - (pan2Y + 30));
        ctx.fillRect(wX, pan2Y + 30, wW, groundY2 - (pan2Y + 30));
        ctx.fillStyle = COL_TRAIN;
        ctx.font = '11px Inter';
        ctx.fillText('🚂', wX + 8, pan2Y + 55);
        // Ruote treno
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(wX + 30, groundY2, 12, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(wX + wW - 30, groundY2, 12, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(wX + 30, groundY2, 12, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(wX + wW - 30, groundY2, 12, 0, Math.PI*2); ctx.stroke();

        // Vettore treno
        const trainArrowLen = Math.min(trainV / 350 * W * 0.4, W * 0.35);
        ctx.strokeStyle = COL_TRAIN;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wX + wW * 0.5, pan2Y + 42);
        ctx.lineTo(wX + wW * 0.5 + trainArrowLen, pan2Y + 42);
        ctx.stroke();
        ctx.fillStyle = COL_TRAIN;
        ctx.beginPath();
        const tAX = wX + wW * 0.5 + trainArrowLen;
        ctx.moveTo(tAX, pan2Y + 36); ctx.lineTo(tAX + 8, pan2Y + 42); ctx.lineTo(tAX, pan2Y + 48);
        ctx.fill();
        ctx.font = '11px Inter';
        ctx.fillText('V = ' + trainV + ' km/h', wX + wW * 0.5 + trainArrowLen + 12, pan2Y + 46);

        // Mosca vista da fuori (posizione assoluta che scorre veloce)
        const flyAbsCanvasX = flyAbsX * W;
        const flyAbsCanvasY = pan2Y + pan2H * 0.45;
        ctx.font = '22px Arial';
        ctx.fillText('🪰', flyAbsCanvasX - 11, flyAbsCanvasY);

        // Vettore mosca (assoluto)
        const totalV = trainV + flyV;
        const flyAbsArrowLen = Math.min(Math.abs(totalV) / 350 * W * 0.4, W * 0.35);
        const flyAbsDir = totalV >= 0 ? 1 : -1;
        ctx.strokeStyle = COL_FLY_ABS;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flyAbsCanvasX, flyAbsCanvasY - 8);
        ctx.lineTo(flyAbsCanvasX + flyAbsDir * flyAbsArrowLen, flyAbsCanvasY - 8);
        ctx.stroke();
        if (flyAbsArrowLen > 5) {
            ctx.fillStyle = COL_FLY_ABS;
            ctx.beginPath();
            const fAX = flyAbsCanvasX + flyAbsDir * flyAbsArrowLen;
            ctx.moveTo(fAX, flyAbsCanvasY - 14);
            ctx.lineTo(fAX + flyAbsDir * 8, flyAbsCanvasY - 8);
            ctx.lineTo(fAX, flyAbsCanvasY - 2);
            ctx.fill();
        }
        ctx.fillStyle = COL_FLY_ABS;
        ctx.font = '11px Inter';
        const labelX = flyAbsCanvasX + flyAbsDir * (flyAbsArrowLen + 4) - (totalV < 0 ? 80 : 0);
        ctx.fillText('v = ' + totalV + ' km/h', labelX, flyAbsCanvasY - 12);

        // Osservatore sul marciapiede
        ctx.font = '22px Arial';
        ctx.fillText('🧍', 16, groundY2 - 2);

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();
