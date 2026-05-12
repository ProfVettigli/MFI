// ========== MASSIMI E MINIMI ==========

const MassimiMinimiApp = {
  a: 1, b: 0, c: 0,
  boxX: 1.5,

  init() {
    this.setupParabola();
    this.setupBox();
    this.setupQuiz();
  },

  setupParabola() {
    const aSlider = document.getElementById('para-a');
    const bSlider = document.getElementById('para-b');
    const cSlider = document.getElementById('para-c');
    const aVal = document.getElementById('para-a-val');
    const bVal = document.getElementById('para-b-val');
    const cVal = document.getElementById('para-c-val');

    const updateParabola = () => {
      this.a = parseFloat(aSlider.value);
      this.b = parseFloat(bSlider.value);
      this.c = parseFloat(cSlider.value);
      aVal.textContent = this.a.toFixed(1);
      bVal.textContent = this.b.toFixed(1);
      cVal.textContent = this.c.toFixed(1);
      this.drawParabola();
    };

    [aSlider, bSlider, cSlider].forEach(s => s.addEventListener('input', updateParabola));
    this.drawParabola();
  },

  drawParabola() {
    const canvas = document.getElementById('parabola-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 40;

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

    // Parabola: y = ax^2 + bx + c
    const fn = (x) => this.a*x*x + this.b*x + this.c;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = -3; px <= 3; px += 0.05) {
      const fy = fn(px);
      if (Math.abs(fy) < 6) {
        const sx = cx + px*scale;
        const sy = cy - fy*scale;
        if (px === -3) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // Vertex (critical point)
    const xv = -this.b / (2*this.a);
    const yv = fn(xv);

    if (Math.abs(xv) <= 3 && Math.abs(yv) <= 6) {
      const vx = cx + xv*scale;
      const vy = cy - yv*scale;

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(vx, vy, 6, 0, 2*Math.PI);
      ctx.fill();

      // Vertical line
      ctx.strokeStyle = 'rgba(239,68,68,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Result
    const type = this.a > 0 ? 'minimo' : 'massimo';
    const f2d = 2 * this.a;
    document.getElementById('parabola-result').textContent =
      `Vertice: (${xv.toFixed(2)}, ${yv.toFixed(2)}) · Tipo: ${type} (f''(x) = ${f2d > 0 ? '+' : ''}${f2d.toFixed(1)})`;
  },

  setupBox() {
    const xSlider = document.getElementById('box-x');
    const xVal = document.getElementById('box-x-val');

    xSlider.addEventListener('input', (e) => {
      this.boxX = parseFloat(e.target.value);
      xVal.textContent = this.boxX.toFixed(2);
      this.drawBox();
    });

    this.drawBox();
  },

  drawBox() {
    const canvas = document.getElementById('box-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 20;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // V(x) = x(10-2x)^2
    const fn = (x) => x * Math.pow(10 - 2*x, 2);
    const dfn = (x) => (10-2*x)*(10-6*x); // derivative

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = 0; px <= 5; px += 0.05) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      if (px === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Current point
    const vy = fn(this.boxX);
    const vx = cx + this.boxX*scale;
    const vy_y = cy - vy*scale;

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(vx, vy_y, 5, 0, 2*Math.PI);
    ctx.fill();

    // Find maximum (approximately)
    let maxV = 0, maxX = 1.5;
    for (let t = 0.1; t < 5; t += 0.1) {
      const v = fn(t);
      if (v > maxV) { maxV = v; maxX = t; }
    }

    const max_vx = cx + maxX*scale;
    const max_vy = cy - maxV*scale;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(max_vx, max_vy, 4, 0, 2*Math.PI);
    ctx.fill();

    document.getElementById('box-result').textContent =
      `Volume massimo ≈ ${maxV.toFixed(1)} a x ≈ ${maxX.toFixed(2)} · Tuo: V(${this.boxX.toFixed(2)}) = ${vy.toFixed(1)}`;
  },

  setupQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizzes = [
      { q: "Un punto critico è dove...", opts: ["f=0", "f'=0", "f''=0", "f è continua"], ans: 1 },
      { q: "Se \\(f'\\) cambia da + a −, è un...", opts: ["minimo", "massimo", "flesso", "asintoto"], ans: 1 },
      { q: "\\(f''(x) > 0\\) significa che la curva è...", opts: ["concava (∪)", "convessa (∩)", "lineare", "discontinua"], ans: 0 },
      { q: "Per \\(y = 3x^2 - 6x + 2\\), il vertice è a x =", opts: ["0", "1", "2", "-1"], ans: 1 },
      { q: "Il test della derivata seconda dice che se \\(f'(c)=0\\) e \\(f''(c)>0\\), allora c è...", opts: ["massimo", "minimo", "flesso", "discontinuo"], ans: 1 },
      { q: "La derivata segunda misura...", opts: ["la pendenza", "la concavità", "il volume", "l'area"], ans: 1 },
      { q: "In un problema di ottimizzazione, il massimo può trovarsi...", opts: ["solo in punti critici", "sui bordi dell'intervallo", "in punti critici o sui bordi", "ovunque"], ans: 2 },
      { q: "Se \\(f'(c) = 0\\) ma \\(f'\\) non cambia segno, c è un...", opts: ["massimo", "minimo", "punto di flesso", "asintoto"], ans: 2 }
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

document.addEventListener('DOMContentLoaded', () => MassimiMinimiApp.init());
