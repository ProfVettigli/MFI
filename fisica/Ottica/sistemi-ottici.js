document.addEventListener('DOMContentLoaded', () => {

    // ============ SIMULATOR LENTE ============
    const lensCanvas = document.getElementById('lensCanvas');
    const lensCtx = lensCanvas.getContext('2d');
    const objDistSlider = document.getElementById('objectDist');
    const focalSlider = document.getElementById('focalLen');
    const objVal = document.getElementById('objVal');
    const focalVal = document.getElementById('focalVal');
    const imageDistEl = document.getElementById('imageDist');
    const magnifEl = document.getElementById('magnif');
    const imgTypeEl = document.getElementById('imgType');

    function drawLens() {
        const W = lensCanvas.width;
        const H = lensCanvas.height;
        const centerX = W / 2;
        const centerY = H / 2;
        const scale = 3; // pixel per cm

        lensCtx.fillStyle = '#060a10';
        lensCtx.fillRect(0, 0, W, H);

        // Griglia
        lensCtx.strokeStyle = 'rgba(255,255,255,0.05)';
        lensCtx.lineWidth = 1;
        for (let i = 0; i < W; i += 20) {
            lensCtx.beginPath();
            lensCtx.moveTo(i, 0);
            lensCtx.lineTo(i, H);
            lensCtx.stroke();
        }
        for (let j = 0; j < H; j += 20) {
            lensCtx.beginPath();
            lensCtx.moveTo(0, j);
            lensCtx.lineTo(W, j);
            lensCtx.stroke();
        }

        const p = parseFloat(objDistSlider.value);
        const f = parseFloat(focalSlider.value);

        // Asse ottico
        lensCtx.strokeStyle = 'rgba(255,255,255,0.3)';
        lensCtx.lineWidth = 1;
        lensCtx.setLineDash([4, 4]);
        lensCtx.beginPath();
        lensCtx.moveTo(0, centerY);
        lensCtx.lineTo(W, centerY);
        lensCtx.stroke();
        lensCtx.setLineDash([]);

        // Lente (linea verticale al centro)
        lensCtx.strokeStyle = 'var(--physics-color)';
        lensCtx.lineWidth = 3;
        lensCtx.beginPath();
        lensCtx.moveTo(centerX, centerY - 80);
        lensCtx.lineTo(centerX, centerY + 80);
        lensCtx.stroke();

        // Fuochi
        const fLoc = f * scale;
        lensCtx.fillStyle = 'rgba(16,185,129,0.4)';
        lensCtx.beginPath();
        lensCtx.arc(centerX + fLoc, centerY, 6, 0, 2 * Math.PI);
        lensCtx.fill();
        lensCtx.beginPath();
        lensCtx.arc(centerX - fLoc, centerY, 6, 0, 2 * Math.PI);
        lensCtx.fill();

        // Oggetto
        const objX = centerX - p * scale;
        const objH = 50;
        lensCtx.strokeStyle = '#3b82f6';
        lensCtx.lineWidth = 2;
        lensCtx.beginPath();
        lensCtx.moveTo(objX, centerY);
        lensCtx.lineTo(objX, centerY - objH);
        lensCtx.stroke();
        lensCtx.fillStyle = '#3b82f6';
        lensCtx.fillRect(objX - 4, centerY - objH - 4, 8, 8);

        // Etichette
        lensCtx.fillStyle = 'rgba(255,255,255,0.7)';
        lensCtx.font = '12px Inter';
        lensCtx.fillText('F', centerX + fLoc - 8, centerY - 20);
        lensCtx.fillText('F', centerX - fLoc - 8, centerY - 20);
        lensCtx.fillText('O', objX - 10, centerY + 30);

        // Calcola immagine
        const q = (p * f) / (p - f);
        const m = -q / p;

        if (isFinite(q) && q !== 0) {
            const imgX = centerX + q * scale;
            const imgH = Math.abs(m * objH);

            // Raggi
            lensCtx.strokeStyle = 'rgba(16,185,129,0.5)';
            lensCtx.lineWidth = 1.5;
            lensCtx.setLineDash([3, 3]);

            // Raggio parallelo
            lensCtx.beginPath();
            lensCtx.moveTo(objX, centerY - objH);
            lensCtx.lineTo(centerX, centerY - (objH * f / p));
            lensCtx.lineTo(imgX, centerY + (m * objH));
            lensCtx.stroke();

            // Immagine
            lensCtx.setLineDash([]);
            lensCtx.strokeStyle = '#10b981';
            lensCtx.lineWidth = 2;
            lensCtx.beginPath();
            if (m < 0) {
                lensCtx.moveTo(imgX, centerY);
                lensCtx.lineTo(imgX, centerY + imgH);
            } else {
                lensCtx.moveTo(imgX, centerY);
                lensCtx.lineTo(imgX, centerY - imgH);
            }
            lensCtx.stroke();
            lensCtx.fillStyle = '#10b981';
            lensCtx.fillRect(imgX - 4, centerY + (m < 0 ? imgH - 4 : -imgH - 4), 8, 8);

            lensCtx.fillStyle = 'rgba(255,255,255,0.7)';
            lensCtx.fillText('I', imgX - 10, centerY + (m < 0 ? imgH + 30 : -imgH - 20));

            imageDistEl.textContent = `Distanza Immagine: ${Math.abs(q).toFixed(1)} cm`;
            magnifEl.textContent = `Ingrandimento: ${m.toFixed(2)}`;
            if (q > 0) {
                imgTypeEl.textContent = `Tipo immagine: REALE ${m < 0 ? '(capovolta)' : '(dritta)'}`;
            } else {
                imgTypeEl.textContent = `Tipo immagine: VIRTUALE (dritta)`;
            }
        } else {
            imageDistEl.textContent = `Distanza Immagine: Infinito (raggil paralleli)`;
            magnifEl.textContent = `Ingrandimento: Infinito`;
            imgTypeEl.textContent = `Tipo immagine: Oggetto nel fuoco`;
        }
    }

    objDistSlider.addEventListener('input', () => {
        objVal.textContent = objDistSlider.value + ' cm';
        drawLens();
    });
    focalSlider.addEventListener('input', () => {
        focalVal.textContent = focalSlider.value + ' cm';
        drawLens();
    });

    drawLens();

    // ============ RAY TRACING ============
    const rayCanvas = document.getElementById('rayCanvas');
    const rayCtx = rayCanvas.getContext('2d');
    const systemSelect = document.getElementById('systemType');

    function drawRayTracing() {
        const W = rayCanvas.width;
        const H = rayCanvas.height;
        const centerX = W / 2;
        const centerY = H / 2;

        rayCtx.fillStyle = '#060a10';
        rayCtx.fillRect(0, 0, W, H);

        // Asse
        rayCtx.strokeStyle = 'rgba(255,255,255,0.2)';
        rayCtx.lineWidth = 1;
        rayCtx.setLineDash([4, 4]);
        rayCtx.beginPath();
        rayCtx.moveTo(0, centerY);
        rayCtx.lineTo(W, centerY);
        rayCtx.stroke();
        rayCtx.setLineDash([]);

        const sysType = systemSelect.value;

        if (sysType === 'lens') {
            // Lente convergente
            rayCtx.strokeStyle = 'var(--physics-color)';
            rayCtx.lineWidth = 3;
            rayCtx.beginPath();
            rayCtx.moveTo(centerX, centerY - 80);
            rayCtx.lineTo(centerX, centerY + 80);
            rayCtx.stroke();

            // Fuoco
            rayCtx.fillStyle = 'rgba(16,185,129,0.3)';
            rayCtx.beginPath();
            rayCtx.arc(centerX + 100, centerY, 5, 0, 2 * Math.PI);
            rayCtx.fill();

            // Oggetto
            const objX = centerX - 150;
            rayCtx.strokeStyle = '#3b82f6';
            rayCtx.lineWidth = 2;
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY);
            rayCtx.lineTo(objX, centerY - 60);
            rayCtx.stroke();

            // Tre raggi principali
            rayCtx.strokeStyle = '#22c55e';
            rayCtx.lineWidth = 1.5;
            rayCtx.setLineDash([3, 3]);

            // Raggio 1: parallelo al fuoco
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 60);
            rayCtx.lineTo(centerX, centerY - 45);
            rayCtx.lineTo(centerX + 100, centerY);
            rayCtx.stroke();

            // Raggio 2: attraverso il fuoco
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 60);
            rayCtx.lineTo(centerX - 100, centerY);
            rayCtx.lineTo(centerX + 150, centerY - 60);
            rayCtx.stroke();

            // Raggio 3: centrale (passa dritto)
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 60);
            rayCtx.lineTo(centerX, centerY);
            rayCtx.lineTo(centerX + 200, centerY + 60);
            rayCtx.stroke();

            // Immagine formata
            rayCtx.setLineDash([]);
            rayCtx.strokeStyle = '#10b981';
            rayCtx.lineWidth = 2;
            const imgX = centerX + 200;
            rayCtx.beginPath();
            rayCtx.moveTo(imgX, centerY);
            rayCtx.lineTo(imgX, centerY + 60);
            rayCtx.stroke();

            rayCtx.fillStyle = 'rgba(255,255,255,0.6)';
            rayCtx.font = '12px Inter';
            rayCtx.fillText('Lente', centerX - 20, centerY - 100);
            rayCtx.fillText('F', centerX + 100, centerY - 25);

        } else if (sysType === 'mirror') {
            // Specchio concavo
            rayCtx.strokeStyle = 'var(--physics-color)';
            rayCtx.lineWidth = 3;
            rayCtx.beginPath();
            rayCtx.arc(centerX, centerY, 60, 0.3, Math.PI - 0.3);
            rayCtx.stroke();

            // Fuoco
            rayCtx.fillStyle = 'rgba(16,185,129,0.3)';
            rayCtx.beginPath();
            rayCtx.arc(centerX - 80, centerY, 5, 0, 2 * Math.PI);
            rayCtx.fill();

            // Oggetto
            const objX = centerX - 200;
            rayCtx.strokeStyle = '#3b82f6';
            rayCtx.lineWidth = 2;
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY);
            rayCtx.lineTo(objX, centerY - 50);
            rayCtx.stroke();

            // Tre raggi
            rayCtx.strokeStyle = '#22c55e';
            rayCtx.lineWidth = 1.5;
            rayCtx.setLineDash([3, 3]);

            // Raggio parallelo -> fuoco
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 50);
            rayCtx.lineTo(centerX, centerY - 50);
            rayCtx.lineTo(centerX - 80, centerY);
            rayCtx.stroke();

            // Raggio per il fuoco -> parallelo
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 50);
            rayCtx.lineTo(centerX - 80, centerY);
            rayCtx.lineTo(centerX + 100, centerY - 50);
            rayCtx.stroke();

            // Immagine reale
            rayCtx.setLineDash([]);
            rayCtx.strokeStyle = '#10b981';
            rayCtx.lineWidth = 2;
            const imgX = centerX - 160;
            rayCtx.beginPath();
            rayCtx.moveTo(imgX, centerY);
            rayCtx.lineTo(imgX, centerY + 50);
            rayCtx.stroke();

            rayCtx.fillStyle = 'rgba(255,255,255,0.6)';
            rayCtx.font = '12px Inter';
            rayCtx.fillText('Specchio', centerX - 40, centerY - 90);
            rayCtx.fillText('F', centerX - 80, centerY - 25);

        } else if (sysType === 'divergent') {
            // Lente divergente
            rayCtx.strokeStyle = 'var(--physics-color)';
            rayCtx.lineWidth = 3;
            rayCtx.beginPath();
            rayCtx.moveTo(centerX - 8, centerY - 80);
            rayCtx.lineTo(centerX - 8, centerY + 80);
            rayCtx.moveTo(centerX + 8, centerY - 80);
            rayCtx.lineTo(centerX + 8, centerY + 80);
            rayCtx.stroke();

            // Fuoco virtuale
            rayCtx.fillStyle = 'rgba(16,185,129,0.3)';
            rayCtx.beginPath();
            rayCtx.arc(centerX - 70, centerY, 5, 0, 2 * Math.PI);
            rayCtx.fill();

            // Oggetto
            const objX = centerX - 150;
            rayCtx.strokeStyle = '#3b82f6';
            rayCtx.lineWidth = 2;
            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY);
            rayCtx.lineTo(objX, centerY - 60);
            rayCtx.stroke();

            // Raggi divergenti
            rayCtx.strokeStyle = '#22c55e';
            rayCtx.lineWidth = 1.5;
            rayCtx.setLineDash([3, 3]);

            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 60);
            rayCtx.lineTo(centerX, centerY - 40);
            rayCtx.lineTo(centerX + 150, centerY + 60);
            rayCtx.stroke();

            rayCtx.beginPath();
            rayCtx.moveTo(objX, centerY - 60);
            rayCtx.lineTo(centerX, centerY - 20);
            rayCtx.lineTo(centerX + 150, centerY);
            rayCtx.stroke();

            // Immagine virtuale
            rayCtx.setLineDash([]);
            rayCtx.strokeStyle = '#10b981';
            rayCtx.lineWidth = 2;
            const imgX = centerX - 100;
            rayCtx.beginPath();
            rayCtx.moveTo(imgX, centerY);
            rayCtx.lineTo(imgX, centerY - 40);
            rayCtx.stroke();

            rayCtx.fillStyle = 'rgba(255,255,255,0.6)';
            rayCtx.font = '12px Inter';
            rayCtx.fillText('Lente Divergente', centerX - 50, centerY - 100);
        }
    }

    systemSelect.addEventListener('change', drawRayTracing);
    drawRayTracing();

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
