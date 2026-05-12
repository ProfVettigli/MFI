// ========== CLIL: HILBERT'S PROBLEMS ==========

const HilbertProblems = [
  {
    num: 1,
    it_title: "Ipotesi del continuo",
    en_title: "Continuum Hypothesis",
    it_desc: "Esiste un infinito tra il numerabile e il continuo?",
    en_desc: "Is there an infinity between countable and continuum?",
    status: "partial",
    it_status: "Parzialmente risolto",
    en_status: "Partially solved",
    it_details: "Gödel (1938) e Cohen (1963) mostrarono che è indipendente da ZFC.",
    en_details: "Gödel (1938) and Cohen (1963) showed it is independent of ZFC."
  },
  {
    num: 2,
    it_title: "Consistenza dell'aritmetica",
    en_title: "Consistency of Arithmetic",
    it_desc: "L'aritmetica è coerente?",
    en_desc: "Is arithmetic consistent?",
    status: "partial",
    it_status: "Parzialmente risolto",
    en_status: "Partially solved",
    it_details: "Gödel mostrò che non può essere provata dentro se stessa (1931).",
    en_details: "Gödel showed it cannot be proven within itself (1931)."
  },
  {
    num: 3,
    it_title: "Equivalenza dei volumi",
    en_title: "Equivalence of Volumes",
    it_desc: "Due poliedri equivalenti sono sempre scomponibili?",
    en_desc: "Are two equivalent polyhedra always decomposable?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Dehn (1900) dimostrò il contrario con il 'Problema di Dehn'.",
    en_details: "Dehn (1900) proved the opposite with the 'Dehn Invariant'."
  },
  {
    num: 4,
    it_title: "Geometrie non euclidee",
    en_title: "Non-Euclidean Geometries",
    it_desc: "Quali sono le metriche coerenti?",
    en_desc: "What are the consistent metrics?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Sviluppo della geometria differenziale e dello spazio metrico.",
    en_details: "Development of differential geometry and metric spaces."
  },
  {
    num: 5,
    it_title: "Gruppi e continuità",
    en_title: "Groups and Continuity",
    it_desc: "I gruppi sono necessariamente continui?",
    en_desc: "Must groups be continuous?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Risolto da vari matematici tra il 1900 e il 1950.",
    en_details: "Solved by various mathematicians between 1900 and 1950."
  },
  {
    num: 6,
    it_title: "Assiomi della fisica",
    en_title: "Axioms of Physics",
    it_desc: "Quale assiomatica per la fisica?",
    en_desc: "What axiomatic system for physics?",
    status: "open",
    it_status: "Aperto",
    en_status: "Open",
    it_details: "Ancora dibattuto con la meccanica quantistica e la relatività.",
    en_details: "Still debated with quantum mechanics and relativity."
  },
  {
    num: 7,
    it_title: "Trascendenza di numeri",
    en_title: "Transcendence of Numbers",
    it_desc: "a^b è trascendente quando a, b sono algebrici?",
    en_desc: "When is a^b transcendental for algebraic a, b?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Gelfond-Schneider (1934): sì, con condizioni.",
    en_details: "Gelfond-Schneider (1934): yes, with conditions."
  },
  {
    num: 8,
    it_title: "Ipotesi di Riemann",
    en_title: "Riemann Hypothesis",
    it_desc: "Tutti gli zeri ζ(s) hanno Re(s) = 1/2?",
    en_desc: "Do all zeros ζ(s) have Re(s) = 1/2?",
    status: "open",
    it_status: "Aperto - Premio Clay $1,000,000",
    en_status: "Open - Clay Prize $1,000,000",
    it_details: "Verificato per 13 trilioni di zeri. Fondamentale per la teoria dei numeri primi.",
    en_details: "Verified for 13 trillion zeros. Fundamental for prime number theory."
  },
  {
    num: 9,
    it_title: "Leggi di reciprocità",
    en_title: "Laws of Reciprocity",
    it_desc: "Come generalizzare la reciprocità?",
    en_desc: "How to generalize reciprocity laws?",
    status: "partial",
    it_status: "Parzialmente risolto",
    en_status: "Partially solved",
    it_details: "Sviluppo della teoria dei campi di classe.",
    en_details: "Development of class field theory."
  },
  {
    num: 10,
    it_title: "Equazioni Diofantee",
    en_title: "Diophantine Equations",
    it_desc: "Esiste algoritmo generale per risolvere equazioni Diofantee?",
    en_desc: "Is there a general algorithm for Diophantine equations?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Matiyasevich (1970): No, usando il Teorema di Gödel.",
    en_details: "Matiyasevich (1970): No, using Gödel's Theorem."
  },
  {
    num: 11,
    it_title: "Forme quadratiche",
    en_title: "Quadratic Forms",
    it_desc: "Come classificare le forme quadratiche?",
    en_desc: "How to classify quadratic forms?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Sviluppo della teoria algebrica dei numeri.",
    en_details: "Development of algebraic number theory."
  },
  {
    num: 12,
    it_title: "Estensioni di campi",
    en_title: "Field Extensions",
    it_desc: "Generalizzazioni della teoria di Galois?",
    en_desc: "Generalizations of Galois theory?",
    status: "partial",
    it_status: "Parzialmente risolto",
    en_status: "Partially solved",
    it_details: "Sviluppo della teoria dei campi di classe e forme automorfe.",
    en_details: "Development of class field theory and automorphic forms."
  },
  {
    num: 13,
    it_title: "Funzioni di 7 variabili",
    en_title: "Functions of 7 Variables",
    it_desc: "Quali funzioni di 7 variabili non sono composizioni di funzioni di 2 variabili?",
    en_desc: "What functions of 7 variables are not compositions of 2-variable functions?",
    status: "open",
    it_status: "Aperto",
    en_status: "Open",
    it_details: "Kolmogorov-Arnold fecero progressi significativi negli anni 1950-60.",
    en_details: "Kolmogorov-Arnold made significant progress in the 1950s-60s."
  },
  {
    num: 14,
    it_title: "Finitezza di sistemi algebrici",
    en_title: "Finiteness of Algebraic Systems",
    it_desc: "Sono finiti gli anelli di invarianti di alcuni gruppi algebrici?",
    en_desc: "Are invariant rings of algebraic groups finitely generated?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Nagata (1959): No, ma con vincoli sì.",
    en_details: "Nagata (1959): No, but yes with restrictions."
  },
  {
    num: 15,
    it_title: "Calcolo di Schubert",
    en_title: "Schubert Calculus",
    it_desc: "Rigore matematico del calcolo di Schubert?",
    en_desc: "Mathematical rigor of Schubert calculus?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Fondamenti della geometria algebrica moderna.",
    en_details: "Foundations of modern algebraic geometry."
  },
  {
    num: 16,
    it_title: "Topologia delle curve",
    en_title: "Topology of Real Curves",
    it_desc: "Quali topologie hanno le curve algebriche reali?",
    en_desc: "What topologies do real algebraic curves have?",
    status: "open",
    it_status: "Aperto",
    en_status: "Open",
    it_details: "Progresso significativo, ma non completamente risolto.",
    en_details: "Significant progress, but not completely solved."
  },
  {
    num: 17,
    it_title: "Forme definite positive",
    en_title: "Positive Definite Forms",
    it_desc: "Come sommare quadrati di funzioni razionali?",
    en_desc: "How to sum squares of rational functions?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Artin (1927) e sviluppi recenti nella geometria algebrica reale.",
    en_details: "Artin (1927) and recent developments in real algebraic geometry."
  },
  {
    num: 18,
    it_title: "Spazi iperbolici",
    en_title: "Hyperbolic Spaces",
    it_desc: "Come tassellare lo spazio euclideo?",
    en_desc: "How to tile Euclidean space?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Sviluppo della geometria computazionale e della teoria del packing.",
    en_details: "Development of computational geometry and packing theory."
  },
  {
    num: 19,
    it_title: "Equazioni variazionali",
    en_title: "Variational Equations",
    it_desc: "Sono sempre analitiche le soluzioni?",
    en_desc: "Are solutions always analytic?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Bernstein (1904), analisi ellittica e regolarità.",
    en_details: "Bernstein (1904), elliptic analysis and regularity."
  },
  {
    num: 20,
    it_title: "Problemi variazionali",
    en_title: "Variational Problems",
    it_desc: "Quali problemi variazionali hanno sempre soluzioni?",
    en_desc: "Which variational problems always have solutions?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Sviluppo del calcolo delle variazioni moderno.",
    en_details: "Development of modern calculus of variations."
  },
  {
    num: 21,
    it_title: "Equazioni differenziali",
    en_title: "Differential Equations",
    it_desc: "Soluzioni delle equazioni differenziali?",
    en_desc: "Solutions of differential equations?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Sviluppo della teoria delle equazioni differenziali ordinarie e PDEs.",
    en_details: "Development of ODE and PDE theory."
  },
  {
    num: 22,
    it_title: "Uniformizzazione",
    en_title: "Uniformization",
    it_desc: "Mapping uniformity di superfici analitiche?",
    en_desc: "Uniformization of analytic surfaces?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Koebe, Poincaré. Fondamenti della teoria conforme moderna.",
    en_details: "Koebe, Poincaré. Foundations of modern conformal theory."
  },
  {
    num: 23,
    it_title: "Metodi variazionali",
    en_title: "Variational Methods",
    it_desc: "Sviluppo dei metodi variazionali?",
    en_desc: "Development of variational methods?",
    status: "solved",
    it_status: "Risolto",
    en_status: "Solved",
    it_details: "Calcolo delle variazioni, analisi funzionale moderna.",
    en_details: "Calculus of variations, modern functional analysis."
  }
];

let currentFilter = 'all';

function renderProblems(filter = 'all') {
  const container = document.getElementById('problems-list');
  const lang = document.documentElement.lang === 'en' ? 'en' : 'it';

  const filtered = filter === 'all'
    ? HilbertProblems
    : filter === 'solved'
      ? HilbertProblems.filter(p => p.status === 'solved')
      : HilbertProblems.filter(p => p.status === 'open');

  container.innerHTML = filtered.map(p => {
    const title = lang === 'en' ? p.en_title : p.it_title;
    const desc = lang === 'en' ? p.en_desc : p.it_desc;
    const details = lang === 'en' ? p.en_details : p.it_details;
    const statusText = lang === 'en' ? p.en_status : p.it_status;
    const statusClass = p.status === 'solved' ? 'status-solved' : p.status === 'open' ? 'status-open' : 'status-open';

    return `
      <div class="problem-card">
        <div>
          <span class="problem-num">#${p.num}</span>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="problem-title">${title}</div>
        <div class="problem-desc"><em>${desc}</em></div>
        <div class="problem-desc" style="color: var(--text-muted); font-size: 0.9rem;">📝 ${details}</div>
      </div>
    `;
  }).join('');
}

function filterProblems(type) {
  currentFilter = type;
  renderProblems(type);

  // Update button states
  document.querySelectorAll('.filter-row button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  if (lang === 'en') {
    document.body.classList.add('lang-en');
  } else {
    document.body.classList.remove('lang-en');
  }

  // Update button states
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Re-render problems with new language
  renderProblems(currentFilter);
}

function drawStatistics() {
  const canvas = document.getElementById('stats-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Counts
  const solved = HilbertProblems.filter(p => p.status === 'solved').length;
  const partial = HilbertProblems.filter(p => p.status === 'partial').length;
  const open = HilbertProblems.filter(p => p.status === 'open').length;

  // Bar chart
  const barWidth = 80;
  const maxHeight = h - 60;
  const spacing = 100;
  const startX = 50;

  // Draw bars
  const data = [
    { count: solved, label: 'Solved', color: '#22c55e' },
    { count: partial, label: 'Partial', color: '#f59e0b' },
    { count: open, label: 'Open', color: '#dc2626' }
  ];

  data.forEach((item, i) => {
    const x = startX + i * spacing;
    const barHeight = (item.count / 13) * maxHeight;
    const y = h - 50 - barHeight;

    // Bar
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(item.count, x + barWidth / 2, y - 10);

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px monospace';
    ctx.fillText(item.label, x + barWidth / 2, h - 20);
  });

  // Y-axis
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(30, h - 50);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(30, h - 50);
  ctx.lineTo(w - 20, h - 50);
  ctx.stroke();
}

document.addEventListener('DOMContentLoaded', () => {
  renderProblems('all');
  drawStatistics();
});
