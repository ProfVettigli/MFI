// ========== INTEGRALI ==========

const IntegraliApp = {
  currentFunc: 'quad',
  riemannN: 10,
  areaA: -1,
  areaB: 2,

  functions: {
    quad: { f: x => x*x, F: x => x*x*x/3, label: 'x²', color: '#3b82f6' },
    sin: { f: x => Math.sin(x), F: x => -Math.cos(x), label: 'sin(x)', color: '#3b82f6' },
    exp: { f: x => Math.exp(x), F: x => Math.exp(x), label: 'e^x', color: '#3b82f6' }
  },

  init() {
    this.setupRiemann();
    this.setupAreaViz();
    this.setupQuiz();
  },

  setupRiemann() {
    const funcPick = document.getElementById('riemann-func-pick');
    const nSlider = document.getElementById('riemann-n');
    const nVal = document.getElementById('riemann-n-val');

    funcPick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        funcPick.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFunc = btn.dataset.fn;
        this.drawRiemann();
      });
    });

    nSlider.addEventListener('input', (e) => {
      this.riemannN = parseInt(e.target.value);
      nVal.textContent = this.riemannN;
      this.drawRiemann();
    });

    this.drawRiemann();
  },

  drawRiemann() {
    const canvas = document.getElementById('riemann-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 3; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const fn = this.functions[this.currentFunc].f;
    const a = 0, b = 2.5;
    const dx = (b - a) / this.riemannN;

    // Riemann rectangles
    let riemannSum = 0;
    ctx.fillStyle = 'rgba(59,130,246,0.4)';
    for (let i = 0; i < this.riemannN; i++) {
      const xi = a + i*dx;
      const val = fn(xi);
      const rect_x = cx + xi*scale;
      const rect_y = cy - val*scale;
      const rect_w = dx*scale;
      const rect_h = val*scale;

      ctx.fillRect(rect_x, rect_y, rect_w, Math.abs(rect_h));
      ctx.strokeStyle = 'rgba(59,130,246,0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(rect_x, rect_y, rect_w, Math.abs(rect_h));

      riemannSum += val * dx;
    }

    // Function curve
    ctx.strokeStyle = this.functions[this.currentFunc].color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = a; px <= b; px += 0.02) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      if (px === a) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    // True area (integral)
    const F = this.functions[this.currentFunc].F;
    const trueArea = F(b) - F(a);

    document.getElementById('riemann-result').textContent =
      `Area (Riemann) ≈ ${riemannSum.toFixed(3)} · Area vera ≈ ${trueArea.toFixed(3)}`;
  },

  setupAreaViz() {
    const aSlider = document.getElementById('area-a');
    const bSlider = document.getElementById('area-b');
    const aVal = document.getElementById('area-a-val');
    const bVal = document.getElementById('area-b-val');

    [aSlider, bSlider].forEach(s => {
      s.addEventListener('input', () => {
        this.areaA = parseFloat(aSlider.value);
        this.areaB = parseFloat(bSlider.value);
        aVal.textContent = this.areaA.toFixed(1);
        bVal.textContent = this.areaB.toFixed(1);
        this.drawArea();
      });
    });

    this.drawArea();
  },

  drawArea() {
    const canvas = document.getElementById('area-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 4; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Function: x^2 (for simplicity)
    const fn = (x) => x*x;
    const F = (x) => x*x*x/3;

    // Shaded area
    ctx.fillStyle = 'rgba(59,130,246,0.3)';
    ctx.beginPath();
    ctx.moveTo(cx + this.areaA*scale, cy);
    for (let px = this.areaA; px <= this.areaB; px += 0.05) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      ctx.lineTo(sx, sy);
    }
    ctx.lineTo(cx + this.areaB*scale, cy);
    ctx.closePath();
    ctx.fill();

    // Curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = -2; px <= 3; px += 0.05) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      if (px === -2) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    // Vertical lines at endpoints
    ctx.strokeStyle = 'rgba(59,130,246,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + this.areaA*scale, 0);
    ctx.lineTo(cx + this.areaA*scale, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + this.areaB*scale, 0);
    ctx.lineTo(cx + this.areaB*scale, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate area
    const area = F(this.areaB) - F(this.areaA);
    document.getElementById('area-result').textContent =
      `Area = ∫ x² dx from ${this.areaA.toFixed(1)} to ${this.areaB.toFixed(1)} = ${area.toFixed(3)} · Teorema: F(${this.areaB.toFixed(1)}) - F(${this.areaA.toFixed(1)}) = ${area.toFixed(3)}`;
  },

  setupQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizzes = [
      { q: "L'integrale definito \\(\\int_a^b f(x) dx\\) rappresenta...", opts: ["la derivata", "l'area sotto la curva", "la pendenza", "il volume"], ans: 1 },
      { q: "La somma di Riemann approssima l'area usando...", opts: ["triangoli", "rettangoli", "cerchi", "trapezi"], ans: 1 },
      { q: "Il Teorema Fondamentale del Calcolo dice che derivata e integrale sono...", opts: ["uguali", "operazioni inverse", "complementari", "indefiniti"], ans: 1 },
      { q: "Una primitiva di \\(x^3\\) è...", opts: ["x⁴", "x⁴/4", "3x²", "1/4 x⁴"], ans: 3 },
      { q: "\\(\\int_1^2 x^2 dx = ?\\) usando il Teorema Fondamentale", opts: ["1/3", "7/3", "8/3", "2"], ans: 2 },
      { q: "La sostituzione \\(u = g(x)\\) si usa quando...", opts: ["la funzione è razionale", "hai una composizione di funzioni", "la primitiva è nota", "l'integrale è divergente"], ans: 1 },
      { q: "L'integrazione per parti \\(\\int u dv = uv - \\int v du\\) è utile quando...", opts: ["hai una somma", "hai un prodotto di funzioni diverse", "la funzione è polinomiale", "l'intervallo è infinito"], ans: 1 },
      { q: "\\(\\int e^x dx = ?\\)", opts: ["e^(x+1)", "e^x + C", "x e^x", "1 + C"], ans: 1 }
    ];

    quizArea.innerHTML = quizzes.map((quiz, i) => `
      <div style="margin-bottom:2rem; padding:1.5rem; background:rgba(255,255,255,0.02); border-radius:10px; border-left:3px solid var(--math-color);">
        <p style="margin-bottom:1rem; color:var(--text-main);">
          <strong>Q${i+1}.</strong> ${quiz.q}
        </p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${quiz.opts.map((opt, j) => `
            <label style="cursor:pointer; display:flex; align-items:center; padding:0.5rem;">
              <input type="radio" name="q${i}" value="${j}" style="cursor:pointer; margin-right:0.5rem;">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Controlla Risposte';
    submitBtn.style.cssText = 'background:var(--math-color);color:white;border:none;padding:0.8rem 2rem;border-radius:8px;cursor:pointer;font-weight:700;margin-bottom:2rem;';
    quizArea.parentNode.insertBefore(submitBtn, document.getElementById('quiz-score'));

    submitBtn.addEventListener('click', () => {
      let score = 0;
      quizzes.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (sel && parseInt(sel.value) === q.ans) score++;
      });
      document.getElementById('quiz-score').textContent =
        `Risultato: ${score}/${quizzes.length} corretto!`;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => IntegraliApp.init());
