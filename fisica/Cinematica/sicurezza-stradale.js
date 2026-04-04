// ═══════════════════════════════════════════════════════
// SIMULATION 1: BRAKING DISTANCE
// ═══════════════════════════════════════════════════════
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const dReaction = document.getElementById('d-reaction');
const dBraking = document.getElementById('d-braking');
const dTotal = document.getElementById('d-total');
const brakeCanvas = document.getElementById('brakeCanvas');
const bCtx = brakeCanvas ? brakeCanvas.getContext('2d') : null;
const btnBrake = document.getElementById('btn-brake');

const reactionTime = 1.0; // seconds
const deceleration = 8.0; // m/s^2

// Helper: draw emoji flipped horizontally (so vehicles face right)
function drawEmoji(ctx, emoji, x, y, size) {
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.font = size + 'px Arial';
    ctx.textAlign = 'center';
    ctx.translate(x, y);
    ctx.scale(-1, 1); // flip horizontally
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
}

let currentSpeedKmh = 50;
let brakeAnim = null;
let brakeCarX = 0;
let brakeCarSpeed = 0;
let brakePhase = 'idle'; // 'idle', 'reaction', 'braking', 'stopped'
let brakeTimer = 0;
let brakeReactionDist = 0;
let brakeBrakingDist = 0;

function initBrakeCanvas() {
    if (!brakeCanvas) return;
    brakeCanvas.width = brakeCanvas.parentElement.clientWidth;
}

function updateBrakeCalc() {
    const vKmh = parseInt(speedSlider.value);
    currentSpeedKmh = vKmh;
    const vMs = vKmh / 3.6;
    const dr = vMs * reactionTime;
    const db = (vMs * vMs) / (2 * deceleration);
    const dt = dr + db;

    speedDisplay.innerText = vKmh + ' km/h';
    dReaction.innerText = dr.toFixed(1) + ' m';
    dBraking.innerText = db.toFixed(1) + ' m';
    dTotal.innerText = dt.toFixed(1) + ' m';

    // Color code the speed display
    if (vKmh <= 50) {
        speedDisplay.style.color = '#10b981';
    } else if (vKmh <= 90) {
        speedDisplay.style.color = '#f59e0b';
    } else {
        speedDisplay.style.color = '#ef4444';
    }

    drawBrakeScene();
}

function drawBrakeScene() {
    if (!bCtx) return;
    bCtx.clearRect(0, 0, brakeCanvas.width, brakeCanvas.height);

    const vMs = currentSpeedKmh / 3.6;
    const dr = vMs * reactionTime;
    const db = (vMs * vMs) / (2 * deceleration);
    const dt = dr + db;

    // Scale: map total distance to canvas width with padding
    const maxDist = 180; // max possible at 150 km/h
    const scale = (brakeCanvas.width - 100) / maxDist;
    const roadY = brakeCanvas.height / 2 + 20;
    const startX = 50;

    // Draw road
    bCtx.fillStyle = '#2d2d3f';
    bCtx.fillRect(0, roadY - 20, brakeCanvas.width, 40);

    // Road dashes
    bCtx.strokeStyle = '#f59e0b';
    bCtx.lineWidth = 2;
    bCtx.setLineDash([15, 10]);
    bCtx.beginPath();
    bCtx.moveTo(0, roadY);
    bCtx.lineTo(brakeCanvas.width, roadY);
    bCtx.stroke();
    bCtx.setLineDash([]);

    if (brakePhase === 'idle') {
        // Draw static preview
        // Reaction zone
        const rEnd = startX + dr * scale;
        bCtx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        bCtx.fillRect(startX, roadY - 25, dr * scale, 50);
        bCtx.strokeStyle = '#3b82f6';
        bCtx.lineWidth = 2;
        bCtx.strokeRect(startX, roadY - 25, dr * scale, 50);

        // Braking zone
        bCtx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        bCtx.fillRect(rEnd, roadY - 25, db * scale, 50);
        bCtx.strokeStyle = '#ef4444';
        bCtx.lineWidth = 2;
        bCtx.strokeRect(rEnd, roadY - 25, db * scale, 50);

        // Labels
        bCtx.font = 'bold 11px Inter';
        bCtx.fillStyle = '#3b82f6';
        bCtx.textAlign = 'center';
        bCtx.fillText('Reazione', startX + dr * scale / 2, roadY - 32);
        bCtx.fillText(dr.toFixed(1) + ' m', startX + dr * scale / 2, roadY + 45);

        bCtx.fillStyle = '#ef4444';
        bCtx.fillText('Frenata', rEnd + db * scale / 2, roadY - 32);
        bCtx.fillText(db.toFixed(1) + ' m', rEnd + db * scale / 2, roadY + 45);

        // Total arrow
        const totalEnd = startX + dt * scale;
        bCtx.strokeStyle = 'white';
        bCtx.lineWidth = 1;
        bCtx.beginPath();
        bCtx.moveTo(startX, roadY + 55);
        bCtx.lineTo(totalEnd, roadY + 55);
        bCtx.stroke();
        bCtx.fillStyle = 'white';
        bCtx.font = 'bold 12px Inter';
        bCtx.fillText('Totale: ' + dt.toFixed(1) + ' m', (startX + totalEnd) / 2, roadY + 70);

        // Car emoji at start (flipped to face right)
        drawEmoji(bCtx, '🚗', startX - 15, roadY + 8, 24);
        bCtx.textAlign = 'start';

    } else {
        // Animation in progress
        const rEnd = startX + brakeReactionDist * scale;
        const carDrawX = startX + brakeCarX * scale;

        // Reaction zone (filled up to how far we've gone during reaction)
        if (brakePhase === 'reaction' || brakePhase === 'braking' || brakePhase === 'stopped') {
            bCtx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            bCtx.fillRect(startX, roadY - 25, brakeReactionDist * scale, 50);
            bCtx.strokeStyle = '#3b82f6';
            bCtx.lineWidth = 2;
            bCtx.strokeRect(startX, roadY - 25, brakeReactionDist * scale, 50);
            bCtx.font = 'bold 11px Inter';
            bCtx.fillStyle = '#3b82f6';
            bCtx.textAlign = 'center';
            bCtx.fillText('Reazione', startX + brakeReactionDist * scale / 2, roadY - 32);
        }

        if (brakePhase === 'braking' || brakePhase === 'stopped') {
            const brakeDist = brakeCarX - brakeReactionDist;
            bCtx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            bCtx.fillRect(rEnd, roadY - 25, brakeDist * scale, 50);
            bCtx.strokeStyle = '#ef4444';
            bCtx.lineWidth = 2;
            bCtx.strokeRect(rEnd, roadY - 25, brakeDist * scale, 50);
            bCtx.font = 'bold 11px Inter';
            bCtx.fillStyle = '#ef4444';
            bCtx.textAlign = 'center';
            bCtx.fillText('Frenata', rEnd + brakeDist * scale / 2, roadY - 32);
        }

        if (brakePhase === 'stopped') {
            bCtx.fillStyle = '#10b981';
            bCtx.font = 'bold 14px Inter';
            bCtx.textAlign = 'center';
            bCtx.fillText('🛑 STOP a ' + brakeCarX.toFixed(1) + ' m', carDrawX, roadY - 40);
        }

        // Car (flipped to face right)
        drawEmoji(bCtx, '🚗', carDrawX, roadY + 8, 24);
        bCtx.textAlign = 'start';
    }
}

function startBrakeAnimation() {
    if (brakeAnim) cancelAnimationFrame(brakeAnim);
    const vMs = currentSpeedKmh / 3.6;
    brakeCarX = 0;
    brakeCarSpeed = vMs;
    brakeReactionDist = vMs * reactionTime;
    brakeBrakingDist = (vMs * vMs) / (2 * deceleration);
    brakePhase = 'reaction';
    brakeTimer = 0;

    let lastTime = 0;
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        brakeTimer += dt;

        if (brakePhase === 'reaction') {
            brakeCarX += brakeCarSpeed * dt;
            if (brakeTimer >= reactionTime) {
                brakeCarX = brakeReactionDist;
                brakePhase = 'braking';
            }
        } else if (brakePhase === 'braking') {
            brakeCarSpeed -= deceleration * dt;
            if (brakeCarSpeed <= 0) {
                brakeCarSpeed = 0;
                brakePhase = 'stopped';
            }
            brakeCarX += brakeCarSpeed * dt;
        }

        drawBrakeScene();

        if (brakePhase !== 'stopped') {
            brakeAnim = requestAnimationFrame(animate);
        }
    }
    brakeAnim = requestAnimationFrame(animate);
}

if (speedSlider) {
    speedSlider.addEventListener('input', () => {
        brakePhase = 'idle';
        if (brakeAnim) cancelAnimationFrame(brakeAnim);
        updateBrakeCalc();
    });
}

if (btnBrake) {
    btnBrake.addEventListener('click', startBrakeAnimation);
}

if (brakeCanvas) {
    initBrakeCanvas();
    updateBrakeCalc();
    window.addEventListener('resize', () => {
        initBrakeCanvas();
        drawBrakeScene();
    });
}


// ═══════════════════════════════════════════════════════
// SIMULATION 2: TURN SIGNALS (WITH vs WITHOUT)
// ═══════════════════════════════════════════════════════
const turnCanvasA = document.getElementById('turnCanvasA');
const turnCanvasB = document.getElementById('turnCanvasB');
const tCtxA = turnCanvasA ? turnCanvasA.getContext('2d') : null;
const tCtxB = turnCanvasB ? turnCanvasB.getContext('2d') : null;
const btnTurnSim = document.getElementById('btn-turn-sim');

let turnAnim = null;
let turnTime = 0;
let turnRunning = false;

function initTurnCanvas() {
    if (turnCanvasA) turnCanvasA.width = turnCanvasA.parentElement.clientWidth;
    if (turnCanvasB) turnCanvasB.width = turnCanvasB.parentElement.clientWidth;
}

function drawTurnScene(ctx, canvas, withSignal, t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;

    const roadY = canvas.height / 2;
    const roadH = 50;
    const turnX = canvas.width * 0.65;

    // Main road
    ctx.fillStyle = '#2d2d3f';
    ctx.fillRect(0, roadY - roadH / 2, canvas.width, roadH);

    // Side road (going down)
    ctx.fillRect(turnX - 25, roadY, 50, canvas.height - roadY);

    // Road lines - main
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(canvas.width, roadY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Turn arrow on road
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('↱', turnX, roadY + 4);
    ctx.globalAlpha = 1.0;

    // === BLUE CAR MOVEMENT ===
    const carStartX = 30;
    const carTurnStart = 2.5;
    const carTurnEnd = 3.5;

    let blueX, blueY;

    if (t < carTurnStart) {
        blueX = carStartX + (turnX - carStartX) * (t / carTurnStart);
        blueY = roadY - 10;
    } else if (t < carTurnEnd) {
        const p = (t - carTurnStart) / (carTurnEnd - carTurnStart);
        blueX = turnX;
        blueY = roadY - 10 + p * 60;
    } else {
        blueX = turnX;
        blueY = roadY + 50 + (t - carTurnEnd) * 40;
    }

    // Draw blinker glow if withSignal
    if (withSignal && t < carTurnEnd && t > 0.8) {
        const blinkOn = Math.floor(t * 3) % 2 === 0;
        if (blinkOn) {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(blueX + 12, blueY - 3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(blueX + 12, blueY - 3, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    // Draw blue car (fully opaque, flipped)
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(blueX, blueY);
    ctx.scale(-1, 1);
    ctx.fillText('🚙', 0, 0);
    ctx.restore();

    // === MOTORCYCLE MOVEMENT (smooth interpolation) ===
    const motoStartX = 10;
    let motoX, motoY;

    if (withSignal) {
        // Moto travels at CONSTANT speed, then brakes gently when it sees the blinker
        const blinkerSeenT = 1.2;
        const motoSafeX = turnX - 55;
        // Constant speed: cover (motoSafeX - motoStartX) over the full approach time
        const constantSpeed = (turnX - 20 - motoStartX) / carTurnStart; // same speed as scene B

        if (t <= 0) {
            motoX = motoStartX;
        } else if (t < blinkerSeenT) {
            // Constant speed, same as no-signal scenario
            motoX = motoStartX + constantSpeed * t;
        } else if (t < carTurnStart + 0.5) {
            // Position when braking starts
            const posAtBrake = motoStartX + constantSpeed * blinkerSeenT;
            // Smooth deceleration: speed goes from constantSpeed to 0
            const brakeDuration = carTurnStart + 0.5 - blinkerSeenT;
            const bt = t - blinkerSeenT;
            const p = Math.min(1, bt / brakeDuration);
            // ease-out: decelerating (position follows parabola that flattens)
            const eased = p * (2 - p);
            const maxBrakeDist = motoSafeX - posAtBrake;
            motoX = posAtBrake + maxBrakeDist * eased;
        } else {
            motoX = motoSafeX;
        }
        motoY = roadY - 10;
    } else {
        // Without signal: moto drives at full speed, then PANIC brakes
        const motoFullSpeedTarget = turnX - 15;

        if (t < carTurnStart) {
            // Full speed approach (linear, no warning)
            const p = t / carTurnStart;
            motoX = motoStartX + (motoFullSpeedTarget - motoStartX) * p;
            motoY = roadY - 10;
        } else {
            // Panic brake: rapid deceleration with slight overshoot
            const brakeTime = t - carTurnStart;
            const brakeDuration = 0.6;
            if (brakeTime < brakeDuration) {
                const p = brakeTime / brakeDuration;
                const eased = p * (2 - p); // ease-out
                motoX = motoFullSpeedTarget + 8 * (1 - eased); // slight forward slide
            } else {
                motoX = motoFullSpeedTarget + 1;
            }
            motoY = roadY - 10;

            // Skid marks
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(motoFullSpeedTarget - 25, roadY - 8);
            ctx.lineTo(motoX, roadY - 8);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }

    // Draw motorcycle (fully opaque, flipped)
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(motoX, motoY);
    ctx.scale(-1, 1);
    ctx.fillText('🏍️', 0, 0);
    ctx.restore();

    // === STATUS MESSAGES ===
    ctx.globalAlpha = 1.0;
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    if (withSignal && t > carTurnEnd) {
        ctx.fillStyle = '#10b981';
        ctx.fillText('✅ Svolta sicura!', canvas.width / 2, 22);
    } else if (!withSignal && t > carTurnStart + 0.3) {
        ctx.fillStyle = '#ef4444';
        ctx.fillText('⚠️ Frenata di emergenza!', canvas.width / 2, 22);
        // Danger border
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    }
    ctx.textAlign = 'start';
}

function startTurnAnimation() {
    if (turnAnim) cancelAnimationFrame(turnAnim);
    turnTime = 0;
    turnRunning = true;

    let lastTime = 0;
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        turnTime += dt;

        drawTurnScene(tCtxA, turnCanvasA, true, turnTime);
        drawTurnScene(tCtxB, turnCanvasB, false, turnTime);

        if (turnTime < 5) {
            turnAnim = requestAnimationFrame(animate);
        } else {
            turnRunning = false;
        }
    }
    turnAnim = requestAnimationFrame(animate);
}

if (btnTurnSim) {
    btnTurnSim.addEventListener('click', startTurnAnimation);
}

if (turnCanvasA && turnCanvasB) {
    initTurnCanvas();
    drawTurnScene(tCtxA, turnCanvasA, true, 0);
    drawTurnScene(tCtxB, turnCanvasB, false, 0);
    window.addEventListener('resize', () => {
        initTurnCanvas();
        drawTurnScene(tCtxA, turnCanvasA, true, 0);
        drawTurnScene(tCtxB, turnCanvasB, false, 0);
    });
}


// ═══════════════════════════════════════════════════════
// QUIZ (Trial & Error)
// ═══════════════════════════════════════════════════════
const quizButtons = document.querySelectorAll('.quiz-btn:not(#btn-brake):not(#btn-turn-sim)');

quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const questionDiv = btn.closest('.quiz-question');
        if (!questionDiv) return;
        const status = btn.getAttribute('data-status');
        const allBtns = questionDiv.querySelectorAll('.quiz-btn');

        if (status === 'correct') {
            btn.classList.add('correct');
            allBtns.forEach(b => b.disabled = true);
        } else {
            btn.classList.add('wrong');
        }
    });
});
