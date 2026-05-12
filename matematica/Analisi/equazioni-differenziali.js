// ========== EQUAZIONI DIFFERENZIALI ==========

const EDOApp = {

  // ── stato pendolo ──────────────────────────────────────────
  pendulum: {
    L: 1.0,
    theta0: 20,        // gradi
    theta: null,       // radianti
    omega: 0,          // velocità angolare
    rafId: null,
    lastTime: null,
    trail: [],         // posizioni recenti della punta
  },

  // ── init principale ────────────────────────────────────────
  init() {
    this.initGrowthSim();
    this.initEulerMethod();
    this.initPendulum();
    this.initQuiz();
  },

  // ══════════════════════════════════════════════════════════
  // 1. CRESCITA / DECADIMENTO ESPONENZIALE
  // ══════════════════════════════════════════════════════════
  initGrowthSim() {
    const kSlider  = document.getElementById('growth-k');
    const n0Slider = document.getElementById('growth-n0');
    const kVal     = document.getElementById('growth-k-val');
    const n0Val    = document.getElementById('growth-n0-val');

    if (!kSlider) return;

    const update = () => {
      const k  = parseFloat(kSlider.value);
      const n0 = parseFloat(n0Slider.value);
      kVal.textContent  = k.toFixed(2);
      n0Val.textContent = n0.toFixed(0);
      this.drawGrowth(k, n0);
    };

    kSlider.addEventListener('input', update);
    n0Slider.addEventListener('input', update);
    update();
  },

  drawGrowth(k, n0) {
    const canvas = document.getElementById('growth-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // --- parametri grafico ---
    const tMax   = 8;           // asse t da 0 a tMax
    const margin = { l: 60, r: 20, t: 30, b: 50 };
    const plotW  = W - margin.l - margin.r;
    const plotH  = H - margin.t - margin.b;

    // Calcola range N
    const Nmax = n0 * Math.exp(k * tMax);
    const Nmin = n0 * Math.exp(k * tMax);  // k<0: il min è a t=tMax
    const yMax = k >= 0 ? Math.max(n0 * Math.exp(k * tMax), n0 * 1.1) : n0 * 1.1;
    const yMin = k < 0  ? Math.min(n0 * Math.exp(k * tMax) * 0.9, 0) : 0;
    const yRange = yMax - yMin || 1;

    const toX = t => margin.l + (t / tMax) * plotW;
    const toY = v => margin.t + plotH - ((v - yMin) / yRange) * plotH;

    // Sfondo zona plot
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(margin.l, margin.t, plotW, plotH);

    // Grid orizzontale
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = margin.t + (i / 5) * plotH;
      ctx.beginPath(); ctx.moveTo(margin.l, y); ctx.lineTo(margin.l + plotW, y); ctx.stroke();
    }
    // Grid verticale
    for (let i = 0; i <= tMax; i++) {
      const x = toX(i);
      ctx.beginPath(); ctx.moveTo(x, margin.t); ctx.lineTo(x, margin.t + plotH); ctx.stroke();
    }

    // Assi
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    // asse x
    ctx.beginPath();
    ctx.moveTo(margin.l, toY(0));
    ctx.lineTo(margin.l + plotW, toY(0));
    ctx.stroke();
    // asse y
    ctx.beginPath();
    ctx.moveTo(margin.l, margin.t);
    ctx.lineTo(margin.l, margin.t + plotH);
    ctx.stroke();

    // Etichette assi
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= tMax; i += 2) {
      ctx.fillText(i, toX(i), margin.t + plotH + 18);
    }
    ctx.textAlign = 'right';
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const v = yMin + (i / steps) * yRange;
      ctx.fillText(v.toFixed(0), margin.l - 6, toY(v) + 4);
    }

    // Label assi
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('t', margin.l + plotW + 14, toY(0) + 4);
    ctx.fillText('N', margin.l - 8, margin.t - 10);

    // Curva N(t) = N0 * e^(kt)
    const color = k >= 0 ? '#3b82f6' : '#f43f5e';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= plotW; px++) {
      const t = (px / plotW) * tMax;
      const v = n0 * Math.exp(k * t);
      const sx = margin.l + px;
      const sy = toY(v);
      if (sy < margin.t - 5 || sy > margin.t + plotH + 5) { first = true; continue; }
      if (first) { ctx.moveTo(sx, sy); first = false; } else { ctx.lineTo(sx, sy); }
    }
    ctx.stroke();

    // Punto iniziale
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(toX(0), toY(n0), 5, 0, Math.PI * 2);
    ctx.fill();

    // Valore a t=tMax
    const nEnd = n0 * Math.exp(k * tMax);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(toX(tMax), toY(nEnd), 4, 0, Math.PI * 2);
    ctx.fill();

    // Label tipo
    const tipo = k >= 0 ? 'Crescita di Popolazione' : 'Decadimento Radioattivo';
    ctx.fillStyle = color;
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(tipo, margin.l + 10, margin.t + 20);

    // Result card
    const resultEl = document.getElementById('growth-result');
    if (resultEl) {
      const nAt4 = n0 * Math.exp(k * 4);
      const t2 = k !== 0 ? Math.abs(Math.log(2) / k) : Infinity;
      const t2Str = isFinite(t2) ? t2.toFixed(2) + ' s' : '∞';
      const metaLabel = k >= 0 ? 'Tempo di raddoppio' : 'Tempo di dimezzamento';
      resultEl.textContent =
        `N(t) = ${n0} · e^(${k.toFixed(2)}·t)   |   N(4) ≈ ${nAt4.toFixed(1)}   |   ${metaLabel} ≈ ${t2Str}`;
    }
  },

  // ══════════════════════════════════════════════════════════
  // 2. METODO DI EULERO vs. SOLUZIONE ESATTA (dy/dx = y)
  // ══════════════════════════════════════════════════════════
  initEulerMethod() {
    const hSlider = document.getElementById('euler-h');
    const hVal    = document.getElementById('euler-h-val');

    if (!hSlider) return;

    const update = () => {
      const h = parseFloat(hSlider.value);
      hVal.textContent = h.toFixed(2);
      this.drawEuler(h);
    };

    hSlider.addEventListener('input', update);
    update();
  },

  drawEuler(h) {
    const canvas = document.getElementById('euler-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const xMax   = 3;
    const margin = { l: 60, r: 30, t: 30, b: 50 };
    const plotW  = W - margin.l - margin.r;
    const plotH  = H - margin.t - margin.b;

    const yMax = Math.exp(xMax) * 1.05;
    const yMin = 0;
    const yRange = yMax - yMin;

    const toX = x => margin.l + (x / xMax) * plotW;
    const toY = y => margin.t + plotH - ((y - yMin) / yRange) * plotH;

    // Sfondo
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(margin.l, margin.t, plotW, plotH);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = margin.t + (i / 5) * plotH;
      ctx.beginPath(); ctx.moveTo(margin.l, y); ctx.lineTo(margin.l + plotW, y); ctx.stroke();
    }
    for (let i = 0; i <= xMax; i++) {
      const x = toX(i);
      ctx.beginPath(); ctx.moveTo(x, margin.t); ctx.lineTo(x, margin.t + plotH); ctx.stroke();
    }

    // Assi
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(margin.l, toY(0)); ctx.lineTo(margin.l + plotW, toY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin.l, margin.t); ctx.lineTo(margin.l, margin.t + plotH); ctx.stroke();

    // Etichette assi
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= xMax; i++) ctx.fillText(i, toX(i), margin.t + plotH + 18);
    ctx.textAlign = 'right';
    const yLabels = [0, 5, 10, 15, 20];
    yLabels.forEach(v => {
      if (v <= yMax) ctx.fillText(v, margin.l - 6, toY(v) + 4);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('x', margin.l + plotW + 14, toY(0) + 4);

    // Soluzione esatta: y = e^x (blu)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= plotW; px++) {
      const x = (px / plotW) * xMax;
      const y = Math.exp(x);
      const sx = margin.l + px;
      const sy = toY(y);
      if (sy < margin.t - 2) { first = true; continue; }
      if (first) { ctx.moveTo(sx, sy); first = false; } else { ctx.lineTo(sx, sy); }
    }
    ctx.stroke();

    // Approssimazione di Eulero: y_{n+1} = y_n + h * y_n (arancione)
    const eulerPoints = [];
    let xE = 0, yE = 1;
    while (xE <= xMax + 1e-9) {
      eulerPoints.push({ x: xE, y: yE });
      yE = yE + h * yE;   // f(x,y) = y
      xE = xE + h;
    }

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    eulerPoints.forEach((pt, i) => {
      const sx = toX(pt.x);
      const sy = toY(pt.y);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Pallini sui nodi di Eulero
    ctx.fillStyle = '#f59e0b';
    eulerPoints.forEach(pt => {
      if (pt.x > xMax + 0.01) return;
      ctx.beginPath();
      ctx.arc(toX(pt.x), toY(pt.y), 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Legenda
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('● Esatta: e^x', margin.l + 10, margin.t + 18);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('● Eulero con h=' + h.toFixed(2), margin.l + 10, margin.t + 36);

    // Errore finale
    const lastPt = eulerPoints.filter(p => p.x <= xMax + h / 2).pop();
    const exact3  = Math.exp(xMax);
    let errorText = '—';
    if (lastPt) {
      // interpola se necessario
      const approxAt3 = lastPt.y * Math.exp((xMax - lastPt.x) * 0); // usiamo il valore al nodo più vicino
      const err = Math.abs(lastPt.y - exact3);
      errorText = err.toFixed(3);
    }

    const resultEl = document.getElementById('euler-result');
    if (resultEl) {
      const closestPt = eulerPoints.reduce((best, pt) =>
        Math.abs(pt.x - xMax) < Math.abs(best.x - xMax) ? pt : best, eulerPoints[0]);
      const errAbs = Math.abs(closestPt.y - exact3);
      const errRel = (errAbs / exact3 * 100).toFixed(1);
      resultEl.textContent =
        `x=3: Esatta = ${exact3.toFixed(3)}  |  Eulero ≈ ${closestPt.y.toFixed(3)}  |  Errore assoluto ≈ ${errAbs.toFixed(3)} (${errRel}%)`;
    }
  },

  // ══════════════════════════════════════════════════════════
  // 3. PENDOLO — animazione con requestAnimationFrame
  // ══════════════════════════════════════════════════════════
  initPendulum() {
    const LSlider     = document.getElementById('pend-L');
    const thetaSlider = document.getElementById('pend-theta');
    const LVal        = document.getElementById('pend-L-val');
    const thetaVal    = document.getElementById('pend-theta-val');

    if (!LSlider) return;

    const reset = () => {
      const p = this.pendulum;
      p.L      = parseFloat(LSlider.value);
      p.theta0 = parseFloat(thetaSlider.value);
      LVal.textContent     = p.L.toFixed(1);
      thetaVal.textContent = p.theta0.toFixed(0);

      // Reimposta stato
      p.theta    = p.theta0 * Math.PI / 180;
      p.omega    = 0;
      p.lastTime = null;
      p.trail    = [];

      // Periodo approssimato (correzione per angoli grandi: serie di Taylor)
      const T0   = 2 * Math.PI * Math.sqrt(p.L / 9.81);
      const th   = p.theta;
      const T    = T0 * (1 + (1/16) * th * th + (11/3072) * th * th * th * th);
      const resEl = document.getElementById('pend-result');
      if (resEl) resEl.textContent = `T ≈ ${T.toFixed(3)} s   |   L = ${p.L.toFixed(1)} m   |   θ₀ = ${p.theta0}°`;
    };

    LSlider.addEventListener('input', reset);
    thetaSlider.addEventListener('input', reset);

    reset();

    // Avvia loop
    if (this.pendulum.rafId) cancelAnimationFrame(this.pendulum.rafId);
    this._pendulumLoop(performance.now());
  },

  _pendulumLoop(timestamp) {
    const p = this.pendulum;
    if (p.lastTime === null) p.lastTime = timestamp;
    const rawDt = (timestamp - p.lastTime) / 1000;  // secondi
    p.lastTime = timestamp;

    // Limita dt per evitare salti grandi a tab inattivo
    const dt = Math.min(rawDt, 0.033);
    const g  = 9.81;

    // Integrazione Eulero–Cromer (semi-implicita, conserva l'energia meglio)
    // d²θ/dt² = -(g/L) sin θ
    const alpha = -(g / p.L) * Math.sin(p.theta);
    p.omega += alpha * dt;
    p.theta += p.omega * dt;

    this._drawPendulum();

    p.rafId = requestAnimationFrame(ts => this._pendulumLoop(ts));
  },

  _drawPendulum() {
    const canvas = document.getElementById('pendulum-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const p = this.pendulum;

    // Pivot al centro-alto
    const pivotX = W / 2;
    const pivotY = H * 0.18;

    // Scala: L_max = 2.0 m → visualizziamo su ~55% dell'altezza disponibile
    const scale = (H * 0.58) / 2.0;   // pixel per metro

    const bobX = pivotX + Math.sin(p.theta) * p.L * scale;
    const bobY = pivotY + Math.cos(p.theta) * p.L * scale;

    // Trail (scia)
    p.trail.push({ x: bobX, y: bobY });
    if (p.trail.length > 80) p.trail.shift();

    // ── Disegno ──────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // Griglia leggera
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Scia del bob
    if (p.trail.length > 1) {
      ctx.lineWidth = 1.5;
      for (let i = 1; i < p.trail.length; i++) {
        const alpha = i / p.trail.length;
        ctx.strokeStyle = `rgba(59,130,246,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.stroke();
      }
    }

    // Linea di equilibrio (verticale tratteggiata)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + p.L * scale + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Filo
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Pivot
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Bob (massa)
    const bobR = 14;
    const grad = ctx.createRadialGradient(bobX - 3, bobY - 3, 2, bobX, bobY, bobR);
    grad.addColorStop(0, '#60a5fa');
    grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Angolo arco
    ctx.strokeStyle = 'rgba(248,250,252,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 40, Math.PI / 2 - Math.abs(p.theta), Math.PI / 2, p.theta < 0);
    ctx.stroke();

    // Label θ live
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`θ = ${(p.theta * 180 / Math.PI).toFixed(1)}°`, pivotX + 50, pivotY + 15);
    ctx.fillText(`ω = ${p.omega.toFixed(2)} rad/s`, pivotX + 50, pivotY + 32);
  },

  // ══════════════════════════════════════════════════════════
  // 4. QUIZ
  // ══════════════════════════════════════════════════════════
  initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    if (!quizArea) return;

    const quizzes = [
      {
        q: "Un'equazione differenziale ordinaria (EDO) è un'equazione che coinvolge...",
        opts: [
          "solo numeri costanti",
          "una funzione incognita e le sue derivate rispetto a una variabile",
          "derivate parziali rispetto a più variabili",
          "esclusivamente integrali definiti"
        ],
        ans: 1
      },
      {
        q: "L'ordine di una EDO è determinato da...",
        opts: [
          "il numero di soluzioni che ammette",
          "il grado del polinomio",
          "l'ordine della derivata più alta presente nell'equazione",
          "il numero di variabili indipendenti"
        ],
        ans: 2
      },
      {
        q: "La soluzione dell'equazione \\(dN/dt = kN\\) con \\(N(0) = N_0\\) è:",
        opts: [
          "\\(N(t) = N_0 + kt\\)",
          "\\(N(t) = N_0 \\cdot e^{kt}\\)",
          "\\(N(t) = k \\cdot \\ln(N_0 t)\\)",
          "\\(N(t) = N_0^k\\)"
        ],
        ans: 1
      },
      {
        q: "Nel metodo di Eulero, la formula di aggiornamento è:",
        opts: [
          "\\(y_{n+1} = y_n - h \\cdot f(x_n, y_n)\\)",
          "\\(y_{n+1} = y_n \\cdot f(x_n, y_n)\\)",
          "\\(y_{n+1} = y_n + h \\cdot f(x_n, y_n)\\)",
          "\\(y_{n+1} = h / f(x_n, y_n)\\)"
        ],
        ans: 2
      },
      {
        q: "Cosa succede all'errore del metodo di Eulero quando si dimezza il passo \\(h\\)?",
        opts: [
          "Rimane uguale",
          "Raddoppia",
          "Si dimezza circa (l'errore è proporzionale a h)",
          "Diventa zero"
        ],
        ans: 2
      },
      {
        q: "L'equazione del pendolo semplice \\(\\ddot{\\theta} = -(g/L)\\sin\\theta\\) è un'equazione differenziale...",
        opts: [
          "lineare del primo ordine",
          "non lineare del secondo ordine",
          "lineare del secondo ordine",
          "alle derivate parziali"
        ],
        ans: 1
      }
    ];

    quizArea.innerHTML = quizzes.map((quiz, i) => `
      <div style="margin-bottom:2rem; padding:1.5rem; background:rgba(255,255,255,0.02); border-radius:10px; border-left:3px solid var(--math-color);">
        <p style="margin-bottom:1rem; color:var(--text-main);">
          <strong>Q${i + 1}.</strong> ${quiz.q}
        </p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${quiz.opts.map((opt, j) => `
            <label style="cursor:pointer; display:flex; align-items:center; padding:0.5rem; border-radius:6px; transition:background 0.2s;">
              <input type="radio" name="q${i}" value="${j}" style="cursor:pointer; margin-right:0.6rem; accent-color:var(--math-color);">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Pulsante
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Controlla Risposte';
    submitBtn.style.cssText = 'background:var(--math-color);color:white;border:none;padding:0.8rem 2rem;border-radius:8px;cursor:pointer;font-weight:700;margin-bottom:2rem;font-size:1rem;';
    const scoreEl = document.getElementById('quiz-score');
    quizArea.parentNode.insertBefore(submitBtn, scoreEl);

    submitBtn.addEventListener('click', () => {
      let score = 0;
      quizzes.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (sel && parseInt(sel.value) === q.ans) score++;
      });
      const pct = Math.round((score / quizzes.length) * 100);
      let emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖';
      scoreEl.textContent = `Risultato: ${score}/${quizzes.length} (${pct}%) ${emoji}`;

      // Tipizzazione risposta corretta / sbagliata
      quizzes.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        const labels = document.querySelectorAll(`input[name="q${i}"]`);
        labels.forEach(inp => {
          const lbl = inp.parentElement;
          if (parseInt(inp.value) === q.ans) {
            lbl.style.background = 'rgba(34,197,94,0.12)';
            lbl.style.color = '#4ade80';
          } else if (sel && inp === sel) {
            lbl.style.background = 'rgba(239,68,68,0.12)';
            lbl.style.color = '#f87171';
          }
        });
      });

      // Ri-renderizza MathJax se presente
      if (window.MathJax) MathJax.typesetPromise([scoreEl.parentElement]).catch(() => {});
    });

    // Renderizza formule nel quiz
    if (window.MathJax) MathJax.typesetPromise([quizArea]).catch(() => {});
  }
};

document.addEventListener('DOMContentLoaded', () => EDOApp.init());
