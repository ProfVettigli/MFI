// ========== DERIVATE E TEOREMI ==========

const DerivateApp = {
  currentFunc: 'quad',
  currentX: 1,

  functions: {
    quad: { f: x => x*x, df: x => 2*x, label: 'x²', color: '#3b82f6' },
    cube: { f: x => x*x*x, df: x => 3*x*x, label: 'x³', color: '#3b82f6' },
    sin: { f: x => Math.sin(x), df: x => Math.cos(x), label: 'sin(x)', color: '#3b82f6' },
    exp: { f: x => Math.exp(x), df: x => Math.exp(x), label: 'e^x', color: '#3b82f6' }
  },

  init() {
    this.setupDerivativeViz();
    this.setupRolleViz();
    this.setupQuiz();
  },

  setupDerivativeViz() {
    const funcPick = document.getElementById('deriv-func-pick');
    const xSlider = document.getElementById('deriv-x');
    const xVal = document.getElementById('deriv-x-val');
    const canvas = document.getElementById('deriv-canvas');
    const resultDiv = document.getElementById('deriv-val-result');
    const tangDiv = document.getElementById('tang-eq');

    funcPick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        funcPick.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFunc = btn.dataset.fn;
        this.drawDerivative();
      });
    });

    xSlider.addEventListener('input', (e) => {
      this.currentX = parseFloat(e.target.value);
      xVal.textContent = this.currentX.toFixed(2);
      this.drawDerivative();
    });

    this.drawDerivative();
  },

  drawDerivative() {
    const canvas = document.getElementById('deriv-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Function curve
    const fn = this.functions[this.currentFunc];
    ctx.strokeStyle = fn.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = -3; px <= 3; px += 0.02) {
      const fy = fn.f(px);
      if (Math.abs(fy) < 5) {
        const sx = cx + px*scale;
        const sy = cy - fy*scale;
        if (px === -3) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // Point on curve
    const fy = fn.f(this.currentX);
    const px = cx + this.currentX*scale;
    const py = cy - fy*scale;

    ctx.fillStyle = fn.color;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2*Math.PI);
    ctx.fill();

    // Tangent line
    const slope = fn.df(this.currentX);
    const b = fy - slope * this.currentX;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const x1 = -3, y1 = slope * x1 + b;
    const x2 = 3, y2 = slope * x2 + b;
    ctx.moveTo(cx + x1*scale, cy - y1*scale);
    ctx.lineTo(cx + x2*scale, cy - y2*scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update result
    document.getElementById('deriv-val-result').textContent = slope.toFixed(3);
    const eqStr = `y = ${slope.toFixed(2)}x ${(b >= 0 ? '+' : '')} ${b.toFixed(2)}`;
    document.getElementById('tang-eq').textContent = eqStr;
  },

  setupRolleViz() {
    const aSlider = document.getElementById('rolle-a');
    const bSlider = document.getElementById('rolle-b');
    const aVal = document.getElementById('rolle-a-val');
    const bVal = document.getElementById('rolle-b-val');
    const canvas = document.getElementById('rolle-canvas');

    [aSlider, bSlider].forEach(s => {
      s.addEventListener('input', () => {
        this.currentA = parseFloat(aSlider.value);
        this.currentB = parseFloat(bSlider.value);
        aVal.textContent = this.currentA.toFixed(1);
        bVal.textContent = this.currentB.toFixed(1);
        this.drawRolle();
      });
    });

    this.currentA = -2;
    this.currentB = 2;
    this.drawRolle();
  },

  drawRolle() {
    const canvas = document.getElementById('rolle-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Function: x^3 - 3x
    const fn = (x) => x*x*x - 3*x;
    const dfn = (x) => 3*x*x - 3;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = -3; px <= 3; px += 0.02) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      if (px === -3) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Endpoints
    const fa = fn(this.currentA);
    const fb = fn(this.currentB);
    const paX = cx + this.currentA*scale;
    const paY = cy - fa*scale;
    const pbX = cx + this.currentB*scale;
    const pbY = cy - fb*scale;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(paX, paY, 5, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(pbX, pbY, 5, 0, 2*Math.PI); ctx.fill();

    // Secant line
    const slopeAvg = (fb - fa) / (this.currentB - this.currentA);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const y1 = fa + slopeAvg * (this.currentA - this.currentA);
    const y2 = fa + slopeAvg * (this.currentB - this.currentA);
    ctx.moveTo(paX, paY);
    ctx.lineTo(pbX, pbY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Find c where f'(c) = slopeAvg (Lagrange)
    let cFound = null;
    for (let t = this.currentA + 0.01; t < this.currentB; t += 0.01) {
      if (Math.abs(dfn(t) - slopeAvg) < 0.05) {
        cFound = t;
        break;
      }
    }

    if (cFound !== null) {
      const fc = fn(cFound);
      const pcX = cx + cFound*scale;
      const pcY = cy - fc*scale;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pcX, pcY, 4, 0, 2*Math.PI);
      ctx.fill();

      // Tangent at c
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const t1 = -3, y1t = fc + slopeAvg * (t1 - cFound);
      const t2 = 3, y2t = fc + slopeAvg * (t2 - cFound);
      ctx.moveTo(cx + t1*scale, cy - y1t*scale);
      ctx.lineTo(cx + t2*scale, cy - y2t*scale);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    document.getElementById('rolle-result').textContent =
      `Pendenza media = ${slopeAvg.toFixed(3)} · Punto critico c = ${cFound ? cFound.toFixed(2) : '?'}`;
  },

  setupQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizzes = [
      { q: "Qual è la derivata di \\(3x^4\\)?", opts: ["12x³", "3x³", "12x⁴", "x³"], ans: 0 },
      { q: "La derivata misura...", opts: ["l'area", "la pendenza", "il volume", "il tempo"], ans: 1 },
      { q: "Se \\(f'(x) = 0\\) nel punto c, allora c è...", opts: ["uno zero", "un punto critico", "un asintoto", "indefinito"], ans: 1 },
      { q: "\\((e^x)' = ?\\)", opts: ["x·e^(x-1)", "e^x", "1", "0"], ans: 1 },
      { q: "La regola del prodotto: \\((fg)' = ?\\)", opts: ["f'g'", "f'g + fg'", "f+g'", "fg"], ans: 1 },
      { q: "Il Teorema di Lagrange garantisce l'esistenza di \\(c\\) dove...", opts: ["f(c)=0", "f'(c)=pendenza media", "f(c)=max", "f'(c)=1"], ans: 1 },
      { q: "\\(\\sin'(x) = ?\\)", opts: ["cos(x)", "-cos(x)", "sin(x)", "tan(x)"], ans: 0 },
      { q: "Una tangente orizzontale indica che...", opts: ["f cresce", "f decresce", "f ha velocità 0", "f è discontinua"], ans: 2 }
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

document.addEventListener('DOMContentLoaded', () => DerivateApp.init());
