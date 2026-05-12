// ========== LIMITI E CONTINUITÀ ==========

const LimitiApp = {
  currentFunc: 'poly',
  currentC: 1,
  ratA: 2, ratB: 1, ratC: 1, ratD: -2,
  bisA: 1, bisB: 3, bisStep: 0,

  functions: {
    poly: { f: x => x*x - 1, label: 'x² - 1', color: '#3b82f6' },
    hole: { f: x => x === 1 ? undefined : (x*x - 1)/(x - 1), label: '(x²-1)/(x-1)', color: '#3b82f6' },
    step: { f: x => x > 0 ? 1 : (x < 0 ? -1 : 0), label: 'sign(x)', color: '#3b82f6' },
    abs: { f: x => x === 0 ? undefined : Math.abs(x)/x, label: '|x|/x', color: '#3b82f6' },
    osc: { f: x => x === 0 ? undefined : Math.sin(1/x), label: 'sin(1/x)', color: '#3b82f6' }
  },

  init() {
    this.setupSinTable();
    this.setupLimitExplorer();
    this.setupRationalExplorer();
    this.setupClassification();
    this.setupBisection();
    this.setupQuiz();
  },

  setupSinTable() {
    const tbody = document.querySelector('#sinx-table tbody');
    const values = [0.1, 0.01, 0.001, 0.0001, -0.0001, -0.001, -0.01, -0.1];
    tbody.innerHTML = values.map(x => {
      const val = Math.sin(x)/x;
      return `<tr><td>${x.toFixed(4)}</td><td>${val.toFixed(6)}</td></tr>`;
    }).join('');
  },

  setupLimitExplorer() {
    const funcPick = document.getElementById('limit-func-pick');
    const cSlider = document.getElementById('limit-c');
    const cVal = document.getElementById('limit-c-val');

    funcPick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        funcPick.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFunc = btn.dataset.fn;
        this.drawLimit();
      });
    });

    cSlider.addEventListener('input', (e) => {
      this.currentC = parseFloat(e.target.value);
      cVal.textContent = this.currentC.toFixed(2);
      this.drawLimit();
    });

    this.drawLimit();
  },

  drawLimit() {
    const canvas = document.getElementById('limit-canvas');
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

    const fn = this.functions[this.currentFunc].f;

    // Draw curve (with gaps for discontinuities)
    ctx.strokeStyle = this.functions[this.currentFunc].color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = -3; px <= 3; px += 0.05) {
      const fy = fn(px);
      if (fy !== undefined && Math.abs(fy) < 5) {
        const sx = cx + px*scale;
        const sy = cy - fy*scale;
        if (!started) { ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Mark the point c
    const fc = fn(this.currentC);
    const pc = cx + this.currentC*scale;
    const pyc = fc !== undefined ? cy - fc*scale : 0;

    if (fc !== undefined) {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(pc, pyc, 5, 0, 2*Math.PI);
      ctx.fill();
    } else {
      // Hole for discontinuity
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pc, pyc, 5, 0, 2*Math.PI);
      ctx.stroke();
    }

    // Calculate limit from left and right
    const eps = 0.01;
    const fLeft = fn(this.currentC - eps);
    const fRight = fn(this.currentC + eps);

    let limitStr = '';
    if (fLeft !== undefined && fRight !== undefined) {
      limitStr = `lim(x→${this.currentC.toFixed(1)}⁻) f(x) = ${fLeft.toFixed(3)} · lim(x→${this.currentC.toFixed(1)}⁺) f(x) = ${fRight.toFixed(3)}`;
    } else {
      limitStr = 'Limite non esiste o indefinito';
    }

    document.getElementById('limit-result').textContent = limitStr;
  },

  setupRationalExplorer() {
    [
      { id: 'rat-a', update: 'ratA' },
      { id: 'rat-b', update: 'ratB' },
      { id: 'rat-c', update: 'ratC' },
      { id: 'rat-d', update: 'ratD' }
    ].forEach(({ id, update }) => {
      const slider = document.getElementById(id);
      slider.addEventListener('input', (e) => {
        this[update] = parseFloat(e.target.value);
        document.getElementById(id + '-val').textContent = this[update].toFixed(1);
        this.drawRational();
      });
    });

    this.drawRational();
  },

  drawRational() {
    const canvas = document.getElementById('rat-canvas');
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

    // f(x) = (ax+b)/(cx+d)
    const fn = (x) => this.ratC === 0 ? 0 : (this.ratA*x + this.ratB)/(this.ratC*x + this.ratD);

    // Vertical asymptote at x = -d/c
    const vertAsymX = this.ratC !== 0 ? -this.ratD/this.ratC : null;
    if (vertAsymX !== null && Math.abs(vertAsymX) <= 3) {
      const vx = cx + vertAsymX*scale;
      ctx.strokeStyle = 'rgba(245,158,11,0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      ctx.lineTo(vx, h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Horizontal asymptote at y = a/c
    const horizAsymY = this.ratC !== 0 ? this.ratA/this.ratC : 0;
    if (Math.abs(horizAsymY) <= 3) {
      const hy = cy - horizAsymY*scale;
      ctx.strokeStyle = 'rgba(16,185,129,0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, hy);
      ctx.lineTo(w, hy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let px = -3; px <= 3; px += 0.05) {
      if (vertAsymX !== null && Math.abs(px - vertAsymX) < 0.05) {
        started = false;
        continue;
      }
      const fy = fn(px);
      if (Math.abs(fy) < 6) {
        const sx = cx + px*scale;
        const sy = cy - fy*scale;
        if (!started) { ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Result
    const aVal = `a/c = ${(this.ratA/this.ratC).toFixed(2)}`;
    const vVal = vertAsymX ? `x = ${vertAsymX.toFixed(2)}` : 'nessuno';
    document.getElementById('rat-result').textContent = `Asintoto orizzontale: y = ${(this.ratA/this.ratC).toFixed(2)} · Asintoto verticale: x = ${vVal}`;
  },

  setupClassification() {
    const classifyArea = document.querySelector('#classify-area');
    const problems = [
      { f: x => x > 0 ? 1 : -1, desc: 'f(x) = sign(x)', ans: 'salto' },
      { f: x => 1/x, desc: 'f(x) = 1/x', ans: 'infinito' },
      { f: x => (x*x-4)/(x-2), desc: 'f(x) = (x²-4)/(x-2)', ans: 'rimovibile' }
    ];

    classifyArea.innerHTML = problems.map((p, i) => `
      <div style="margin-bottom:1.5rem; padding:1rem; background:rgba(255,255,255,0.02); border-radius:8px;">
        <p style="margin-bottom:0.5rem; color:var(--text-muted);">${p.desc}</p>
        <div style="display:flex; gap:0.5rem;">
          <label><input type="radio" name="classify${i}" value="salto" style="margin-right:0.3rem;">Salto</label>
          <label><input type="radio" name="classify${i}" value="infinito" style="margin-right:0.3rem;">Infinita</label>
          <label><input type="radio" name="classify${i}" value="rimovibile" style="margin-right:0.3rem;">Rimovibile</label>
        </div>
        <p style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-muted); display:none;" id="feedback${i}"></p>
      </div>
    `).join('');

    classifyArea.parentNode.insertBefore(
      Object.assign(document.createElement('button'), {
        textContent: 'Controlla',
        style: 'background:var(--math-color);color:white;border:none;padding:0.6rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:700;margin-bottom:1rem;'
      }),
      classifyArea.nextSibling
    ).addEventListener('click', () => {
      problems.forEach((p, i) => {
        const sel = document.querySelector(`input[name="classify${i}"]:checked`);
        const feedback = document.getElementById(`feedback${i}`);
        if (sel) {
          const correct = sel.value === p.ans;
          feedback.style.display = 'block';
          feedback.textContent = correct ? '✓ Corretto!' : `✗ Sbagliato. Risposta: ${p.ans}`;
          feedback.style.color = correct ? '#10b981' : '#ef4444';
        }
      });
    });
  },

  setupBisection() {
    const stepBtn = document.getElementById('bis-step');
    const resetBtn = document.getElementById('bis-reset');

    stepBtn.addEventListener('click', () => this.bisectionStep());
    resetBtn.addEventListener('click', () => this.bisectionReset());

    this.bisectionReset();
  },

  bisectionReset() {
    this.bisA = 1;
    this.bisB = 3;
    this.bisStep = 0;
    this.drawBisection();
  },

  bisectionStep() {
    this.bisStep++;
    this.drawBisection();
  },

  drawBisection() {
    const canvas = document.getElementById('bis-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -1; i <= 4; i++) {
      const x = cx + i*scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i*scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // f(x) = x^3 - 2x - 5
    const fn = (x) => x*x*x - 2*x - 5;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let px = -1; px <= 4; px += 0.05) {
      const fy = fn(px);
      const sx = cx + px*scale;
      const sy = cy - fy*scale;
      if (px === -1) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Bisection iterations
    let a = this.bisA, b = this.bisB;
    for (let step = 0; step < this.bisStep && step < 10; step++) {
      const m = (a + b)/2;
      const fa = fn(a), fb = fn(b), fm = fn(m);

      // Draw current interval
      const ax = cx + a*scale;
      const bx = cx + b*scale;
      const mx = cx + m*scale;

      if (step === this.bisStep - 1) {
        // Current iteration: highlight
        ctx.fillStyle = 'rgba(59,130,246,0.2)';
        ctx.fillRect(ax, cy-10, bx-ax, 20);
      }

      ctx.fillStyle = step < 5 ? 'rgba(16,185,129,0.6)' : 'rgba(245,158,11,0.6)';
      ctx.beginPath(); ctx.arc(mx, cy, 3, 0, 2*Math.PI); ctx.fill();

      if (fa * fm < 0) b = m;
      else a = m;
    }

    const final_m = (a + b)/2;
    document.getElementById('bis-result').textContent =
      `Step ${this.bisStep} · a = ${a.toFixed(4)} · b = ${b.toFixed(4)} · m = ${final_m.toFixed(4)}`;
  },

  setupQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizzes = [
      { q: "Un limite esiste quando...", opts: ["f(c) è definita", "i limiti sinistro e destro coincidono", "la curva è continua", "f cresce"], ans: 1 },
      { q: "Se \\(f(c)\\) non esiste ma esiste \\(\\lim_{x \\to c} f(x)\\), la discontinuità è...", opts: ["salto", "infinita", "rimovibile", "nessuna"], ans: 2 },
      { q: "La funzione \\(f(x) = |x|/x\\) è discontinua in \\(x=0\\) di tipo...", opts: ["salto", "infinito", "rimovibile", "continua"], ans: 0 },
      { q: "Un asintoto verticale indica una discontinuità di...", opts: ["salto", "2ª specie", "rimovibile", "flesso"], ans: 1 },
      { q: "Il Teorema dei Valori Intermedi garantisce che...", opts: ["la funzione è derivabile", "esiste almeno uno zero se f(a)·f(b)<0", "la funzione è continua", "il limite esiste sempre"], ans: 1 },
      { q: "\\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = ?\\)", opts: ["0", "1", "indefinito", "infinito"], ans: 1 },
      { q: "Una funzione è continua in c se...", opts: ["f(c) esiste", "il limite esiste", "f(c) = lim f(x)", "la derivata è zero"], ans: 2 },
      { q: "Se \\(\\lim_{x \\to +\\infty} f(x) = 2\\), allora \\(y = 2\\) è...", opts: ["derivata", "asintoto orizzontale", "asintoto verticale", "punto critico"], ans: 1 }
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

document.addEventListener('DOMContentLoaded', () => LimitiApp.init());
