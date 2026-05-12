let unitCircleCanvas, graphCanvas;
let unitCircleCtx, graphCtx;
let canvasWidth, canvasHeight;
let circleRadius = 120;
let currentFunction = 'sin';

document.addEventListener('DOMContentLoaded', () => {
    unitCircleCanvas = document.getElementById('unit-circle');
    graphCanvas = document.getElementById('gonio-graph');
    unitCircleCtx = unitCircleCanvas.getContext('2d');
    graphCtx = graphCanvas.getContext('2d');

    // Set canvas sizes
    unitCircleCanvas.width = unitCircleCanvas.offsetWidth;
    unitCircleCanvas.height = unitCircleCanvas.offsetHeight;
    graphCanvas.width = graphCanvas.offsetWidth;
    graphCanvas.height = graphCanvas.offsetHeight;

    canvasWidth = graphCanvas.width;
    canvasHeight = graphCanvas.height;

    // Event listener
    document.getElementById('angle-slider').addEventListener('input', updateGraphics);

    updateGraphics();
});

window.selectFunction = function(fn) {
    currentFunction = fn;

    // Update button styles
    document.querySelectorAll('.fn-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updateGraphics();
};

function updateGraphics() {
    const angle = parseFloat(document.getElementById('angle-slider').value);

    // Update angle display
    const degrees = (angle * 180 / Math.PI).toFixed(0);
    document.getElementById('angle-display').textContent =
        `${angle.toFixed(2)} rad (${degrees}°)`;

    // Update values
    const sinVal = Math.sin(angle);
    const cosVal = Math.cos(angle);
    const tanVal = Math.tan(angle);

    document.getElementById('sin-value').textContent = sinVal.toFixed(2);
    document.getElementById('cos-value').textContent = cosVal.toFixed(2);
    document.getElementById('tan-value').textContent = isFinite(tanVal) ? tanVal.toFixed(2) : '∞';
    document.getElementById('degree-value').textContent = `${degrees}°`;

    // Draw
    drawUnitCircle(angle);
    drawFunction(angle);
}

function drawUnitCircle(angle) {
    const centerX = unitCircleCanvas.width / 2;
    const centerY = unitCircleCanvas.height / 2;

    // Clear
    unitCircleCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    unitCircleCtx.fillRect(0, 0, unitCircleCanvas.width, unitCircleCanvas.height);

    // Draw circle
    unitCircleCtx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    unitCircleCtx.lineWidth = 2;
    unitCircleCtx.beginPath();
    unitCircleCtx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    unitCircleCtx.stroke();

    // Draw axes
    unitCircleCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    unitCircleCtx.lineWidth = 1;
    unitCircleCtx.beginPath();
    unitCircleCtx.moveTo(centerX - circleRadius - 20, centerY);
    unitCircleCtx.lineTo(centerX + circleRadius + 20, centerY);
    unitCircleCtx.stroke();
    unitCircleCtx.beginPath();
    unitCircleCtx.moveTo(centerX, centerY - circleRadius - 20);
    unitCircleCtx.lineTo(centerX, centerY + circleRadius + 20);
    unitCircleCtx.stroke();

    // Draw point on circle
    const x = Math.cos(angle) * circleRadius;
    const y = -Math.sin(angle) * circleRadius;
    const px = centerX + x;
    const py = centerY + y;

    // Point
    unitCircleCtx.fillStyle = '#06b6d4';
    unitCircleCtx.beginPath();
    unitCircleCtx.arc(px, py, 6, 0, Math.PI * 2);
    unitCircleCtx.fill();

    // Line from origin
    unitCircleCtx.strokeStyle = '#06b6d4';
    unitCircleCtx.lineWidth = 2;
    unitCircleCtx.beginPath();
    unitCircleCtx.moveTo(centerX, centerY);
    unitCircleCtx.lineTo(px, py);
    unitCircleCtx.stroke();

    // Projection lines
    unitCircleCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    unitCircleCtx.lineWidth = 1;
    unitCircleCtx.setLineDash([4, 4]);

    // Horizontal (cosine)
    unitCircleCtx.beginPath();
    unitCircleCtx.moveTo(px, py);
    unitCircleCtx.lineTo(px, centerY);
    unitCircleCtx.stroke();

    // Vertical (sine)
    unitCircleCtx.beginPath();
    unitCircleCtx.moveTo(px, py);
    unitCircleCtx.lineTo(centerX, py);
    unitCircleCtx.stroke();

    unitCircleCtx.setLineDash([]);

    // Labels
    unitCircleCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    unitCircleCtx.font = '11px Inter';
    unitCircleCtx.textAlign = 'center';
    unitCircleCtx.fillText('cos θ', px, centerY + 18);
    unitCircleCtx.textAlign = 'right';
    unitCircleCtx.fillText('sin θ', centerX - 12, py + 4);
}

function drawFunction(angle) {
    const graphWidth = graphCanvas.width;
    const graphHeight = graphCanvas.height;
    const centerY = graphHeight / 2;
    const scaleX = graphWidth / (2 * Math.PI);
    const scaleY = graphHeight / 3;

    // Clear
    graphCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    graphCtx.fillRect(0, 0, graphWidth, graphHeight);

    // Draw grid
    graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    graphCtx.lineWidth = 1;
    for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 4) {
        const px = i * scaleX;
        graphCtx.beginPath();
        graphCtx.moveTo(px, 0);
        graphCtx.lineTo(px, graphHeight);
        graphCtx.stroke();
    }

    // Draw horizontal axis
    graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    graphCtx.lineWidth = 1;
    graphCtx.beginPath();
    graphCtx.moveTo(0, centerY);
    graphCtx.lineTo(graphWidth, centerY);
    graphCtx.stroke();

    // Draw function
    graphCtx.strokeStyle = '#06b6d4';
    graphCtx.lineWidth = 3;
    graphCtx.beginPath();

    let first = true;
    for (let x = 0; x <= 2 * Math.PI; x += 0.02) {
        let y;
        if (currentFunction === 'sin') {
            y = Math.sin(x);
        } else if (currentFunction === 'cos') {
            y = Math.cos(x);
        } else if (currentFunction === 'tan') {
            y = Math.tan(x);
            // Clamp tan to avoid extreme values
            if (Math.abs(y) > 3) y = Math.sign(y) * 3;
        }

        const px = x * scaleX;
        const py = centerY - y * scaleY;

        if (first) {
            graphCtx.moveTo(px, py);
            first = false;
        } else {
            graphCtx.lineTo(px, py);
        }
    }
    graphCtx.stroke();

    // Mark current angle on graph
    const graphX = angle * scaleX;
    let graphY;
    if (currentFunction === 'sin') {
        graphY = Math.sin(angle);
    } else if (currentFunction === 'cos') {
        graphY = Math.cos(angle);
    } else {
        graphY = Math.tan(angle);
        if (Math.abs(graphY) > 3) graphY = Math.sign(graphY) * 3;
    }
    const graphPy = centerY - graphY * scaleY;

    graphCtx.fillStyle = '#f59e0b';
    graphCtx.beginPath();
    graphCtx.arc(graphX, graphPy, 5, 0, Math.PI * 2);
    graphCtx.fill();

    // Vertical line from angle slider
    graphCtx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    graphCtx.lineWidth = 1;
    graphCtx.setLineDash([4, 4]);
    graphCtx.beginPath();
    graphCtx.moveTo(graphX, 0);
    graphCtx.lineTo(graphX, graphHeight);
    graphCtx.stroke();
    graphCtx.setLineDash([]);
}
