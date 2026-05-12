// ========== CORNO DI GABRIELE ==========

const CornoGabrieleApp = {
  scene: null,
  camera: null,
  renderer: null,
  hornMesh: null,
  hornLimit: 3,

  init() {
    this.setup3D();
    this.setupControls();
  },

  setup3D() {
    const container = document.getElementById('3d-container');
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Create horn
    this.createHorn(3);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && this.hornMesh) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        this.hornMesh.rotation.y += deltaX * 0.01;
        this.hornMesh.rotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    this.renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Auto-rotate
    this.animate();
  },

  createHorn(limit) {
    if (this.hornMesh) this.scene.remove(this.hornMesh);

    const segments = 64;
    const points = [];

    // Generate the horn curve y = 1/x
    for (let i = 0; i <= segments; i++) {
      const x = 1 + (limit - 1) * (i / segments);
      const y = 1 / x;
      points.push(new THREE.Vector2(y, x - 1)); // radius, height
    }

    // Create lathe geometry (revolve around axis)
    const latheGeometry = new THREE.LatheGeometry(points, 32);

    // Material
    const material = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      emissive: 0x1e40af,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.hornMesh = new THREE.Mesh(latheGeometry, material);
    this.hornMesh.scale.set(2, 2, 2);
    this.scene.add(this.hornMesh);

    // Update metrics
    this.updateMetrics(limit);
  },

  updateMetrics(limit) {
    // Volume: integral of π/x² from 1 to limit
    const volume = Math.PI * (1 - 1/limit);

    // Approximate surface area
    let surfaceApprox = 0;
    const n = 100;
    for (let i = 0; i < n; i++) {
      const x1 = 1 + (limit - 1) * (i / n);
      const x2 = 1 + (limit - 1) * ((i + 1) / n);
      const y1 = 1 / x1;
      const y2 = 1 / x2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const arcLength = Math.sqrt(dx * dx + dy * dy);
      surfaceApprox += 2 * Math.PI * y1 * arcLength;
    }

    document.getElementById('horn-result').innerHTML = `
      Volume (1 a ${limit.toFixed(1)}): <strong>${volume.toFixed(4)}π ≈ ${(volume * Math.PI).toFixed(4)}</strong><br>
      Superficie approssimata: <strong>${surfaceApprox.toFixed(4)}</strong><br>
      <em>Al limite → ∞: Volume → π, Superficie → ∞</em>
    `;
  },

  setupControls() {
    const limitSlider = document.getElementById('horn-limit');
    const limitVal = document.getElementById('horn-limit-val');

    limitSlider.addEventListener('input', (e) => {
      this.hornLimit = parseFloat(e.target.value);
      limitVal.textContent = this.hornLimit.toFixed(1);
      this.createHorn(this.hornLimit);
    });

    // Draw the curve on canvas
    this.drawCurveAnalysis();
  },

  drawCurveAnalysis() {
    const canvas = document.getElementById('horn-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w / 4, cy = h / 2;
    const scale = 30;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * scale, 0);
      ctx.lineTo(cx + i * scale, h);
      ctx.stroke();
    }

    // y = 1/x curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 1; x <= this.hornLimit; x += 0.05) {
      const px = cx + (x - 1) * scale;
      const py = cy - (1 / x) * scale;
      if (x === 1) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px monospace';
    ctx.fillText('x', w - 20, cy - 10);
    ctx.fillText('y', cx + 5, 15);
    ctx.fillText('y = 1/x', cx + 50, 30);
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.hornMesh && !this.isDragging) {
      this.hornMesh.rotation.y += 0.003;
    }

    this.renderer.render(this.scene, this.camera);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CornoGabrieleApp.init();

  // Handle window resize
  window.addEventListener('resize', () => {
    const container = document.getElementById('3d-container');
    if (container) {
      const w = container.clientWidth;
      const h = container.clientHeight;
      CornoGabrieleApp.camera.aspect = w / h;
      CornoGabrieleApp.camera.updateProjectionMatrix();
      CornoGabrieleApp.renderer.setSize(w, h);
    }
  });
});
