document.addEventListener('DOMContentLoaded', () => {

    const fiberCanvas = document.getElementById('fiberCanvas');
    const fiberCtx = fiberCanvas.getContext('2d');
    const fiberAngle = document.getElementById('fiberAngle');
    const fiberAngleVal = document.getElementById('fiberAngleVal');
    const fiberStatus = document.getElementById('fiberStatus');

    const CRITICAL_ANGLE = 42.2; // degrees for glass-air interface

    function drawFiber() {
        const W = fiberCanvas.width, H = fiberCanvas.height;
        fiberCtx.clearRect(0, 0, W, H);

        const angle = parseInt(fiberAngle.value);
        fiberAngleVal.textContent = angle;

        // Draw fiber (core + cladding)
        const fiberX = 80;
        const fiberWidth = 400;
        const fiberHeight = 80;
        const fiberY = (H - fiberHeight) / 2;

        // Cladding
        fiberCtx.fillStyle = 'rgba(100, 150, 200, 0.1)';
        fiberCtx.fillRect(fiberX - 10, fiberY - 10, fiberWidth + 20, fiberHeight + 20);

        // Core
        fiberCtx.fillStyle = 'rgba(100, 150, 200, 0.3)';
        fiberCtx.fillRect(fiberX, fiberY, fiberWidth, fiberHeight);

        // Border
        fiberCtx.strokeStyle = 'rgba(100, 200, 200, 0.6)';
        fiberCtx.lineWidth = 2;
        fiberCtx.strokeRect(fiberX, fiberY, fiberWidth, fiberHeight);

        // Entering light ray
        const entryAngle = angle * Math.PI / 180;
        const raySpeed = 80;

        // Draw reflection pattern
        fiberCtx.strokeStyle = '#fcd34d';
        fiberCtx.lineWidth = 3;
        fiberCtx.lineCap = 'round';

        let x = fiberX;
        let y = fiberY + fiberHeight / 2;
        let dirAngle = entryAngle;
        let confined = true;

        for (let bounce = 0; bounce < 4; bounce++) {
            // Calculate next bounce point
            const dx = Math.cos(dirAngle);
            const dy = Math.sin(dirAngle);

            let nextX, nextY, hitTop;
            if (dy > 0) {
                // Ray going down
                const dist = (fiberY + fiberHeight - y) / dy;
                nextX = x + dx * dist;
                nextY = fiberY + fiberHeight;
                hitTop = false;
            } else {
                // Ray going up
                const dist = (fiberY - y) / dy;
                nextX = x + dx * dist;
                nextY = fiberY;
                hitTop = true;
            }

            if (nextX > fiberX && nextX < fiberX + fiberWidth) {
                // Draw ray segment
                fiberCtx.beginPath();
                fiberCtx.moveTo(x, y);
                fiberCtx.lineTo(nextX, nextY);
                fiberCtx.stroke();

                // Check if ray angle satisfies critical angle
                const incidenceAngle = Math.abs(dirAngle);
                if (incidenceAngle < (90 - CRITICAL_ANGLE) * Math.PI / 180) {
                    confined = false;
                }

                // Reflect
                dirAngle = -dirAngle;
                x = nextX;
                y = nextY;
            } else {
                break;
            }
        }

        // Draw incident ray from light source
        fiberCtx.strokeStyle = '#fcd34d';
        fiberCtx.lineWidth = 2;
        fiberCtx.setLineDash([4, 4]);
        fiberCtx.beginPath();
        fiberCtx.moveTo(30, fiberY + fiberHeight / 2 - 30);
        fiberCtx.lineTo(fiberX, fiberY + fiberHeight / 2);
        fiberCtx.stroke();
        fiberCtx.setLineDash([]);

        // Light source
        fiberCtx.fillStyle = '#fcd34d';
        fiberCtx.beginPath();
        fiberCtx.arc(30, fiberY + fiberHeight / 2 - 30, 6, 0, Math.PI * 2);
        fiberCtx.fill();

        // Labels
        fiberCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        fiberCtx.font = '12px Inter, sans-serif';
        fiberCtx.fillText('Laser', 10, fiberY + fiberHeight / 2 - 35);
        fiberCtx.fillText('Fiber Core', fiberX + 10, fiberY - 5);

        // Status
        if (confined) {
            fiberStatus.textContent = '✓ Ray confined (efficient transmission)';
            fiberStatus.style.color = '#6ee7b7';
        } else {
            fiberStatus.textContent = '✗ Ray leakage (escapes from fiber)';
            fiberStatus.style.color = '#f87171';
        }
    }

    fiberAngle.addEventListener('input', drawFiber);
    drawFiber();

});
