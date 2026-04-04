// ═══════════════════════════════════════════════════════
// SIMULATION 1: CLICK-TO-PLACE ON GRID
// ═══════════════════════════════════════════════════════
const posCanvas = document.getElementById('posCanvas');
const pCtx = posCanvas ? posCanvas.getContext('2d') : null;
const posXEl = document.getElementById('pos-x');
const posYEl = document.getElementById('pos-y');
const posVecEl = document.getElementById('pos-vec');

let charX = 0;
let charY = 0;
const gridSize = 40;

function initPosCanvas() {
    if (!posCanvas) return;
    posCanvas.width = posCanvas.parentElement.clientWidth;
    charX = posCanvas.width / 2;
    charY = posCanvas.height / 2;
}

function drawPosGrid() {
    if (!pCtx) return;
    pCtx.clearRect(0, 0, posCanvas.width, posCanvas.height);

    // Draw grid lines
    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    for (let x = 0; x < posCanvas.width; x += gridSize) {
        pCtx.moveTo(x, 0); pCtx.lineTo(x, posCanvas.height);
    }
    for (let y = 0; y < posCanvas.height; y += gridSize) {
        pCtx.moveTo(0, y); pCtx.lineTo(posCanvas.width, y);
    }
    pCtx.stroke();

    // Draw axes
    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    pCtx.lineWidth = 2;
    pCtx.beginPath();
    // X axis along top
    pCtx.moveTo(0, 0); pCtx.lineTo(posCanvas.width, 0);
    // Y axis along left
    pCtx.moveTo(0, 0); pCtx.lineTo(0, posCanvas.height);
    pCtx.stroke();

    // X-axis label
    pCtx.fillStyle = 'rgba(255,255,255,0.5)';
    pCtx.font = 'bold 14px Inter, sans-serif';
    pCtx.fillText('X →', posCanvas.width - 40, 18);
    // Y-axis label
    pCtx.save();
    pCtx.translate(14, posCanvas.height - 10);
    pCtx.fillText('Y ↓', 0, 0);
    pCtx.restore();

    // Origin label
    pCtx.fillStyle = '#ef4444';
    pCtx.beginPath(); pCtx.arc(4, 4, 5, 0, Math.PI * 2); pCtx.fill();
    pCtx.fillStyle = 'white';
    pCtx.font = 'bold 12px Inter';
    pCtx.fillText('O(0,0)', 12, 18);

    // Tick marks on X
    pCtx.fillStyle = 'rgba(255,255,255,0.4)';
    pCtx.font = '11px Inter';
    for (let x = gridSize; x < posCanvas.width; x += gridSize * 2) {
        pCtx.fillText(x, x - 8, 14);
    }
    // Ticks on Y
    for (let y = gridSize; y < posCanvas.height; y += gridSize * 2) {
        pCtx.fillText(y, 4, y + 4);
    }

    // Draw position vector (dashed line from origin to character)
    pCtx.beginPath();
    pCtx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    pCtx.lineWidth = 2;
    pCtx.setLineDash([6, 4]);
    pCtx.moveTo(0, 0);
    pCtx.lineTo(charX, charY);
    pCtx.stroke();
    pCtx.setLineDash([]);

    // Projection lines
    pCtx.beginPath();
    pCtx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    pCtx.setLineDash([4, 4]);
    pCtx.moveTo(charX, charY); pCtx.lineTo(charX, 0);
    pCtx.moveTo(charX, charY); pCtx.lineTo(0, charY);
    pCtx.stroke();
    pCtx.setLineDash([]);

    // Arrowhead on position vector
    const angle = Math.atan2(charY, charX);
    const headLen = 12;
    pCtx.beginPath();
    pCtx.fillStyle = '#f59e0b';
    pCtx.moveTo(charX, charY);
    pCtx.lineTo(charX - headLen * Math.cos(angle - 0.3), charY - headLen * Math.sin(angle - 0.3));
    pCtx.lineTo(charX - headLen * Math.cos(angle + 0.3), charY - headLen * Math.sin(angle + 0.3));
    pCtx.closePath();
    pCtx.fill();

    // Draw the character emoji
    pCtx.font = '32px Arial';
    pCtx.fillText('🧑‍🚀', charX - 16, charY + 12);

    // Update labels
    if (posXEl) posXEl.innerText = Math.round(charX);
    if (posYEl) posYEl.innerText = Math.round(charY);
    if (posVecEl) posVecEl.innerHTML = `\\(\\vec{P} = (${Math.round(charX)}, ${Math.round(charY)})\\)`;

    // Re-render KaTeX for the vector label
    if (window.renderMathInElement && posVecEl) {
        renderMathInElement(posVecEl.parentElement);
    }
}

if (posCanvas) {
    initPosCanvas();
    drawPosGrid();

    posCanvas.addEventListener('click', (e) => {
        const rect = posCanvas.getBoundingClientRect();
        charX = e.clientX - rect.left;
        charY = e.clientY - rect.top;
        drawPosGrid();
    });

    window.addEventListener('resize', () => {
        initPosCanvas();
        drawPosGrid();
    });
}


// ═══════════════════════════════════════════════════════
// SIMULATION 2: SQUALL MUST REACH RINOA (FF8)
// ═══════════════════════════════════════════════════════
const moveCanvas = document.getElementById('moveCanvas');
const mCtx = moveCanvas ? moveCanvas.getContext('2d') : null;

const mvXEl = document.getElementById('mv-x');
const mvYEl = document.getElementById('mv-y');
const mvVxEl = document.getElementById('mv-vx');
const mvVyEl = document.getElementById('mv-vy');
const rinoaCoordsEl = document.getElementById('rinoa-coords');
const rescueMsgEl = document.getElementById('rescue-msg');

let mCharX = 60;
let mCharY = 300;
let mVx = 0;
let mVy = 0;
const speed = 150; // pixels per second

// Rinoa's position (placed in top-right area)
let rinoaX = 0;
let rinoaY = 0;
let rescued = false;
let rescueGlowPhase = 0;
const rescueRadius = 40;

function initMoveCanvas() {
    if (!moveCanvas) return;
    moveCanvas.width = moveCanvas.parentElement.clientWidth;
    // Place Rinoa in the top-right quadrant
    rinoaX = moveCanvas.width - 80;
    rinoaY = 80;
    if (rinoaCoordsEl) rinoaCoordsEl.innerText = `(${Math.round(rinoaX)}, ${Math.round(rinoaY)})`;
}

function drawMoveScene() {
    if (!mCtx) return;
    mCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);

    // Background: starfield
    mCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    // Deterministic stars based on canvas size
    for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + 53) * 7) % moveCanvas.width;
        const sy = ((i * 211 + 97) * 3) % moveCanvas.height;
        const sr = (i % 3 === 0) ? 1.5 : 0.8;
        mCtx.beginPath();
        mCtx.arc(sx, sy, sr, 0, Math.PI * 2);
        mCtx.fill();
    }

    // Draw dashed line from Squall to Rinoa (distance indicator)
    if (!rescued) {
        const dist = Math.hypot(rinoaX - mCharX, rinoaY - mCharY);
        mCtx.beginPath();
        mCtx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        mCtx.lineWidth = 1;
        mCtx.setLineDash([4, 6]);
        mCtx.moveTo(mCharX, mCharY);
        mCtx.lineTo(rinoaX, rinoaY);
        mCtx.stroke();
        mCtx.setLineDash([]);

        // Distance label at midpoint 
        mCtx.fillStyle = 'rgba(245, 158, 11, 0.5)';
        mCtx.font = '12px Inter';
        mCtx.fillText(`d = ${Math.round(dist)} px`, (mCharX + rinoaX) / 2 + 5, (mCharY + rinoaY) / 2 - 5);
    }

    // Draw Rinoa (pulsing glow)
    rescueGlowPhase += 0.05;
    const glowSize = rescued ? 25 : 18 + 4 * Math.sin(rescueGlowPhase);
    if (!rescued) {
        mCtx.beginPath();
        mCtx.fillStyle = `rgba(245, 158, 11, ${0.1 + 0.05 * Math.sin(rescueGlowPhase)})`;
        mCtx.arc(rinoaX, rinoaY, glowSize + 10, 0, Math.PI * 2);
        mCtx.fill();
    }
    mCtx.font = '28px Arial';
    mCtx.fillText('👩‍🚀', rinoaX - 14, rinoaY + 10);
    // Rinoa label
    mCtx.fillStyle = '#f59e0b';
    mCtx.font = 'bold 11px Inter';
    mCtx.fillText('Rinoa', rinoaX - 16, rinoaY + 28);

    // Draw velocity arrow from Squall
    if ((mVx !== 0 || mVy !== 0) && !rescued) {
        const arrowScale = 0.4;
        const ax = mCharX + mVx * arrowScale;
        const ay = mCharY + mVy * arrowScale;
        const arrowAngle = Math.atan2(mVy, mVx);
        const hl = 10;

        mCtx.beginPath();
        mCtx.strokeStyle = '#ec4899';
        mCtx.lineWidth = 3;
        mCtx.moveTo(mCharX, mCharY);
        mCtx.lineTo(ax, ay);
        mCtx.stroke();

        // Arrowhead
        mCtx.beginPath();
        mCtx.fillStyle = '#ec4899';
        mCtx.moveTo(ax, ay);
        mCtx.lineTo(ax - hl * Math.cos(arrowAngle - 0.35), ay - hl * Math.sin(arrowAngle - 0.35));
        mCtx.lineTo(ax - hl * Math.cos(arrowAngle + 0.35), ay - hl * Math.sin(arrowAngle + 0.35));
        mCtx.closePath();
        mCtx.fill();

        mCtx.fillStyle = '#ec4899';
        mCtx.font = 'bold 14px Inter';
        mCtx.fillText('v⃗', ax + 8, ay - 5);
    }

    // Draw Squall
    mCtx.font = '28px Arial';
    mCtx.fillText('🧑‍🚀', mCharX - 14, mCharY + 10);
    mCtx.fillStyle = '#3b82f6';
    mCtx.font = 'bold 11px Inter';
    mCtx.fillText('Squall', mCharX - 18, mCharY + 28);

    // Rescued celebration
    if (rescued) {
        mCtx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        mCtx.fillRect(0, 0, moveCanvas.width, moveCanvas.height);
        mCtx.font = 'bold 20px Inter';
        mCtx.fillStyle = '#10b981';
        mCtx.textAlign = 'center';
        mCtx.fillText('✨ Rescue Complete! ✨', moveCanvas.width / 2, moveCanvas.height / 2 - 10);
        mCtx.font = '14px Inter';
        mCtx.fillStyle = 'rgba(255,255,255,0.6)';
        mCtx.fillText('Squall caught Rinoa in the void of space!', moveCanvas.width / 2, moveCanvas.height / 2 + 15);
        mCtx.textAlign = 'start';
    }

    // Update UI
    if (mvXEl) mvXEl.innerText = Math.round(mCharX);
    if (mvYEl) mvYEl.innerText = Math.round(mCharY);
    if (mvVxEl) mvVxEl.innerText = mVx.toFixed(0);
    if (mvVyEl) mvVyEl.innerText = mVy.toFixed(0);
}

let moveLastTime = 0;
function animateMove(timestamp) {
    if (!moveLastTime) moveLastTime = timestamp;
    const dt = (timestamp - moveLastTime) / 1000;
    moveLastTime = timestamp;

    if (!rescued) {
        // Update position
        mCharX += mVx * dt;
        mCharY += mVy * dt;

        // Clamp to canvas boundaries (no wrap, Squall stays on screen)
        mCharX = Math.max(10, Math.min(moveCanvas.width - 10, mCharX));
        mCharY = Math.max(10, Math.min(moveCanvas.height - 10, mCharY));

        // Check rescue
        const dist = Math.hypot(rinoaX - mCharX, rinoaY - mCharY);
        if (dist < rescueRadius) {
            rescued = true;
            mVx = 0;
            mVy = 0;
            mCharX = rinoaX - 25;
            mCharY = rinoaY;
            if (rescueMsgEl) rescueMsgEl.innerHTML = '<span style="color: #10b981;">🎉 Rescue complete!</span>';
        }
    }

    drawMoveScene();
    requestAnimationFrame(animateMove);
}

if (moveCanvas) {
    initMoveCanvas();
    drawMoveScene();
    requestAnimationFrame(animateMove);

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (rescued) return;
        switch (e.key) {
            case 'ArrowUp': mVy = -speed; e.preventDefault(); break;
            case 'ArrowDown': mVy = speed; e.preventDefault(); break;
            case 'ArrowLeft': mVx = -speed; e.preventDefault(); break;
            case 'ArrowRight': mVx = speed; e.preventDefault(); break;
        }
    });
    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowUp': case 'ArrowDown': mVy = 0; break;
            case 'ArrowLeft': case 'ArrowRight': mVx = 0; break;
        }
    });

    // D-pad buttons
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnStop = document.getElementById('btn-stop');

    if (btnUp) {
        btnUp.addEventListener('mousedown', () => { if (!rescued) mVy = -speed; });
        btnUp.addEventListener('mouseup', () => { mVy = 0; });
        btnUp.addEventListener('mouseleave', () => { mVy = 0; });
        btnUp.addEventListener('touchstart', (e) => { if (!rescued) mVy = -speed; e.preventDefault(); });
        btnUp.addEventListener('touchend', () => { mVy = 0; });
    }
    if (btnDown) {
        btnDown.addEventListener('mousedown', () => { if (!rescued) mVy = speed; });
        btnDown.addEventListener('mouseup', () => { mVy = 0; });
        btnDown.addEventListener('mouseleave', () => { mVy = 0; });
        btnDown.addEventListener('touchstart', (e) => { if (!rescued) mVy = speed; e.preventDefault(); });
        btnDown.addEventListener('touchend', () => { mVy = 0; });
    }
    if (btnLeft) {
        btnLeft.addEventListener('mousedown', () => { if (!rescued) mVx = -speed; });
        btnLeft.addEventListener('mouseup', () => { mVx = 0; });
        btnLeft.addEventListener('mouseleave', () => { mVx = 0; });
        btnLeft.addEventListener('touchstart', (e) => { if (!rescued) mVx = -speed; e.preventDefault(); });
        btnLeft.addEventListener('touchend', () => { mVx = 0; });
    }
    if (btnRight) {
        btnRight.addEventListener('mousedown', () => { if (!rescued) mVx = speed; });
        btnRight.addEventListener('mouseup', () => { mVx = 0; });
        btnRight.addEventListener('mouseleave', () => { mVx = 0; });
        btnRight.addEventListener('touchstart', (e) => { if (!rescued) mVx = speed; e.preventDefault(); });
        btnRight.addEventListener('touchend', () => { mVx = 0; });
    }
    if (btnStop) {
        btnStop.addEventListener('click', () => {
            if (rescued) {
                // Reset mission
                rescued = false;
                mCharX = 60;
                mCharY = 300;
                mVx = 0;
                mVy = 0;
                if (rescueMsgEl) rescueMsgEl.innerHTML = '';
            } else {
                mVx = 0; mVy = 0;
            }
        });
    }

    window.addEventListener('resize', () => {
        initMoveCanvas();
        drawMoveScene();
    });
}


// ═══════════════════════════════════════════════════════
// QUIZ (Trial & Error)
// ═══════════════════════════════════════════════════════
const quizButtons = document.querySelectorAll('.quiz-btn:not(.dpad-btn)');

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
