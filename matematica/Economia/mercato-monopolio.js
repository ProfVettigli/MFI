// Mercato e Monopolio - Interactive Canvas

const canvas = document.getElementById('marketCanvas');
const ctx = canvas.getContext('2d');
const priceSlider = document.getElementById('demand-price');
const priceDisplay = document.getElementById('price-display');
const eqPrice = document.getElementById('eq-price');
const eqQty = document.getElementById('eq-qty');

// Market parameters
const a = 100; // max quantity demanded
const b = 0.5; // demand slope
const c = 10;  // min quantity supplied
const d = 0.8; // supply elasticity

// Calculate equilibrium
function equilibrium() {
    // Qd = a - bp, Qs = c + dp
    // Qd = Qs: a - bp = c + dp
    // a - c = dp + bp = p(d + b)
    const p_eq = (a - c) / (b + d);
    const q_eq = a - b * p_eq;
    return { p: p_eq, q: q_eq };
}

const eq = equilibrium();

function demandQty(p) { return a - b * p; }
function supplyQty(p) { return c + d * p; }

function drawMarket() {
    const currentPrice = parseFloat(priceSlider.value);
    priceDisplay.textContent = currentPrice.toFixed(1);
    eqPrice.textContent = eq.p.toFixed(2);
    eqQty.textContent = eq.q.toFixed(2);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = 50;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    const maxP = 120;
    const maxQ = 120;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = padding + (i / 10) * graphWidth;
        const y = padding + (i / 10) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + graphHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + graphHeight);
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Quantità', padding + graphWidth / 2, canvas.height - 10);
    ctx.save();
    ctx.translate(15, padding + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Prezzo', 0, 0);
    ctx.restore();

    // Price and quantity scale labels
    for (let i = 1; i <= 10; i++) {
        const q = (i / 10) * maxQ;
        const p = (i / 10) * maxP;
        const x = padding + (i / 10) * graphWidth;
        const y = padding + graphHeight - (i / 10) * graphHeight;

        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(q.toFixed(0), x, padding + graphHeight + 15);

        ctx.textAlign = 'right';
        ctx.fillText(p.toFixed(0), padding - 8, y + 4);
    }

    // Demand curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let q = 0; q <= a; q += 1) {
        const p = (a - q) / b;
        if (q === 0) {
            ctx.moveTo(padding, padding + graphHeight - (p / maxP) * graphHeight);
        } else {
            ctx.lineTo(padding + (q / maxQ) * graphWidth, padding + graphHeight - (p / maxP) * graphHeight);
        }
    }
    ctx.stroke();

    // Supply curve
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let p = 0; p <= maxP; p += 1) {
        const q = c + d * p;
        if (p === 0) {
            ctx.moveTo(padding + (q / maxQ) * graphWidth, padding + graphHeight);
        } else {
            ctx.lineTo(padding + (q / maxQ) * graphWidth, padding + graphHeight - (p / maxP) * graphHeight);
        }
    }
    ctx.stroke();

    // Equilibrium point
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    const eqX = padding + (eq.q / maxQ) * graphWidth;
    const eqY = padding + graphHeight - (eq.p / maxP) * graphHeight;
    ctx.arc(eqX, eqY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Current price line
    ctx.strokeStyle = 'rgba(255,193,7,0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    const currentY = padding + graphHeight - (currentPrice / maxP) * graphHeight;
    ctx.beginPath();
    ctx.moveTo(padding, currentY);
    ctx.lineTo(padding + graphWidth, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current quantity demanded and supplied
    const qd = demandQty(currentPrice);
    const qs = supplyQty(currentPrice);
    const qd_x = padding + (qd / maxQ) * graphWidth;
    const qs_x = padding + (qs / maxQ) * graphWidth;

    ctx.fillStyle = 'rgba(59,130,246,0.4)';
    ctx.fillRect(qd_x, currentY, 8, graphHeight - (currentY - padding));

    ctx.fillStyle = 'rgba(239,68,68,0.4)';
    ctx.fillRect(qs_x, currentY, 8, graphHeight - (currentY - padding));

    // Legend
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Domanda', padding + 20, padding + 25);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Offerta', padding + 20, padding + 50);
    ctx.fillStyle = '#10b981';
    ctx.fillText('Equilibrio', padding + 20, padding + 75);
}

priceSlider.addEventListener('input', drawMarket);
drawMarket();
