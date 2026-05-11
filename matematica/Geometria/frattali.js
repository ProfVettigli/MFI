document.addEventListener('DOMContentLoaded', () => {

    // --- FRACTAL TREE CANVAS ---
    const cTree = document.getElementById('treeCanvas');
    let treeDepth = 1;

    function drawBranch(ctx, startX, startY, len, angle, depth) {
        if(depth === 0) return;

        let endX = startX + len * Math.cos(angle);
        let endY = startY + len * Math.sin(angle);

        // Styling based on depth (Brown trunk, green leaves)
        if (depth < 3) ctx.strokeStyle = '#10b981'; // tip leaves
        else ctx.strokeStyle = '#8b5cf6'; // intermediate branches
        if (depth > 6) ctx.strokeStyle = '#f59e0b'; // trunk base

        ctx.lineWidth = depth * 0.8;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Recursion
        // length decays, angles diverge
        drawBranch(ctx, endX, endY, len * 0.73, angle - 0.45, depth - 1);
        drawBranch(ctx, endX, endY, len * 0.73, angle + 0.45, depth - 1);
    }

    function renderTree() {
        if(!cTree) return;
        const ctx = cTree.getContext('2d');
        const W = cTree.width, H = cTree.height;
        ctx.clearRect(0,0,W,H);
        
        ctx.lineCap = 'round';
        // Base trunk coordinates
        drawBranch(ctx, W/2, H, 100, -Math.PI/2, treeDepth);
    }

    window.updateTree = function() {
        treeDepth = parseInt(document.getElementById('tree-depth').value);
        let disp = document.getElementById('tree-disp');
        if(treeDepth === 1) disp.innerText = "Livello 1 (Solo Tronco)";
        else if(treeDepth <= 4) disp.innerText = `Livello ${treeDepth} (Prime Biforcazioni)`;
        else if(treeDepth <= 8) disp.innerText = `Livello ${treeDepth} (La Chioma si Apre)`;
        else disp.innerText = `Livello ${treeDepth} (Il Mostro Frattale Finito!)`;
        renderTree();
    };

    if(cTree) renderTree();


    // --- SIERPINSKI TRIANGLE CANVAS ---
    const cSier = document.getElementById('sierCanvas');
    let sierDepth = 0;

    function drawTri(ctx, p1, p2, p3, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
    }

    function sierpinskiRec(ctx, p1, p2, p3, depth) {
        if(depth === 0) return;
        
        let m1 = {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2};
        let m2 = {x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2};
        let m3 = {x: (p3.x + p1.x)/2, y: (p3.y + p1.y)/2};
        
        // Svuota il centro (colore di sfondo del div canvas-wrapper)
        drawTri(ctx, m1, m2, m3, '#0f172a');
        
        sierpinskiRec(ctx, p1, m1, m3, depth - 1);
        sierpinskiRec(ctx, m1, p2, m2, depth - 1);
        sierpinskiRec(ctx, m3, m2, p3, depth - 1);
    }

    function renderSierpinski() {
        if(!cSier) return;
        const ctx = cSier.getContext('2d');
        const W = cSier.width, H = cSier.height;
        ctx.clearRect(0,0,W,H);
        
        let pad = 20;
        let p1 = {x: W/2, y: pad};
        let p2 = {x: W-pad, y: H-pad};
        let p3 = {x: pad, y: H-pad};

        drawTri(ctx, p1, p2, p3, '#f59e0b');
        sierpinskiRec(ctx, p1, p2, p3, sierDepth);
    }

    window.updateSierpinski = function() {
        sierDepth = parseInt(document.getElementById('sier-depth').value);
        let disp = document.getElementById('sier-disp');
        if(sierDepth === 0) disp.innerText = "Livello 0 (Pieno)";
        else disp.innerText = `Livello ${sierDepth} (Svuotamento Esponenziale)`;
        renderSierpinski();
    };

    if(cSier) renderSierpinski();

    // --- MANDELBROT CANVAS ---
    const cMan = document.getElementById('mandelCanvas');
    window.drawMandelbrot = function() {
        if(!cMan) return;
        const ctx = cMan.getContext('2d');
        const W = cMan.width, H = cMan.height;
        
        // Fast JS Mandelbrot generator
        const maxIter = 50; 
        const magMax = 4.0; // Bailout

        const imgData = ctx.createImageData(W, H);
        const data = imgData.data;

        // Viewport bounds chosen to perfectly center the main cardioid
        const PanX = -0.5, PanY = 0;
        const Zoom = 1.3;
        
        // Coordinates map
        for(let py = 0; py < H; py++) {
            for(let px = 0; px < W; px++) {
                
                // Map screen pixels to mathematical complex plane (Z)
                let c0_x = (px - W/2) / (W * Zoom/3) + PanX;
                let c0_y = (py - H/2) / (H * Zoom/2) + PanY;
                
                let x = 0; let y = 0;
                let iteration = 0;

                while (x*x + y*y <= magMax && iteration < maxIter) {
                    let xtemp = x*x - y*y + c0_x;
                    y = 2*x*y + c0_y;
                    x = xtemp;
                    iteration++;
                }

                // Map iteration count to pixel index
                let pIndex = (py * W + px) * 4;
                
                if (iteration === maxIter) {
                    // Prisoner (Black abyss inside the set)
                    data[pIndex] = 0;
                    data[pIndex+1] = 0;
                    data[pIndex+2] = 0;
                    data[pIndex+3] = 255;
                } else {
                    // Escaped numbers (Colored bands based on escape speed)
                    // We generate a neon electric color mapping from iterations
                    let cScale = (iteration) / maxIter; // 0.0 to 1.0
                    
                    data[pIndex] = parseInt(168 * cScale * 3) % 255;   // Red
                    data[pIndex+1] = parseInt(85 * cScale * 5) % 255;  // Green
                    data[pIndex+2] = parseInt(247 * cScale * 8) % 255; // Blue
                    data[pIndex+3] = 255; // Alpha
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
    };

    if(cMan) {
        // Draw lower res placeholder then schedule render for UX smoothness
        setTimeout(window.drawMandelbrot, 300);
    }


    // --- QUIZ DATA ---
    const quizData = [
        { 
            question: "1. Qual è la fondamentale proprietà cardine che definisce geometricamente un oggetto come Frattale?", 
            options: [
                "L'Autosimilarità: Ingrandendo qualsiasi dettaglio, ritrovi l'identica forma scheletrica dell'oggetto originale macroscopico all'infinito.", 
                "La Rotazione Sferica perfetta sui tre assi cartesiani.", 
                "Il peso e la massa di volume limitati calcolati col Teorema di Pitagora."
            ], 
            correct: 0 
        },
        { 
            question: "2. La Curva di Koch o il Triangolo di Sierpinski sono mostri matematici contorti che collassano le tradizionali leggi fisiche. Nello specifico, hanno una Dimensione di Hausdorff che è:", 
            options: [
                "Un numero netto intero (esattamente 1D come le normali rette).", 
                "Un numero Frazionario con i decimali! (Ad esempio, il triangolo di Sierpinski risulta avere dimensione 1.585... intrappolato tra una linea e un foglio piatto!).", 
                "Esattamente 3D come un solido cubo a prescindere dal contorno."
            ], 
            correct: 1 
        },
        { 
            question: "3. La celebre equazione ciclica Z_{n+1} = (Z_n)^2 + c usata per calcolare i regni neri dell'Insieme di Mandelbrot si avvale puramente dei numeri:", 
            options: [
                "Numeri Irrazionali e Primi limitati.", 
                "Numeri Interi Naturali e Frazioni ridottene.", 
                "Numeri Complessi (Numeri Immaginari dotati di coordinate 2D piane)."
            ], 
            correct: 2 
        },
        { 
            question: "4. Quale eccezionale espediente biologico terrestre è in realtà un chiarissimo frattale vegetale che riproduce in ogni sua piccola punta esatta l'intero design enorme della cima originale principale?", 
            options: [
                "Il Broccolo Romanesco.", 
                "Il Melone Verde e I Semi dell'Anguria.", 
                "Le Radici Quadrate della Cipolla Rossa."
            ], 
            correct: 0 
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0; let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div'); qDiv.className = 'quiz-question';
            const qTitle = document.createElement('h3'); qTitle.textContent = q.question; qDiv.appendChild(qTitle);
            const optionsDiv = document.createElement('div'); optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button'); btn.className = 'quiz-btn'; btn.textContent = optText;
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => { b.disabled = true; b.style.cursor='default'; });
                        if (!optionsDiv.querySelector('.wrong')) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            scoreEl.textContent = `Punteggio Caotico: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Hai domato l'Infinito Matematico! 🌟":"Occhio ai Loop infiniti, ripassa la lezione!");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else { btn.classList.add('wrong'); btn.innerHTML += " <strong>✗ Sbagliato, Riprova la scala spaziale</strong>"; btn.disabled = true; }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv); quizArea.appendChild(qDiv);
        });
    }
});
