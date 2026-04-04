/**
 * Lab: Metodo di Cramer
 * Interactive Flowchart and System Solver
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. INTERACTIVE SOLVER
       ======================================================== */
    const solveBtn = document.getElementById('solve-btn');
    const output = document.getElementById('cramer-output');

    if (solveBtn) {
        solveBtn.addEventListener('click', () => {
            const a1 = parseFloat(document.getElementById('a1').value);
            const b1 = parseFloat(document.getElementById('b1').value);
            const c1 = parseFloat(document.getElementById('c1').value);
            const a2 = parseFloat(document.getElementById('a2').value);
            const b2 = parseFloat(document.getElementById('b2').value);
            const c2 = parseFloat(document.getElementById('c2').value);

            if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
                output.innerHTML = '<span style="color:#ef4444;">⚠ Inserisci numeri validi in tutti i campi</span>';
                return;
            }

            const D = a1 * b2 - a2 * b1;
            const Dx = c1 * b2 - c2 * b1;
            const Dy = a1 * c2 - a2 * c1;

            let resultHtml = `D = ${D.toFixed(3)}, Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}<br>`;

            if (D !== 0) {
                const x = Dx / D;
                const y = Dy / D;
                resultHtml += `<strong style="color:#10b981;">✔ Soluzione unica: x = ${x.toFixed(3)}, y = ${y.toFixed(3)}</strong>`;
            } else {
                if (Dx === 0 && Dy === 0) {
                    resultHtml += `<strong style="color:#f59e0b;">⭐ Sistema Indeterminato (infinite soluzioni)</strong>`;
                } else {
                    resultHtml += `<strong style="color:#ef4444;">❌ Sistema Impossibile (nessuna soluzione)</strong>`;
                }
            }

            output.innerHTML = resultHtml;
            output.style.animation = 'none';
            output.offsetHeight;
            output.style.animation = 'fadeIn 0.4s ease';
        });
    }

    /* ========================================================
       2. FLOWCHART CANVAS
       ======================================================== */
    const flowCanvas = document.getElementById('flowchart-canvas');
    if (flowCanvas) {
        const ctx = flowCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            const rect = flowCanvas.parentElement.getBoundingClientRect();
            const w = Math.min(rect.width - 20, 550);
            flowCanvas.width = w * dpr;
            flowCanvas.height = 750 * dpr;
            flowCanvas.style.width = w + 'px';
            flowCanvas.style.height = '750px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawFlowchart();
        }

        function drawFlowchart() {
            const w = flowCanvas.width / dpr;
            ctx.clearRect(0, 0, w, 750);
            const cx = w / 2;

            function roundRect(x, y, rw, rh, r, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + rw - r, y);
                ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
                ctx.lineTo(x + rw, y + rh - r);
                ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
                ctx.lineTo(x + r, y + rh);
                ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function diamond(dcx, dcy, dw, dh, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(dcx, dcy - dh / 2);
                ctx.lineTo(dcx + dw / 2, dcy);
                ctx.lineTo(dcx, dcy + dh / 2);
                ctx.lineTo(dcx - dw / 2, dcy);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function oval(ocx, ocy, orw, orh, fill, stroke) {
                ctx.beginPath();
                ctx.ellipse(ocx, ocy, orw, orh, 0, 0, Math.PI * 2);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function arrow(x1, y1, x2, y2, color) {
                ctx.strokeStyle = color || '#94A3B8';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4));
                ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4));
                ctx.closePath();
                ctx.fillStyle = color || '#94A3B8';
                ctx.fill();
            }

            function text(str, tx, ty, color, size, align) {
                ctx.fillStyle = color || '#F8FAFC';
                ctx.font = `${size || 12}px Inter, sans-serif`;
                ctx.textAlign = align || 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(str, tx, ty);
            }

            // INIZIO
            oval(cx, 40, 50, 20, 'rgba(16,185,129,0.2)', '#10B981');
            text('INIZIO', cx, 40, '#10B981', 13);
            arrow(cx, 60, cx, 90);

            // INPUT
            roundRect(cx - 90, 90, 180, 45, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('LEGGI I COEFFICIENTI', cx, 105, '#fff', 11);
            text('a1, b1, c1, a2, b2, c2', cx, 122, '#fff', 10);
            arrow(cx, 135, cx, 165);

            // CALCOLO
            roundRect(cx - 100, 165, 200, 60, 8, 'rgba(168,85,247,0.15)', '#a855f7');
            text('CALCOLA I DETERMINANTI', cx, 185, '#fff', 11);
            text('D, Dx, Dy', cx, 205, '#fff', 12);
            arrow(cx, 225, cx, 260);

            // DECISIONE: D != 0?
            diamond(cx, 310, 160, 70, 'rgba(245,158,11,0.15)', '#f59e0b');
            text('D ≠ 0 ?', cx, 310, '#f59e0b', 13);

            // SÌ -> SOLUZIONE UNICA (DESTRA)
            const rightBranchX = cx + 160;
            arrow(cx + 80, 310, rightBranchX, 310, '#10b981');
            text('SÌ', cx + 110, 295, '#10b981', 12);
            arrow(rightBranchX, 310, rightBranchX, 350, '#10b981');
            roundRect(rightBranchX - 85, 350, 170, 70, 8, 'rgba(16,185,129,0.15)', '#10b981');
            text('x = Dx / D', rightBranchX, 375, '#fff', 12);
            text('y = Dy / D', rightBranchX, 395, '#fff', 12);
            arrow(rightBranchX, 420, rightBranchX, 640, '#94A3B8');
            ctx.strokeStyle = '#94A3B8'; ctx.beginPath(); ctx.moveTo(rightBranchX, 640); ctx.lineTo(cx, 640); ctx.stroke();

            // NO -> Dx/Dy (GIÙ)
            arrow(cx, 345, cx, 390, '#ef4444');
            text('NO', cx + 25, 365, '#ef4444', 12);
            diamond(cx, 440, 180, 75, 'rgba(239,68,68,0.15)', '#ef4444');
            text('Dx = 0 E Dy = 0 ?', cx, 440, '#ef4444', 12);

            // SÌ -> INDETERMINATO (SINISTRA)
            const leftBranchX = cx - 180;
            arrow(cx - 90, 440, leftBranchX, 440, '#10b981');
            text('SÌ', cx - 130, 425, '#10b981', 12);
            arrow(leftBranchX, 440, leftBranchX, 490, '#10b981');
            roundRect(leftBranchX - 85, 490, 170, 50, 8, 'rgba(16,185,129,0.15)', '#10b981');
            text('SISTEMA INDETERMINATO', leftBranchX, 515, '#fff', 11);
            arrow(leftBranchX, 540, leftBranchX, 640, '#94A3B8');
            ctx.strokeStyle = '#94A3B8'; ctx.beginPath(); ctx.moveTo(leftBranchX, 640); ctx.lineTo(cx, 640); ctx.stroke();

            // NO -> IMPOSSIBILE (GIÙ)
            arrow(cx, 477, cx, 540, '#ef4444');
            text('NO', cx + 25, 510, '#ef4444', 12);
            roundRect(cx - 85, 540, 170, 50, 8, 'rgba(239,68,68,0.15)', '#ef4444');
            text('SISTEMA IMPOSSIBILE', cx, 565, '#fff', 11);
            arrow(cx, 590, cx, 640, '#94A3B8');

            // FINE
            arrow(cx, 640, cx, 680);
            oval(cx, 705, 55, 25, 'rgba(16,185,129,0.2)', '#10B981');
            text('FINE', cx, 705, '#10B981', 14);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
});
