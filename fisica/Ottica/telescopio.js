document.addEventListener('DOMContentLoaded', () => {

    // ============ TELESCOPE SIMULATOR ============
    const telescopeCanvas = document.getElementById('telescopeCanvas');
    const telescopeCtx = telescopeCanvas.getContext('2d');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomVal = document.getElementById('zoomVal');

    // Simulate a starfield view
    function drawTelescopeView() {
        const W = telescopeCanvas.width;
        const H = telescopeCanvas.height;
        const zoom = parseFloat(zoomSlider.value);

        // Background
        telescopeCtx.fillStyle = '#020613';
        telescopeCtx.fillRect(0, 0, W, H);

        // Viewer circle (telescope field of view)
        const centerX = W / 2;
        const centerY = H / 2;
        const radius = 150;

        // Draw circle border (telescope aperture)
        telescopeCtx.strokeStyle = 'rgba(16,185,129,0.4)';
        telescopeCtx.lineWidth = 2;
        telescopeCtx.beginPath();
        telescopeCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        telescopeCtx.stroke();

        // Crosshairs
        telescopeCtx.strokeStyle = 'rgba(16,185,129,0.2)';
        telescopeCtx.lineWidth = 1;
        telescopeCtx.setLineDash([3, 3]);
        telescopeCtx.beginPath();
        telescopeCtx.moveTo(centerX - 20, centerY);
        telescopeCtx.lineTo(centerX + 20, centerY);
        telescopeCtx.stroke();
        telescopeCtx.beginPath();
        telescopeCtx.moveTo(centerX, centerY - 20);
        telescopeCtx.lineTo(centerX, centerY + 20);
        telescopeCtx.stroke();
        telescopeCtx.setLineDash([]);

        // Stars with zoom effect
        const stars = [
            {x: 0.3, y: 0.2, size: 1.5, color: '#fff'},
            {x: 0.7, y: 0.15, size: 1, color: '#ffd700'},
            {x: 0.5, y: 0.5, size: 2.5, color: '#fff'},
            {x: 0.2, y: 0.7, size: 1.2, color: '#87ceeb'},
            {x: 0.8, y: 0.6, size: 0.8, color: '#ffd700'},
            {x: 0.6, y: 0.85, size: 1.5, color: '#fff'},
            {x: 0.15, y: 0.4, size: 1, color: '#ff6b6b'},
            {x: 0.9, y: 0.3, size: 1.3, color: '#fff'},
        ];

        stars.forEach(star => {
            const sx = centerX + (star.x - 0.5) * 2 * radius / zoom;
            const sy = centerY + (star.y - 0.5) * 2 * radius / zoom;

            // Check if star is in viewport
            if (Math.abs(sx - centerX) < radius && Math.abs(sy - centerY) < radius) {
                const starRadius = Math.max(star.size * (zoom / 20), 0.5);

                // Glow effect
                const gradient = telescopeCtx.createRadialGradient(sx, sy, 0, sx, sy, starRadius * 3);
                gradient.addColorStop(0, star.color + 'aa');
                gradient.addColorStop(1, star.color + '00');
                telescopeCtx.fillStyle = gradient;
                telescopeCtx.beginPath();
                telescopeCtx.arc(sx, sy, starRadius * 3, 0, 2 * Math.PI);
                telescopeCtx.fill();

                // Star core
                telescopeCtx.fillStyle = star.color;
                telescopeCtx.beginPath();
                telescopeCtx.arc(sx, sy, starRadius, 0, 2 * Math.PI);
                telescopeCtx.fill();
            }
        });

        // Diffraction spikes (characteristic of telescopes)
        telescopeCtx.strokeStyle = 'rgba(16,185,129,0.15)';
        telescopeCtx.lineWidth = 1;
        const spikeLen = 60;
        const mainStar = {x: centerX, y: centerY};
        telescopeCtx.beginPath();
        telescopeCtx.moveTo(mainStar.x - spikeLen, mainStar.y);
        telescopeCtx.lineTo(mainStar.x + spikeLen, mainStar.y);
        telescopeCtx.stroke();
        telescopeCtx.beginPath();
        telescopeCtx.moveTo(mainStar.x, mainStar.y - spikeLen);
        telescopeCtx.lineTo(mainStar.x, mainStar.y + spikeLen);
        telescopeCtx.stroke();

        // Info text
        telescopeCtx.fillStyle = 'rgba(255,255,255,0.6)';
        telescopeCtx.font = '11px Inter';
        telescopeCtx.fillText(`FOV: ${(2 / zoom).toFixed(1)}°`, 10, 20);
        telescopeCtx.fillText(`Magn: ${zoom}×`, 10, 35);

        // Vignetting (darkening at edges)
        const vignetteGradient = telescopeCtx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius);
        vignetteGradient.addColorStop(0, 'rgba(0,0,0,0)');
        vignetteGradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        telescopeCtx.fillStyle = vignetteGradient;
        telescopeCtx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    }

    zoomSlider.addEventListener('input', () => {
        zoomVal.textContent = zoomSlider.value + '×';
        drawTelescopeView();
    });

    drawTelescopeView();

    // ============ QUIZ ============
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const qNum = this.dataset.quiz;
            const isCorrect = this.dataset.correct === 'true';
            const container = this.closest('.quiz-item');
            const allOptions = container.querySelectorAll('.quiz-option');

            if (allOptions[0].classList.contains('selected')) return;

            this.classList.add('selected');

            allOptions.forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });

            if (!isCorrect) {
                this.classList.add('incorrect');
            }

            const feedback = document.getElementById(`feedback-${qNum}`);
            if (isCorrect) {
                feedback.textContent = '✓ Corretto!';
                feedback.style.color = '#22c55e';
            } else {
                feedback.textContent = '✗ Sbagliato. La risposta corretta è stata evidenziata.';
                feedback.style.color = '#ef4444';
            }
        });
    });
});
