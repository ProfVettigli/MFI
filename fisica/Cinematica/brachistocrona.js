// ═══════════════════════════════════════════════════════
// SIMULAZIONE 1: GENESI DELLA CICLOIDE
// ═══════════════════════════════════════════════════════
const genCanvas = document.getElementById('genesiCanvas');
const gCtx = genCanvas ? genCanvas.getContext('2d') : null;
const btnGenesi = document.getElementById('btn-genesi');

let genTime = 0;
let isGenRunning = false;
let genLastTime = 0;
const genR = 35; // Raggio della ruota generatrice
const genStartX = 20;

function initGenCanvas() {
    if(!genCanvas) return;
    genCanvas.width = genCanvas.parentElement.clientWidth;
}

function drawGenesi() {
    if(!gCtx) return;
    gCtx.clearRect(0, 0, genCanvas.width, genCanvas.height);
    
    const groundY = genCanvas.height - 20;
    
    // Linea terra
    gCtx.beginPath();
    gCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    gCtx.lineWidth = 2;
    gCtx.moveTo(0, groundY);
    gCtx.lineTo(genCanvas.width, groundY);
    gCtx.stroke();
    
    const omegaGen = 2.5; 
    const currentTheta = omegaGen * genTime;
    
    // Curva Cicloide tracciata
    gCtx.beginPath();
    gCtx.strokeStyle = '#ec4899'; 
    gCtx.lineWidth = 3;
    for(let th=0; th<=currentTheta; th+=0.05) {
        let x = genStartX + genR * (th - Math.sin(th));
        let y = groundY - genR * (1 - Math.cos(th));
        if(th===0) gCtx.moveTo(x,y); else gCtx.lineTo(x,y);
    }
    gCtx.stroke();
    
    // Ruota
    const cx = genStartX + genR * currentTheta;
    const cy = groundY - genR;
    
    gCtx.beginPath();
    gCtx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    gCtx.lineWidth = 2;
    gCtx.arc(cx, cy, genR, 0, Math.PI*2);
    gCtx.stroke();
    
    const px = genStartX + genR * (currentTheta - Math.sin(currentTheta));
    const py = groundY - genR * (1 - Math.cos(currentTheta));
    
    // Raggio interno
    gCtx.beginPath();
    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    gCtx.lineWidth = 2;
    gCtx.moveTo(cx, cy);
    gCtx.lineTo(px, py);
    gCtx.stroke();
    
    // Penna rossa/rosa
    gCtx.beginPath();
    gCtx.fillStyle = '#ec4899';
    gCtx.arc(px, py, 6, 0, Math.PI*2);
    gCtx.fill();
}

function animateGenesi(timestamp) {
    if(!isGenRunning) return;
    if(!genLastTime) genLastTime = timestamp;
    const dt = (timestamp - genLastTime)/1000;
    genLastTime = timestamp;
    
    genTime += dt;
    drawGenesi();
    
    if(genStartX + genR * (2.5 * genTime) > genCanvas.width - genR) {
        isGenRunning = false;
        btnGenesi.innerText = '🔁 Riavvia Rotolamento';
    } else {
        requestAnimationFrame(animateGenesi);
    }
}

if(btnGenesi) {
    initGenCanvas();
    drawGenesi();
    btnGenesi.addEventListener('click', () => {
        if(isGenRunning) return;
        isGenRunning = true;
        genTime = 0;
        genLastTime = 0;
        btnGenesi.innerText = '⚙️ In Movimento...';
        requestAnimationFrame(animateGenesi);
    });
    window.addEventListener('resize', () => { initGenCanvas(); if(!isGenRunning) drawGenesi(); });
}

// ═══════════════════════════════════════════════════════
// SIMULAZIONE 2: GARA BRACHISTOCRONA
// ═══════════════════════════════════════════════════════
const rcCanvas = document.getElementById('brachistoCanvas');
const rCtx = rcCanvas ? rcCanvas.getContext('2d') : null;

const btnRace = document.getElementById('btn-race');
const txtTimeLine = document.getElementById('time-line');
const txtTimeParabola = document.getElementById('time-parabola');
const txtTimeCycloid = document.getElementById('time-cycloid');

let paths = { line: [], parabola: [], cycloid: [] };
const g = 400; 
const R = 100; 
const xEnd = Math.PI * R;
const yEnd = 2 * R;

// Pre-calc paths
function generatePaths() {
    paths = { line: [], parabola: [], cycloid: [] };
    
    // 1. Cycloid
    for(let theta=0; theta <= Math.PI; theta += 0.05) {
        let x = R * (theta - Math.sin(theta));
        let y = R * (1 - Math.cos(theta));
        let t = Math.sqrt(R/g) * theta;
        paths.cycloid.push({x, y, t});
    }
    // Garantiamo esplicitamente l'ultimo punto a PI
    let thEnd = Math.PI;
    paths.cycloid.push({
        x: R * (thEnd - Math.sin(thEnd)), 
        y: R * (1 - Math.cos(thEnd)), 
        t: Math.sqrt(R/g) * thEnd
    });

    // 2. Line
    for(let p=0; p<=1.0; p+=0.02) {
        let x = xEnd * p;
        let y = yEnd * p;
        let s = Math.hypot(x, y);
        let S = Math.hypot(xEnd, yEnd);
        let a = g * (yEnd / S);
        let tLine = Math.sqrt(2 * s / a);
        paths.line.push({x, y, t: tLine});
    }
    // Ultimo punto linea
    let s = Math.hypot(xEnd, yEnd);
    let a = g * (yEnd / s);
    paths.line.push({x: xEnd, y: yEnd, t: Math.sqrt(2 * s / a)});

    // 3. Parabola (y = yEnd * sqrt(x / xEnd))
    let tParab = 0;
    let lastX = 0, lastY = 0;
    for(let p=0; p<=1.0; p+=0.02) {
        let x = xEnd * p;
        let y = yEnd * Math.sqrt(p); 
        if (p===0) { paths.parabola.push({x, y, t:0}); continue; }
        
        let ds = Math.hypot(x - lastX, y - lastY);
        let vAvg = (Math.sqrt(2*g*y) + Math.sqrt(2*g*lastY)) / 2;
        if(vAvg > 0) tParab += ds / vAvg;
        paths.parabola.push({x, y, t: tParab});
        
        lastX = x; lastY = y;
    }
    // Ultimo punto parabola per sicurezza
    let dsParab = Math.hypot(xEnd - lastX, yEnd - lastY);
    let vAvgParab = (Math.sqrt(2*g*yEnd) + Math.sqrt(2*g*lastY)) / 2;
    if(vAvgParab > 0) tParab += dsParab / vAvgParab;
    paths.parabola.push({x: xEnd, y: yEnd, t: tParab});
}

let raceTime = 0;
let isRacing = false;
let raceAnimId;

function initRaceCanvas() {
    if (!rcCanvas) return;
    rcCanvas.width = rcCanvas.parentElement.clientWidth;
    generatePaths();
}

function drawRace() {
    if (!rCtx) return;
    rCtx.clearRect(0, 0, rcCanvas.width, rcCanvas.height);
    
    // Scale and Shift to fit e centrare
    const scale = Math.min(rcCanvas.width / (xEnd + 60), rcCanvas.height / (yEnd + 60));
    const contentWidth = xEnd * scale;
    const contentHeight = yEnd * scale;
    const offsetX = (rcCanvas.width - contentWidth) / 2;
    const offsetY = (rcCanvas.height - contentHeight) / 2;

    const drawPath = (path, color, drawBall) => {
        if(path.length === 0) return;
        rCtx.beginPath();
        rCtx.strokeStyle = color;
        rCtx.lineWidth = 3;
        for(let i=0; i<path.length; i++) {
            let px = offsetX + path[i].x * scale;
            let py = offsetY + path[i].y * scale;
            if(i===0) rCtx.moveTo(px, py);
            else rCtx.lineTo(px, py);
        }
        rCtx.stroke();
        
        if (drawBall) {
            // interpolation
            let bp = path[path.length-1]; // default to end
            for(let i=0; i<path.length; i++) {
                if(path[i].t >= raceTime) {
                    if(i>0) {
                        // interpolate
                        let p1 = path[i-1];
                        let p2 = path[i];
                        let f = (raceTime - p1.t) / (p2.t - p1.t);
                        bp = { x: p1.x + (p2.x - p1.x)*f, y: p1.y + (p2.y - p1.y)*f, t: raceTime };
                    } else { bp = path[0]; }
                    break;
                }
            }
            
            rCtx.beginPath();
            rCtx.fillStyle = color;
            rCtx.arc(offsetX + bp.x * scale, offsetY + bp.y * scale, 10, 0, Math.PI*2);
            rCtx.fill();
            rCtx.strokeStyle = 'white';
            rCtx.lineWidth = 2;
            rCtx.stroke();
        }
    };

    // Draw rails
    drawPath(paths.line, '#10b981', true);
    drawPath(paths.parabola, '#3b82f6', true);
    drawPath(paths.cycloid, '#ec4899', true);
    
    // Draw finish line
    rCtx.beginPath();
    rCtx.setLineDash([5,5]);
    rCtx.strokeStyle = 'rgba(255,255,255,0.4)';
    rCtx.moveTo(offsetX + xEnd*scale, offsetY);
    rCtx.lineTo(offsetX + xEnd*scale, rcCanvas.height);
    rCtx.stroke();
    rCtx.setLineDash([]);
}

function updateRaceTimes() {
    let tLine = Math.min(raceTime, paths.line[paths.line.length-1].t);
    let tPar = Math.min(raceTime, paths.parabola[paths.parabola.length-1].t);
    let tCyc = Math.min(raceTime, paths.cycloid[paths.cycloid.length-1].t);
    
    if(txtTimeLine) txtTimeLine.innerText = tLine.toFixed(2) + ' s';
    if(txtTimeParabola) txtTimeParabola.innerText = tPar.toFixed(2) + ' s';
    if(txtTimeCycloid) txtTimeCycloid.innerText = tCyc.toFixed(2) + ' s';
}

let lastRaceTime = 0;
function animateRace(timestamp) {
    if(!isRacing) return;
    if(!lastRaceTime) lastRaceTime = timestamp;
    let dt = (timestamp - lastRaceTime) / 1000;
    lastRaceTime = timestamp;
    
    raceTime += dt;
    drawRace();
    updateRaceTimes();
    
    // Check if max time reached
    let maxT = Math.max(paths.line[paths.line.length-1].t, paths.parabola[paths.parabola.length-1].t);
    if(raceTime > maxT + 0.5) {
        isRacing = false;
        btnRace.innerText = '🏁 Riavvia Gara!';
    } else {
        raceAnimId = requestAnimationFrame(animateRace);
    }
}

if(btnRace) {
    initRaceCanvas();
    drawRace();
    btnRace.addEventListener('click', () => {
        if(isRacing) return;
        isRacing = true;
        raceTime = 0;
        lastRaceTime = 0;
        btnRace.innerText = '🏃 In esecuzione...';
        txtTimeLine.innerText = '0.00 s';
        txtTimeParabola.innerText = '0.00 s';
        txtTimeCycloid.innerText = '0.00 s';
        raceAnimId = requestAnimationFrame(animateRace);
    });
    window.addEventListener('resize', () => { initRaceCanvas(); if(!isRacing) drawRace(); });
}

// ═══════════════════════════════════════════════════════
// SIMULAZIONE 3: MOTO ISOCRONO SU CICLOIDE
// ═══════════════════════════════════════════════════════
const isoCanvas = document.getElementById('isocroneCanvas');
const iCtx = isoCanvas ? isoCanvas.getContext('2d') : null;
const btnIso = document.getElementById('btn-iso');

let isoTime = 0;
let isIsoRunning = false;
let isoLastTime = 0;

// The period parameter omega for cycloid: omega = sqrt(g / 4R)
const omegaIso = Math.sqrt(g / (4 * R));

// Balls drop from different initial theta
// Ball 1: theta = 0 (top)
// Ball 2: theta = pi/2 
// Ball 3: theta = 3pi/4
const isoBalls = [
    { theta0: 0.1, color: '#f59e0b' },
    { theta0: Math.PI / 2, color: '#10b981' },
    { theta0: 3 * Math.PI / 4, color: '#3b82f6' }
];

function initIsoCanvas() {
    if (!isoCanvas) return;
    isoCanvas.width = isoCanvas.parentElement.clientWidth;
}

function drawIso() {
    if (!iCtx) return;
    iCtx.clearRect(0, 0, isoCanvas.width, isoCanvas.height);
    
    // Draw cycloid bowl from theta=0 to theta=2pi
    const scale = Math.min(isoCanvas.width / (2 * Math.PI * R + 60), isoCanvas.height / (2 * R + 60));
    const contentWidth = 2 * Math.PI * R * scale;
    const contentHeight = 2 * R * scale;
    const offsetX = (isoCanvas.width - contentWidth) / 2;
    const offsetY = (isoCanvas.height - contentHeight) / 2;

    iCtx.beginPath();
    iCtx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    iCtx.lineWidth = 4;
    for(let th=0; th<=2*Math.PI + 0.05; th+=0.1) {
        let x = R * (th - Math.sin(th));
        let y = R * (1 - Math.cos(th));
        let px = offsetX + x * scale;
        let py = offsetY + y * scale;
        if(th===0) iCtx.moveTo(px,py); else iCtx.lineTo(px,py);
    }
    iCtx.stroke();

    // Draw central axis
    let cx = offsetX + Math.PI * R * scale;
    iCtx.beginPath();
    iCtx.setLineDash([5,5]);
    iCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    iCtx.moveTo(cx, 10);
    iCtx.lineTo(cx, isoCanvas.height - 10);
    iCtx.stroke();
    iCtx.setLineDash([]);

    // Draw balls
    isoBalls.forEach(b => {
        // s_0 = 4R cos(theta0 / 2)
        let s0 = 4 * R * Math.cos(b.theta0 / 2);
        // Harmonic motion of arc length
        let s = s0 * Math.cos(omegaIso * isoTime);
        
        // Convert s back to theta
        // s = 4R cos(theta / 2) => cos(th/2) = s / 4R => th/2 = acos(s / 4R)
        // Note: s goes negative when passing the bottom. 
        // Math.acos returns 0 to PI. We handle signs cleanly using acos of absolute value or proper domain.
        // Actually, if s is negative, it goes to the right side of the bowl.
        // Let's use the property that theta spans 0 to 2pi.
        // at theta = pi, s = 0.
        // The analytic relationship from s to theta is:
        // theta = 2 * Math.acos(s / (4 * R))
        let clamp = s / (4 * R);
        if(clamp > 1) clamp = 1; if(clamp < -1) clamp = -1;
        let currentTheta = 2 * Math.acos(clamp);

        let curX = R * (currentTheta - Math.sin(currentTheta));
        let curY = R * (1 - Math.cos(currentTheta));

        iCtx.beginPath();
        iCtx.fillStyle = b.color;
        iCtx.arc(offsetX + curX * scale, offsetY + curY * scale, 12, 0, Math.PI*2);
        iCtx.fill();
        iCtx.strokeStyle = '#fff';
        iCtx.lineWidth = 2;
        iCtx.stroke();
    });

    // Time text
    iCtx.fillStyle = 'white';
    iCtx.font = '16px Inter';
    iCtx.fillText(`T = ${isoTime.toFixed(2)} s`, 10, 20);
}

function animateIso(timestamp) {
    if(!isIsoRunning) return;
    if(!isoLastTime) isoLastTime = timestamp;
    let dt = (timestamp - isoLastTime)/1000;
    isoLastTime = timestamp;
    
    // Slow down simulation to visualize it gracefully
    isoTime += dt * 0.8; 
    
    drawIso();
    
    // Stop after passing bottom twice
    if(isoTime > (Math.PI / omegaIso) * 2) {
        isIsoRunning = false;
        btnIso.innerText = '🔁 Rilascia di nuovo!';
    } else {
        requestAnimationFrame(animateIso);
    }
}

if(btnIso) {
    initIsoCanvas();
    drawIso();
    btnIso.addEventListener('click', () => {
        if(isIsoRunning) return;
        isIsoRunning = true;
        isoTime = 0;
        isoLastTime = 0;
        btnIso.innerText = '⏳ In viaggio...';
        requestAnimationFrame(animateIso);
    });
    window.addEventListener('resize', () => { initIsoCanvas(); if(!isIsoRunning) drawIso(); });
}
