document.addEventListener('DOMContentLoaded', () => {

    const scatteringCanvas = document.getElementById('scatteringCanvas');
    const scatteringCtx = scatteringCanvas.getContext('2d');
    const wavelengthSlider = document.getElementById('wavelengthSlider');
    const wavelengthVal = document.getElementById('wavelengthVal');
    const intensityVal = document.getElementById('intensityVal');

    function wavelengthToColor(wl) {
        let r, g, b;

        if (wl < 380) { r = 0; g = 0; b = 0; }
        else if (wl < 440) {
            r = (440 - wl) / 60;
            g = 0;
            b = 1;
        } else if (wl < 490) {
            r = 0;
            g = (wl - 440) / 50;
            b = 1;
        } else if (wl < 510) {
            r = 0;
            g = 1;
            b = (510 - wl) / 20;
        } else if (wl < 580) {
            r = (wl - 510) / 70;
            g = 1;
            b = 0;
        } else if (wl < 645) {
            r = 1;
            g = (645 - wl) / 65;
            b = 0;
        } else if (wl <= 750) {
            r = 1;
            g = 0;
            b = 0;
        } else {
            r = 0; g = 0; b = 0;
        }

        r = Math.max(0, Math.min(1, r));
        g = Math.max(0, Math.min(1, g));
        b = Math.max(0, Math.min(1, b));

        // Intensity correction
        let intensity = 1;
        if (wl < 380 || wl > 750) { intensity = 0; }
        else if (wl < 420) { intensity = 0.3 + 0.7 * (wl - 380) / 40; }
        else if (wl > 700) { intensity = 0.3 + 0.7 * (750 - wl) / 50; }

        r = Math.pow(r * intensity, 0.8);
        g = Math.pow(g * intensity, 0.8);
        b = Math.pow(b * intensity, 0.8);

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function drawScattering() {
        const wl = parseInt(wavelengthSlider.value);
        wavelengthVal.textContent = wl + ' nm';

        const W = scatteringCanvas.width, H = scatteringCanvas.height;
        scatteringCtx.clearRect(0, 0, W, H);

        // Background (space)
        scatteringCtx.fillStyle = '#000011';
        scatteringCtx.fillRect(0, 0, W, H);

        // Sun
        const sunX = 80, sunY = 80;
        scatteringCtx.fillStyle = '#ffff00';
        scatteringCtx.beginPath();
        scatteringCtx.arc(sunX, sunY, 15, 0, Math.PI * 2);
        scatteringCtx.fill();

        // Light rays from sun
        const col = wavelengthToColor(wl);
        const colorStr = `rgb(${col.r}, ${col.g}, ${col.b})`;

        scatteringCtx.strokeStyle = colorStr;
        scatteringCtx.lineWidth = 2;
        for (let angle = -0.3; angle <= 0.3; angle += 0.1) {
            scatteringCtx.beginPath();
            scatteringCtx.moveTo(sunX, sunY);
            scatteringCtx.lineTo(W - 50, H / 2 + (W - 50) * Math.tan(angle));
            scatteringCtx.stroke();
        }

        // Atmosphere with particles
        const particleCount = 80;
        const scatteringIntensity = 1 / Math.pow(wl / 500, 4);

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * (W - 150) + 100;
            const y = Math.random() * H;
            const size = 2 + Math.random() * 4;

            // Particle color tends toward the scattered wavelength
            scatteringCtx.fillStyle = colorStr;
            scatteringCtx.globalAlpha = 0.1 + 0.6 * scatteringIntensity;
            scatteringCtx.beginPath();
            scatteringCtx.arc(x, y, size, 0, Math.PI * 2);
            scatteringCtx.fill();
            scatteringCtx.globalAlpha = 1;
        }

        // Scattered light cone
        scatteringCtx.fillStyle = colorStr;
        scatteringCtx.globalAlpha = 0.15 * scatteringIntensity;
        scatteringCtx.beginPath();
        scatteringCtx.ellipse(W - 80, H / 2, 100, 150, 0, 0, Math.PI * 2);
        scatteringCtx.fill();
        scatteringCtx.globalAlpha = 1;

        // Observer
        scatteringCtx.fillStyle = '#fff';
        scatteringCtx.beginPath();
        scatteringCtx.arc(W - 50, H / 2, 8, 0, Math.PI * 2);
        scatteringCtx.fill();

        // Labels
        scatteringCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        scatteringCtx.font = '12px Inter, sans-serif';
        scatteringCtx.fillText('Sole', sunX - 20, sunY + 35);
        scatteringCtx.fillText('Atmosfera', W / 2 - 40, 30);
        scatteringCtx.fillText('Osservatore', W - 70, H / 2 + 30);

        // Calculate intensity relative to 500 nm
        const referenceIntensity = 1 / Math.pow(500, 4);
        const relativeIntensity = scatteringIntensity / referenceIntensity;

        intensityVal.textContent = Math.round(relativeIntensity * 100) + '%';
    }

    wavelengthSlider.addEventListener('input', drawScattering);
    drawScattering();

});
