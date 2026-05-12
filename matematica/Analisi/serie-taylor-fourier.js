// ========== SERIE DI TAYLOR E FOURIER ==========

const TaylorFourierApp = {
  currentTaylorFunc: 'sin',
  taylorDegree: 3,
  taylorCenter: 0,
  currentFourierFunc: 'square',
  fourierHarmonics: 5,

  taylorFunctions: {
    sin: { f: x => Math.sin(x), derivatives: [Math.sin, Math.cos, x => -Math.sin(x), x => -Math.cos(x)], label: 'sin(x)' },
    cos: { f: x => Math.cos(x), derivatives: [Math.cos, x => -Math.sin(x), x => -Math.cos(x), Math.sin], label: 'cos(x)' },
    exp: { f: x => Math.exp(x), derivatives: [Math.exp, Math.exp, Math.exp, Math.exp], label: 'e^x' },
    ln: { f: x => Math.log(1 + x), derivatives: [x => Math.log(1 + x), x => 1/(1+x), x => -1/((1+x)*(1+x))], label: 'ln(1+x)' }
  },

  fourierFunctions: {
    square: { label: 'Onda quadra' },
    triangle: { label: 'Onda triangolare' },
    sawtooth: { label: 'Onda a dente di sega' }
  },

  init() {
    this.setupTaylor();
    this.setupFourier();
  },

  // ===== TAYLOR =====
  setupTaylor() {
    const funcPick = document.getElementById('taylor-func-pick');
    const degreeSlider = document.getElementById('taylor-degree');
    const degreeVal = document.getElementById('taylor-degree-val');
    const centerSlider = document.getElementById('taylor-center');
    const centerVal = document.getElementById('taylor-center-val');

    funcPick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        funcPick.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTaylorFunc = btn.dataset.fn;
        this.drawTaylor();
      });
    });

    degreeSlider.addEventListener('input', (e) => {
      this.taylorDegree = parseInt(e.target.value);
      degreeVal.textContent = this.taylorDegree;
      this.drawTaylor();
    });

    centerSlider.addEventListener('input', (e) => {
      this.taylorCenter = parseFloat(e.target.value);
      centerVal.textContent = this.taylorCenter.toFixed(1);
      this.drawTaylor();
    });

    this.drawTaylor();
  },

  drawTaylor() {
    const canvas = document.getElementById('taylor-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      const x = cx + i * scale;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      const y = cy - i * scale;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const fn = this.taylorFunctions[this.currentTaylorFunc];
    const a = this.taylorCenter;

    // Original function
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -2.5; x <= 2.5; x += 0.05) {
      const px = cx + x * scale;
      const py = cy - fn.f(x) * scale;
      if (x === -2.5) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Taylor approximation
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -2.5; x <= 2.5; x += 0.05) {
      let taylor = fn.f(a);
      let factorial = 1;
      for (let n = 1; n <= this.taylorDegree; n++) {
        factorial *= n;
        const derivValue = fn.derivatives[n % 4](a);
        taylor += (derivValue / factorial) * Math.pow(x - a, n);
      }

      const px = cx + x * scale;
      const py = cy - taylor * scale;
      if (x === -2.5) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Center point
    ctx.fillStyle = '#FFC857';
    ctx.beginPath();
    ctx.arc(cx + a * scale, cy - fn.f(a) * scale, 5, 0, Math.PI * 2);
    ctx.fill();

    // Legend
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px monospace';
    ctx.fillText('— Funzione originale', 20, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('— Polinomio Taylor (grado ' + this.taylorDegree + ')', 20, 35);

    // Calculate max error
    let maxError = 0;
    for (let x = -2; x <= 2; x += 0.1) {
      let taylor = fn.f(a);
      let factorial = 1;
      for (let n = 1; n <= this.taylorDegree; n++) {
        factorial *= n;
        const derivValue = fn.derivatives[n % 4](a);
        taylor += (derivValue / factorial) * Math.pow(x - a, n);
      }
      maxError = Math.max(maxError, Math.abs(fn.f(x) - taylor));
    }

    document.getElementById('taylor-result').innerHTML = `
      Errore massimo in [-2, 2]: <strong>${maxError.toFixed(6)}</strong><br>
      Centro di sviluppo: x₀ = ${this.taylorCenter.toFixed(1)}<br>
      Grado: ${this.taylorDegree}
    `;
  },

  // ===== FOURIER =====
  setupFourier() {
    const funcPick = document.getElementById('fourier-func-pick');
    const harmonicsSlider = document.getElementById('fourier-harmonics');
    const harmonicsVal = document.getElementById('fourier-harmonics-val');

    funcPick.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        funcPick.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFourierFunc = btn.dataset.fn;
        this.drawFourier();
      });
    });

    harmonicsSlider.addEventListener('input', (e) => {
      this.fourierHarmonics = parseInt(e.target.value);
      harmonicsVal.textContent = this.fourierHarmonics;
      this.drawFourier();
    });

    this.drawFourier();
  },

  fourierSquareWave(x, n) {
    let sum = 0;
    for (let k = 1; k <= n; k += 2) {
      sum += (4 / (Math.PI * k)) * Math.sin(k * x);
    }
    return sum;
  },

  fourierTriangleWave(x, n) {
    let sum = 0;
    x = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    for (let k = 1; k <= n; k += 2) {
      sum += (8 / (Math.PI * Math.PI * k * k)) * Math.sin(k * x);
    }
    return sum;
  },

  fourierSawtoothWave(x, n) {
    let sum = 0;
    for (let k = 1; k <= n; k++) {
      sum += (2 / (Math.PI * k)) * Math.sin(k * x);
    }
    return sum;
  },

  drawFourier() {
    const canvas = document.getElementById('fourier-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = 50, cy = h / 2;
    const scale = 40;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const x = cx + i * scale * Math.PI;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // Original function (reference)
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2 * Math.PI;
      let y = 0;

      if (this.currentFourierFunc === 'square') {
        y = t < Math.PI ? 1 : -1;
      } else if (this.currentFourierFunc === 'triangle') {
        y = t < Math.PI ? (2 * t / Math.PI - 1) : (3 - 2 * t / Math.PI);
      } else if (this.currentFourierFunc === 'sawtooth') {
        y = 1 - (2 * t / (2 * Math.PI));
      }

      const px = cx + (t / (2 * Math.PI)) * 6 * scale * Math.PI;
      const py = cy - y * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fourier approximation
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 2 * Math.PI;
      let y = 0;

      if (this.currentFourierFunc === 'square') {
        y = this.fourierSquareWave(t, this.fourierHarmonics);
      } else if (this.currentFourierFunc === 'triangle') {
        y = this.fourierTriangleWave(t, this.fourierHarmonics);
      } else if (this.currentFourierFunc === 'sawtooth') {
        y = this.fourierSawtoothWave(t, this.fourierHarmonics);
      }

      const px = cx + (t / (2 * Math.PI)) * 6 * scale * Math.PI;
      const py = cy - y * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Legend
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px monospace';
    ctx.fillText('— Onda originale', 20, 20);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('— Fourier (' + this.fourierHarmonics + ' armonici)', 20, 35);

    document.getElementById('fourier-result').innerHTML = `
      Tipo: ${this.fourierFunctions[this.currentFourierFunc].label}<br>
      Armonici utilizzati: ${this.fourierHarmonics}<br>
      <em>Aumenta gli armonici per una migliore approssimazione</em>
    `;
  }
};

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById('tab-' + tabName).classList.add('active');
  event.target.classList.add('active');

  // Redraw if needed
  if (tabName === 'taylor') {
    setTimeout(() => TaylorFourierApp.drawTaylor(), 100);
  } else {
    setTimeout(() => TaylorFourierApp.drawFourier(), 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TaylorFourierApp.init();
});
