/**
 * montecarlo.js - Piattaforma MFI
 * Gestione delle simulazioni Monte Carlo per Area e Pi Greco in sezioni separate.
 */

class MonteCarloSim {
    constructor(canvasId, statsIds, mode) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Ottimizzazione
        this.statsIds = statsIds;
        this.mode = mode;
        this.total = 0;
        this.hits = 0;
        this.isRunning = false;
        this.errorHistory = [];
        this.lakePath = null;
        this.target = (mode === 'PI') ? Math.PI : 0.3524;
        
        this.init();
    }

    init() {
        // Redraw on resize handled by window listener
        this.resize();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = 350;
        if (this.mode === 'LAKE') this.createLakePath();
        this.draw();
        this.updateUI();
    }

    createLakePath() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.lakePath = new Path2D();
        this.lakePath.moveTo(w * 0.25, h * 0.3);
        this.lakePath.bezierCurveTo(w * 0.1, h * 0.5, w * 0.25, h * 0.85, w * 0.5, h * 0.7);
        this.lakePath.bezierCurveTo(w * 0.75, h * 0.8, w * 0.9, h * 0.5, w * 0.7, h * 0.25);
        this.lakePath.bezierCurveTo(w * 0.5, h * 0.1, w * 0.35, h * 0.2, w * 0.25, h * 0.3);
    }

    drop(count) {
        for (let i = 0; i < count; i++) {
            let x, y, hit;
            if (this.mode === 'LAKE') {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
                // Verifichiamo se il punto è nel lago
                hit = this.ctx.isPointInPath(this.lakePath, x, y);
            } else {
                const r = Math.min(this.canvas.width, this.canvas.height) / 2 - 20;
                const cx = this.canvas.width / 2;
                const cy = this.canvas.height / 2;
                // Estrazione nel quadrato circoscritto
                x = Math.random() * (r * 2) + (cx - r);
                y = Math.random() * (r * 2) + (cy - r);
                const dx = x - cx;
                const dy = y - cy;
                hit = (dx * dx + dy * dy) <= r * r;
            }

            if (hit) this.hits++;
            this.total++;
            this.drawPoint(x, y, hit);
        }

        if (this.mode === 'PI') {
            const currentEst = (4 * this.hits) / this.total;
            this.errorHistory.push(Math.abs(currentEst - Math.PI) / Math.PI);
            if (this.errorHistory.length > 500) this.errorHistory.shift();
        }
        this.updateUI();
    }

    drawPoint(x, y, hit) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        this.ctx.fillStyle = hit ? (this.mode === 'PI' ? "#EF4444" : "#3B82F6") : "rgba(255,255,255,0.3)";
        this.ctx.fill();
    }

    updateUI() {
        document.getElementById(this.statsIds.n).textContent = this.total.toLocaleString();
        document.getElementById(this.statsIds.h).textContent = this.hits.toLocaleString();
        
        const resultEl = document.getElementById(this.statsIds.result);
        if (this.total > 0) {
            if (this.mode === 'PI') {
                const piVal = (4 * this.hits) / this.total;
                resultEl.textContent = piVal.toFixed(5);
                const errVal = document.getElementById(this.statsIds.error);
                if (errVal) {
                    const err = Math.abs(piVal - Math.PI) / Math.PI * 100;
                    errVal.textContent = err.toFixed(3) + "%";
                }
                this.drawErrorPlot();
            } else {
                const ratio = (this.hits / this.total) * 100;
                resultEl.textContent = ratio.toFixed(2) + "%";
            }
        }
    }

    draw() {
        if (this.total === 0) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Black background since alpha:false for optimization
            this.ctx.fillStyle = "#0b0f19"; 
            this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

            if (this.mode === 'LAKE') {
                this.ctx.fillStyle = "rgba(59,130,246,0.15)";
                this.ctx.strokeStyle = "#3B82F6";
                this.ctx.lineWidth = 2;
                this.ctx.fill(this.lakePath);
                this.ctx.stroke(this.lakePath);
            } else {
                const cx = this.canvas.width / 2;
                const cy = this.canvas.height / 2;
                const r = Math.min(this.canvas.width, this.canvas.height) / 2 - 20;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
                this.ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
                this.ctx.strokeStyle = "#EF4444";
                this.ctx.lineWidth = 2;
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.strokeStyle = "rgba(255,255,255,0.15)";
                this.ctx.strokeRect(cx - r, cy - r, r * 2, r * 2);
            }
        }
    }

    drawErrorPlot() {
        const eCanvas = document.getElementById('pi-error-canvas');
        if (!eCanvas) return;
        const eCtx = eCanvas.getContext('2d');
        eCanvas.width = eCanvas.parentElement.clientWidth;
        eCanvas.height = 100;
        
        if (this.errorHistory.length < 2) return;
        
        eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);
        eCtx.beginPath();
        eCtx.strokeStyle = "#EF4444";
        eCtx.lineWidth = 2;
        
        const step = eCanvas.width / (this.errorHistory.length - 1);
        this.errorHistory.forEach((e, i) => {
            const x = i * step;
            // No amplification: error is mapped to [0, 1] on a reasonable scale
            const y = eCanvas.height - Math.min(1, e * 15) * (eCanvas.height - 20) - 10;
            if (i === 0) eCtx.moveTo(x, y);
            else eCtx.lineTo(x, y);
        });
        eCtx.stroke();
    }

    toggleRun() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById(this.statsIds.runBtn);
        btn.textContent = this.isRunning ? "Ferma" : "Esegui Continuo";
        btn.style.background = this.isRunning ? "#EF4444" : "#10B981";
        if (this.isRunning) this.loop();
    }

    loop() {
        if (this.isRunning) {
            this.drop(50); // Incremento veloce per raggiungere grandi N rapidamente
            requestAnimationFrame(() => this.loop());
        }
    }

    reset() {
        this.total = 0;
        this.hits = 0;
        this.isRunning = false;
        this.errorHistory = [];
        const btn = document.getElementById(this.statsIds.runBtn);
        if (btn) {
            btn.textContent = "Esegui Continuo";
            btn.style.background = "#10B981";
        }
        this.draw();
        this.updateUI();
    }
}

let lakeSim, piSim;

document.addEventListener('DOMContentLoaded', () => {
    lakeSim = new MonteCarloSim('lake-canvas', {
        n: 'lake-n', 
        h: 'lake-h', 
        result: 'lake-result', 
        runBtn: 'btn-lake-run'
    }, 'LAKE');

    piSim = new MonteCarloSim('pi-canvas', {
        n: 'pi-n', 
        h: 'pi-h', 
        result: 'pi-result', 
        error: 'pi-error', 
        runBtn: 'btn-pi-run'
    }, 'PI');

    window.addEventListener('resize', () => {
        if(lakeSim) lakeSim.resize();
        if(piSim) piSim.resize();
    });
});
