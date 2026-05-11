document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mainCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        const btnInteract = document.getElementById('btnInteract');
        const btnReset = document.getElementById('btnReset');
        let state = 0;
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            
            // Draw transversal line
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-100, -150);
            ctx.lineTo(-100, 150);
            ctx.stroke();

            // Line 1 top
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-200, -50);
            ctx.lineTo(20, -10);
            ctx.stroke();

            // Line 2 bot
            ctx.beginPath();
            ctx.moveTo(-200, 50);
            ctx.lineTo(20, 15);
            ctx.stroke();

            // Angles
            if (state >= 0) {
                // top angle
                ctx.beginPath();
                ctx.arc(-100, -32, 20, 0, 0.4);
                ctx.strokeStyle = '#EF4444';
                ctx.stroke();
                ctx.fillStyle = '#EF4444';
                ctx.font = '14px sans-serif';
                ctx.fillText("α", -80, -10);
                
                // bot angle
                ctx.beginPath();
                ctx.arc(-100, 33, 20, 5.8, Math.PI*2);
                ctx.stroke();
                ctx.fillText("β", -80, 25);
            }

            // Draw extension intersecting
            if (state >= 1) {
                ctx.strokeStyle = '#EF4444';
                ctx.setLineDash([5, 5]);
                
                ctx.beginPath();
                ctx.moveTo(20, -10);
                // intercept at x=250 approx
                ctx.lineTo(150, 13);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(20, 15);
                ctx.lineTo(150, -5);
                ctx.stroke();
                
                ctx.setLineDash([]);
                
                // Dot at intersection
                ctx.beginPath();
                ctx.arc(130, 9, 6, 0, Math.PI*2);
                ctx.fillStyle = '#EF4444';
                ctx.fill();
            }

            ctx.restore();
            
            ctx.fillStyle = '#333'; ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            if (state === 0) {
                ctx.fillText("Due rette tagliate da una trasversale:  α + β < 180°", canvas.width/2, 30);
            } else {
                ctx.fillText("Prolungandosi, si INCROCIANO irrevocabilmente!", canvas.width/2, 30);
            }
        }

        draw();
        btnInteract.addEventListener('click', () => { state = 1; draw(); });
        btnReset.addEventListener('click', () => { state = 0; draw(); });
    }

    // MULTI-QUESTION QUIZ
    const quizData = [
        {
            question: "1. Quanti sono i postulati fondamentali di Euclide?",
            options: ["Tre", "Cinque", "Dieci", "Infiniti"], correct: 1
        },
        {
            question: "2. Che differenza c'è tra Assioma e Teorema?",
            options: [
                "Sono la stessa cosa, sinonimi latini e greci",
                "Il teorema è autoevidente e banale, l'assioma va dimostrato minuziosamente in più pagine",
                "L'assioma si dà per vero in quanto autoevidente, il teorema necessita di rigorosa e deduttiva dimostrazione a cascata"
            ], correct: 2
        },
        {
            question: "3. Qual è l'anomalia unica del celebre V Postulato di Euclide?",
            options: [
                "È la prima legge sulle potenze dei numeri",
                "Assomiglia molto più ad un teorema complesso e articolato, e indusse generazioni di geniali matematici nell'ossessivo tentativo di dimostrarlo senza prenderlo per dogma.",
                "Non si applica su corpi organici ma solo su poligoni"
            ], correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => { b.disabled = true; b.style.cursor='default'; });
                        if (!optionsDiv.querySelector('.wrong')) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            scoreEl.textContent = `Punteggio Finale: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Ottimo! Euclide è orgoglioso di te.":"Ben fatto, ma il postulato rimane un mistero.");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Riprova!</strong>";
                        btn.disabled = true;
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }
    // ----------------------------------------
    // TRANSVERSAL CANVAS — parallele + trasversale interattiva
    // ----------------------------------------
    const tCanvas = document.getElementById('transversalCanvas');
    if (tCanvas) {
        const tc = tCanvas.getContext('2d');
        const TW = tCanvas.width, TH = tCanvas.height;

        // Two fixed parallel horizontal lines
        const Y1 = 100;  // upper parallel y
        const Y2 = 210;  // lower parallel y

        // Transversal: bottom anchor is FIXED, top handle is DRAGGABLE → angle changes
        const BOTTOM_X = 300, BOTTOM_Y = TH - 20; // fixed bottom anchor
        const TOP_Y = 20;                          // fixed top y
        let handleX = 120;  // draggable top-handle x (start left of center)
        let isDrag = false;

        // Angle colours
        const COL = {
            alt:  '#EF4444',   // alterni interni (red)
            coint:'#10B981',   // co-interni (green)
            corr: '#EC4899',   // corrispondenti (pink)
            vert: '#8B5CF6',   // opposti al vertice (purple)
            line: '#3B82F6',   // parallele (blue)
            trans:'#F59E0B',   // trasversale (amber)
        };

        function getIntersections() {
            // Top handle is draggable; bottom anchor is fixed → changing handleX ROTATES the line
            const x0 = handleX, y0 = TOP_Y;      // draggable top point
            const x1 = BOTTOM_X, y1 = BOTTOM_Y;  // fixed bottom point
            const slope = (y1 - y0) / (x1 - x0); // dy/dx

            // Intersection with Y1 (upper parallel)
            const pX = x0 + (Y1 - y0) / slope;
            // Intersection with Y2 (lower parallel)
            const qX = x0 + (Y2 - y0) / slope;

            return { P: { x: pX, y: Y1 }, Q: { x: qX, y: Y2 }, slope, x0, y0, x1, y1 };
        }

        function angleDeg(a) {
            // Convert Math.atan2 result to 0-180
            let d = a * 180 / Math.PI;
            if (d < 0) d += 360;
            if (d > 180) d = 360 - d;
            return Math.round(d);
        }

        function drawArcAngle(cx, cy, r, a0, a1, col, ccw) {
            tc.beginPath();
            tc.moveTo(cx, cy);
            tc.arc(cx, cy, r, a0, a1, ccw || false);
            tc.closePath();
            tc.fillStyle = col.replace(')', ', 0.2)').replace('rgb', 'rgba');
            tc.fill();
            tc.beginPath();
            tc.arc(cx, cy, r, a0, a1, ccw || false);
            tc.strokeStyle = col;
            tc.lineWidth = 1.8;
            tc.stroke();
        }

        function render() {
            tc.clearRect(0, 0, TW, TH);

            const { P, Q, slope, x0, y0, x1, y1 } = getIntersections();

            // transversal angle from horizontal
            const transAngle = Math.atan2(y1 - y0, x1 - x0); // angle of direction top→bottom

            // The 4 angles at each intersection:
            // At P: parallel goes left (π) and right (0). Transversal goes up-left (transAngle-π) and down-right (transAngle).
            // We define:
            // α (top-left): between parallel-left and transversal-upward
            // β (top-right): between transversal-upward and parallel-right = supplementary to α
            // γ (bottom-right): opposite to α
            // δ (bottom-left): opposite to β

            const transUp   = transAngle - Math.PI; // direction upward along transversal
            const transDown = transAngle;            // direction downward

            // Angle between left ray (π) and transversal-downward (transAngle)
            // α₁ = angle measured clockwise from transUp to left-ray (above the parallel at P)
            const alpha = Math.abs((Math.PI - transAngle + 2 * Math.PI) % (2 * Math.PI));
            const alphaDeg = Math.round(Math.abs(Math.PI - transAngle) * 180 / Math.PI);
            const betaDeg  = 180 - alphaDeg;

            // Draw parallel lines
            tc.beginPath();
            tc.moveTo(0, Y1); tc.lineTo(TW, Y1);
            tc.strokeStyle = COL.line; tc.lineWidth = 2.5; tc.stroke();
            tc.beginPath();
            tc.moveTo(0, Y2); tc.lineTo(TW, Y2);
            tc.strokeStyle = COL.line; tc.lineWidth = 2.5; tc.stroke();

            // Labels for parallels
            tc.font = 'bold 14px Inter,sans-serif';
            tc.fillStyle = COL.line;
            tc.textAlign = 'left'; tc.textBaseline = 'middle';
            tc.fillText('r', 8, Y1 - 12);
            tc.fillText('s', 8, Y2 - 12);

            // Draw transversal
            tc.beginPath();
            tc.moveTo(x0, y0); tc.lineTo(x1, y1);
            tc.strokeStyle = COL.trans; tc.lineWidth = 2.5; tc.stroke();
            tc.fillStyle = COL.trans;
            tc.textAlign = 'center'; tc.textBaseline = 'middle';
            tc.fillText('t', x1 + 14, y1);

            // Draggable handle at top anchor — draw with drag-hint arrow
            tc.beginPath();
            tc.arc(x0, y0, 9, 0, 2 * Math.PI);
            tc.fillStyle = 'rgba(245,158,11,0.95)'; tc.fill();
            tc.strokeStyle = '#fff'; tc.lineWidth = 1.8; tc.stroke();
            // hint label
            tc.font = '10px Inter,sans-serif';
            tc.fillStyle = 'rgba(245,158,11,0.8)';
            tc.textAlign = 'center'; tc.textBaseline = 'bottom';
            tc.fillText('← trascina →', x0, y0 - 8);
            // fixed bottom dot
            tc.beginPath();
            tc.arc(BOTTOM_X, BOTTOM_Y, 6, 0, 2 * Math.PI);
            tc.fillStyle = '#F59E0B'; tc.fill();

            // ---- Angle arcs at P ----
            const RA = 30;

            // α₁ (upper-left of P, between parallel-left and transversal-going-up)
            // Clockwise from transUp to Math.PI
            drawArcAngle(P.x, P.y, RA, transUp, Math.PI, COL.corr, false);

            // β₁ (upper-right of P, between parallel-right 0 and transversal-going-up)
            // Clockwise from 0 to transUp (which is transAngle-π, typically negative, i.e. pointing upper-left)
            drawArcAngle(P.x, P.y, RA, transUp - Math.PI, 0, COL.alt, false);

            // γ₁ (lower-right of P, between parallel-right 0 and transversal going down)
            drawArcAngle(P.x, P.y, RA, 0, transDown, COL.corr, false);

            // δ₁ (lower-left of P, between transversal going down and parallel-left π)
            drawArcAngle(P.x, P.y, RA, transDown, Math.PI, COL.coint, false);

            // ---- Angle arcs at Q ---- (same angles, alternate means equal)
            drawArcAngle(Q.x, Q.y, RA, transUp, Math.PI, COL.corr, false);
            drawArcAngle(Q.x, Q.y, RA, transUp - Math.PI, 0, COL.alt, false);
            drawArcAngle(Q.x, Q.y, RA, 0, transDown, COL.corr, false);
            drawArcAngle(Q.x, Q.y, RA, transDown, Math.PI, COL.coint, false);

            // ---- Angle labels ----
            const labelR = 48;
            function putLabel(cx, cy, mid, text, col) {
                tc.font = 'bold 11px Inter,sans-serif';
                tc.fillStyle = col;
                tc.textAlign = 'center'; tc.textBaseline = 'middle';
                tc.fillText(text, cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR);
            }

            // At P
            const midAlpha1 = (transUp + Math.PI) / 2;
            const midBeta1  = (transUp - Math.PI + 0) / 2;   // between transUp-π and 0
            const midGamma1 = (0 + transDown) / 2;
            const midDelta1 = (transDown + Math.PI) / 2;

            putLabel(P.x, P.y, midAlpha1, `α₁\n${alphaDeg}°`, COL.corr);
            putLabel(P.x, P.y, midBeta1,  `β₁\n${betaDeg}°`,  COL.alt);
            putLabel(P.x, P.y, midGamma1, `γ₁\n${alphaDeg}°`, COL.corr);
            putLabel(P.x, P.y, midDelta1, `δ₁\n${betaDeg}°`,  COL.coint);

            // At Q (same values)
            putLabel(Q.x, Q.y, midAlpha1, `α₂\n${alphaDeg}°`, COL.corr);
            putLabel(Q.x, Q.y, midBeta1,  `β₂\n${betaDeg}°`,  COL.alt);
            putLabel(Q.x, Q.y, midGamma1, `γ₂\n${alphaDeg}°`, COL.corr);
            putLabel(Q.x, Q.y, midDelta1, `δ₂\n${betaDeg}°`,  COL.coint);

            // ---- Readout panel at bottom ----
            const panY = TH - 60;
            tc.fillStyle = 'rgba(255,255,255,0.04)';
            tc.beginPath();
            tc.roundRect(10, panY, TW - 20, 52, 8);
            tc.fill();

            tc.font = '11px Inter,sans-serif';
            tc.textAlign = 'center'; tc.textBaseline = 'middle';

            const facts = [
                { text: `γ₁ = α₂ = ${alphaDeg}°  (alterni interni = uguali)`, col: COL.alt },
                { text: `δ₁ + α₂ = ${betaDeg}+${alphaDeg} = ${betaDeg + alphaDeg}°  (co-interni = 180°)`, col: COL.coint },
                { text: `α₁ = α₂ = ${alphaDeg}°  (corrispondenti = uguali)`, col: COL.corr },
            ];
            facts.forEach((f, i) => {
                tc.fillStyle = f.col;
                tc.fillText(f.text, TW / 2, panY + 13 + i * 14);
            });
        }

        render();

        // Drag logic — drag the orange circle at the TOP of the transversal to rotate it
        tCanvas.addEventListener('mousedown', (e) => {
            const rect = tCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            // Hit-test against actual handle position (handleX, TOP_Y)
            if (Math.abs(mx - handleX) < 18 && Math.abs(my - TOP_Y) < 18) {
                isDrag = true;
            }
        });
        tCanvas.addEventListener('mousemove', (e) => {
            if (!isDrag) return;
            const rect = tCanvas.getBoundingClientRect();
            // Clamp so transversal stays visible and slope stays sensible
            handleX = Math.max(20, Math.min(TW - 20, e.clientX - rect.left));
            render();
        });
        tCanvas.addEventListener('mouseup',    () => { isDrag = false; });
        tCanvas.addEventListener('mouseleave', () => { isDrag = false; });

        document.getElementById('btnTransReset')?.addEventListener('click', () => {
            handleX = 120; render();
        });
    }

});
