document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       CANVAS 1: POLIGONI E ANGOLI ESTERNI
       ========================= */
    const polyCanvas = document.getElementById('polygonCanvas');
    if (polyCanvas) {
        const ctxPoly = polyCanvas.getContext('2d');
        let sides = 3; 
        let isSliding = false; 
        let animProgress = 0;

        function drawPolygon() {
            ctxPoly.clearRect(0, 0, polyCanvas.width, polyCanvas.height);
            ctxPoly.save();
            ctxPoly.translate(polyCanvas.width/2, polyCanvas.height/2);

            let r = 80;
            const angleStep = (Math.PI * 2) / sides;
            ctxPoly.beginPath();
            for(let i=0; i<sides; i++){
                const x = r * Math.cos(i*angleStep - Math.PI/2);
                const y = r * Math.sin(i*angleStep - Math.PI/2);
                if(i===0) ctxPoly.moveTo(x, y);
                else ctxPoly.lineTo(x, y);
            }
            ctxPoly.closePath();
            ctxPoly.fillStyle = 'rgba(59, 130, 246, 0.1)';
            ctxPoly.fill();
            ctxPoly.strokeStyle = '#3B82F6';
            ctxPoly.lineWidth = 2;
            ctxPoly.stroke();

            let translationFactor = 1 - animProgress; 
            for(let i=0; i<sides; i++){
                const a1 = i*angleStep - Math.PI/2;
                const a2 = (i+1)*angleStep - Math.PI/2;
                const v1x = r * Math.cos(a1), v1y = r * Math.sin(a1);
                const v2x = r * Math.cos(a2), v2y = r * Math.sin(a2);

                const extDx = v2x - v1x, extDy = v2y - v1y;
                const extLen = Math.sqrt(extDx*extDx + extDy*extDy);
                const ux = extDx/extLen, uy = extDy/extLen;
                
                const v3x = r * Math.cos((i+2)*angleStep - Math.PI/2);
                const v3y = r * Math.sin((i+2)*angleStep - Math.PI/2);
                const nextDx = v3x - v2x, nextDy = v3y - v2y;
                
                let angleA = Math.atan2(uy, ux);
                let angleB = Math.atan2(nextDy, nextDx);

                let renderX = v2x * translationFactor;
                let renderY = v2y * translationFactor;

                ctxPoly.beginPath();
                ctxPoly.moveTo(renderX, renderY);
                ctxPoly.lineTo(renderX + ux*50, renderY + uy*50);
                ctxPoly.strokeStyle = 'rgba(16, 185, 129, 0.4)';
                ctxPoly.stroke();

                ctxPoly.beginPath();
                ctxPoly.moveTo(renderX, renderY);
                ctxPoly.arc(renderX, renderY, 40, angleA, angleB, false);
                ctxPoly.closePath();
                ctxPoly.fillStyle = `hsl(${(i * 360 / sides)}, 60%, 50%)`;
                ctxPoly.fill();
            }
            ctxPoly.restore();
            
            ctxPoly.fillStyle = '#333';
            ctxPoly.font = '14px Inter, sans-serif';
            ctxPoly.fillText(`Numero Lati: ${sides}`, 10, 20);
            
            let percentage = Math.round(animProgress * 100);
            if(animProgress > 0) ctxPoly.fillText(`Convergenza: ${percentage}% -> Giro Costituito (360°)`, 10, 45); 
        }

        drawPolygon();

        document.getElementById('btnPolyInteract').addEventListener('click', () => {
            if(!isSliding) {
                sides++;
                if(sides > 10) sides = 3;
                animProgress = 0; drawPolygon();
            }
        });

        document.getElementById('btnPolySlide').addEventListener('click', () => {
            if(isSliding) return;
            isSliding = true; animProgress = 0;
            
            function animate() {
                animProgress += 0.02;
                if(animProgress >= 1) animProgress = 1;
                drawPolygon();
                
                if(animProgress < 1) requestAnimationFrame(animate);
                else { setTimeout(() => { isSliding = false; animProgress = 0; drawPolygon(); }, 2500); }
            }
            animate();
        });

        document.getElementById('btnPolyReset').addEventListener('click', () => {
            isSliding = false;
            animProgress = 0;
            sides = 3;
            drawPolygon();
        });
    }

    /* =========================
       CANVAS 1.5: ALTEZZE (HEIGHTS)
       ========================= */
    const heightCanvas = document.getElementById('heightCanvas');
    if (heightCanvas) {
        const ctxH = heightCanvas.getContext('2d');
        let hState = 0; // 0=AB, 1=BC, 2=CA base

        // Un triangolo volutamente OTTUSANGOLO per forzare altezze esterne
        // L'angolo in B è super-ottuso. Coordinate bilanciate per Canvas.
        const pts = [
            { x: 80, y: 160, label: 'A' },
            { x: 240, y: 160, label: 'B' },
            { x: 400, y: 20, label: 'C' }
        ];

        function drawHeightDemo() {
            ctxH.clearRect(0, 0, heightCanvas.width, heightCanvas.height);
            
            // Definisce quale dei 3 lati del triangolo viene considerato come 'BASE' (ground)
            let baseIdx1 = hState;
            let baseIdx2 = (hState + 1) % 3;
            let topIdx   = (hState + 2) % 3;
            
            let v1 = pts[baseIdx1];
            let v2 = pts[baseIdx2];
            let pt = pts[topIdx]; // Il vertice che casca verso la base

            // Calculate direction of the base line
            let dx = v2.x - v1.x;
            let dy = v2.y - v1.y;
            let len2 = dx*dx + dy*dy;
            
            // Projection Factor 't' to find intersection point 'Q'
            let t = ((pt.x - v1.x)*dx + (pt.y - v1.y)*dy) / len2;
            let Qx = v1.x + t*dx;
            let Qy = v1.y + t*dy;

            // DRAW BASE EXTENSION DOTTED IF EXTERIOR
            ctxH.beginPath();
            ctxH.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // Faded Green
            ctxH.lineWidth = 2;
            ctxH.setLineDash([8, 8]);
            
            // Draw a massive infinite floor line representing the entire extension of the segment
            let floor1X = v1.x - dx * 2; let floor1Y = v1.y - dy * 2;
            let floor2X = v2.x + dx * 2; let floor2Y = v2.y + dy * 2;
            ctxH.moveTo(floor1X, floor1Y);
            ctxH.lineTo(floor2X, floor2Y);
            ctxH.stroke();
            ctxH.setLineDash([]);

            // DRAW ALTEZZA (HEIGHT DRIP FROM VERTEX)
            ctxH.beginPath();
            ctxH.strokeStyle = '#EF4444'; // Red
            ctxH.lineWidth = 3;
            ctxH.setLineDash([6, 4]);
            ctxH.moveTo(pt.x, pt.y);
            ctxH.lineTo(Qx, Qy);
            ctxH.stroke();
            ctxH.setLineDash([]);

            // DRAW THE TRIANGLE (THICK SOLID)
            ctxH.beginPath();
            ctxH.strokeStyle = '#10B981'; // Green Solid
            ctxH.lineWidth = 5;
            ctxH.moveTo(pts[0].x, pts[0].y);
            ctxH.lineTo(pts[1].x, pts[1].y);
            ctxH.lineTo(pts[2].x, pts[2].y);
            ctxH.closePath();
            ctxH.stroke();

            // Riempi in base alla "base" illuminata
            ctxH.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctxH.fill();
            
            // Evidenzia visivamente il segmento BASE attivo
            ctxH.beginPath();
            ctxH.strokeStyle = '#F59E0B'; // Spessa riga Gold
            ctxH.lineWidth = 7;
            ctxH.moveTo(v1.x, v1.y);
            ctxH.lineTo(v2.x, v2.y);
            ctxH.stroke();

            // DRAW VERTEX LABELS
            ctxH.font = 'bold 18px sans-serif';
            ctxH.fillStyle = '#1e293b';
            pts.forEach(p => {
                ctxH.fillText(p.label, p.x + (p.x>200? 10 : -25), p.y + (p.y>100? 25 : -10));
            });

            // DRAW PERPENDICULAR RECT AT 'Q' To prove 90°
            let uDx = dx/Math.sqrt(len2); let uDy = dy/Math.sqrt(len2);
            let perpX = -uDy; let perpY = uDx;
            if( ((pt.x - Qx)*perpX + (pt.y - Qy)*perpY) < 0 ) { perpX = -perpX; perpY = -perpY; }
            
            ctxH.beginPath();
            let sqSize = 15;
            ctxH.moveTo(Qx, Qy);
            ctxH.lineTo(Qx + uDx*sqSize, Qy + uDy*sqSize);
            ctxH.lineTo(Qx + uDx*sqSize + perpX*sqSize, Qy + uDy*sqSize + perpY*sqSize);
            ctxH.lineTo(Qx + perpX*sqSize, Qy + perpY*sqSize);
            ctxH.closePath();
            ctxH.strokeStyle = '#EF4444';
            ctxH.lineWidth = 2;
            ctxH.fillStyle = 'rgba(239, 68, 68, 0.2)';
            ctxH.fill();
            ctxH.stroke();

            // Text Explanation
            ctxH.fillStyle = '#333';
            ctxH.font = '16px sans-serif';
            ctxH.fillText("Base Corrente Evidenziata Gialla: " + v1.label + "-" + v2.label, 15, 25);
            ctxH.fillStyle = '#EF4444';
            let isExternal = (t < 0 || t > 1);
            let extWord = isExternal ? "(Cade palesemente all'ESTERNO)" : "(Cade Regolarmente all'INTERNO)";
            ctxH.fillText("Altezza scende dal Vertice: " + pt.label + " " + extWord, 15, 48);
        }

        drawHeightDemo();
        document.getElementById('btnHeightToggle').addEventListener('click', () => {
            hState = (hState + 1) % 3;
            drawHeightDemo();
        });
    }

    /* =========================
       CANVAS 2: TEOREMA DI PITAGORA
       ========================= */
    const mainCanvas = document.getElementById('mainCanvas');
    if (mainCanvas) {
        const ctxMain = mainCanvas.getContext('2d');
        const btnInteractMain = document.getElementById('btnInteract');
        const btnResetMain = document.getElementById('btnReset');
        let fluidState = 0;

        function drawPitagora() {
            ctxMain.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            let sFillA = '#3B82F6', sFillB = '#EC4899';
            
            ctxMain.save();
            ctxMain.translate(mainCanvas.width/2 - 20, mainCanvas.height/2 + 20);
            const base = 60, height = 80;
            ctxMain.beginPath(); ctxMain.moveTo(0,0); ctxMain.lineTo(base,0); ctxMain.lineTo(0,-height); ctxMain.closePath(); 
            ctxMain.strokeStyle = '#0f172a'; ctxMain.lineWidth = 2; ctxMain.stroke();
            
            ctxMain.fillStyle = sFillB;
            const fillWidthB = base;
            const fillHeightB = base * (1 - fluidState);
            ctxMain.fillRect(0, 0, fillWidthB, fillHeightB);
            ctxMain.strokeRect(0,0, base, base);

            ctxMain.fillStyle = sFillA;
            const fillWidthA = height;
            const fillHeightA = height * (1 - fluidState);
            ctxMain.fillRect(-fillWidthA, -fillHeightA, fillWidthA, fillHeightA);
            ctxMain.strokeRect(-height, -height, height, height);

            ctxMain.save();
            ctxMain.translate(base, 0); 
            const angle = Math.atan2(-height, -base); 
            ctxMain.rotate(angle);
            const hypo = Math.sqrt(base*base + height*height);
            ctxMain.strokeRect(0, 0, hypo, hypo);
            
            if(fluidState > 0) {
                let fillFactor = hypo * fluidState;
                ctxMain.fillStyle = '#10B981'; 
                ctxMain.fillRect(0, hypo - fillFactor, hypo, fillFactor);
            }
            ctxMain.restore(); ctxMain.restore();
        }

        drawPitagora();

        btnInteractMain.addEventListener('click', () => {
            fluidState = 0;
            function runAnim() {
                fluidState += 0.02;
                if(fluidState >= 1) fluidState = 1;
                drawPitagora();
                if(fluidState < 1) requestAnimationFrame(runAnim);
            }
            runAnim();
        });

        btnResetMain.addEventListener('click', () => { fluidState = 0; drawPitagora(); });
    }

    /* =========================
       CANVAS 3: ORIGAMI FOLDING
       ========================= */
    const origamiCanvas = document.getElementById('origamiCanvas');
    if (origamiCanvas) {
        const ctxO = origamiCanvas.getContext('2d');
        let foldState = 0; // 0=Square, 1=Half, 2=House, 3=Hat/Boat
        
        function drawOrigami() {
            ctxO.clearRect(0, 0, origamiCanvas.width, origamiCanvas.height);
            let cx = origamiCanvas.width / 2;
            let cy = origamiCanvas.height / 2;

            if (foldState === 0) {
                ctxO.fillStyle = '#f8fafc';
                ctxO.strokeStyle = '#1e293b';
                ctxO.lineWidth = 2;
                ctxO.fillRect(cx - 100, cy - 100, 200, 200);
                ctxO.strokeRect(cx - 100, cy - 100, 200, 200);
                
                // Add a cute center dashed line indicating the next fold
                ctxO.beginPath();
                ctxO.setLineDash([5,5]);
                ctxO.moveTo(cx - 100, cy);
                ctxO.lineTo(cx + 100, cy);
                ctxO.strokeStyle = '#94a3b8';
                ctxO.stroke();
                ctxO.setLineDash([]);
                
                ctxO.fillStyle = '#333'; ctxO.font = '14px Inter, sans-serif'; ctxO.textAlign='center';
                ctxO.fillText("Foglio Quadrato Intatto (20x20)", cx, cy - 120);

            } else if (foldState === 1) {
                // Vecchio quadrato sfumato
                ctxO.strokeStyle = 'rgba(30, 41, 59, 0.2)';
                ctxO.strokeRect(cx - 100, cy - 100, 200, 200);
                
                // Nuovo rettangolo piegato
                ctxO.fillStyle = '#cbd5e1';
                ctxO.fillRect(cx - 100, cy, 200, 100);
                ctxO.strokeStyle = '#1e293b';
                ctxO.strokeRect(cx - 100, cy, 200, 100);
                
                // Linee di piega future (center vertical)
                ctxO.beginPath(); ctxO.setLineDash([5,5]);
                ctxO.moveTo(cx, cy); ctxO.lineTo(cx, cy + 100);
                ctxO.strokeStyle = '#ef4444'; ctxO.stroke(); ctxO.setLineDash([]);

                ctxO.fillStyle = '#333'; ctxO.font = '14px Inter, sans-serif'; ctxO.textAlign='center';
                ctxO.fillText("Fase 1. Piega a 'Montagna' Orizzontale a Metà", cx, cy - 120);
                
            } else if (foldState === 2) {
                // House shape
                ctxO.fillStyle = '#94a3b8';
                ctxO.beginPath();
                ctxO.moveTo(cx, cy); // top peak
                ctxO.lineTo(cx + 100, cy + 50);
                ctxO.lineTo(cx + 100, cy + 100);
                ctxO.lineTo(cx - 100, cy + 100);
                ctxO.lineTo(cx - 100, cy + 50);
                ctxO.closePath();
                ctxO.fill();
                ctxO.strokeStyle = '#1e293b';
                ctxO.stroke();
                
                // Le alette ripiegate giu
                ctxO.beginPath(); ctxO.setLineDash([]);
                ctxO.moveTo(cx, cy); ctxO.lineTo(cx, cy + 100); ctxO.stroke(); // center

                // Horizontal bottom flaps fold hints
                ctxO.beginPath(); ctxO.setLineDash([5,5]);
                ctxO.moveTo(cx - 100, cy + 70); ctxO.lineTo(cx + 100, cy + 70);
                ctxO.strokeStyle = '#ef4444'; ctxO.stroke(); ctxO.setLineDash([]);

                ctxO.fillStyle = '#333'; ctxO.font = '14px Inter, sans-serif'; ctxO.textAlign='center';
                ctxO.fillText("Fase 2. Triangoli Laterali Ribaltati (Profilo Pentago-Casa)", cx, cy - 120);

            } else if (foldState >= 3) {
                // Boat Hat
                ctxO.fillStyle = '#94a3b8';
                ctxO.beginPath();
                ctxO.moveTo(cx, cy - 20); // peak a po' piu su per estetica
                ctxO.lineTo(cx + 100, cy + 60);
                ctxO.lineTo(cx - 100, cy + 60);
                ctxO.closePath();
                ctxO.fill(); ctxO.stroke();
                
                // Bordo piegato su
                ctxO.fillStyle = '#cbd5e1';
                ctxO.beginPath();
                ctxO.moveTo(cx - 120, cy + 60);
                ctxO.lineTo(cx + 120, cy + 60);
                ctxO.lineTo(cx + 80, cy + 100);
                ctxO.lineTo(cx - 80, cy + 100);
                ctxO.closePath();
                ctxO.fill(); ctxO.stroke();

                ctxO.fillStyle = '#333'; ctxO.font = '14px Inter, sans-serif'; ctxO.textAlign='center';
                ctxO.fillText("Fase finale 3. Ali sollevate all'insù = Il Cappello/Barchetta!", cx, cy - 120);
                ctxO.fillStyle = '#10B981'; ctxO.font = 'bold 20px Inter, sans-serif';
                ctxO.fillText("Origami Compiuto!", cx, cy + 150);
            }
        }
        
        drawOrigami();

        document.getElementById('btnOrigamiFold').addEventListener('click', () => {
            if(foldState < 3) {
                foldState++;
                drawOrigami();
            }
        });
        document.getElementById('btnOrigamiReset').addEventListener('click', () => {
            foldState = 0;
            drawOrigami();
        });
    }

    /* =========================
       MULTI-QUESTION QUIZ
       ========================= */
    const quizData = [
        {
            question: "1. Come definiremmo formalmente l'altezza di un triangolo?",
            options: [
                "È la riga che divide a metà gli angoli.",
                "Un perno verticale tracciato verso il nucleo del perimetro di massa.",
                "E' la linea che scende o viaggia PERPENDICOLARMENTE (in obliquo pure all'esterno da un angolo spanciato ottuso) da uno dei vertici intersecandosi a piombo mortale sul relativo e spietato confine del lato opposto."
            ], correct: 2
        },
        {
            question: "2. Che cosa scaturisce dall'Ortocentro?",
            options: [
                "È l'urto catastrofico al centro della cellula base dove le 3 Altezze del triangolo si trafiggono collidendo intersezionalmente e simultaneamente tra loro.",
                "Centro cosmico che chiude sempre una sfera d'oro magico.",
                "Crea i lati per formare 360 gradi a cono"
            ], correct: 0
        },
        {
            question: "3. Come si verifica matematicamente con 100% certezza il criterio geometrico di LAL? (Lati-Angolo-Lati)",
            options: [
                "I tre triangoli risultano isosceli se sovrapposti al quadrato",
                "Due triangoli possiedono appuratamente DUE lati che spadroneggiano eguali, e condividono esattamente lo *stesso* scomparto di angolazione avvolto intrappolato in mezzo ad essi. Ergo, la congiunzione fa del resto rendendo le tre copie cloni inamovibili.",
                "Il triangolo è circondato da tre angoli in sommitudine a tre curve speculari irrazionali."
            ], correct: 1
        },
        {
            question: "4. Cosa narra il raccapricciante ed emblematico segreto Pitagorico di Ippaso di Metaponto?",
            options: [
                "Ippaso assassinò Pitagora rubando i grafici del triangolo ottuso rubato in Egitto.",
                "Applicando il teorema col calcolo speculato per un lato basilare di valore 1 trovò incocciato che la diagonale formicolava folle verso la rotta della Radice Irrazionale (numerica imperfetta scriteriata senza limiti logici frazionanti naturali), frastagliando bruscamente le speranze mistiche della gilda per cui venne forse punito o asfissiato tragicamente per segreto occultista dei numeratori.",
                "Calcolando il miele dell'ingegneristica Esagonale, scoprì l'apiario perfetto delle api"
            ], correct: 1
        },
        {
            question: "5. Se tagli un triangolino specchiante in due rintracciando la mediana perfetta della sua struttura per metà (Isoscele) qual'è il pregevole trucco geometrico indiscusso che insorge?",
            options: [
                "Che la linea spezzata fa magicamente e brutalmente pure da Altezza, smembrando il colosso in due triangoli Rettangoli genetici speculari e garantendo una precisione ingegneristica per cui Altezza, Mediana e Bisettrice convergono fusi magicamente.",
                "Perde congruenza distaccandosi dai 180° imposti euclidei.",
                "Nessuno, un triangolo diviene ottuso e forma il rombo."
            ], correct: 0
        },
        {
            question: "6. Quale prodigio matematico vanta segretamente l'astuta arte degli Origami giapponesi incassata tra le falangi delle creste cartacee?",
            options: [
                "Vanta l'incredibile ma tangibile potere di risultare mostruosamente più formidabile ed elaborata del rigido compartimento 'Riga e Compasso'. Attraverso le piegature riesce a eludere astutamente i limiti classici permettendo incantesimi preclusi ai Greci: prima fra cui la famigerata Trisezione angolare perfetta in 3 spicchi.",
                "Usano la colla a caldo che viola le equazioni euclidee dei piani.",
                "Serve a determinare lo spessore dell'Universo."
            ], correct: 0
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
                            scoreEl.textContent = `Punteggio Finale Esplosivo: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Sei un vero colosso di Teoremi incrociati perfetti!":"Davvero un lavoro eccellente ma ci sono lacune da rimarginare attentamente!");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Fatalità Riprova!</strong>";
                        btn.disabled = true;
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }
});
