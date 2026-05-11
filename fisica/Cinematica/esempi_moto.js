// ═══════════════════════════════════════════════════════
// SIMULAZIONE MOTO PARABOLICO - THOUSAND SUNNY
// ═══════════════════════════════════════════════════════

const canvas = document.getElementById('parabolaCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const sliderY0 = document.getElementById('slider-y0');
const sliderV0 = document.getElementById('slider-v0');
const sliderTheta = document.getElementById('slider-theta');

const valY0 = document.getElementById('val-y0');
const valV0 = document.getElementById('val-v0');
const valTheta = document.getElementById('val-theta');

const btnFire = document.getElementById('btn-fire');
const resultText = document.getElementById('parabolaResult');

// Costanti Fisiche e Scala
const GC = 9.81;
// Mappa 1 metro fisico a 1 pixel per la simulazione (es: larghezza simulata da 0 a 600m)
const SCALE_X = 1.0; 
const SCALE_Y = 2.0; // Scaliamo maggiormente la Y per visibilità sul canvas
const SUNNY_X = 500;
const SUNNY_WIDTH = 40;
const SUNNY_HEIGHT = 40;

let y0 = 10;
let v0 = 45;
let thetaDeg = 35;

let isFiring = false;
let startTime = 0;
let trajectoryPath = [];
let animFrame;

function initCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    // Altezza interna fissa a 400
}

function drawGrid() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();

    // Disegna Linea del mare
    ctx.fillStyle = 'rgba(14, 165, 233, 0.4)'; // Acqua del mare
    const seaLevel = getCanvasY(0);
    ctx.fillRect(0, seaLevel, canvas.width, canvas.height - seaLevel);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, seaLevel); ctx.lineTo(canvas.width, seaLevel); ctx.stroke();
}

// Funzione di conversione coordinate
function getCanvasX(x_m) {
    // 0 metri corrisponde a 20 px da sinistra
    return 20 + x_m * SCALE_X;
}
function getCanvasY(y_m) {
    // 0 metri corrisponde al fondo mare (es: canvas.height - 40)
    return canvas.height - 40 - (y_m * SCALE_Y);
}

function drawScene() {
    if (!ctx) return;
    drawGrid();

    y0 = parseFloat(sliderY0.value);
    v0 = parseFloat(sliderV0.value);
    thetaDeg = parseFloat(sliderTheta.value);

    // Nave della Marina (Sinistra)
    ctx.fillStyle = '#64748b'; // Grigio
    const marineX = getCanvasX(-10);
    const marineWidth = 30;
    const marineY = getCanvasY(0);
    ctx.fillRect(marineX, marineY, marineWidth, getCanvasY(-y0) - marineY);
    // Cannone
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(getCanvasX(0), getCanvasY(y0), 8, 0, Math.PI * 2);
    ctx.fill();

    // Thousand Sunny (Destra)
    ctx.fillStyle = '#f59e0b'; // Arancio / Legno
    const sunnyCX = getCanvasX(SUNNY_X);
    const sunnyCY = getCanvasY(0);
    // Disegna corpo barca
    ctx.fillRect(sunnyCX - SUNNY_WIDTH/2, sunnyCY - SUNNY_HEIGHT/2, SUNNY_WIDTH, SUNNY_HEIGHT/2);
    // Disegna Vela
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.moveTo(sunnyCX, sunnyCY - SUNNY_HEIGHT/2);
    ctx.lineTo(sunnyCX + 20, sunnyCY - SUNNY_HEIGHT*1.5);
    ctx.lineTo(sunnyCX - 20, sunnyCY - SUNNY_HEIGHT*1.5);
    ctx.fill();

    // Disegna traiettoria precedente se esiste
    if (trajectoryPath.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        for (let i = 0; i < trajectoryPath.length; i++) {
            const p = trajectoryPath[i];
            const px = getCanvasX(p.x);
            const py = getCanvasY(p.y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Disegna palla di cannone
        const lastP = trajectoryPath[trajectoryPath.length - 1];
        ctx.beginPath();
        ctx.fillStyle = '#ef4444';
        ctx.arc(getCanvasX(lastP.x), getCanvasY(lastP.y), 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateSliders() {
    if(valY0) valY0.innerText = sliderY0.value + ' m';
    if(valV0) valV0.innerText = sliderV0.value + ' m/s';
    if(valTheta) valTheta.innerText = sliderTheta.value + '°';
    if (!isFiring) {
        trajectoryPath = [];
        resultText.style.display = 'none';
        drawScene();
    }
}

function fireCannon() {
    if (isFiring) return;
    isFiring = true;
    trajectoryPath = [];
    resultText.style.display = 'none';
    btnFire.disabled = true;
    btnFire.style.opacity = '0.5';

    y0 = parseFloat(sliderY0.value);
    v0 = parseFloat(sliderV0.value);
    thetaDeg = parseFloat(sliderTheta.value);

    // Convertiamo in radianti
    const thetaRad = thetaDeg * Math.PI / 180;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);

    const timeStep = 0.05; // sec per frame logico
    let simTime = 0;
    let hitSunny = false;

    function animate() {
        simTime += timeStep;
        
        // Equazioni del moto
        const curX = v0x * simTime;
        const curY = y0 + v0y * simTime - 0.5 * GC * simTime * simTime;

        trajectoryPath.push({ x: curX, y: curY });

        // Controllo Collisione Sunny
        if (curX >= SUNNY_X - SUNNY_WIDTH/2 && curX <= SUNNY_X + SUNNY_WIDTH/2) {
            if (curY >= -10 && curY <= parseInt(SUNNY_HEIGHT)) { // Colpita barca/vela
                hitSunny = true;
            }
        }

        drawScene();

        // Controllo fine simulazione
        if (curY < -20 || curX > canvas.width / SCALE_X || hitSunny) {
            isFiring = false;
            btnFire.disabled = false;
            btnFire.style.opacity = '1';
            
            if (hitSunny) {
                resultText.innerText = "COLPITO!";
                resultText.style.color = '#10b981';
                resultText.style.display = 'block';
            } else {
                resultText.innerText = "MANCATO!";
                resultText.style.color = '#ef4444';
                resultText.style.display = 'block';
            }
            return;
        }

        animFrame = requestAnimationFrame(animate);
    }
    animate();
}

if (sliderY0) {
    sliderY0.addEventListener('input', updateSliders);
    sliderV0.addEventListener('input', updateSliders);
    sliderTheta.addEventListener('input', updateSliders);
    btnFire.addEventListener('click', fireCannon);

    window.addEventListener('resize', () => {
        initCanvas();
        if(!isFiring) drawScene();
    });

    // Inizializzazione
    initCanvas();
    updateSliders();
}


// ═══════════════════════════════════════════════════════
// SIMULAZIONE MOTO CIRCOLARE UNIFORME E PROIEZIONI
// ═══════════════════════════════════════════════════════
const circCanvas = document.getElementById('circolareCanvas');
const cCtx = circCanvas ? circCanvas.getContext('2d') : null;

const sliderCircR = document.getElementById('slider-circR');
const sliderCircOmega = document.getElementById('slider-circOmega');

const valCircR = document.getElementById('val-circR');
const valCircOmega = document.getElementById('val-circOmega');

const btnCircolare = document.getElementById('btn-circolare');

let circSimTime = 0;
let isCircRunning = false;
let circAnimId;
let circLastTime = 0;

function initCircCanvas() {
    if (!circCanvas) return;
    circCanvas.width = circCanvas.parentElement.clientWidth;
}

function updateCircParams() {
    if(valCircR) valCircR.innerText = sliderCircR.value + ' px';
    if(valCircOmega) valCircOmega.innerText = sliderCircOmega.value + ' rad/s';
    if(!isCircRunning) drawCircolare();
}

function drawCircolare() {
    if(!cCtx) return;
    cCtx.clearRect(0, 0, circCanvas.width, circCanvas.height);
    
    const r = parseFloat(sliderCircR.value);
    const omega = parseFloat(sliderCircOmega.value);
    
    // Angolo theta = omega * t
    const t = circSimTime;
    const theta = omega * t;
    
    // Centro del sistema
    const cx = circCanvas.width / 2;
    const cy = circCanvas.height / 2;
    
    // Posizione del punto rotante (P)
    const px = cx + r * Math.cos(theta);
    const py = cy - r * Math.sin(theta); // su canvas y punta verso il basso
    
    // Disegna l'asse X e Y
    cCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    cCtx.lineWidth = 1;
    cCtx.beginPath();
    cCtx.moveTo(0, cy); cCtx.lineTo(circCanvas.width, cy); // asse X
    cCtx.moveTo(cx, 0); cCtx.lineTo(cx, circCanvas.height); // asse Y
    cCtx.stroke();
    
    // Disegna il cerchio traiettoria
    cCtx.beginPath();
    cCtx.setLineDash([5, 5]);
    cCtx.strokeStyle = 'rgba(168, 85, 247, 0.4)'; // viola
    cCtx.arc(cx, cy, r, 0, Math.PI*2);
    cCtx.stroke();
    cCtx.setLineDash([]);
    
    // Proiezioni ortogonali a tratteggio
    cCtx.beginPath();
    cCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    cCtx.setLineDash([3, 3]);
    cCtx.moveTo(px, py); cCtx.lineTo(px, cy); // all'asse X
    cCtx.moveTo(px, py); cCtx.lineTo(cx, py); // all'asse Y
    cCtx.stroke();
    cCtx.setLineDash([]);
    
    // Punto blu (Proiezione asse X)
    cCtx.beginPath();
    cCtx.fillStyle = '#3b82f6';
    cCtx.arc(px, cy, 8, 0, Math.PI*2);
    cCtx.fill();
    
    // Punto rosso (Proiezione asse Y)
    cCtx.beginPath();
    cCtx.fillStyle = '#ef4444';
    cCtx.arc(cx, py, 8, 0, Math.PI*2);
    cCtx.fill();
    
    // Punto principale Viola e Raggio vettore
    cCtx.beginPath();
    cCtx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
    cCtx.lineWidth = 2;
    cCtx.moveTo(cx, cy);
    cCtx.lineTo(px, py);
    cCtx.stroke();
    
    cCtx.beginPath();
    cCtx.fillStyle = '#a855f7';
    cCtx.arc(px, py, 12, 0, Math.PI*2);
    cCtx.fill();
    
    // Info text
    cCtx.fillStyle = 'rgba(255,255,255,0.7)';
    cCtx.font = '14px Inter, sans-serif';
    cCtx.fillText(`Angle: ${(theta * 180 / Math.PI % 360).toFixed(0)}°`, 10, 20);
    cCtx.fillStyle = '#3b82f6';
    cCtx.fillText(`X(t) = R·cos(ωt)`, 10, 40);
    cCtx.fillStyle = '#ef4444';
    cCtx.fillText(`Y(t) = R·sin(ωt)`, 10, 60);
}

function animateCircolare(timestamp) {
    if (!isCircRunning) return;
    if (!circLastTime) circLastTime = timestamp;
    const dt = (timestamp - circLastTime) / 1000;
    circLastTime = timestamp;
    
    circSimTime += dt;
    drawCircolare();
    
    circAnimId = requestAnimationFrame(animateCircolare);
}

function toggleCircolare() {
    isCircRunning = !isCircRunning;
    if (isCircRunning) {
        circLastTime = 0;
        btnCircolare.innerText = '⏸️ Pausa';
        circAnimId = requestAnimationFrame(animateCircolare);
    } else {
        btnCircolare.innerText = '▶️ Avvia';
        cancelAnimationFrame(circAnimId);
    }
}

if(circCanvas) {
    initCircCanvas();
    updateCircParams();
    
    sliderCircR.addEventListener('input', updateCircParams);
    sliderCircOmega.addEventListener('input', updateCircParams);
    btnCircolare.addEventListener('click', toggleCircolare);
    
    window.addEventListener('resize', () => {
        initCircCanvas();
        if(!isCircRunning) drawCircolare();
    });
    
    // Default Start
    isCircRunning = true;
    btnCircolare.innerText = '⏸️ Pausa';
    circAnimId = requestAnimationFrame(animateCircolare);
}

// ═══════════════════════════════════════════════════════
// SIMULAZIONE MOTO ARMONICO - PENDOLO
// ═══════════════════════════════════════════════════════
const penCanvas = document.getElementById('pendoloCanvas');
const pCtx = penCanvas ? penCanvas.getContext('2d') : null;

const sliderL = document.getElementById('slider-L');
const sliderG = document.getElementById('slider-g');
const sliderTheta0 = document.getElementById('slider-theta0');

const valL = document.getElementById('val-L');
const valG = document.getElementById('val-g');
const valTheta0 = document.getElementById('val-theta0');
const displayPeriodo = document.getElementById('display-periodo');

const btnPendolo = document.getElementById('btn-pendolo');

let pendoloSimTime = 0;
let isPendoloRunning = false;
let pendoloAnimId;
let lastTime = 0;

function initPendoloCanvas() {
    if (!penCanvas) return;
    penCanvas.width = penCanvas.parentElement.clientWidth;
}

function updatePendoloParams() {
    if(valL) valL.innerText = sliderL.value + ' m';
    if(valG) valG.innerText = sliderG.value + ' m/s²';
    if(valTheta0) valTheta0.innerText = sliderTheta0.value + '°';
    
    // Calcolo periodo
    const l = parseFloat(sliderL.value);
    const g = parseFloat(sliderG.value);
    const T = 2 * Math.PI * Math.sqrt(l / g);
    if(displayPeriodo) displayPeriodo.innerText = T.toFixed(2) + ' s';
    
    if(!isPendoloRunning) drawPendolo();
}

function drawPendolo() {
    if(!pCtx) return;
    pCtx.clearRect(0, 0, penCanvas.width, penCanvas.height);
    
    const l = parseFloat(sliderL.value);
    const g = parseFloat(sliderG.value);
    const theta0Deg = parseFloat(sliderTheta0.value);
    const theta0 = theta0Deg * Math.PI / 180;
    
    // Omega
    const omega = Math.sqrt(g / l);
    // Theta al tempo t
    const currentTheta = theta0 * Math.cos(omega * pendoloSimTime);
    
    // Supporto pendolo (Origine)
    const ox = penCanvas.width / 2;
    const oy = 30; // dal top
    
    // Scala grafica: L va da 0.5 a 5m. 5m diventeranno circa 250px, per cui moltoplico per 50px/m
    const scale = 55; 
    const px = ox + l * scale * Math.sin(currentTheta);
    const py = oy + l * scale * Math.cos(currentTheta); // cos è verso il basso sull'asseY del canvas!
    
    // Disegno soffitto/perno
    pCtx.fillStyle = '#64748b';
    pCtx.fillRect(ox - 50, oy - 10, 100, 10);
    pCtx.beginPath();
    pCtx.arc(ox, oy, 4, 0, Math.PI*2);
    pCtx.fill();
    
    // Filo
    pCtx.beginPath();
    pCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    pCtx.lineWidth = 2;
    pCtx.moveTo(ox, oy);
    pCtx.lineTo(px, py);
    pCtx.stroke();
    
    // Massa del pendolo
    pCtx.beginPath();
    pCtx.fillStyle = '#10b981';
    pCtx.arc(px, py, 20, 0, Math.PI*2);
    pCtx.fill();
    pCtx.strokeStyle = 'rgba(255,255,255,0.8)';
    pCtx.lineWidth = 2;
    pCtx.stroke();
    
    // Info Testuale
    pCtx.fillStyle = 'rgba(255,255,255,0.7)';
    pCtx.font = '14px Inter, sans-serif';
    pCtx.fillText(`Tempo: ${pendoloSimTime.toFixed(1)} s`, 10, 20);
    pCtx.fillText(`Angolo attuale: ${(currentTheta * 180 / Math.PI).toFixed(1)}°`, 10, 40);
}

function animatePendolo(timestamp) {
    if (!isPendoloRunning) return;
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    pendoloSimTime += dt;
    drawPendolo();
    
    pendoloAnimId = requestAnimationFrame(animatePendolo);
}

function togglePendolo() {
    isPendoloRunning = !isPendoloRunning;
    if (isPendoloRunning) {
        lastTime = 0;
        btnPendolo.innerText = '⏸️ Pausa';
        pendoloAnimId = requestAnimationFrame(animatePendolo);
    } else {
        btnPendolo.innerText = '▶️ Avvia';
        cancelAnimationFrame(pendoloAnimId);
    }
}

if(penCanvas) {
    initPendoloCanvas();
    updatePendoloParams();
    
    sliderL.addEventListener('input', updatePendoloParams);
    sliderG.addEventListener('input', updatePendoloParams);
    sliderTheta0.addEventListener('input', updatePendoloParams);
    btnPendolo.addEventListener('click', togglePendolo);
    
    window.addEventListener('resize', () => {
        initPendoloCanvas();
        if(!isPendoloRunning) drawPendolo();
    });
    
    // Default Start
    isPendoloRunning = true;
    btnPendolo.innerText = '⏸️ Pausa';
    pendoloAnimId = requestAnimationFrame(animatePendolo);
}


// ═══════════════════════════════════════════════════════
// QUIZ SYSTEM LOGIC
// ═══════════════════════════════════════════════════════
let qScore = 0;
let qAnswered = new Set();
function checkQuizAnswer(btn, correct) {
    const qDiv = btn.closest('.quiz-question');
    const group = qDiv.querySelectorAll('.quiz-btn');
    const questions = Array.from(document.querySelectorAll('.quiz-question'));
    const qIdx = questions.indexOf(qDiv);
    
    if (correct) {
        btn.style.background = '#10B981'; 
        btn.style.color = 'white';
        btn.style.borderColor = '#10B981';
        group.forEach(b => b.disabled = true);
        if (!qAnswered.has(qIdx)) { 
            qScore++; 
            qAnswered.add(qIdx); 
        }
    } else {
        btn.style.background = '#ef4444'; 
        btn.style.color = 'white'; 
        btn.style.borderColor = '#ef4444';
        btn.disabled = true;
    }
    
    if (qAnswered.size === questions.length) {
        document.getElementById('quiz-feedback').innerText = `Punteggio totale: ${qScore}/${questions.length}! Complimenti, hai superato la simulazione della Marina!`;
    }
}
