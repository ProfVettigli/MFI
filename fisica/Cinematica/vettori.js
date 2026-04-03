// --- Global Utility ---
function toggleSolution(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ═══════════════════════════════════════════════════════
// SHARED VECTOR DRAWING
// ═══════════════════════════════════════════════════════

function drawVectorLabel(ctx, label, x, y) {
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillStyle = 'white';
    const metrics = ctx.measureText(label);
    const textWidth = metrics.width;
    
    // Position text
    ctx.fillText(label, x, y);
    
    // Draw arrow above label
    const arrowY = y - 16;
    const arrowXStart = x;
    const arrowXEnd = x + textWidth;
    
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.moveTo(arrowXStart, arrowY);
    ctx.lineTo(arrowXEnd, arrowY);
    ctx.stroke();
    
    // Small arrow head
    const headSize = 4;
    ctx.beginPath();
    ctx.moveTo(arrowXEnd, arrowY);
    ctx.lineTo(arrowXEnd - headSize, arrowY - headSize/1.5);
    ctx.lineTo(arrowXEnd - headSize, arrowY + headSize/1.5);
    ctx.closePath();
    ctx.fill();
}

function drawArrow(ctx, x0, y0, x1, y1, color, label, width = 3) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const angle = Math.atan2(dy, dx);
    const headLen = Math.min(18, len * 0.4);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - headLen * Math.cos(angle - Math.PI / 6), y1 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x1 - headLen * Math.cos(angle + Math.PI / 6), y1 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        const lx = mx + 15 * Math.cos(angle - Math.PI / 2);
        const ly = my + 15 * Math.sin(angle - Math.PI / 2);
        drawVectorLabel(ctx, label, lx, ly);
    }
    ctx.restore();
}

function drawGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();
}

function drawHandle(ctx, x, y, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// ═══════════════════════════════════════════════════════
// SUM & PARALLELOGRAM LOGIC
// ═══════════════════════════════════════════════════════
const canvas = document.getElementById('vectorCanvas');
const paraCanvas = document.getElementById('paraCanvas');
let bTip = { x: 300, y: 150 };
let isDraggingMain = false;
let isDraggingPara = false;
const ORIGIN = { x: 70, y: 320 };
const A_TIP = { x: 250, y: 320 };

function drawPuntaCoda() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H);
    drawArrow(ctx, ORIGIN.x, ORIGIN.y, A_TIP.x, A_TIP.y, '#3b82f6', 'a');
    drawArrow(ctx, A_TIP.x, A_TIP.y, bTip.x, bTip.y, '#ef4444', 'b');
    drawArrow(ctx, ORIGIN.x, ORIGIN.y, bTip.x, bTip.y, '#fbbf24', 'r', 2.5);
    drawHandle(ctx, bTip.x, bTip.y, '#ef4444');
    updateLabels();
}

function drawParallelogrammo() {
    if (!paraCanvas) return;
    const ctx = paraCanvas.getContext('2d');
    const W = paraCanvas.width, H = paraCanvas.height;
    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H);
    const O = ORIGIN;
    const Bx = bTip.x - A_TIP.x + O.x;
    const By = bTip.y - A_TIP.y + O.y;
    const Rx = A_TIP.x + (Bx - O.x), Ry = A_TIP.y + (By - O.y);
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(A_TIP.x, A_TIP.y); ctx.lineTo(Rx, Ry);
    ctx.moveTo(Bx, By); ctx.lineTo(Rx, Ry);
    ctx.stroke();
    ctx.restore();
    drawArrow(ctx, O.x, O.y, A_TIP.x, A_TIP.y, '#3b82f6', 'a');
    drawArrow(ctx, O.x, O.y, Bx, By, '#ef4444', 'b');
    drawArrow(ctx, O.x, O.y, Rx, Ry, '#fbbf24', 'r', 2.5);
    drawHandle(ctx, Bx, By, '#ef4444');
}

function updateLabels() {
    const ax = A_TIP.x - ORIGIN.x;
    const ay = ORIGIN.y - A_TIP.y;
    const bx = bTip.x - A_TIP.x;
    const by = A_TIP.y - bTip.y;
    const rx = bTip.x - ORIGIN.x;
    const ry = ORIGIN.y - bTip.y;
    const modA = Math.sqrt(ax * ax + ay * ay);
    const modB = Math.sqrt(bx * bx + by * by);
    const modR = Math.sqrt(rx * rx + ry * ry).toFixed(1);
    const cosT = (ax * bx + ay * by) / (modA * modB);
    const theta = (Math.acos(Math.max(-1, Math.min(1, cosT || 1))) * 180 / Math.PI).toFixed(1);

    const el = (id) => document.getElementById(id);
    if (el('vec-a-info')) el('vec-a-info').innerText = `(${ax}, ${ay}) | |a| = ${modA.toFixed(1)}`;
    if (el('vec-b-info')) el('vec-b-info').innerText = `(${bx}, ${by}) | |b| = ${modB.toFixed(1)}`;
    if (el('vec-r-info')) el('vec-r-info').innerText = `(${rx}, ${ry})`;
    if (el('vec-angle')) el('vec-angle').innerText = `${theta}°`;
    if (el('vec-r-mod')) el('vec-r-mod').innerText = modR;
}

// ═══════════════════════════════════════════════════════
// SCALAR PRODUCT LAB
// ═══════════════════════════════════════════════════════
const scalarCanvas = document.getElementById('scalarCanvas');
const scalarKSlider = document.getElementById('scalar-k-slider');
const scalarKVal = document.getElementById('scalar-k-val');
const scalarResInfo = document.getElementById('scalar-res-info');

function drawScalarLab() {
    if (!scalarCanvas) return;
    const ctx = scalarCanvas.getContext('2d');
    const W = scalarCanvas.width, H = scalarCanvas.height;
    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H);
    
    const k = parseFloat(scalarKSlider.value);
    scalarKVal.innerText = k.toFixed(1);
    
    const S_ORIGIN = { x: W / 2, y: H / 2 };
    const baseV = { x: 50, y: 0 };
    const resV = { x: baseV.x * k, y: baseV.y * k };
    
    // Base v (Blue)
    drawArrow(ctx, S_ORIGIN.x, S_ORIGIN.y, S_ORIGIN.x + baseV.x, S_ORIGIN.y - baseV.y, 'rgba(59, 130, 246, 0.4)', 'v', 2);
    // Modified kv (Yellow)
    drawArrow(ctx, S_ORIGIN.x, S_ORIGIN.y, S_ORIGIN.x + resV.x, S_ORIGIN.y - resV.y, '#fbbf24', 'kv', 3.5);
    
    scalarResInfo.innerText = `(${resV.x.toFixed(1)}, ${resV.y.toFixed(1)})`;
}

if (scalarKSlider) {
    scalarKSlider.addEventListener('input', drawScalarLab);
}

// ═══════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════
function resizeAll() {
    [canvas, paraCanvas, scalarCanvas].forEach(c => {
        if (!c) return;
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
    });
    drawAll();
}

function drawAll() {
    drawPuntaCoda();
    drawParallelogrammo();
    drawScalarLab();
}

function initEvents() {
    const startDrag = (c, e, flag) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - r.left;
        const y = (e.clientY || e.touches[0].clientY) - r.top;
        let tx = bTip.x, ty = bTip.y;
        if (flag === 'para') { tx = bTip.x - A_TIP.x + ORIGIN.x; ty = bTip.y - A_TIP.y + ORIGIN.y; }
        if (Math.sqrt((x - tx) ** 2 + (y - ty) ** 2) < 20) {
            if (flag === 'main') isDraggingMain = true;
            else isDraggingPara = true;
        }
    };

    if (canvas) {
        canvas.addEventListener('mousedown', e => startDrag(canvas, e, 'main'));
        canvas.addEventListener('touchstart', e => startDrag(canvas, e, 'main'), {passive: false});
    }
    if (paraCanvas) {
        paraCanvas.addEventListener('mousedown', e => startDrag(paraCanvas, e, 'para'));
        paraCanvas.addEventListener('touchstart', e => startDrag(paraCanvas, e, 'para'), {passive: false});
    }
}

window.addEventListener('mousemove', e => {
    if (isDraggingMain) {
        const r = canvas.getBoundingClientRect();
        bTip.x = e.clientX - r.left; bTip.y = e.clientY - r.top;
        drawAll();
    } else if (isDraggingPara) {
        const r = paraCanvas.getBoundingClientRect();
        bTip.x = (e.clientX - r.left) + A_TIP.x - ORIGIN.x;
        bTip.y = (e.clientY - r.top) + A_TIP.y - ORIGIN.y;
        drawAll();
    }
});

window.addEventListener('mouseup', () => { isDraggingMain = false; isDraggingPara = false; });

// ═══════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════
let qScore = 0;
let qAnswered = new Set();
function checkQuizAnswer(btn, correct) {
    const qDiv = btn.closest('.quiz-question');
    const group = qDiv.querySelectorAll('.quiz-btn');
    const qIdx = Array.from(document.querySelectorAll('.quiz-question')).indexOf(qDiv);
    if (correct) {
        btn.style.background = '#10B981'; btn.style.color = 'white';
        group.forEach(b => b.disabled = true);
        if (!qAnswered.has(qIdx)) { qScore++; qAnswered.add(qIdx); }
    } else {
        btn.style.background = '#ef4444'; btn.style.color = 'white'; btn.disabled = true;
    }
    if (qAnswered.size === 7) {
        document.getElementById('quiz-feedback').innerText = `Risultato: ${qScore}/7! Vector Arrow completata!`;
    }
}

window.onload = () => { resizeAll(); initEvents(); };
window.onresize = resizeAll;
