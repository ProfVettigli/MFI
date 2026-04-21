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

    /* =========================
       CANVAS 4: FAVO DI API (HONEYCOMB)
       ========================= */
    const honeyCanvas = document.getElementById('honeyCanvas');
    if (honeyCanvas) {
        const ctxHoney = honeyCanvas.getContext('2d');
        const HEX_R = 28; // raggio esagono (centro→vertice)
        const CX = honeyCanvas.width / 2;
        const CY = honeyCanvas.height / 2;

        // Coordinate assiali → pixel (flat-top hex)
        function hexToPixel(q, r) {
            const x = CX + HEX_R * (3/2 * q);
            const y = CY + HEX_R * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
            return { x, y };
        }

        // Vertici di un esagono flat-top centrato in (cx,cy)
        function hexVertices(cx, cy) {
            const verts = [];
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i);
                verts.push({ x: cx + HEX_R * Math.cos(angle), y: cy + HEX_R * Math.sin(angle) });
            }
            return verts;
        }

        function drawHex(cx, cy, fillColor, strokeColor) {
            const verts = hexVertices(cx, cy);
            ctxHoney.beginPath();
            ctxHoney.moveTo(verts[0].x, verts[0].y);
            for (let i = 1; i < 6; i++) ctxHoney.lineTo(verts[i].x, verts[i].y);
            ctxHoney.closePath();
            ctxHoney.fillStyle = fillColor;
            ctxHoney.fill();
            ctxHoney.strokeStyle = strokeColor;
            ctxHoney.lineWidth = 2;
            ctxHoney.stroke();
        }

        // Ordine a spirale (anello 0, poi anello 1, poi anello 2…)
        function spiralCells(maxRing) {
            const cells = [{ q: 0, r: 0 }];
            const dirs = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
            for (let ring = 1; ring <= maxRing; ring++) {
                let q = ring, r = -ring;
                // parte da q=ring, r=-ring e gira 6 lati
                for (let side = 0; side < 6; side++) {
                    for (let step = 0; step < ring; step++) {
                        cells.push({ q, r });
                        q += dirs[side][0];
                        r += dirs[side][1];
                    }
                }
            }
            return cells;
        }

        const ALL_CELLS = spiralCells(4); // ~61 celle
        let builtCount = 0;
        let autoTimer = null;

        function countSharedSides(n) {
            // Per n celle disposte in spirale, i lati condivisi crescono
            // in modo approssimato: ogni nuova cella (dopo la prima) condivide in media ~2 lati
            if (n <= 1) return 0;
            // calcolo esatto: per ogni coppia di celle vicine
            const builtSet = new Set();
            for (let i = 0; i < n; i++) builtSet.add(`${ALL_CELLS[i].q},${ALL_CELLS[i].r}`);
            const hexDirs = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
            let shared = 0;
            for (let i = 0; i < n; i++) {
                const {q,r} = ALL_CELLS[i];
                for (const [dq, dr] of hexDirs) {
                    if (builtSet.has(`${q+dq},${r+dr}`)) shared++;
                }
            }
            return shared / 2; // ogni lato condiviso è contato due volte
        }

        function drawHoneycomb() {
            ctxHoney.clearRect(0, 0, honeyCanvas.width, honeyCanvas.height);

            // Griglia sfumata di sfondo
            for (let i = 0; i < ALL_CELLS.length; i++) {
                const {q, r} = ALL_CELLS[i];
                const {x, y} = hexToPixel(q, r);
                drawHex(x, y, 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.07)');
            }

            // Celle costruite
            const colors = ['rgba(16,185,129,0.25)', 'rgba(16,185,129,0.18)', 'rgba(16,185,129,0.12)'];
            for (let i = 0; i < builtCount; i++) {
                const {q, r} = ALL_CELLS[i];
                const {x, y} = hexToPixel(q, r);
                // Sfumatura in base all'anello
                const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(q+r));
                const fill = i === builtCount - 1
                    ? 'rgba(251,191,36,0.4)'   // ultima aggiunta: gialla
                    : colors[Math.min(ring, colors.length - 1)];
                drawHex(x, y, fill, '#10B981');

                // Numero cella
                ctxHoney.fillStyle = 'rgba(255,255,255,0.6)';
                ctxHoney.font = 'bold 9px Inter, sans-serif';
                ctxHoney.textAlign = 'center';
                ctxHoney.textBaseline = 'middle';
                ctxHoney.fillText(i + 1, x, y);
            }

            // Contatori
            const shared = countSharedSides(builtCount);
            const totalSidesIsolated = builtCount * 6;
            const totalSidesActual = totalSidesIsolated - shared * 2;
            const savedPct = totalSidesIsolated > 0
                ? Math.round((shared * 2 / totalSidesIsolated) * 100)
                : 0;

            const cellsEl = document.getElementById('honey-cells');
            const sharedEl = document.getElementById('honey-shared');
            const savedEl  = document.getElementById('honey-saved');
            if (cellsEl)  cellsEl.textContent  = builtCount;
            if (sharedEl) sharedEl.textContent = shared;
            if (savedEl)  savedEl.textContent  = savedPct + '%';
        }

        drawHoneycomb();

        document.getElementById('btnHoneyAdd').addEventListener('click', () => {
            if (builtCount < ALL_CELLS.length) {
                builtCount++;
                drawHoneycomb();
            }
        });

        document.getElementById('btnHoneyAuto').addEventListener('click', () => {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; document.getElementById('btnHoneyAuto').textContent = '▶ Costruzione Automatica'; return; }
            document.getElementById('btnHoneyAuto').textContent = '⏸ Pausa';
            autoTimer = setInterval(() => {
                if (builtCount < ALL_CELLS.length) {
                    builtCount++;
                    drawHoneycomb();
                } else {
                    clearInterval(autoTimer);
                    autoTimer = null;
                    document.getElementById('btnHoneyAuto').textContent = '▶ Costruzione Automatica';
                }
            }, 180);
        });

        document.getElementById('btnHoneyReset').addEventListener('click', () => {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
            document.getElementById('btnHoneyAuto').textContent = '▶ Costruzione Automatica';
            builtCount = 0;
            drawHoneycomb();
        });
    }


    /* =========================
       CANVAS 5: CRITERI DI CONGRUENZA
       ========================= */
    const congruenceCanvas = document.getElementById('congruenceCanvas');
    if (congruenceCanvas) {
        const ctxC = congruenceCanvas.getContext('2d');
        const W = congruenceCanvas.width, H = congruenceCanvas.height;

        let currentCriterion = 'LAL';
        let sliderVal = 90; // angolo libero in gradi (LAL) o altezza libera (LLL)

        const DESCRIPTIONS = {
            LAL: '🔵 <strong>Primo Criterio (L-A-L) – Lato, Angolo, Lato:</strong> Se due triangoli hanno due lati uguali e l\'angolo <em>compreso</em> tra essi uguale, allora i triangoli sono congruenti. Il terzo lato e gli altri due angoli risultano automaticamente determinati.',
            ALA: '🔴 <strong>Secondo Criterio (A-L-A) – Angolo, Lato, Angolo:</strong> Se due triangoli hanno un lato uguale e i due angoli agli estremi di quel lato uguali, allora sono congruenti. Gli altri due lati e l\'angolo rimanente risultano completamente determinati.',
            LLL: '🔵 <strong>Terzo Criterio (L-L-L) – Lato, Lato, Lato:</strong> Se due triangoli hanno tutti e tre i lati corrispondenti uguali, allora sono congruenti. La forma è completamente determinata dalla sola assegnazione dei tre lati (purché soddisfino la disuguaglianza triangolare).'
        };

        // ---- utilità ----
        function deg(r) { return r * 180 / Math.PI; }
        function rad(d) { return d * Math.PI / 180; }

        function drawTriangle(ctx, A, B, C, sideColors, angleColors, fill) {
            // fill
            ctx.beginPath();
            ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y);
            ctx.closePath();
            ctx.fillStyle = fill || 'rgba(255,255,255,0.04)';
            ctx.fill();

            // sides: AB, BC, CA
            const sides = [[A,B,0],[B,C,1],[C,A,2]];
            sides.forEach(([P,Q,i]) => {
                ctx.beginPath();
                ctx.moveTo(P.x,P.y); ctx.lineTo(Q.x,Q.y);
                ctx.strokeStyle = sideColors[i];
                ctx.lineWidth = sideColors[i] === '#3B82F6' ? 4 : 2.5;
                ctx.stroke();
            });

            // tick marks on sides
            sides.forEach(([P,Q,i]) => {
                if (sideColors[i] === '#3B82F6') drawTick(ctx, P, Q, '#3B82F6');
            });

            // angle arcs at A, B, C
            [A,B,C].forEach((vertex, i) => {
                const col = angleColors[i];
                if (col === '#EF4444') {
                    const [P,Q] = [[B,C],[A,C],[A,B]][i];
                    drawAngleArc(ctx, vertex, P, Q, col);
                }
            });

            // vertex labels
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const labels = ['A','B','C'];
            [A,B,C].forEach((v,i) => {
                const off = 18;
                const midX = (A.x+B.x+C.x)/3, midY = (A.y+B.y+C.y)/3;
                const dx = v.x - midX, dy = v.y - midY;
                const len = Math.sqrt(dx*dx+dy*dy)||1;
                ctx.fillText(labels[i], v.x + dx/len*off, v.y + dy/len*off);
            });
        }

        function drawTick(ctx, P, Q, color) {
            const mx = (P.x+Q.x)/2, my = (P.y+Q.y)/2;
            const dx = Q.x-P.x, dy = Q.y-P.y;
            const len = Math.sqrt(dx*dx+dy*dy)||1;
            const nx = -dy/len*8, ny = dx/len*8;
            ctx.beginPath();
            ctx.moveTo(mx-nx/2, my-ny/2);
            ctx.lineTo(mx+nx/2, my+ny/2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // double tick for second side in LLL
        }

        function drawAngleArc(ctx, vertex, P, Q, color) {
            const a1 = Math.atan2(P.y-vertex.y, P.x-vertex.x);
            const a2 = Math.atan2(Q.y-vertex.y, Q.x-vertex.x);
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 22, Math.min(a1,a2), Math.max(a1,a2));
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // Build triangle given criterion + slider value
        // Returns {A,B,C} for left triangle, sideColors[3], angleColors[3]
        function buildTriangles(criterion, sv) {
            // Base reference: left triangle fixed base on a horizontal segment
            const baseLen = 100;
            const Ax = 90, Ay = 210;
            const Bx = Ax + baseLen, By = Ay;

            let Cx, Cy;
            let sideColL, angleColL;  // for left triangle
            // color arrays: [AB, BC, CA] and [A, B, C]

            if (criterion === 'LAL') {
                // Fixed: AB (base), angle at A, side AC
                // Free: slider = angle at A (20-160°)
                const angleA = rad(sv);
                const sideAC = 90;
                Cx = Ax + sideAC * Math.cos(angleA);
                Cy = Ay - sideAC * Math.sin(angleA);
                // sides: AB=blue, BC=grey, CA=blue; angles: A=red, B=grey, C=grey
                sideColL  = ['#3B82F6', '#64748b', '#3B82F6'];
                angleColL = ['#EF4444', '#64748b', '#64748b'];
            } else if (criterion === 'ALA') {
                // Fixed: AB (base), angle at A, angle at B
                // Free: slider = angle at A (20-100°), B is computed to keep triangle valid
                const angleA = rad(sv);
                const angleB = rad(40);  // fixed B angle
                const angleC = Math.PI - angleA - angleB;
                if (angleC <= 0) { Cx = Ax + 50; Cy = Ay - 50; }
                else {
                    // By sine rule: AB/sinC = AC/sinB
                    const sinC = Math.sin(angleC);
                    const AC = sinC > 0.01 ? (baseLen * Math.sin(angleB)) / sinC : 60;
                    Cx = Ax + AC * Math.cos(angleA);
                    Cy = Ay - AC * Math.sin(angleA);
                }
                // sides: AB=blue, BC=grey, CA=grey; angles: A=red, B=red, C=grey
                sideColL  = ['#3B82F6', '#64748b', '#64748b'];
                angleColL = ['#EF4444', '#EF4444', '#64748b'];
            } else {
                // LLL: all three sides fixed; slider changes the apex height (free triangle shape check)
                // side AB fixed, side AC and BC defined by slider
                const sideAC = 80 + (sv - 20) * 0.3;
                const sideBC = 95;
                // Find C by intersection of two circles
                const d = baseLen;
                const a = sideAC, b = sideBC;
                const cosA_angle = (d*d + a*a - b*b)/(2*d*a);
                const angleAtA = Math.acos(Math.max(-1, Math.min(1, cosA_angle)));
                Cx = Ax + a * Math.cos(angleAtA);
                Cy = Ay - a * Math.sin(angleAtA);
                // all sides blue
                sideColL  = ['#3B82F6', '#3B82F6', '#3B82F6'];
                angleColL = ['#64748b', '#64748b', '#64748b'];
            }

            return {
                left:  { A:{x:Ax,y:Ay}, B:{x:Bx,y:By}, C:{x:Cx,y:Cy} },
                sideColors: sideColL,
                angleColors: angleColL
            };
        }

        function mirrorTriangle(tri, offsetX) {
            // Mirror left triangle (reflect across vertical axis through centre of its bounding box, then shift right)
            const xs = [tri.A.x, tri.B.x, tri.C.x];
            const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
            function mirrorPoint(p) {
                return { x: offsetX + (centerX - p.x) + offsetX/2 - centerX/2, y: p.y };
            }
            // Simpler: just translate right and slightly reflect
            const shift = W/2 + 20;
            return {
                A: { x: tri.A.x + shift, y: tri.A.y },
                B: { x: tri.B.x + shift, y: tri.B.y },
                C: { x: tri.C.x + shift, y: tri.C.y }
            };
        }

        function drawDivider() {
            ctxC.beginPath();
            ctxC.moveTo(W/2, 20); ctxC.lineTo(W/2, H-20);
            ctxC.strokeStyle = 'rgba(255,255,255,0.1)';
            ctxC.lineWidth = 1;
            ctxC.setLineDash([6,6]);
            ctxC.stroke();
            ctxC.setLineDash([]);
            ctxC.fillStyle = 'rgba(255,255,255,0.25)';
            ctxC.font = '11px Inter, sans-serif';
            ctxC.textAlign = 'center';
            ctxC.fillText('Triangolo 1', W/4, 20);
            ctxC.fillText('Triangolo 2  (congruente)', W*3/4, 20);
        }

        function render() {
            ctxC.clearRect(0, 0, W, H);
            drawDivider();

            const { left, sideColors, angleColors } = buildTriangles(currentCriterion, sliderVal);
            const right = mirrorTriangle(left, W/2 + 10);

            // Left triangle (fill blue-tinted)
            drawTriangle(ctxC, left.A, left.B, left.C,
                sideColors, angleColors, 'rgba(59,130,246,0.08)');

            // Right triangle (same colors, fill orange-tinted)
            drawTriangle(ctxC, right.A, right.B, right.C,
                sideColors, angleColors, 'rgba(245,158,11,0.08)');

            // Equal-sign badge between triangles at midpoint
            ctxC.fillStyle = '#10B981';
            ctxC.font = 'bold 20px Inter, sans-serif';
            ctxC.textAlign = 'center';
            ctxC.fillText('≅', W/2, H/2 + 5);
        }

        function updateDesc() {
            const el = document.getElementById('congruence-desc-text');
            const box = document.getElementById('congruence-desc');
            if (!el || !box) return;
            el.innerHTML = DESCRIPTIONS[currentCriterion];
            const colors = { LAL: '#3B82F6', ALA: '#EF4444', LLL: '#3B82F6' };
            box.style.borderLeftColor = colors[currentCriterion];
            box.style.background = currentCriterion === 'ALA'
                ? 'rgba(239,68,68,0.07)' : 'rgba(59,130,246,0.07)';
        }

        function updateSliderLabel() {
            const lbl = document.getElementById('congruenceSliderVal');
            if (!lbl) return;
            if (currentCriterion === 'LLL') {
                lbl.textContent = sliderVal + '';
            } else {
                lbl.textContent = sliderVal + '°';
            }
        }

        // Init
        updateDesc();
        updateSliderLabel();
        render();

        // Tab switching
        ['LAL','ALA','LLL'].forEach(name => {
            document.getElementById('tab' + name)?.addEventListener('click', () => {
                currentCriterion = name;
                // Reset slider
                const slider = document.getElementById('congruenceSlider');
                sliderVal = 90;
                if (slider) slider.value = 90;
                // Update tab styles
                ['LAL','ALA','LLL'].forEach(n => {
                    const btn = document.getElementById('tab' + n);
                    if (btn) btn.style.background = n === name ? '#3B82F6' : '#64748b';
                });
                updateDesc();
                updateSliderLabel();
                render();
            });
        });

        // Slider
        document.getElementById('congruenceSlider')?.addEventListener('input', function() {
            sliderVal = parseInt(this.value);
            updateSliderLabel();
            render();
        });

        // Reset
        document.getElementById('btnCongruenceReset')?.addEventListener('click', () => {
            currentCriterion = 'LAL';
            sliderVal = 90;
            const slider = document.getElementById('congruenceSlider');
            if (slider) slider.value = 90;
            ['LAL','ALA','LLL'].forEach(n => {
                const btn = document.getElementById('tab' + n);
                if (btn) btn.style.background = n === 'LAL' ? '#3B82F6' : '#64748b';
            });
            updateDesc();
            updateSliderLabel();
            render();
        });

        // Drag on canvas: move free vertex C of left triangle
        let isDragging = false;
        congruenceCanvas.addEventListener('mousedown', (e) => {
            const rect = congruenceCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            // Only active in left half
            if (mx < W/2) isDragging = true;
        });
        congruenceCanvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = congruenceCanvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            if (mx >= W/2) return;
            // Convert mouse position to angle or height depending on criterion
            const Ax = 90, Ay = 210;
            if (currentCriterion === 'LAL' || currentCriterion === 'ALA') {
                const dx = mx - Ax, dy = Ay - my;
                let angle = deg(Math.atan2(dy, dx));
                angle = Math.max(20, Math.min(160, angle));
                sliderVal = Math.round(angle);
                const slider = document.getElementById('congruenceSlider');
                if (slider) slider.value = sliderVal;
            } else {
                const h = Math.max(20, Math.min(160, Ay - my));
                sliderVal = Math.round(h);
                const slider = document.getElementById('congruenceSlider');
                if (slider) slider.value = sliderVal;
            }
            updateSliderLabel();
            render();
        });
        congruenceCanvas.addEventListener('mouseup', () => { isDragging = false; });
        congruenceCanvas.addEventListener('mouseleave', () => { isDragging = false; });
    }

    /* =========================
       CANVAS 6: DIMOSTRAZIONE 180° (retta parallela)
       ========================= */
    const proof180 = document.getElementById('proof180Canvas');
    if (proof180) {
        const p = proof180.getContext('2d');
        const PW = proof180.width, PH = proof180.height;

        // Vertices (A = apex, B = bottom-left, C = bottom-right)
        const A = { x: 170, y: 50 };
        const B = { x:  52, y: 185 };
        const C = { x: 288, y: 185 };

        // Direction angles from each vertex
        const angAtoB = Math.atan2(B.y - A.y, B.x - A.x); // ≈ 2.28 rad
        const angAtoC = Math.atan2(C.y - A.y, C.x - A.x); // ≈ 0.861 rad
        const angBtoA = Math.atan2(A.y - B.y, A.x - B.x); // ≈ -0.861 rad
        const angBtoC = Math.atan2(C.y - B.y, C.x - B.x); // 0 rad
        const angCtoA = Math.atan2(A.y - C.y, A.x - C.x); // ≈ -2.28 rad
        const angCtoB = Math.PI;                            // pointing left

        function fillArc(cx, cy, r, a0, a1, fill) {
            p.beginPath(); p.moveTo(cx, cy);
            p.arc(cx, cy, r, a0, a1, false);
            p.closePath();
            p.fillStyle = fill; p.fill();
        }
        function strokeArc(cx, cy, r, a0, a1, col, lw) {
            p.beginPath(); p.arc(cx, cy, r, a0, a1, false);
            p.strokeStyle = col; p.lineWidth = lw || 2.2; p.stroke();
        }
        function lbl(text, x, y, col, sz) {
            p.font = `bold ${sz || 13}px Inter,sans-serif`;
            p.fillStyle = col; p.textAlign = 'center'; p.textBaseline = 'middle';
            p.fillText(text, x, y);
        }

        // Clear
        p.clearRect(0, 0, PW, PH);

        // Parallel line through A (dashed, orange)
        p.beginPath(); p.moveTo(0, A.y); p.lineTo(PW, A.y);
        p.strokeStyle = 'rgba(245,158,11,0.6)'; p.lineWidth = 1.8;
        p.setLineDash([7, 5]); p.stroke(); p.setLineDash([]);

        // Triangle fill
        p.beginPath();
        p.moveTo(A.x, A.y); p.lineTo(B.x, B.y); p.lineTo(C.x, C.y);
        p.closePath(); p.fillStyle = 'rgba(16,185,129,0.07)'; p.fill();

        // Triangle sides
        p.beginPath();
        p.moveTo(A.x, A.y); p.lineTo(B.x, B.y); p.lineTo(C.x, C.y);
        p.closePath(); p.strokeStyle = '#10B981'; p.lineWidth = 2.5; p.stroke();

        const R = 28; // arc radius

        // β at B: clockwise from angBtoA to angBtoC
        fillArc(B.x, B.y, R, angBtoA, angBtoC, 'rgba(239,68,68,0.18)');
        strokeArc(B.x, B.y, R, angBtoA, angBtoC, '#EF4444', 2.5);

        // γ at C: clockwise from angCtoB(=π) to angCtoA
        fillArc(C.x, C.y, R, angCtoB, angCtoA, 'rgba(139,92,246,0.18)');
        strokeArc(C.x, C.y, R, angCtoB, angCtoA, '#8B5CF6', 2.5);

        // α at A: clockwise from angAtoC to angAtoB (inside triangle)
        fillArc(A.x, A.y, R, angAtoC, angAtoB, 'rgba(59,130,246,0.18)');
        strokeArc(A.x, A.y, R, angAtoC, angAtoB, '#3B82F6', 2.5);

        // β' at A: clockwise from angAtoB to π (below parallel, left of A — alternate to β)
        fillArc(A.x, A.y, R, angAtoB, Math.PI, 'rgba(239,68,68,0.15)');
        strokeArc(A.x, A.y, R, angAtoB, Math.PI, '#EF4444', 2);

        // γ' at A: clockwise from 0 to angAtoC (below parallel, right of A — alternate to γ)
        fillArc(A.x, A.y, R, 0, angAtoC, 'rgba(139,92,246,0.15)');
        strokeArc(A.x, A.y, R, 0, angAtoC, '#8B5CF6', 2);

        // Dashed guide: β↔β' and γ↔γ'
        p.setLineDash([4, 4]); p.lineWidth = 1;

        const bMid  = (angBtoA + angBtoC) / 2;
        const bpMid = (angAtoB + Math.PI) / 2;
        p.beginPath();
        p.moveTo(B.x + Math.cos(bMid) * 44, B.y + Math.sin(bMid) * 44);
        p.lineTo(A.x + Math.cos(bpMid) * 44, A.y + Math.sin(bpMid) * 44);
        p.strokeStyle = 'rgba(239,68,68,0.35)'; p.stroke();

        const gMid  = (angCtoB + angCtoA) / 2;
        const gpMid = (0 + angAtoC) / 2;
        p.beginPath();
        p.moveTo(C.x + Math.cos(gMid) * 44, C.y + Math.sin(gMid) * 44);
        p.lineTo(A.x + Math.cos(gpMid) * 44, A.y + Math.sin(gpMid) * 44);
        p.strokeStyle = 'rgba(139,92,246,0.35)'; p.stroke();
        p.setLineDash([]);

        // Angle labels (at mid-arc, slightly outside)
        const LR = 46;
        lbl('α',  A.x + Math.cos((angAtoC+angAtoB)/2)*LR, A.y + Math.sin((angAtoC+angAtoB)/2)*LR, '#3B82F6', 14);
        lbl('β',  B.x + Math.cos((angBtoA+angBtoC)/2)*LR, B.y + Math.sin((angBtoA+angBtoC)/2)*LR, '#EF4444', 14);
        lbl('γ',  C.x + Math.cos((angCtoB+angCtoA)/2)*LR, C.y + Math.sin((angCtoB+angCtoA)/2)*LR, '#8B5CF6', 14);
        lbl("β'", A.x + Math.cos((angAtoB+Math.PI)/2)*LR, A.y + Math.sin((angAtoB+Math.PI)/2)*LR, '#EF4444', 11);
        lbl("γ'", A.x + Math.cos((0+angAtoC)/2)*LR,       A.y + Math.sin((0+angAtoC)/2)*LR,       '#8B5CF6', 11);

        // Vertex labels
        p.font = 'bold 12px Inter,sans-serif'; p.fillStyle = 'rgba(255,255,255,0.45)';
        p.textAlign = 'center'; p.textBaseline = 'middle';
        p.fillText('A', A.x, A.y - 18);
        p.fillText('B', B.x - 15, B.y + 9);
        p.fillText('C', C.x + 15, C.y + 9);

        // Caption
        p.font = '10px Inter,sans-serif'; p.fillStyle = 'rgba(255,255,255,0.28)';
        p.textAlign = 'center'; p.textBaseline = 'middle';
        p.fillText("β' = β  e  γ' = γ  (angoli alterni interni)  →  β' + α + γ' = 180°", PW / 2, PH - 8);
    }

});
