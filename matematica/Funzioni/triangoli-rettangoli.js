let triangleCanvas;
let ctx;
let canvasWidth, canvasHeight;
let centerX, centerY;

const baseHypotenuse = 100;

document.addEventListener('DOMContentLoaded', () => {
    triangleCanvas = document.getElementById('triangle-canvas');
    ctx = triangleCanvas.getContext('2d');

    canvasWidth = triangleCanvas.offsetWidth;
    canvasHeight = triangleCanvas.offsetHeight;

    triangleCanvas.width = canvasWidth;
    triangleCanvas.height = canvasHeight;

    centerX = canvasWidth / 2;
    centerY = canvasHeight * 0.65;

    document.getElementById('angle-slider').addEventListener('input', updateTriangle);

    updateTriangle();
});

function updateTriangle() {
    const angleInDegrees = parseFloat(document.getElementById('angle-slider').value);
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    // Calculate sides (with hypotenuse = 100)
    const hypotenuse = baseHypotenuse;
    const adjacent = hypotenuse * Math.cos(angleInRadians);
    const opposite = hypotenuse * Math.sin(angleInRadians);

    // Update display
    document.getElementById('angle-display').textContent = angleInDegrees;
    document.getElementById('adjacent-value').textContent = adjacent.toFixed(2);
    document.getElementById('opposite-value').textContent = opposite.toFixed(2);
    document.getElementById('hypotenuse-value').textContent = hypotenuse.toFixed(2);
    document.getElementById('complement-value').textContent = (90 - angleInDegrees).toFixed(0);

    drawTriangle(angleInRadians, adjacent, opposite, hypotenuse);
}

function drawTriangle(angleRad, adjacent, opposite, hypotenuse) {
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

    // Triangle vertices
    const A = { x: centerX, y: centerY }; // Right angle
    const B = { x: centerX + adjacent, y: centerY }; // Adjacent end
    const C = { x: centerX, y: centerY - opposite }; // Opposite end

    // Draw triangle
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.stroke();

    // Fill triangle with transparency
    ctx.fillStyle = 'rgba(124, 58, 237, 0.1)';
    ctx.fill();

    // Draw right angle indicator
    const squareSize = 15;
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(A.x + squareSize, A.y);
    ctx.lineTo(A.x + squareSize, A.y - squareSize);
    ctx.lineTo(A.x, A.y - squareSize);
    ctx.stroke();

    // Draw angle arc
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(B.x - 30, B.y, 30, Math.PI - angleRad, Math.PI, false);
    ctx.stroke();

    // Draw vertices
    [A, B, C].forEach(point => {
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = var(--text-main);
    ctx.font = 'bold 16px Inter';
    ctx.fillText('A', A.x - 15, A.y + 20);
    ctx.fillText('B', B.x + 10, B.y + 20);
    ctx.fillText('C', C.x - 15, C.y - 10);

    // Side labels with colors
    // Adjacent (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px Inter';
    const adjMidX = (A.x + B.x) / 2;
    const adjMidY = A.y + 25;
    ctx.fillText(`a = ${adjacent.toFixed(1)}`, adjMidX - 30, adjMidY);

    // Opposite (red)
    ctx.fillStyle = '#ef4444';
    const oppMidX = A.x - 50;
    const oppMidY = (A.y + C.y) / 2;
    ctx.fillText(`b = ${opposite.toFixed(1)}`, oppMidX, oppMidY);

    // Hypotenuse (purple)
    ctx.fillStyle = '#a78bfa';
    const hypMidX = (B.x + C.x) / 2 + 15;
    const hypMidY = (B.y + C.y) / 2 - 10;
    ctx.fillText(`c = ${hypotenuse.toFixed(1)}`, hypMidX, hypMidY);

    // Angle label
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px Inter';
    ctx.fillText(`θ`, B.x - 45, B.y - 15);
}
