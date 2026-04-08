/**
 * statistica.js
 * Interattività per la lezione di Statistica Descrittiva (MFI)
 * Canvas-based charts, live playground, exercises
 */

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */

function showFeedback(elementId, isCorrect, message) {
    const el = document.getElementById(elementId);
    el.style.display = 'block';
    el.textContent = message;
    el.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
}

/** Parse comma-separated numbers */
function parseData(str) {
    return str.split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));
}

/** Calculate statistics from an array */
function calcStats(data) {
    if (!data.length) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;

    // Mean
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    let median;
    if (n % 2 === 0) {
        median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    } else {
        median = sorted[Math.floor(n / 2)];
    }

    // Mode
    const freq = {};
    sorted.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);

    // Range & semi-dispersion
    const range = sorted[n - 1] - sorted[0];
    const semiDisp = range / 2;

    // Variance & std dev (Bessel's correction n-1)
    const variance = n > 1 ? sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (n - 1) : 0;
    const sigma = Math.sqrt(variance);

    return { sorted, mean, median, modes, range, semiDisp, variance, sigma, freq, n };
}

/** Round to d decimals */
function rd(val, d = 2) {
    return Math.round(val * 10 ** d) / 10 ** d;
}


/* =============================================
   CHART DRAWING (Canvas 2D)
   ============================================= */

const COLORS = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981',
    '#F59E0B', '#EF4444', '#06B6D4', '#F97316',
    '#6366F1', '#14B8A6', '#D946EF', '#84CC16'
];

/** Draw a bar chart from frequency map */
function drawBarChart(canvasId, freqMap, title) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const labels = Object.keys(freqMap).sort((a, b) => Number(a) - Number(b));
    const values = labels.map(l => freqMap[l]);
    if (!labels.length) return;

    const maxVal = Math.max(...values);
    const padding = { top: 20, right: 30, bottom: 45, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const barWidth = Math.min(chartW / labels.length * 0.6, 50);
    const gap = (chartW - barWidth * labels.length) / (labels.length + 1);

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, H - padding.bottom);
    ctx.lineTo(W - padding.right, H - padding.bottom);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    const ySteps = Math.min(maxVal, 5);
    for (let i = 0; i <= ySteps; i++) {
        const val = Math.round(maxVal / ySteps * i);
        const y = H - padding.bottom - (val / maxVal) * chartH;
        ctx.fillText(val, padding.left - 8, y + 4);
        // Grid line
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(W - padding.right, y);
        ctx.stroke();
    }

    // Bars
    labels.forEach((label, i) => {
        const x = padding.left + gap + i * (barWidth + gap);
        const barH = (values[i] / maxVal) * chartH;
        const y = H - padding.bottom - barH;

        // Bar gradient
        const grad = ctx.createLinearGradient(x, y, x, H - padding.bottom);
        grad.addColorStop(0, COLORS[i % COLORS.length]);
        grad.addColorStop(1, COLORS[i % COLORS.length] + '66');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Value on top
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(values[i], x + barWidth / 2, y - 6);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(label, x + barWidth / 2, H - padding.bottom + 18);
    });
}

/** Draw a pie chart from frequency map */
function drawPieChart(canvasId, freqMap) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const labels = Object.keys(freqMap).sort((a, b) => Number(a) - Number(b));
    const values = labels.map(l => freqMap[l]);
    const total = values.reduce((a, b) => a + b, 0);
    if (!total) return;

    const cx = W * 0.45, cy = H / 2;
    const radius = Math.min(cx, cy) - 20;

    let startAngle = -Math.PI / 2;
    labels.forEach((label, i) => {
        const sliceAngle = (values[i] / total) * 2 * Math.PI;
        const midAngle = startAngle + sliceAngle / 2;

        // Slice
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Percentage label
        const pct = Math.round(values[i] / total * 100);
        if (pct >= 5) {
            const labelR = radius * 0.65;
            const lx = cx + Math.cos(midAngle) * labelR;
            const ly = cy + Math.sin(midAngle) * labelR;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', lx, ly);
        }

        startAngle += sliceAngle;
    });

    // Legend
    const legendX = W * 0.75;
    let legendY = 30;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    labels.forEach((label, i) => {
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fillRect(legendX, legendY - 5, 12, 12);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`${label} (${values[i]})`, legendX + 18, legendY + 1);
        legendY += 20;
    });
}

/** Draw a histogram (continuous data, adjacent bars) */
function drawHistogram(canvasId, bins, binLabels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const maxVal = Math.max(...bins);
    const padding = { top: 20, right: 30, bottom: 50, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const barWidth = chartW / bins.length;

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, H - padding.bottom);
    ctx.lineTo(W - padding.right, H - padding.bottom);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const val = Math.round(maxVal / 4 * i);
        const y = H - padding.bottom - (val / maxVal) * chartH;
        ctx.fillText(val, padding.left - 8, y + 4);
    }

    // Bars (adjacent, no gap)
    bins.forEach((val, i) => {
        const x = padding.left + i * barWidth;
        const barH = (val / maxVal) * chartH;
        const y = H - padding.bottom - barH;

        const grad = ctx.createLinearGradient(x, y, x, H - padding.bottom);
        grad.addColorStop(0, '#EC4899');
        grad.addColorStop(1, '#EC489944');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth - 1, barH);

        // Stroke
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.strokeRect(x, y, barWidth - 1, barH);

        // Value on top
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val, x + barWidth / 2, y - 6);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(binLabels[i], x + barWidth / 2, H - padding.bottom + 18);
    });

    // Y-axis title
    ctx.save();
    ctx.translate(15, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Frequenza', 0, 0);
    ctx.restore();
}

/** Draw scatter plot with regression line */
function drawScatter(canvasId, xData, yData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padding = { top: 25, right: 40, bottom: 55, left: 55 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const xMin = Math.min(...xData) - 1;
    const xMax = Math.max(...xData) + 1;
    const yMin = Math.min(...yData) - 1;
    const yMax = Math.max(...yData) + 1;

    function toCanvasX(x) { return padding.left + ((x - xMin) / (xMax - xMin)) * chartW; }
    function toCanvasY(y) { return H - padding.bottom - ((y - yMin) / (yMax - yMin)) * chartH; }

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        const cx = toCanvasX(x);
        ctx.beginPath(); ctx.moveTo(cx, padding.top); ctx.lineTo(cx, H - padding.bottom); ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        const cy = toCanvasY(y);
        ctx.beginPath(); ctx.moveTo(padding.left, cy); ctx.lineTo(W - padding.right, cy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, H - padding.bottom);
    ctx.lineTo(W - padding.right, H - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        ctx.fillText(x, toCanvasX(x), H - padding.bottom + 18);
    }
    ctx.textAlign = 'right';
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        ctx.fillText(y, padding.left - 8, toCanvasY(y) + 4);
    }

    // Axis titles
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ore di studio', W / 2, H - 8);
    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Voto', 0, 0);
    ctx.restore();

    // Regression line (least squares)
    const n = xData.length;
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((a, x, i) => a + x * yData[i], 0);
    const sumX2 = xData.reduce((a, x) => a + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Interpolation line (solid)
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const lineXStart = xMin;
    const lineXEnd = xMax - 0.5;
    ctx.moveTo(toCanvasX(lineXStart + 0.5), toCanvasY(slope * (lineXStart + 0.5) + intercept));
    ctx.lineTo(toCanvasX(lineXEnd), toCanvasY(slope * lineXEnd + intercept));
    ctx.stroke();

    // Extrapolation (dashed)
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.beginPath();
    ctx.moveTo(toCanvasX(lineXEnd), toCanvasY(slope * lineXEnd + intercept));
    ctx.lineTo(toCanvasX(xMax), toCanvasY(slope * xMax + intercept));
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('— interpolazione', toCanvasX(lineXEnd - 2.5), toCanvasY(slope * (lineXEnd - 2) + intercept) - 14);
    ctx.fillText('--- estrapolazione', toCanvasX(lineXEnd + 0.1), toCanvasY(slope * (lineXEnd + 0.5) + intercept) - 14);

    // Data points
    xData.forEach((x, i) => {
        const cx = toCanvasX(x);
        const cy = toCanvasY(yData[i]);

        // Glow
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fill();

        // Point
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });

    // Store slope/intercept for exercise checking
    canvas.dataset.slope = slope;
    canvas.dataset.intercept = intercept;
}

/** Draw regression analysis (Scatter withResiduals and R2) */
function drawRegressionAnalysis(canvasId, xData, yData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const xMin = 1, xMax = 10, yMin = 3, yMax = 10;
    function toX(x) { return padding.left + ((x - xMin) / (xMax - xMin)) * chartW; }
    function toY(y) { return H - padding.bottom - ((y - yMin) / (yMax - yMin)) * chartH; }

    // Math for regression
    const n = xData.length;
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((a, x, i) => a + x * yData[i], 0);
    const sumX2 = xData.reduce((a, x) => a + x * x, 0);
    const sumY2 = yData.reduce((a, y) => a + y * y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R2 Calculation
    const yMean = sumY / n;
    const ssTotal = yData.reduce((a, y) => a + (y - yMean) ** 2, 0);
    const ssRes = yData.reduce((a, y, i) => a + (y - (slope * xData[i] + intercept)) ** 2, 0);
    const r2 = 1 - (ssRes / ssTotal);

    // Grid and Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 1; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(toX(i), padding.top); ctx.lineTo(toX(i), H - padding.bottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padding.left, toY(i)); ctx.lineTo(W - padding.right, toY(i)); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.moveTo(padding.left, padding.top); ctx.lineTo(padding.left, H - padding.bottom); ctx.lineTo(W - padding.right, H - padding.bottom); ctx.stroke();

    // Draw Residuals (Errors)
    ctx.strokeStyle = '#EF4444'; // Red for errors
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    xData.forEach((x, i) => {
        const yPred = slope * x + intercept;
        ctx.beginPath();
        ctx.moveTo(toX(x), toY(yData[i]));
        ctx.lineTo(toX(x), toY(yPred));
        ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw Regression Line
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toX(1), toY(slope * 1 + intercept));
    ctx.lineTo(toX(10), toY(slope * 10 + intercept));
    ctx.stroke();

    // Draw Points
    xData.forEach((x, i) => {
        ctx.beginPath();
        ctx.arc(toX(x), toY(yData[i]), 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    });

    // Update Stats text
    const statsEl = document.getElementById('regression-stats');
    if (statsEl) {
        statsEl.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Equazione:</strong> y = ${rd(slope)}x + ${rd(intercept, 1)}</div>
                <div><strong>Indice R²:</strong> ${rd(r2, 4)} (Determina Affidabilità)</div>
                <div><strong>Sum Sq Residui:</strong> ${rd(ssRes, 2)} (Errore Totale)</div>
                <div><strong>R (Corr):</strong> ${rd(Math.sqrt(r2), 3)} (Pearson)</div>
            </div>
        `;
    }
}

/** Draw a horizontal box plot */
function drawBoxPlot(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;

    // Quartiles
    function median(arr) {
        const m = arr.length;
        if (m % 2 === 0) return (arr[m / 2 - 1] + arr[m / 2]) / 2;
        return arr[Math.floor(m / 2)];
    }
    const q2 = median(sorted);
    const lowerHalf = sorted.slice(0, Math.floor(n / 2));
    const upperHalf = sorted.slice(Math.ceil(n / 2));
    const q1 = median(lowerHalf);
    const q3 = median(upperHalf);
    const iqr = q3 - q1;

    // Whisker limits
    const whiskerLow = Math.max(sorted[0], q1 - 1.5 * iqr);
    const whiskerHigh = Math.min(sorted[n - 1], q3 + 1.5 * iqr);
    // Actual whisker endpoints (nearest data points within limits)
    const wLow = sorted.find(v => v >= whiskerLow);
    const wHigh = [...sorted].reverse().find(v => v <= whiskerHigh);

    // Outliers
    const outliers = sorted.filter(v => v < wLow || v > wHigh);

    // Layout
    const padding = { left: 50, right: 50, top: 50, bottom: 55 };
    const chartW = W - padding.left - padding.right;
    const midY = H / 2;
    const boxH = 60;

    const dataMin = Math.min(sorted[0], wLow) - 0.5;
    const dataMax = Math.max(sorted[n - 1], wHigh) + 0.5;
    function toX(val) { return padding.left + ((val - dataMin) / (dataMax - dataMin)) * chartW; }

    // Axis line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, H - padding.bottom + 10);
    ctx.lineTo(W - padding.right, H - padding.bottom + 10);
    ctx.stroke();

    // Tick marks and labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let v = Math.ceil(dataMin); v <= Math.floor(dataMax); v++) {
        const x = toX(v);
        ctx.beginPath();
        ctx.moveTo(x, H - padding.bottom + 10);
        ctx.lineTo(x, H - padding.bottom + 16);
        ctx.stroke();
        ctx.fillText(v, x, H - padding.bottom + 30);
    }

    // Whisker lines
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    // Left whisker
    ctx.beginPath();
    ctx.moveTo(toX(wLow), midY);
    ctx.lineTo(toX(q1), midY);
    ctx.stroke();
    // Right whisker
    ctx.beginPath();
    ctx.moveTo(toX(q3), midY);
    ctx.lineTo(toX(wHigh), midY);
    ctx.stroke();
    // Whisker end caps
    ctx.beginPath();
    ctx.moveTo(toX(wLow), midY - boxH / 4);
    ctx.lineTo(toX(wLow), midY + boxH / 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toX(wHigh), midY - boxH / 4);
    ctx.lineTo(toX(wHigh), midY + boxH / 4);
    ctx.stroke();

    // Box (Q1 to Q3)
    const boxX = toX(q1);
    const boxW = toX(q3) - toX(q1);
    const grad = ctx.createLinearGradient(boxX, midY - boxH / 2, boxX + boxW, midY + boxH / 2);
    grad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
    grad.addColorStop(1, 'rgba(236, 72, 153, 0.35)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(boxX, midY - boxH / 2, boxW, boxH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Median line
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toX(q2), midY - boxH / 2);
    ctx.lineTo(toX(q2), midY + boxH / 2);
    ctx.stroke();

    // Outliers
    outliers.forEach(v => {
        ctx.beginPath();
        ctx.arc(toX(v), midY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // Labels above the box
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    const labelY = midY - boxH / 2 - 12;

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Min=' + wLow, toX(wLow), labelY - 14);
    ctx.fillText('Max=' + wHigh, toX(wHigh), labelY - 14);

    ctx.fillStyle = '#A78BFA';
    ctx.fillText('Q₁=' + q1, toX(q1), labelY);

    ctx.fillStyle = '#EC4899';
    ctx.fillText('Q₂=' + q2, toX(q2), labelY - 16);

    ctx.fillStyle = '#A78BFA';
    ctx.fillText('Q₃=' + q3, toX(q3), labelY);

    // IQR bracket below
    const bracketY = midY + boxH / 2 + 18;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toX(q1), bracketY);
    ctx.lineTo(toX(q1), bracketY + 6);
    ctx.lineTo(toX(q3), bracketY + 6);
    ctx.lineTo(toX(q3), bracketY);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('IQR = ' + iqr, (toX(q1) + toX(q3)) / 2, bracketY + 18);
}


/* =============================================
   PLAYGROUND LOGIC
   ============================================= */

function calcolaPlayground() {
    const input = document.getElementById('playground-input').value;
    const data = parseData(input);
    if (data.length < 2) {
        document.getElementById('pg-media').textContent = 'Dati insufficienti';
        return;
    }

    const s = calcStats(data);

    document.getElementById('pg-media').textContent = rd(s.mean);
    document.getElementById('pg-mediana').textContent = rd(s.median);
    document.getElementById('pg-moda').textContent = s.modes.join(', ');
    document.getElementById('pg-range').textContent = rd(s.range);
    document.getElementById('pg-semidisp').textContent = rd(s.semiDisp);
    document.getElementById('pg-sigma').textContent = rd(s.sigma);

    // Draw playground charts
    drawBarChart('pg-bar-chart', s.freq);
    drawPieChart('pg-pie-chart', s.freq);
}


/* =============================================
   EXERCISE CHECK FUNCTIONS
   ============================================= */

/* 2. Descriptors: Loot Drop */
function checkDescriptors() {
    const mediaAns = document.getElementById('ans-media').value.replace(',', '.').trim();
    const medianaAns = document.getElementById('ans-mediana').value.replace(',', '.').trim();
    const modaAns = document.getElementById('ans-moda').value.trim();

    const mediaOk = parseFloat(mediaAns) === 17.5;
    const medianaOk = parseFloat(medianaAns) === 17.5;
    const modaOk = modaAns === '10';

    if (mediaOk && medianaOk && modaOk) {
        showFeedback('feed-descriptors', true, 'Perfetto! Media = 17.5, Mediana = 17.5, Moda = 10. In questo caso media e mediana coincidono!');
    } else {
        let hints = [];
        if (!mediaOk) hints.push('Media sbagliata (somma/n = 140/8)');
        if (!medianaOk) hints.push('Mediana sbagliata (media dei due valori centrali del dataset ordinato)');
        if (!modaOk) hints.push('Moda sbagliata (qual è il valore più frequente?)');
        showFeedback('feed-descriptors', false, hints.join('. ') + '. Riprova!');
    }
}

/* 3. Dispersion: Range & Semi-dispersion */
function checkDispersione() {
    const rangeAns = parseFloat(document.getElementById('ans-range').value);
    const semidispAns = parseFloat(document.getElementById('ans-semidisp').value);

    // Data: {10, 10, 10, 15, 20, 20, 25, 30} → range = 30-10 = 20, semidisp = 10
    const rangeOk = rangeAns === 20;
    const semidispOk = semidispAns === 10;

    if (rangeOk && semidispOk) {
        showFeedback('feed-dispersione', true, 'Esatto! Range = 30 − 10 = 20, Semidispersione = 20/2 = 10.');
    } else {
        let hints = [];
        if (!rangeOk) hints.push('Range = max − min = 30 − 10');
        if (!semidispOk) hints.push('Semidispersione = Range / 2');
        showFeedback('feed-dispersione', false, hints.join('. ') + '. Riprova!');
    }
}

/* 2b. Weighted Average: RPG Damage */
function checkPonderata() {
    const ans = parseFloat(document.getElementById('ans-ponderata').value);
    // (10*5 + 25*3 + 40*2) / (5+3+2) = 205/10 = 20.5
    if (ans === 20.5) {
        showFeedback('feed-ponderata', true, 'Perfetto! (10×5 + 25×3 + 40×2) / 10 = 205/10 = 20.5 danni medi per attacco!');
    } else {
        showFeedback('feed-ponderata', false, 'Non proprio. Moltiplica ogni danno per le volte che viene usato, somma tutto, e dividi per il totale delle volte (5+3+2=10). Riprova!');
    }
}

/* Box Plot exercise */
function checkBoxPlot() {
    const medAns = parseFloat(document.getElementById('ans-bp-mediana').value);
    const iqrAns = parseFloat(document.getElementById('ans-bp-iqr').value);
    const lowAns = parseFloat(document.getElementById('ans-bp-low').value);
    const highAns = parseFloat(document.getElementById('ans-bp-high').value);

    const medOk = medAns === 7;
    const iqrOk = iqrAns === 2;
    const rangeOk = lowAns === 6 && highAns === 8;

    let correct = 0;
    let hints = [];
    if (medOk) correct++; else hints.push('La mediana (Q₂) è il valore centrale = 7');
    if (iqrOk) correct++; else hints.push('IQR = Q₃ − Q₁ = 8 − 6 = 2');
    if (rangeOk) correct++; else hints.push('Il 50% centrale va da Q₁=6 a Q₃=8');

    if (correct === 3) {
        showFeedback('feed-boxplot', true, 'Perfetto! 3/3 — Q₂=7, IQR=2, e il 50% centrale dei voti va da 6 a 8. Sai leggere un box plot!');
    } else {
        showFeedback('feed-boxplot', false, `${correct}/3 corretti. ${hints.join('. ')}. Riprova!`);
    }
}

/* 5. Graphs exercise */
function checkGrafici() {
    const a1 = document.getElementById('ans-grafico-1').value;
    const a2 = document.getElementById('ans-grafico-2').value;
    const a3 = document.getElementById('ans-grafico-3').value;

    let correct = 0;
    if (a1 === 'barre') { correct++; document.getElementById('ans-grafico-1').style.borderColor = '#10B981'; }
    else { document.getElementById('ans-grafico-1').style.borderColor = '#EF4444'; }

    if (a2 === 'torta') { correct++; document.getElementById('ans-grafico-2').style.borderColor = '#10B981'; }
    else { document.getElementById('ans-grafico-2').style.borderColor = '#EF4444'; }

    if (a3 === 'istogramma') { correct++; document.getElementById('ans-grafico-3').style.borderColor = '#10B981'; }
    else { document.getElementById('ans-grafico-3').style.borderColor = '#EF4444'; }

    if (correct === 3) {
        showFeedback('feed-grafici', true, 'Perfetto! 3/3 — Barre per categorie, Torta per proporzioni, Istogramma per intervalli continui.');
    } else {
        showFeedback('feed-grafici', false, `${correct}/3. I campi in rosso sono da rivedere. Ricorda: barre = categorie, torta = proporzioni %, istogramma = intervalli continui.`);
    }
}

/* 6. Interpolation exercise */
function checkInterp() {
    const ans = parseFloat(document.getElementById('ans-interp').value);
    // Regression: y = slope * x + intercept
    // with data: x=[2,3,4,5,6,7,8,9], y=[4,5,5.5,6,7,7.5,8,9]
    // slope ≈ 0.696, intercept ≈ 2.643 → at x=5: y ≈ 6.1
    // Accept 6.0, 6.1, 6.2
    if (ans >= 5.9 && ans <= 6.3) {
        showFeedback('feed-interp', true, `Giusto! La retta di regressione stima un voto di circa 6.1 per 5 ore di studio. Ottima lettura del grafico!`);
    } else {
        showFeedback('feed-interp', false, 'Non proprio. Segui la retta tratteggiata/solida fino a X=5 e leggi il valore Y corrispondente. Dovrebbe essere intorno a 6.1.');
    }
}


/* =============================================
   QUIZ FINALE (7 domande)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            q: "1. La media aritmetica è sensibile ai valori estremi (outlier)?",
            a: ["No, la media è sempre stabile.", "Sì, un singolo valore estremo può spostarla significativamente.", "Solo se i dati sono più di 100.", "Dipende dalla mediana."],
            c: 1
        },
        {
            q: "2. Qual è la mediana del dataset {2, 5, 7, 8, 12}?",
            a: ["5", "7", "6.8", "8"],
            c: 1
        },
        {
            q: "3. Se in un dataset il valore 15 compare 5 volte e nessun altro compare più di 3 volte, la moda è:",
            a: ["3", "5", "15", "Non esiste"],
            c: 2
        },
        {
            q: "4. La deviazione standard misura:",
            a: ["Il valore centrale dei dati.", "La differenza tra il valore massimo e il minimo.", "Quanto in media i dati si discostano dalla media.", "Il rapporto tra mediana e moda."],
            c: 2
        },
        {
            q: "5. Quale grafico è più adatto per mostrare la distribuzione delle altezze (dato continuo) in classi?",
            a: ["Grafico a torta", "Grafico a barre", "Istogramma", "Diagramma di dispersione"],
            c: 2
        },
        {
            q: "6. L'interpolazione permette di:",
            a: ["Predire valori fuori dal range dei dati osservati.", "Stimare valori all'interno del range dei dati osservati.", "Calcolare la deviazione standard.", "Disegnare un grafico a torta."],
            c: 1
        },
        {
            q: "7. Perché l'estrapolazione è considerata rischiosa?",
            a: ["Perché richiede troppi calcoli.", "Perché il modello potrebbe non essere valido fuori dal range dei dati.", "Perché i grafici diventano illeggibili.", "Non è rischiosa, è sempre affidabile."],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2.5rem";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "12px";
            card.style.background = "rgba(255,255,255,0.02)";
            card.style.border = "1px solid rgba(255,255,255,0.05)";

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff; font-size: 1.1rem;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex";
            optionsGroup.style.flexDirection = "column";
            optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = option;
                btn.style.textAlign = "left";
                btn.style.padding = "1rem";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "white";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.transition = "0.3s";
                btn.style.fontSize = "0.95rem";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;

                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.style.borderColor = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        if (!card.classList.contains('attempted')) {
                            score++;
                        }
                        const sibs = optionsGroup.children;
                        for (let s of sibs) {
                            s.style.pointerEvents = "none";
                            s.style.opacity = s === btn ? "1" : "0.5";
                        }
                        answered++;
                        if (answered === quizData.length) {
                            quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = score >= (quizData.length - 1) ? "#10B981" : "#F59E0B";
                        }
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato, riprova</strong>";
                        btn.classList.add('picked');
                        btn.style.pointerEvents = "none";
                        card.classList.add('attempted');
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }

    /* =============================================
       RENDER EXAMPLE CHARTS ON PAGE LOAD
       ============================================= */

    // Bar chart: vote frequencies
    const voteFreq = { '4': 1, '5': 1, '6': 1, '7': 4, '8': 2, '9': 1 };
    drawBarChart('bar-chart-example', voteFreq);

    // Pie chart: vote distribution
    drawPieChart('pie-chart-example', voteFreq);

    // Histogram: game level completion times (seconds)
    const histBins = [3, 8, 15, 12, 7, 4, 2];
    const histLabels = ['30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100'];
    drawHistogram('histogram-example', histBins, histLabels);

    // Scatter plot: hours of study vs grade
    const studyHours = [2, 3, 4, 5, 6, 7, 8, 9];
    const grades =     [4, 5, 5.5, 6, 7, 7.5, 8, 9];
    drawScatter('scatter-chart', studyHours, grades);

    // Box plot: class grades
    const boxplotData = [4, 5, 6, 7, 7, 7, 7, 8, 8, 9];
    drawBoxPlot('boxplot-example', boxplotData);

    // Regression analysis (Residuals and R2)
    drawRegressionAnalysis('regression-analysis-chart', studyHours, grades);

    // Auto-calculate playground with default data
    calcolaPlayground();
});
