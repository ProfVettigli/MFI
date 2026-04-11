document.addEventListener('DOMContentLoaded', () => {
    const GridSize = 25;

    function drawGrid(ctx, W, H) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        let cx = W/2, cy = H/2;
        for (let x = cx % GridSize; x < W; x += GridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = cy % GridSize; y < H; y += GridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    }
    function toPx(W, H, px, py) { return { x: W/2 + px * GridSize, y: H/2 - py * GridSize }; }
    function dist(x1, y1, x2, y2) { return Math.sqrt((x1-x2)**2 + (y1-y2)**2); }

    // --- CONE SLICE INTRO (Perspectives) ---
    const cCone = document.getElementById('coneCanvas');
    let coneAngle = 0;
    function drawCone() {
        if(!cCone) return;
        const ctx = cCone.getContext('2d');
        const W = cCone.width, H = cCone.height;
        ctx.clearRect(0,0,W,H);
        
        let cx = W/2, cy = H/2;
        ctx.lineWidth = 2;

        // Perspective Bases (Ellipses)
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.ellipse(cx, cy - 150, 100, 20, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy + 150, 100, 20, 0, 0, Math.PI*2); ctx.stroke();
        
        // Cone generator lines (hourglass)
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        // Top nappe
        ctx.moveTo(cx - 100, cy - 150); ctx.lineTo(cx, cy); ctx.lineTo(cx + 100, cy - 150);
        // Bottom nappe
        ctx.moveTo(cx - 100, cy + 150); ctx.lineTo(cx, cy); ctx.lineTo(cx + 100, cy + 150);
        ctx.stroke();
        
        // Perspective Slicing Plane
        let radians = coneAngle * Math.PI / 180;
        ctx.translate(cx, cy - 75); 
        ctx.rotate(-radians);
        
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-150, -20); ctx.lineTo(150, -20);
        ctx.lineTo(120, 20); ctx.lineTo(-120, 20);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Draw the shining Conic Curve directly embedded onto the plane
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        if(coneAngle == 0) { 
            ctx.strokeStyle = '#ef4444'; ctx.shadowColor = '#ef4444';
            ctx.ellipse(0, 0, 50, 15, 0, 0, Math.PI*2);
        }
        else if (coneAngle <= 48) { 
            ctx.strokeStyle = '#a855f7'; ctx.shadowColor = '#a855f7';
            ctx.ellipse(0, 0, 50 + coneAngle, 15, 0, 0, Math.PI*2);
        }
        else if (coneAngle > 48 && coneAngle <= 62) { 
            ctx.strokeStyle = '#3b82f6'; ctx.shadowColor = '#3b82f6';
            // Parabola: U shape
            for(let i = -100; i <= 100; i+= 5) {
                let px = i;
                let py = -15 + (px*px) / 250;
                if(i === -100) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
        }
        else { 
            ctx.strokeStyle = '#14B8A6'; ctx.shadowColor = '#14B8A6';
            // Hyperbola: 2 opposing U shapes
            for(let i = -120; i <= 120; i+= 5) {
                let px = i;
                let py = -8 - (px*px) / 300;
                if(i === -120) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            for(let i = -120; i <= 120; i+= 5) {
                let px = i;
                let py = 8 + (px*px) / 300;
                if(i === -120) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.rotate(radians);
        ctx.translate(-cx, -(cy - 75));
        
        // Feedback Text
        let resEl = document.getElementById('cone-res-display');
        if(coneAngle == 0) { resEl.innerText = "Circonferenza 🔴"; resEl.style.color = '#ef4444'; }
        else if (coneAngle <= 48) { resEl.innerText = "Ellisse 🪐"; resEl.style.color = '#a855f7'; }
        else if (coneAngle > 48 && coneAngle <= 62) { resEl.innerText = "Parabola ⛲"; resEl.style.color = '#3b82f6'; }
        else { resEl.innerText = "Iperbole ⌛"; resEl.style.color = '#14B8A6'; }
    }
    window.updateCone = function() {
        if(document.getElementById('cone-angle')) { coneAngle = parseInt(document.getElementById('cone-angle').value); drawCone(); }
    }
    if(cCone) drawCone();

    // --- CIRCLE CANONICAL ---
    const cCan = document.getElementById('circCanCanvas');
    let canX = 0, canY = 0, canR = 3;
    function drawCircCan() {
        if(!cCan) return;
        const ctx = cCan.getContext('2d'); const W = cCan.width, H = cCan.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);
        
        let centerPx = toPx(W, H, canX, canY);
        ctx.beginPath(); ctx.arc(centerPx.x, centerPx.y, canR * GridSize, 0, Math.PI*2);
        ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(centerPx.x, centerPx.y, 4, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill();
    }
    window.updateCircCan = function() {
        canX = parseInt(document.getElementById('circ-can-x').value);
        canY = parseInt(document.getElementById('circ-can-y').value);
        canR = parseInt(document.getElementById('circ-can-r').value);
        let sX = canX >= 0 ? '- ' + canX : '+ ' + Math.abs(canX);
        let sY = canY >= 0 ? '- ' + canY : '+ ' + Math.abs(canY);
        document.getElementById('circ-can-eq-display').innerText = `(x ${sX})² + (y ${sY})² = ${canR*canR}`;
        drawCircCan();
    }
    if(cCan) drawCircCan();

    // --- CIRCLE GENERAL ---
    const cCirc = document.getElementById('circCanvas');
    let aVal = 0, bVal = 0, cVal = -9;
    function drawCirc() {
        if(!cCirc) return;
        const ctx = cCirc.getContext('2d'); ctx.clearRect(0,0,cCirc.width, cCirc.height); drawGrid(ctx, cCirc.width, cCirc.height);
        let xc = -aVal/2, yc = -bVal/2, radInside = (xc*xc) + (yc*yc) - cVal;
        let errEl = document.getElementById('circ-error');
        if(radInside < 0) { errEl.style.opacity = 1; document.getElementById('circ-stats-display').innerText = `Centro(${xc.toFixed(1)}, ${yc.toFixed(1)}) | Raggio = IMPOSSIBILE!`; return; } 
        else { errEl.style.opacity = 0; }
        let r = Math.sqrt(radInside);
        document.getElementById('circ-stats-display').innerText = `Centro(${xc.toFixed(1)}, ${yc.toFixed(1)}) | Raggio = ${r.toFixed(2)}`;
        let centerPx = toPx(cCirc.width, cCirc.height, xc, yc);
        ctx.beginPath(); ctx.arc(centerPx.x, centerPx.y, r * GridSize, 0, Math.PI*2); ctx.strokeStyle = '#14B8A6'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(centerPx.x, centerPx.y, 4, 0, Math.PI*2); ctx.fillStyle = '#f59e0b'; ctx.fill();
    }
    window.updateCirc = function() {
        aVal = parseFloat(document.getElementById('circ-a').value); bVal = parseFloat(document.getElementById('circ-b').value); cVal = parseFloat(document.getElementById('circ-c').value);
        let sA = aVal >= 0 ? '+ ' + aVal : '- ' + Math.abs(aVal); let sB = bVal >= 0 ? '+ ' + bVal : '- ' + Math.abs(bVal); let sC = cVal >= 0 ? '+ ' + cVal : '- ' + Math.abs(cVal);
        document.getElementById('circ-eq-display').innerText = `x² + y² ${sA}x ${sB}y ${sC} = 0`;
        drawCirc();
    };
    if(cCirc) drawCirc();

    // --- CIRCLE LINE COLLISION ---
    const cLine = document.getElementById('circLineCanvas');
    let lQ = 2; // y = mx+Q, we will just use m=0 for simplicity to see vertical delta or standard intercept
    function drawCircLine() {
        if(!cLine) return;
        const ctx = cLine.getContext('2d'); const W = cLine.width, H = cLine.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);
        
        // Base circle: x^2 + y^2 = 9 (radius 3)
        let rPx = 3 * GridSize;
        ctx.beginPath(); ctx.arc(W/2, H/2, rPx, 0, Math.PI*2); ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2; ctx.stroke();
        
        // Line y = lQ
        let lineYPx = H/2 - lQ * GridSize;
        ctx.beginPath(); ctx.moveTo(0, lineYPx); ctx.lineTo(W, lineYPx); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth=3; ctx.stroke();

        let statStr = document.getElementById('circ-line-status');
        if(Math.abs(lQ) < 3) {
            statStr.innerText = `Stato: 🔵 SECANTE (Δ > 0) -> 2 Punti d'impatto`; statStr.style.color = '#3b82f6';
            // Draw points
            let dX = Math.sqrt(9 - (lQ*lQ));
            let p1 = toPx(W, H, dX, lQ), p2 = toPx(W, H, -dX, lQ);
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(p1.x, p1.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(p2.x, p2.y, 5, 0, Math.PI*2); ctx.fill();
        } else if(Math.abs(lQ) === 3) {
            statStr.innerText = `Stato: 🟡 TANGENTE (Δ = 0) -> 1 Punto d'impatto`; statStr.style.color = '#f59e0b';
            let pt = toPx(W, H, 0, lQ);
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2); ctx.fill();
        } else {
            statStr.innerText = `Stato: 🔴 ESTERNA (Δ < 0) -> Nessun Tocco`; statStr.style.color = '#ef4444';
        }
    }
    window.updateCircLine = function() { lQ = parseFloat(document.getElementById('line-q').value); drawCircLine(); }
    if(cLine) drawCircLine();

    // --- TWO CIRCLES COLLISION ---
    const cTwoCirc = document.getElementById('twoCircCanvas');
    let cx2 = 5; // Second circle x pos
    function drawTwoCirc() {
        if(!cTwoCirc) return;
        const ctx = cTwoCirc.getContext('2d'); const W = cTwoCirc.width, H = cTwoCirc.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);
        
        // Base Circle 1: x^2 + y^2 = 16 (r=4, centered)
        let r1 = 4;
        let c1PX = toPx(W, H, 0, 0);
        ctx.beginPath(); ctx.arc(c1PX.x, c1PX.y, r1*GridSize, 0, Math.PI*2); ctx.strokeStyle = '#a855f7'; ctx.lineWidth=2; ctx.stroke();

        // Moving Circle 2: (x - cx2)^2 + y^2 = 9 (r=3)
        let r2 = 3;
        let c2PX = toPx(W, H, cx2, 0);
        ctx.beginPath(); ctx.arc(c2PX.x, c2PX.y, r2*GridSize, 0, Math.PI*2); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth=2; ctx.stroke();

        let distC = Math.abs(cx2);
        let statStr = document.getElementById('two-circ-status');
        if (distC > r1+r2 || distC < Math.abs(r1-r2)) {
            statStr.innerText = `Stato: 🔴 NESSUNA INTERSEZIONE (Sistema impossibile)`; statStr.style.color = '#ef4444';
        } else if (distC === r1+r2 || distC === Math.abs(r1-r2)) {
            statStr.innerText = `Stato: 🟡 TANGENTI (1 Punto Comune)`; statStr.style.color = '#f59e0b';
            let ptX = (r1 * cx2) / (r1+r2); // Approximation logic visually
            let pt = toPx(W, H, cx2 > 0 ? ptX : -Math.abs(ptX), 0);
            if(distC === Math.abs(r1-r2)) pt = toPx(W, H, cx2 > 0 ? r1 : -r1, 0); // Inner tangent 
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2); ctx.fill();
        } else {
            statStr.innerText = `Stato: 🔵 SECANTI (2 Punti d'impatto)`; statStr.style.color = '#3b82f6';
            // Calculating true intersection points (x^2 + y^2 = r1^2 and (x-cx2)^2 +y^2 = r2^2)
            // Subtracting: x^2 - (x-cx2)^2 = r1^2 - r2^2 -> 2*x*cx2 - cx2^2 = r1^2 - r2^2 
            let xi = (r1*r1 - r2*r2 + cx2*cx2) / (2 * cx2);
            let yi = Math.sqrt(r1*r1 - xi*xi);
            
            let p1 = toPx(W, H, xi, yi);
            let p2 = toPx(W, H, xi, -yi);
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(p1.x, p1.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(p2.x, p2.y, 5, 0, Math.PI*2); ctx.fill();
            
            // Draw Asse Radicale in real time
            ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y - 100); ctx.lineTo(p2.x, p2.y + 100); ctx.stroke(); ctx.setLineDash([]);
        }
    }
    window.updateTwoCirc = function() { cx2 = parseFloat(document.getElementById('circ2-x').value); drawTwoCirc(); }
    if(cTwoCirc) drawTwoCirc();

    // --- ELLIPSE & HYPERBOLA ---
    const cEll = document.getElementById('ellCanvas');
    let eA = 6, eB = 3;
    function drawEll() {
        if(!cEll) return;
        const ctx = cEll.getContext('2d'); const W = cEll.width, H = cEll.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);
        
        let cx = W/2, cy = H/2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, eA*GridSize, eB*GridSize, 0, 0, Math.PI*2);
        ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 3; ctx.stroke();

        // Draw Foci
        let focusDist = 0;
        if(eA > eB) focusDist = Math.sqrt(eA*eA - eB*eB);
        else focusDist = Math.sqrt(eB*eB - eA*eA);

        ctx.fillStyle = '#fff';
        if(eA >= eB) {
            let f1 = toPx(W, H, focusDist, 0); let f2 = toPx(W, H, -focusDist, 0);
            ctx.beginPath(); ctx.arc(f1.x, f1.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(f2.x, f2.y, 4, 0, Math.PI*2); ctx.fill();
        } else {
            let f1 = toPx(W, H, 0, focusDist); let f2 = toPx(W, H, 0, -focusDist);
            ctx.beginPath(); ctx.arc(f1.x, f1.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(f2.x, f2.y, 4, 0, Math.PI*2); ctx.fill();
        }
    }
    window.updateEll = function() { eA = parseInt(document.getElementById('ell-a').value); eB = parseInt(document.getElementById('ell-b').value); drawEll(); }
    if(cEll) drawEll();

    const cHyp = document.getElementById('hypCanvas');
    let hA = 3, hB = 2;
    function drawHyp() {
        if(!cHyp) return;
        const ctx = cHyp.getContext('2d'); const W = cHyp.width, H = cHyp.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);

        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        ctx.beginPath();
        for(let py = -10; py <= 10; py+= 0.1) {
            let px = hA * Math.sqrt(1 + (py*py)/(hB*hB));
            let rP = toPx(W,H, px, py);
            if(py===-10) ctx.moveTo(rP.x, rP.y); else ctx.lineTo(rP.x, rP.y);
        }
        ctx.stroke();
        ctx.beginPath();
        for(let py = -10; py <= 10; py+= 0.1) {
            let px = -hA * Math.sqrt(1 + (py*py)/(hB*hB));
            let rP = toPx(W,H, px, py);
            if(py===-10) ctx.moveTo(rP.x, rP.y); else ctx.lineTo(rP.x, rP.y);
        }
        ctx.stroke();

        // Asymptotes: y = (b/a)x and y = -(b/a)x
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        let aSlope = hB/hA;
        let pL1 = toPx(W,H, -15, -15*aSlope), pR1 = toPx(W,H, 15, 15*aSlope);
        ctx.moveTo(pL1.x, pL1.y); ctx.lineTo(pR1.x, pR1.y); ctx.stroke();
        
        ctx.beginPath();
        let pL2 = toPx(W,H, -15, 15*aSlope), pR2 = toPx(W,H, 15, -15*aSlope);
        ctx.moveTo(pL2.x, pL2.y); ctx.lineTo(pR2.x, pR2.y); ctx.stroke();
        ctx.setLineDash([]);
    }
    window.updateHyp = function() { hA = parseInt(document.getElementById('hyp-a').value); hB = parseInt(document.getElementById('hyp-b').value); drawHyp(); }
    if(cHyp) drawHyp();

    // --- PARABOLA ---
    const cPar = document.getElementById('parabCanvas');
    let pA = 1, pB = 0, pC = 0;
    function drawParab() {
        if(!cPar) return;
        const ctx = cPar.getContext('2d'); const W = cPar.width, H = cPar.height;
        ctx.clearRect(0,0,W,H); drawGrid(ctx, W, H);
        if (pA === 0) return;
        ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
        for (let px = -15; px <= 15; px += 0.1) {
            let py = pA*(px*px) + pB*px + pC;
            let scr = toPx(W, H, px, py);
            if(px === -15) ctx.moveTo(scr.x, scr.y); else ctx.lineTo(scr.x, scr.y);
        }
        ctx.stroke();
        
        let xv = -pB / (2*pA); let delta = (pB*pB) - (4*pA*pC); let yv = -delta / (4*pA);
        let vPx = toPx(W, H, xv, yv);
        ctx.beginPath(); ctx.arc(vPx.x, vPx.y, 6, 0, Math.PI*2); ctx.fillStyle = '#ec4899'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        document.getElementById('parab-stats-display').innerText = `Vertice V(${xv.toFixed(2)}, ${yv.toFixed(2)})`;
    }
    window.updateParab = function() {
        pA = parseFloat(document.getElementById('parab-a').value); if(pA === 0) { pA = 0.1; document.getElementById('parab-a').value = pA; }
        pB = parseFloat(document.getElementById('parab-b').value); pC = parseFloat(document.getElementById('parab-c').value);
        let sB = pB >= 0 ? '+ ' + pB : '- ' + Math.abs(pB); let sC = pC >= 0 ? '+ ' + pC : '- ' + Math.abs(pC);
        document.getElementById('parab-eq-display').innerText = `y = ${pA}x² ${sB}x ${sC}`;
        drawParab();
    }
    if(cPar) drawParab();

    // QUIZ
    const quizData = [
        { question: "1. Che cos'è il cono in geometria analitica e da dove derivano le 'Coniche'?", options: ["Il perimetro di un cerchio chiuso che si espande.", "Un solido tridimensionale infinito formato da due falde opposte, sezionato da un piano d'inclinazione variabile.", "Un singolo triangolo rotante nel 3D."], correct: 1 },
        { question: "2. Nello studio dell'intersezione matematica tra retta e circonferenza effettuato col 'Sistema di Sostituzione', cosa ci indica un Discriminante (Delta) negativo?", options: ["Che la retta passa esattamente per il centro della circonferenza matematica.", "Che la retta è secante e sicura, tagliando la circonferenza in due punti massimi reali.", "Che non ci sono punti fisici d'intersezione reali nel sistema e la retta passerà esterna!"], correct: 2 },
        { question: "3. Come si allunga ed espande l'Ellisse, e come si può tracciare analogicamente su di un prato?", options: ["Meno è tonda, più la figura ruota su se stessa come una Parabola libera.", "Più è allungata, più i due Fuochi interni si distanziano. E' tracciabile fisicamente spina a spina con due chiodi fissati nei fuochi stessi e una singola fune tesa ('Metodo del giardiniere')!", "L'allungamento non modifica l'unico fuoco solitario centrale. Si disegna piegando una canna."], correct: 1 },
        { question: "4. Per quale incredibile proprietà fisica e geometrica i fari delle auto e le antenne satellitari assumono sempre la forma 3D di 'Paraboloide'?", options: ["L'aerodinamica del Paraboloide sfonda costantemente il muro del vento riducendo gli attriti massimi atmosferici.", "Perché ogni raggio che impatta sulle pareti parallelamente all'asse, al suo rimbalzo va proiettato geometricamente e perentoriamente sul medesimo 'Punto di Fuoco' (o viceversa sparandosi fuori!).", "Perché deviano naturalmente e disordinatamente la luce solare rendendola invisibile ad occhio iridato."], correct: 1 }
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
                            scoreEl.textContent = `Punteggio totale galattico: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Perfetto! Architetto delle traiettorie Celesti.":"Ottimo, ma studia bene le intersezioni dei sistemi.");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else { btn.classList.add('wrong'); btn.innerHTML += " <strong>✗ Sbagliato, attenzione!</strong>"; btn.disabled = true; }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv); quizArea.appendChild(qDiv);
        });
    }
});
