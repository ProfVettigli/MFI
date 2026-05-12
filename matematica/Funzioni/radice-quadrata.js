let squareCanvas, sqrtCanvas;
let squareCtx, sqrtCtx;
let canvasWidth, canvasHeight;
let centerX, centerY;
let scale = 40;

document.addEventListener('DOMContentLoaded', () => {
    squareCanvas = document.getElementById('square-canvas');
    sqrtCanvas = document.getElementById('sqrt-canvas');
    squareCtx = squareCanvas.getContext('2d');
    sqrtCtx = sqrtCanvas.getContext('2d');

    canvasWidth = squareCanvas.offsetWidth;
    canvasHeight = squareCanvas.offsetHeight;

    squareCanvas.width = canvasWidth;
    squareCanvas.height = canvasHeight;
    sqrtCanvas.width = canvasWidth;
    sqrtCanvas.height = canvasHeight;

    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;

    // Event listener
    document.getElementById('x-slider').addEventListener('input', updateGraphs);

    updateGraphs();
});

function updateGraphs() {
    const x = parseFloat(document.getElementById('x-slider').value);

    // Update info panel
    document.getElementById('input-x').textContent = x.toFixed(2);
    document.getElementById('output-sqrt').textContent = Math.sqrt(x).toFixed(2);
    document.getElementById('output-square').textContent = (x * x).toFixed(2);

    // Draw square function
    drawSquareGraph(x);

    // Draw sqrt function
    drawSqrtGraph(x);
}

function drawSquareGraph(selectedX) {
    squareCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    squareCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawGrid(squareCtx);
    drawAxes(squareCtx, 'X', 'X²');

    // Draw parabola
    squareCtx.strokeStyle = '#3b82f6';
    squareCtx.lineWidth = 3;
    squareCtx.beginPath();

    let first = true;
    for (let px = 0; px < canvasWidth; px++) {
        const x = (px - centerX) / scale;
        const y = x * x;
        const py = centerY - y * scale;

        if (py > -100 && py < canvasHeight + 100) {
            if (first) {
                squareCtx.moveTo(px, py);
                first = false;
            } else {
                squareCtx.lineTo(px, py);
            }
        }
    }
    squareCtx.stroke();

    // Draw selected point
    const selectedY = selectedX * selectedX;
    const px = centerX + selectedX * scale;
    const py = centerY - selectedY * scale;

    squareCtx.fillStyle = '#f59e0b';
    squareCtx.beginPath();
    squareCtx.arc(px, py, 7, 0, Math.PI * 2);
    squareCtx.fill();

    // Draw lines to axes
    squareCtx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    squareCtx.lineWidth = 1;
    squareCtx.setLineDash([4, 4]);
    squareCtx.beginPath();
    squareCtx.moveTo(px, py);
    squareCtx.lineTo(px, centerY);
    squareCtx.stroke();
    squareCtx.setLineDash([]);
}

function drawSqrtGraph(selectedX) {
    sqrtCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    sqrtCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawGrid(sqrtCtx);
    drawAxes(sqrtCtx, 'X', '√X');

    // Draw square root
    sqrtCtx.strokeStyle = '#10b981';
    sqrtCtx.lineWidth = 3;
    sqrtCtx.beginPath();

    let first = true;
    for (let px = 0; px < canvasWidth; px++) {
        const x = (px - centerX) / scale;
        if (x >= 0) {
            const y = Math.sqrt(x);
            const py = centerY - y * scale;

            if (first) {
                sqrtCtx.moveTo(px, py);
                first = false;
            } else {
                sqrtCtx.lineTo(px, py);
            }
        }
    }
    sqrtCtx.stroke();

    // Draw selected point
    const selectedY = Math.sqrt(selectedX);
    const px = centerX + selectedX * scale;
    const py = centerY - selectedY * scale;

    sqrtCtx.fillStyle = '#f59e0b';
    sqrtCtx.beginPath();
    sqrtCtx.arc(px, py, 7, 0, Math.PI * 2);
    sqrtCtx.fill();

    // Draw lines to axes
    sqrtCtx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    sqrtCtx.lineWidth = 1;
    sqrtCtx.setLineDash([4, 4]);
    sqrtCtx.beginPath();
    sqrtCtx.moveTo(px, py);
    sqrtCtx.lineTo(px, centerY);
    sqrtCtx.stroke();
    sqrtCtx.setLineDash([]);
}

function drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = -5; i <= 15; i++) {
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();

        const y = centerY - i * scale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

function drawAxes(ctx, xLabel, yLabel) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, canvasWidth - 15, centerY - 10);
    ctx.textAlign = 'right';
    ctx.fillText(yLabel, centerX - 10, 15);
}
