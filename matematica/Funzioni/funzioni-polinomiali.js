let canvas, ctx;
let canvasWidth, canvasHeight;
let centerX, centerY;
let scale = 40; // pixels per unit

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('poly-canvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;

    // Event listeners
    document.getElementById('slider-a').addEventListener('input', updateGraph);
    document.getElementById('slider-b').addEventListener('input', updateGraph);
    document.getElementById('slider-c').addEventListener('input', updateGraph);

    updateGraph();
});

function getCoefficients() {
    const a = parseFloat(document.getElementById('slider-a').value);
    const b = parseFloat(document.getElementById('slider-b').value);
    const c = parseFloat(document.getElementById('slider-c').value);

    // Update display
    document.getElementById('value-a').textContent = a.toFixed(1);
    document.getElementById('value-b').textContent = b.toFixed(1);
    document.getElementById('value-c').textContent = c.toFixed(1);

    return { a, b, c };
}

function f(x, a, b, c) {
    return a * x * x + b * x + c;
}

function calculateVertex(a, b, c) {
    if (a === 0) return null;
    const xv = -b / (2 * a);
    const yv = f(xv, a, b, c);
    return { x: xv, y: yv };
}

function calculateRoots(a, b, c) {
    if (a === 0) {
        if (b === 0) return [];
        return [-c / b];
    }

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [];
    if (discriminant === 0) return [-b / (2 * a)];

    const sqrtD = Math.sqrt(discriminant);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    return [Math.min(x1, x2), Math.max(x1, x2)];
}

function updateGraph() {
    const { a, b, c } = getCoefficients();

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and axes
    drawGrid();
    drawAxes();

    // Draw parabola
    drawParabola(a, b, c);

    // Draw vertex
    const vertex = calculateVertex(a, b, c);
    if (vertex) {
        const vx = centerX + vertex.x * scale;
        const vy = centerY - vertex.y * scale;

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(vx, vy, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw roots
    const roots = calculateRoots(a, b, c);
    roots.forEach(root => {
        const rx = centerX + root * scale;
        const ry = centerY;

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(rx, ry, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Update info boxes
    if (vertex) {
        document.getElementById('vertex-info').textContent =
            `(${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`;
    }

    if (roots.length === 0) {
        document.getElementById('roots-info').textContent = 'Nessuna radice reale';
    } else if (roots.length === 1) {
        document.getElementById('roots-info').textContent = roots[0].toFixed(2);
    } else {
        document.getElementById('roots-info').textContent =
            `${roots[0].toFixed(2)}, ${roots[1].toFixed(2)}`;
    }
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = -10; i <= 10; i++) {
        // Vertical lines
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();

        // Horizontal lines
        const y = centerY - i * scale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasHeight);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('x', canvasWidth - 15, centerY - 10);
    ctx.textAlign = 'right';
    ctx.fillText('y', centerX - 10, 15);
}

function drawParabola(a, b, c) {
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let px = 0; px < canvasWidth; px++) {
        const x = (px - centerX) / scale;
        const y = f(x, a, b, c);
        const py = centerY - y * scale;

        if (first) {
            ctx.moveTo(px, py);
            first = false;
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();
}
