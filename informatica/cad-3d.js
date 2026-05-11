document.addEventListener('DOMContentLoaded', () => {

    const cube = document.getElementById('cube');
    const rx = document.getElementById('rx');
    const ry = document.getElementById('ry');
    const rz = document.getElementById('rz');
    const rxVal = document.getElementById('rx-val');
    const ryVal = document.getElementById('ry-val');
    const rzVal = document.getElementById('rz-val');
    const autoBtn = document.getElementById('auto-rotate');
    let autoOn = false;
    let autoRaf = null;

    function applyRotation() {
        if (!cube) return;
        const x = rx.value;
        const y = ry.value;
        const z = rz.value;
        cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
        rxVal.textContent = `${x}°`;
        ryVal.textContent = `${y}°`;
        rzVal.textContent = `${z}°`;
    }

    [rx, ry, rz].forEach(el => el && el.addEventListener('input', applyRotation));
    applyRotation();

    function autoLoop() {
        if (!autoOn) return;
        ry.value = (parseInt(ry.value, 10) + 1) % 360;
        rx.value = (parseInt(rx.value, 10) + 0.4);
        if (rx.value > 180) rx.value = -180;
        applyRotation();
        autoRaf = requestAnimationFrame(autoLoop);
    }

    if (autoBtn) {
        autoBtn.addEventListener('click', () => {
            autoOn = !autoOn;
            autoBtn.textContent = autoOn ? 'Ferma rotazione' : 'Avvia rotazione automatica';
            if (autoOn) autoLoop();
            else cancelAnimationFrame(autoRaf);
        });
    }

    const meshCanvas = document.getElementById('mesh-canvas');
    const meshButtons = document.querySelectorAll('.mc-btn');
    let currentMesh = 'cube';
    let meshAngle = 0;

    const meshes = {
        cube: (() => {
            const v = [];
            for (let x = -1; x <= 1; x += 2) for (let y = -1; y <= 1; y += 2) for (let z = -1; z <= 1; z += 2) v.push([x, y, z]);
            const e = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
            return { vertices: v, edges: e };
        })(),
        pyramid: {
            vertices: [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,1.2,0]],
            edges: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]]
        },
        sphere: (() => {
            const v = [], e = [];
            const stacks = 8, slices = 10;
            for (let i = 0; i <= stacks; i++) {
                const phi = Math.PI * i / stacks;
                for (let j = 0; j < slices; j++) {
                    const theta = 2 * Math.PI * j / slices;
                    v.push([Math.sin(phi)*Math.cos(theta), Math.cos(phi), Math.sin(phi)*Math.sin(theta)]);
                }
            }
            for (let i = 0; i < stacks; i++) {
                for (let j = 0; j < slices; j++) {
                    const a = i * slices + j;
                    const b = i * slices + (j+1) % slices;
                    const c = (i+1) * slices + j;
                    e.push([a, b]);
                    e.push([a, c]);
                }
            }
            return { vertices: v, edges: e };
        })()
    };

    function project(v, w, h) {
        const cosA = Math.cos(meshAngle), sinA = Math.sin(meshAngle);
        const x = v[0]*cosA - v[2]*sinA;
        const z = v[0]*sinA + v[2]*cosA + 4;
        const y = v[1];
        const scale = 110 / z;
        return { x: w/2 + x*scale*z, y: h/2 - y*scale*z };
    }

    function drawMesh() {
        if (!meshCanvas) return;
        const ctx = meshCanvas.getContext('2d');
        const W = meshCanvas.width, H = meshCanvas.height;
        ctx.fillStyle = '#0B0E14';
        ctx.fillRect(0, 0, W, H);

        const mesh = meshes[currentMesh];
        const pts = mesh.vertices.map(v => project(v, W, H));

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        mesh.edges.forEach(([a, b]) => {
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
        });
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        pts.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function meshLoop() {
        meshAngle += 0.012;
        drawMesh();
        requestAnimationFrame(meshLoop);
    }

    meshButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            meshButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMesh = btn.dataset.mesh;
        });
    });

    if (meshCanvas) meshLoop();

    const quizData = [
        {
            question: "1. Chi sviluppo Sketchpad nel 1963, il primo programma CAD della storia?",
            options: ["Steve Jobs", "Ivan Sutherland", "Tim Berners-Lee"],
            correct: 1
        },
        {
            question: "2. In che anno esce AutoCAD 1.0?",
            options: ["1976", "1982", "1995"],
            correct: 1
        },
        {
            question: "3. Una mesh 3D e composta principalmente da:",
            options: ["Curve di Bezier", "Vertici, spigoli e facce", "Solo cerchi e quadrati"],
            correct: 1
        },
        {
            question: "4. Cosa rappresenta un 'vertice' in un modello 3D?",
            options: [
                "Una linea con direzione",
                "Un punto definito da tre coordinate (x, y, z)",
                "L'angolo tra due facce"
            ],
            correct: 1
        },
        {
            question: "5. La stampa 3D FDM usa come materiale principale:",
            options: ["Resina liquida UV", "Filamento di plastica scaldato", "Polvere metallica"],
            correct: 1
        },
        {
            question: "6. Cosa fa uno 'slicer' come Cura o PrusaSlicer?",
            options: [
                "Modella oggetti 3D da zero",
                "Trasforma un modello 3D in G-code strato per strato",
                "Renderizza filmati realistici"
            ],
            correct: 1
        },
        {
            question: "7. Quale CAD e gratuito, open source e usato anche dalla Pixar?",
            options: ["AutoCAD", "Blender", "SolidWorks"],
            correct: 1
        },
        {
            question: "8. Per stampare un oggetto in 3D con stampante FDM serve, nell'ordine:",
            options: [
                "G-code → Modello CAD → Stampante",
                "Modello CAD → Slicer → G-code → Stampante",
                "Solo il modello CAD"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    function renderQuiz() {
        if (!quizArea) return;
        quizArea.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = '';

        quizData.forEach((q) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = '1rem';
            qTitle.style.fontWeight = '600';
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.cssText = 'display:flex; flex-direction:column; gap:0.8rem;';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                btn.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-main); padding:1rem; border-radius:0.5rem; cursor:pointer; text-align:left; font-size:1rem; font-family:inherit; transition:all 0.2s;';
                btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.1)'; };
                btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.05)'; };
                btn.onclick = () => {
                    if (btn.disabled) return;
                    if (optIndex === q.correct) {
                        btn.style.background = 'var(--physics-color)';
                        btn.style.borderColor = 'var(--physics-color)';
                        btn.style.color = '#fff';
                        btn.classList.add('correct');
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>X Riprova!</strong>';
                        btn.disabled = true;
                        btn.style.opacity = '0.7';
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showScore() {
        const scoreEl = document.getElementById('quiz-score');
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--physics-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Pronto a modellare in Fusion 360!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa storia del CAD, mesh e stampa 3D.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
