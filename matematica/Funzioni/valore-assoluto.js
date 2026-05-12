let canvas, ctx;
let canvasWidth, canvasHeight;
let centerX, centerY;
let scale = 40;
let currentFunction = 'basic';

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('abs-canvas');
    ctx = canvas.getContext('2d');

    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    centerX = canvasWidth / 2;
    centerY = canvasHeight / 2;

    // Event listeners
    document.getElementById('param-a').addEventListener('input', updateGraph);

    // Add additional sliders based on function type
    setupSliders();
    updateGraph();
});

window.selectFunction = function(func) {
    currentFunction = func;

    // Update button styles
    document.querySelectorAll('.btn-option').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    setupSliders();
    updateGraph();
};

function setupSliders() {
    const container = document.getElementById('sliders-container');
    container.innerHTML = '';

    switch (currentFunction) {
        case 'basic':
            addSlider(container, 'a', 'a (pendenza)', 0.1, 3, 0.1, 1);
            break;
        case 'shifted':
            addSlider(container, 'h', 'h (shift orizzontale)', -5, 5, 0.1, 0);
            break;
        case 'transformed':
            addSlider(container, 'a', 'a (pendenza)', -2, 2, 0.1, 1);
            addSlider(container, 'b', 'b (shift verticale)', -5, 5, 0.1, 0);
            break;
        case 'double':
            addSlider(container, 'c', 'c (costante)', -5, 5, 0.1, 1);
            break;
    }
}

function addSlider(container, id, label, min, max, step, value) {
    const group = document.createElement('div');
    group.className = 'slider-group';
    group.innerHTML = `
        <label class="slider-label">${label}</label>
        <input type="range" id="param-${id}" min="${min}" max="${max}" step="${step}" value="${value}">
        <div class="slider-value" id="value-${id}">${parseFloat(value).toFixed(1)}</div>
    `;
    container.appendChild(group);

    document.getElementById(`param-${id}`).addEventListener('input', (e) => {
        document.getElementById(`value-${id}`).textContent = parseFloat(e.target.value).toFixed(1);
        updateGraph();
    });
}

function getParameters() {
    const params = {};
    switch (currentFunction) {
        case 'basic':
            params.a = parseFloat(document.getElementById('param-a').value);
            break;
        case 'shifted':
            params.h = parseFloat(document.getElementById('param-h').value);
            break;
        case 'transformed':
            params.a = parseFloat(document.getElementById('param-a').value);
            params.b = parseFloat(document.getElementById('param-b').value);
            break;
        case 'double':
            params.c = parseFloat(document.getElementById('param-c').value);
            break;
    }
    return params;
}

function f(x, params) {
    switch (currentFunction) {
        case 'basic':
            return params.a * Math.abs(x);
        case 'shifted':
            return Math.abs(x - params.h);
        case 'transformed':
            return params.a * Math.abs(x) + params.b;
        case 'double':
            return Math.abs(Math.abs(x) - params.c);
    }
    return 0;
}

function updateGraph() {
    const params = getParameters();

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid and axes
    drawGrid();
    drawAxes();

    // Draw function
    drawFunction(params);

    // Update info
    updateInfo(params);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = -10; i <= 10; i++) {
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

function drawAxes() {
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
}

function drawFunction(params) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let first = true;
    for (let px = 0; px < canvasWidth; px++) {
        const x = (px - centerX) / scale;
        const y = f(x, params);
        const py = centerY - y * scale;

        if (first) {
            ctx.moveTo(px, py);
            first = false;
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();

    // Mark special points
    if (currentFunction === 'shifted') {
        const h = params.h;
        const px = centerX + h * scale;
        const py = centerY;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentFunction === 'transformed') {
        const py = centerY - params.b * scale;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(centerX, py, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateInfo(params) {
    const f2 = f(2, params);
    const fNeg2 = f(-2, params);

    document.getElementById('f-value').textContent = f2.toFixed(2);
    document.getElementById('f-neg-value').textContent = fNeg2.toFixed(2);
}
