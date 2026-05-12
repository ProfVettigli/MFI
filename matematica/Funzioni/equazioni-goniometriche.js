let canvas;
let ctx;
let canvasWidth, canvasHeight;
let centerX, centerY;
let scale = 80; // pixels per unit

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('unit-circle-canvas');
    ctx = canvas.getContext('2d');

    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;

    document.getElementById('sin-slider').addEventListener('input', updateVisualization);
    document.getElementById('cos-slider').addEventListener('input', updateVisualization);

    updateVisualization();
});

function updateVisualization() {
    const sinK = parseFloat(document.getElementById('sin-slider').value);
    const cosK = parseFloat(document.getElementById('cos-slider').value);

    drawUnitCircle(sinK, cosK);
    updateSolutions(sinK, cosK);
}

function drawUnitCircle(sinK, cosK) {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvasWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }

    // Draw axes
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

    // Draw unit circle
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, scale, 0, Math.PI * 2);
    ctx.stroke();

    // Draw sin(x) = k line (horizontal)
    if (sinK >= -1 && sinK <= 1) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const yLine = centerY - sinK * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - scale - 30, yLine);
        ctx.lineTo(centerX + scale + 30, yLine);
        ctx.stroke();
        ctx.setLineDash([]);

        // Mark intersection points
        const alpha = Math.asin(sinK);
        const angle1 = alpha;
        const angle2 = Math.PI - alpha;

        drawPoint(angle1, 'rgba(239, 68, 68, 0.8)');
        drawPoint(angle2, 'rgba(239, 68, 68, 0.8)');
    }

    // Draw cos(x) = k line (vertical)
    if (cosK >= -1 && cosK <= 1) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const xLine = centerX + cosK * scale;
        ctx.beginPath();
        ctx.moveTo(xLine, centerY - scale - 30);
        ctx.lineTo(xLine, centerY + scale + 30);
        ctx.stroke();
        ctx.setLineDash([]);

        // Mark intersection points
        const alpha = Math.acos(cosK);
        drawPoint(alpha, 'rgba(59, 130, 246, 0.8)');
        drawPoint(-alpha, 'rgba(59, 130, 246, 0.8)');
    }

    // Draw reference angle arc (for sin)
    if (sinK >= -1 && sinK <= 1 && sinK >= 0) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 2;
        const alpha = Math.asin(sinK);
        const arcRadius = 20;
        ctx.beginPath();
        ctx.arc(centerX, centerY, arcRadius, 0, alpha, false);
        ctx.stroke();
    }

    // Draw angle labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('0', centerX + scale + 10, centerY - 5);
    ctx.fillText('π/2', centerX + 5, centerY - scale - 10);
    ctx.fillText('π', centerX - scale - 20, centerY - 5);
    ctx.fillText('3π/2', centerX + 5, centerY + scale + 15);
}

function drawPoint(angle, color) {
    const x = centerX + Math.cos(angle) * scale;
    const y = centerY - Math.sin(angle) * scale;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
}

function updateSolutions(sinK, cosK) {
    // Update sin solutions
    document.getElementById('sin-value').textContent = `sin(x) = ${sinK.toFixed(2)}`;

    if (sinK >= -1 && sinK <= 1) {
        const alpha = Math.asin(sinK);
        const beta = Math.PI - alpha;
        document.getElementById('sin-alpha').textContent = `${alpha.toFixed(2)} rad (${(alpha * 180 / Math.PI).toFixed(1)}°)`;
        document.getElementById('sin-beta').textContent = `${beta.toFixed(2)} rad (${(beta * 180 / Math.PI).toFixed(1)}°)`;
    }

    // Update cos solutions
    document.getElementById('cos-value').textContent = `cos(x) = ${cosK.toFixed(2)}`;

    if (cosK >= -1 && cosK <= 1) {
        const alpha = Math.acos(cosK);
        const beta = 2 * Math.PI - alpha;
        document.getElementById('cos-alpha').textContent = `${alpha.toFixed(2)} rad (${(alpha * 180 / Math.PI).toFixed(1)}°)`;
        document.getElementById('cos-beta').textContent = `${beta.toFixed(2)} rad (${(beta * 180 / Math.PI).toFixed(1)}°)`;
    }
}
