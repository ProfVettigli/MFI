document.addEventListener('DOMContentLoaded', () => {

    // ============ MICROSCOPE SIMULATOR ============
    const microscopeCanvas = document.getElementById('microscopeCanvas');
    const microscopeCtx = microscopeCanvas.getContext('2d');
    const magnSlider = document.getElementById('magnSlider');
    const focusSlider = document.getElementById('focusSlider');
    const sampleSelect = document.getElementById('sampleSelect');
    const magnVal = document.getElementById('magnVal');
    const focusVal = document.getElementById('focusVal');

    function drawMicroscopeView() {
        const W = microscopeCanvas.width;
        const H = microscopeCanvas.height;
        const centerX = W / 2;
        const centerY = H / 2;
        const radius = 180;

        // Background
        microscopeCtx.fillStyle = '#1a1a2e';
        microscopeCtx.fillRect(0, 0, W, H);

        // Microscope field circular aperture
        microscopeCtx.strokeStyle = 'rgba(16,185,129,0.5)';
        microscopeCtx.lineWidth = 3;
        microscopeCtx.beginPath();
        microscopeCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        microscopeCtx.stroke();

        // Grid scale (micrometer scale)
        microscopeCtx.strokeStyle = 'rgba(255,255,255,0.15)';
        microscopeCtx.lineWidth = 1;
        const gridSpacing = 20;
        for (let i = -W; i < W; i += gridSpacing) {
            microscopeCtx.beginPath();
            microscopeCtx.moveTo(centerX + i, centerY - radius);
            microscopeCtx.lineTo(centerX + i, centerY + radius);
            microscopeCtx.stroke();
        }
        for (let j = -H; j < H; j += gridSpacing) {
            microscopeCtx.beginPath();
            microscopeCtx.moveTo(centerX - radius, centerY + j);
            microscopeCtx.lineTo(centerX + radius, centerY + j);
            microscopeCtx.stroke();
        }

        const magnification = parseInt(magnSlider.value);
        const focus = parseFloat(focusSlider.value) / 100;
        const sample = sampleSelect.value;

        // Draw sample structures based on selection
        if (sample === 'blood') {
            drawBloodCells(centerX, centerY, radius, magnification, focus);
        } else if (sample === 'leaf') {
            drawLeafCells(centerX, centerY, radius, magnification, focus);
        } else if (sample === 'fabric') {
            drawFabricCells(centerX, centerY, radius, magnification, focus);
        } else if (sample === 'cell') {
            drawAnimalCell(centerX, centerY, radius, magnification, focus);
        }

        // Focus indicator and info
        microscopeCtx.fillStyle = 'rgba(255,255,255,0.7)';
        microscopeCtx.font = '12px Inter';
        microscopeCtx.fillText(`Ingrandimento: ${magnification}×`, 20, 30);
        microscopeCtx.fillText(`Focus: ${(focus * 100).toFixed(0)}%`, 20, 50);

        let focusText = 'Non a fuoco';
        if (focus > 0.4 && focus < 0.6) {
            focusText = 'A fuoco';
            microscopeCtx.fillStyle = '#22c55e';
        } else if (focus > 0.3 && focus < 0.7) {
            focusText = 'Quasi a fuoco';
            microscopeCtx.fillStyle = 'rgba(255,193,7,0.7)';
        } else {
            microscopeCtx.fillStyle = 'rgba(239,68,68,0.7)';
        }
        microscopeCtx.fillText(focusText, 20, 70);

        // Vignetting
        const vignetteGradient = microscopeCtx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius);
        vignetteGradient.addColorStop(0, 'rgba(0,0,0,0)');
        vignetteGradient.addColorStop(0.8, 'rgba(0,0,0,0.2)');
        vignetteGradient.addColorStop(1, 'rgba(0,0,0,0.6)');
        microscopeCtx.fillStyle = vignetteGradient;
        microscopeCtx.fillRect(centerX - radius - 20, centerY - radius - 20, radius * 2 + 40, radius * 2 + 40);
    }

    function drawBloodCells(cx, cy, r, mag, focus) {
        // Red blood cells (RBCs)
        const rbc_size = (mag / 20) * 8;
        const cellPositions = [
            {x: cx - 60, y: cy - 60},
            {x: cx + 30, y: cy - 80},
            {x: cx - 100, y: cy + 20},
            {x: cx + 80, y: cy - 20},
            {x: cx + 60, y: cy + 70},
            {x: cx - 40, y: cy + 80},
            {x: cx - 120, y: cy},
            {x: cx + 120, y: cy + 40},
        ];

        cellPositions.forEach(pos => {
            // Focus blur
            const blur = Math.abs(focus - 0.5) * 10;

            microscopeCtx.fillStyle = `rgba(220, 20, 60, ${0.6 - blur * 0.05})`;
            microscopeCtx.beginPath();
            microscopeCtx.ellipse(pos.x, pos.y, rbc_size, rbc_size * 0.6, 0, 0, 2 * Math.PI);
            microscopeCtx.fill();

            microscopeCtx.strokeStyle = 'rgba(139, 0, 0, 0.5)';
            microscopeCtx.lineWidth = 1;
            microscopeCtx.stroke();
        });

        // White blood cell (WBC)
        const wbc_size = rbc_size * 2;
        microscopeCtx.fillStyle = `rgba(255, 200, 100, ${0.7 - Math.abs(focus - 0.5) * 0.1})`;
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx, cy, wbc_size, 0, 2 * Math.PI);
        microscopeCtx.fill();

        microscopeCtx.strokeStyle = 'rgba(200, 100, 0, 0.6)';
        microscopeCtx.lineWidth = 2;
        microscopeCtx.stroke();

        // Nucleus
        microscopeCtx.fillStyle = 'rgba(100, 50, 150, 0.6)';
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx - 5, cy, wbc_size * 0.4, 0, 2 * Math.PI);
        microscopeCtx.fill();
    }

    function drawLeafCells(cx, cy, r, mag, focus) {
        // Leaf epidermal cells (polygonal)
        const cellSize = (mag / 20) * 12;

        // Top epidermis
        for (let row = -1; row <= 1; row++) {
            for (let col = -2; col <= 2; col++) {
                const x = cx + col * cellSize * 1.5;
                const y = cy - 80 + row * cellSize * 1.3;

                if (Math.hypot(x - cx, y - cy) < 180) {
                    const alpha = 0.4 - Math.abs(focus - 0.5) * 0.2;
                    microscopeCtx.fillStyle = `rgba(200, 220, 100, ${alpha})`;
                    microscopeCtx.strokeStyle = `rgba(100, 150, 50, ${alpha})`;
                    microscopeCtx.lineWidth = 1.5;

                    // Draw hexagonal cell
                    microscopeCtx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI / 3);
                        const px = x + cellSize * Math.cos(angle);
                        const py = y + cellSize * Math.sin(angle);
                        if (i === 0) microscopeCtx.moveTo(px, py);
                        else microscopeCtx.lineTo(px, py);
                    }
                    microscopeCtx.closePath();
                    microscopeCtx.fill();
                    microscopeCtx.stroke();
                }
            }
        }

        // Chloroplasts (green dots inside cells)
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * 2 * Math.PI;
            const dist = 40 + i * 8;
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);

            if (Math.hypot(x - cx, y - cy) < 180) {
                const alpha = 0.5 - Math.abs(focus - 0.5) * 0.2;
                microscopeCtx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
                microscopeCtx.beginPath();
                microscopeCtx.arc(x, y, 4, 0, 2 * Math.PI);
                microscopeCtx.fill();
            }
        }
    }

    function drawFabricCells(cx, cy, r, mag, focus) {
        // Textile fibers pattern
        const fiberSpacing = (mag / 20) * 10;
        const fiberLength = 40;

        // Warp fibers (vertical)
        microscopeCtx.strokeStyle = `rgba(200, 150, 100, ${0.5 - Math.abs(focus - 0.5) * 0.15})`;
        microscopeCtx.lineWidth = 3;
        for (let i = -4; i <= 4; i++) {
            microscopeCtx.beginPath();
            microscopeCtx.moveTo(cx + i * fiberSpacing, cy - fiberLength);
            microscopeCtx.lineTo(cx + i * fiberSpacing, cy + fiberLength);
            microscopeCtx.stroke();
        }

        // Weft fibers (horizontal)
        microscopeCtx.strokeStyle = `rgba(180, 130, 80, ${0.5 - Math.abs(focus - 0.5) * 0.15})`;
        for (let j = -4; j <= 4; j++) {
            microscopeCtx.beginPath();
            microscopeCtx.moveTo(cx - fiberLength, cy + j * fiberSpacing);
            microscopeCtx.lineTo(cx + fiberLength, cy + j * fiberSpacing);
            microscopeCtx.stroke();
        }

        // Fiber texture (cross pattern)
        microscopeCtx.strokeStyle = `rgba(150, 100, 50, ${0.3 - Math.abs(focus - 0.5) * 0.1})`;
        microscopeCtx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
            for (let j = -3; j <= 3; j++) {
                const x = cx + i * fiberSpacing;
                const y = cy + j * fiberSpacing;
                microscopeCtx.beginPath();
                microscopeCtx.moveTo(x - 2, y - 2);
                microscopeCtx.lineTo(x + 2, y + 2);
                microscopeCtx.stroke();
            }
        }
    }

    function drawAnimalCell(cx, cy, r, mag, focus) {
        const cellRadius = (mag / 20) * 40;
        const alpha = 0.5 - Math.abs(focus - 0.5) * 0.2;

        // Cell membrane
        microscopeCtx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
        microscopeCtx.lineWidth = 2;
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx, cy, cellRadius, 0, 2 * Math.PI);
        microscopeCtx.stroke();

        // Cytoplasm
        microscopeCtx.fillStyle = `rgba(200, 230, 255, ${alpha * 0.2})`;
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx, cy, cellRadius, 0, 2 * Math.PI);
        microscopeCtx.fill();

        // Nucleus
        const nucleusRadius = cellRadius * 0.35;
        microscopeCtx.fillStyle = `rgba(150, 100, 200, ${alpha})`;
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx - 15, cy, nucleusRadius, 0, 2 * Math.PI);
        microscopeCtx.fill();

        microscopeCtx.strokeStyle = `rgba(100, 50, 150, ${alpha})`;
        microscopeCtx.lineWidth = 1.5;
        microscopeCtx.stroke();

        // Nucleolus
        microscopeCtx.fillStyle = `rgba(200, 100, 100, ${alpha})`;
        microscopeCtx.beginPath();
        microscopeCtx.arc(cx - 15, cy, nucleusRadius * 0.3, 0, 2 * Math.PI);
        microscopeCtx.fill();

        // Mitochondria (scattered)
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * 2 * Math.PI;
            const dist = cellRadius * 0.6;
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);

            microscopeCtx.fillStyle = `rgba(255, 150, 100, ${alpha})`;
            microscopeCtx.beginPath();
            microscopeCtx.ellipse(x, y, 6, 3, angle, 0, 2 * Math.PI);
            microscopeCtx.fill();
        }

        // Ribosomes (small dots)
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const dist = Math.random() * cellRadius * 0.8;
            const x = cx + dist * Math.cos(angle);
            const y = cy + dist * Math.sin(angle);

            microscopeCtx.fillStyle = `rgba(100, 200, 100, ${alpha})`;
            microscopeCtx.beginPath();
            microscopeCtx.arc(x, y, 2, 0, 2 * Math.PI);
            microscopeCtx.fill();
        }
    }

    magnSlider.addEventListener('input', () => {
        magnVal.textContent = magnSlider.value + '×';
        drawMicroscopeView();
    });

    focusSlider.addEventListener('input', () => {
        focusVal.textContent = focusSlider.value + '%';
        drawMicroscopeView();
    });

    sampleSelect.addEventListener('change', drawMicroscopeView);

    drawMicroscopeView();

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
