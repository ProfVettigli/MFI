document.addEventListener('DOMContentLoaded', () => {

    // Eye cross-section canvas
    const eyeCanvas = document.getElementById('eyeCanvas');
    const eyeCtx = eyeCanvas.getContext('2d');

    function drawEyeCrosssection() {
        const W = eyeCanvas.width, H = eyeCanvas.height;
        eyeCtx.clearRect(0, 0, W, H);

        const cx = W * 0.5, cy = H * 0.5;
        const eyeRadius = 120;

        // Sclera (white part)
        eyeCtx.fillStyle = '#f0f0f0';
        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
        eyeCtx.fill();

        // Cornea (dome)
        eyeCtx.fillStyle = 'rgba(200, 220, 255, 0.4)';
        eyeCtx.beginPath();
        eyeCtx.ellipse(cx, cy - eyeRadius * 0.2, eyeRadius * 0.35, eyeRadius * 0.25, 0, 0, Math.PI * 2);
        eyeCtx.fill();

        // Iris and pupil
        eyeCtx.fillStyle = '#8B7355';
        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy - 15, 25, 0, Math.PI * 2);
        eyeCtx.fill();

        // Pupil
        eyeCtx.fillStyle = '#1a1a1a';
        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy - 15, 12, 0, Math.PI * 2);
        eyeCtx.fill();

        // Light reflection in pupil
        eyeCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        eyeCtx.beginPath();
        eyeCtx.arc(cx - 5, cy - 18, 4, 0, Math.PI * 2);
        eyeCtx.fill();

        // Lens (cristallino)
        eyeCtx.strokeStyle = 'rgba(100, 150, 200, 0.6)';
        eyeCtx.lineWidth = 2;
        eyeCtx.beginPath();
        eyeCtx.ellipse(cx, cy - 5, 28, 22, 0, 0, Math.PI * 2);
        eyeCtx.stroke();

        // Retina (at back)
        eyeCtx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
        eyeCtx.lineWidth = 6;
        eyeCtx.beginPath();
        eyeCtx.arc(cx, cy, eyeRadius - 5, 0, Math.PI, true);
        eyeCtx.stroke();

        // Optic nerve
        eyeCtx.fillStyle = 'rgba(200, 100, 100, 0.5)';
        eyeCtx.fillRect(cx + eyeRadius - 10, cy - 15, 25, 30);

        // Labels
        eyeCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        eyeCtx.font = '12px Inter, sans-serif';
        eyeCtx.textAlign = 'left';

        eyeCtx.fillText('Cornea', cx - 70, cy - 80);
        eyeCtx.fillText('Pupilla', cx + 15, cy - 20);
        eyeCtx.fillText('Cristallino', cx - 75, cy + 5);
        eyeCtx.fillText('Retina', cx + 80, cy + 70);
        eyeCtx.fillText('Nervo Ottico', cx - 50, cy + 100);

        // Light ray entering
        eyeCtx.strokeStyle = '#fcd34d';
        eyeCtx.lineWidth = 2;
        eyeCtx.beginPath();
        eyeCtx.moveTo(cx - 180, cy - 40);
        eyeCtx.lineTo(cx - eyeRadius, cy - 40);
        eyeCtx.stroke();

        eyeCtx.fillStyle = '#fcd34d';
        eyeCtx.beginPath();
        eyeCtx.moveTo(cx - eyeRadius + 8, cy - 40);
        eyeCtx.lineTo(cx - eyeRadius + 8, cy - 36);
        eyeCtx.lineTo(cx - eyeRadius + 3, cy - 40);
        eyeCtx.fill();
    }

    drawEyeCrosssection();

    // Accommodation slider
    const distanceSlider = document.getElementById('distanceSlider');
    const distanceVal = document.getElementById('distanceVal');
    const accommodationCanvas = document.getElementById('accommodationCanvas');
    const accoCtx = accommodationCanvas.getContext('2d');

    function drawAccommodation() {
        const distance = parseInt(distanceSlider.value);
        distanceVal.textContent = distance + ' cm';

        const W = accommodationCanvas.width, H = accommodationCanvas.height;
        accoCtx.clearRect(0, 0, W, H);

        // Object
        accoCtx.fillStyle = '#fcd34d';
        const objX = 80;
        accoCtx.fillRect(objX, 80, 20, 80);
        accoCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        accoCtx.font = '11px Inter, sans-serif';
        accoCtx.fillText('Oggetto', objX - 15, 170);

        // Eye
        const eyeX = W - 120;
        const eyeR = 40;

        accoCtx.fillStyle = '#888';
        accoCtx.beginPath();
        accoCtx.arc(eyeX, H / 2, eyeR, 0, Math.PI * 2);
        accoCtx.fill();

        // Lens shape based on distance
        const maxCurve = 18;
        const minCurve = 8;
        const curve = minCurve + (maxCurve - minCurve) * Math.max(0, 1 - distance / 200);

        accoCtx.strokeStyle = '#6ee7b7';
        accoCtx.lineWidth = 3;
        accoCtx.beginPath();
        accoCtx.ellipse(eyeX - 25, H / 2, 15, curve, 0, 0, Math.PI * 2);
        accoCtx.stroke();

        // Rays
        accoCtx.strokeStyle = '#a78bfa';
        accoCtx.lineWidth = 1.5;
        accoCtx.setLineDash([4, 4]);
        for (let i = 0; i < 5; i++) {
            const y = 70 + i * 40;
            accoCtx.beginPath();
            accoCtx.moveTo(objX + 10, y);
            accoCtx.lineTo(eyeX - eyeR, H / 2);
            accoCtx.stroke();
        }
        accoCtx.setLineDash([]);

        // Info text
        accoCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        accoCtx.font = '12px Inter, sans-serif';
        accoCtx.fillText('Cristallino ' + (curve > 12 ? 'arrotondato' : 'appiattito'), eyeX - 80, H - 20);
    }

    distanceSlider.addEventListener('input', drawAccommodation);
    drawAccommodation();

    // Vision focus slider
    const focusSlider = document.getElementById('focusSlider');
    const focusVal = document.getElementById('focusVal');
    const visionText = document.getElementById('visionText');

    focusSlider.addEventListener('input', () => {
        const blur = parseInt(focusSlider.value);
        focusVal.textContent = Math.max(0, 100 - blur * 6) + '%';
        visionText.style.filter = `blur(${blur * 0.6}px)`;
    });

});
