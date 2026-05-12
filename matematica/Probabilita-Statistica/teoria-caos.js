// Teoria del Caos - Interactive Logistic Map & Bifurcation

const logisticCanvas = document.getElementById('logisticCanvas');
const logisticCtx = logisticCanvas.getContext('2d');

const bifurcationCanvas = document.getElementById('bifurcationCanvas');
const bifurcationCtx = bifurcationCanvas.getContext('2d');

const rSlider = document.getElementById('logistic-r');
const x0Slider = document.getElementById('logistic-x0');
const rDisplay = document.getElementById('r-display');
const x0Display = document.getElementById('x0-display');

function logisticMap(x, r) {
    return r * x * (1 - x);
}

function drawLogisticMap() {
    const r = parseFloat(rSlider.value);
    const x0 = parseFloat(x0Slider.value);

    rDisplay.textContent = r.toFixed(2);
    x0Display.textContent = x0.toFixed(2);

    // Clear canvas
    logisticCtx.fillStyle = '#0f172a';
    logisticCtx.fillRect(0, 0, logisticCanvas.width, logisticCanvas.height);

    const padding = 50;
    const graphWidth = logisticCanvas.width - 2 * padding;
    const graphHeight = logisticCanvas.height - 2 * padding;

    // Draw axes
    logisticCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    logisticCtx.lineWidth = 1;
    logisticCtx.beginPath();
    logisticCtx.moveTo(padding, padding);
    logisticCtx.lineTo(padding, padding + graphHeight);
    logisticCtx.lineTo(padding + graphWidth, padding + graphHeight);
    logisticCtx.stroke();

    // Grid
    logisticCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i <= 10; i++) {
        const x = padding + (i / 10) * graphWidth;
        const y = padding + (i / 10) * graphHeight;
        logisticCtx.beginPath();
        logisticCtx.moveTo(x, padding);
        logisticCtx.lineTo(x, padding + graphHeight);
        logisticCtx.stroke();
        logisticCtx.beginPath();
        logisticCtx.moveTo(padding, y);
        logisticCtx.lineTo(padding + graphWidth, y);
        logisticCtx.stroke();
    }

    // Draw y = x line (for visualization)
    logisticCtx.strokeStyle = 'rgba(236,107,6,0.2)';
    logisticCtx.lineWidth = 1;
    logisticCtx.beginPath();
    logisticCtx.moveTo(padding, padding + graphHeight);
    logisticCtx.lineTo(padding + graphWidth, padding);
    logisticCtx.stroke();

    // Draw logistic function: x_{n+1} = rx_n(1-x_n)
    logisticCtx.strokeStyle = '#ec6b06';
    logisticCtx.lineWidth = 2.5;
    logisticCtx.beginPath();
    for (let i = 0; i <= graphWidth; i++) {
        const xn = i / graphWidth;
        const xn1 = logisticMap(xn, r);
        const screenX = padding + i;
        const screenY = padding + graphHeight - (xn1 * graphHeight);
        if (i === 0) {
            logisticCtx.moveTo(screenX, screenY);
        } else {
            logisticCtx.lineTo(screenX, screenY);
        }
    }
    logisticCtx.stroke();

    // Iterate and draw trajectory
    let x = x0;
    logisticCtx.strokeStyle = 'rgba(59,130,246,0.7)';
    logisticCtx.lineWidth = 1;

    const maxIterations = 200;
    for (let iter = 0; iter < maxIterations; iter++) {
        // Draw vertical line from (x, x) to (x, f(x))
        const screenX = padding + (x * graphWidth);
        const screenY1 = padding + graphHeight - (x * graphHeight);
        const xNext = logisticMap(x, r);
        const screenY2 = padding + graphHeight - (xNext * graphHeight);

        logisticCtx.beginPath();
        logisticCtx.moveTo(screenX, screenY1);
        logisticCtx.lineTo(screenX, screenY2);
        logisticCtx.stroke();

        // Draw horizontal line from (x, f(x)) to (f(x), f(x))
        const screenX2 = padding + (xNext * graphWidth);
        logisticCtx.beginPath();
        logisticCtx.moveTo(screenX, screenY2);
        logisticCtx.lineTo(screenX2, screenY2);
        logisticCtx.stroke();

        x = xNext;
    }

    // Labels
    logisticCtx.fillStyle = 'rgba(255,255,255,0.6)';
    logisticCtx.font = '12px Inter';
    logisticCtx.textAlign = 'center';
    logisticCtx.fillText('x_n', padding + graphWidth / 2, logisticCanvas.height - 15);
    logisticCtx.save();
    logisticCtx.translate(15, padding + graphHeight / 2);
    logisticCtx.rotate(-Math.PI / 2);
    logisticCtx.fillText('x_{n+1}', 0, 0);
    logisticCtx.restore();
}

rSlider.addEventListener('input', drawLogisticMap);
x0Slider.addEventListener('input', drawLogisticMap);
drawLogisticMap();

// Bifurcation Diagram
function drawBifurcation() {
    bifurcationCtx.fillStyle = '#0f172a';
    bifurcationCtx.fillRect(0, 0, bifurcationCanvas.width, bifurcationCanvas.height);

    const padding = 50;
    const graphWidth = bifurcationCanvas.width - 2 * padding;
    const graphHeight = bifurcationCanvas.height - 2 * padding;

    // Grid
    bifurcationCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    bifurcationCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const x = padding + (i / 5) * graphWidth;
        const y = padding + (i / 5) * graphHeight;
        bifurcationCtx.beginPath();
        bifurcationCtx.moveTo(x, padding);
        bifurcationCtx.lineTo(x, padding + graphHeight);
        bifurcationCtx.stroke();
        bifurcationCtx.beginPath();
        bifurcationCtx.moveTo(padding, y);
        bifurcationCtx.lineTo(padding + graphWidth, y);
        bifurcationCtx.stroke();
    }

    // Axes
    bifurcationCtx.strokeStyle = 'rgba(255,255,255,0.3)';
    bifurcationCtx.lineWidth = 1.5;
    bifurcationCtx.beginPath();
    bifurcationCtx.moveTo(padding, padding);
    bifurcationCtx.lineTo(padding, padding + graphHeight);
    bifurcationCtx.lineTo(padding + graphWidth, padding + graphHeight);
    bifurcationCtx.stroke();

    const rMin = 0;
    const rMax = 4;
    const xMin = 0;
    const xMax = 1;

    const resolution = 800;
    const transient = 300;
    const iterations = 100;

    for (let i = 0; i < resolution; i++) {
        const r = rMin + (i / resolution) * (rMax - rMin);
        let x = 0.5;

        // Skip transients
        for (let t = 0; t < transient; t++) {
            x = logisticMap(x, r);
        }

        // Plot iterations
        for (let iter = 0; iter < iterations; iter++) {
            x = logisticMap(x, r);
            const screenX = padding + (i / resolution) * graphWidth;
            const screenY = padding + graphHeight - ((x - xMin) / (xMax - xMin)) * graphHeight;

            bifurcationCtx.fillStyle = '#ec6b06';
            bifurcationCtx.fillRect(screenX, screenY, 0.5, 0.5);
        }
    }

    // Labels
    bifurcationCtx.fillStyle = 'rgba(255,255,255,0.6)';
    bifurcationCtx.font = '12px Inter';
    bifurcationCtx.textAlign = 'center';
    bifurcationCtx.fillText('r', padding + graphWidth / 2, bifurcationCanvas.height - 15);
    bifurcationCtx.save();
    bifurcationCtx.translate(15, padding + graphHeight / 2);
    bifurcationCtx.rotate(-Math.PI / 2);
    bifurcationCtx.fillText('x (stati stazionari)', 0, 0);
    bifurcationCtx.restore();

    // Scale labels
    bifurcationCtx.font = '11px Inter';
    bifurcationCtx.textAlign = 'center';
    bifurcationCtx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i <= 5; i++) {
        const r = rMin + (i / 5) * (rMax - rMin);
        const x = padding + (i / 5) * graphWidth;
        bifurcationCtx.fillText(r.toFixed(1), x, padding + graphHeight + 15);
    }
}

drawBifurcation();
