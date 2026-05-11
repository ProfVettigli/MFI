/**
 * Buffon's Needle - CLIL Module
 * Probability and Statistics - MFI
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('buffon-canvas');
    const ctx = canvas.getContext('2d');
    
    // Stats display
    const valTotal = document.getElementById('val-total');
    const valHits = document.getElementById('val-hits');
    const valPi = document.getElementById('val-pi');
    
    // Buttons
    const btn1 = document.getElementById('btn-drop-1');
    const btn100 = document.getElementById('btn-drop-100');
    const btn1000 = document.getElementById('btn-drop-1000');
    const btnReset = document.getElementById('btn-reset');

    // Simulation variables
    const lineDistance = 80;
    const needleLength = 60;
    let totalDrops = 0;
    let hits = 0;
    
    // Initial resize
    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 400;
        drawLines();
    }

    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1.5;
        
        for (let x = lineDistance; x < canvas.width; x += lineDistance) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    function dropNeedles(count) {
        for (let i = 0; i < count; i++) {
            // Midpoint of the needle
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            // Random angle
            const angle = Math.random() * Math.PI;
            
            // Calculate endpoints
            const x1 = x - (needleLength / 2) * Math.sin(angle);
            const y1 = y - (needleLength / 2) * Math.cos(angle);
            const x2 = x + (needleLength / 2) * Math.sin(angle);
            const y2 = y + (needleLength / 2) * Math.cos(angle);
            
            // Check for hit
            // A hit occurs if floor(x1/d) != floor(x2/d)
            const hit = Math.floor(x1 / lineDistance) !== Math.floor(x2 / lineDistance);
            
            if (hit) hits++;
            totalDrops++;
            
            // Visual rendering
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            if (hit) {
                ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"; // Success Green
                ctx.lineWidth = 2;
                // Add a small glow to hits
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
            } else {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; // Faded White
                ctx.lineWidth = 1;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset shadow for next needle
        }
        
        updateStats();
    }

    function updateStats() {
        valTotal.textContent = totalDrops.toLocaleString();
        valHits.textContent = hits.toLocaleString();
        
        if (hits > 0) {
            // Formula: Pi = (2 * l * N) / (h * d)
            const piEstimate = (2 * needleLength * totalDrops) / (hits * lineDistance);
            valPi.textContent = piEstimate.toFixed(5);
        } else {
            valPi.textContent = "---";
        }
    }

    function reset() {
        totalDrops = 0;
        hits = 0;
        resize();
        updateStats();
    }

    // Event listeners
    btn1.addEventListener('click', () => dropNeedles(1));
    btn100.addEventListener('click', () => dropNeedles(100));
    btn1000.addEventListener('click', () => dropNeedles(1000));
    btnReset.addEventListener('click', reset);
    
    window.addEventListener('resize', resize);
    
    // Start
    resize();
});
