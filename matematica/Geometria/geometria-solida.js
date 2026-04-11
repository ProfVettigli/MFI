document.addEventListener('DOMContentLoaded', () => {

    // === CANVAS 3D VIDEOGAME ENGINE ===
    const canvas = document.getElementById('poly3DCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const btnDetail = document.getElementById('btnDetail');
        const btnReset = document.getElementById('btnDetailReset');
        
        let width = canvas.width;
        let height = canvas.height;
        let cx = width / 2;
        let cy = height / 2;
        
        // 0=Tetrahedron (very lowpoly), 1=Cube/Octa, 2=Icosahedron, 3=UVSphere (highpoly fake curve)
        let subdivLevel = 0; 
        
        let rotationX = 0;
        let rotationY = 0;
        
        function generateSphereGeometry(level) {
            let vertices = [];
            let edges = [];
            
            // Per simulare il Low Poly usiamo un trucco numerico sui segmenti azimutali.
            // Level 0: 4 segmenti equatoriali, 3 verticali -> Forma storpia
            // Level 1: 8 segmenti eq, 6 vert
            // Level 2: 15 segmenti eq, 10 vert
            // Level 3: 30 segmenti eq, 20 vert
            let latBands = [3, 5, 10, 20][level];
            let longBands = [4, 8, 15, 30][level];
            let radius = 120;
            
            for (let lat = 0; lat <= latBands; lat++) {
                let theta = lat * Math.PI / latBands;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);
                
                for (let lon = 0; lon <= longBands; lon++) {
                    let phi = lon * 2 * Math.PI / longBands;
                    let sinPhi = Math.sin(phi);
                    let cosPhi = Math.cos(phi);
                    
                    let x = cosPhi * sinTheta;
                    let y = cosTheta;
                    let z = sinPhi * sinTheta;
                    
                    vertices.push({ x: radius * x, y: radius * y, z: radius * z });
                }
            }
            
            // Build edges (wireframe)
            for (let lat = 0; lat < latBands; lat++) {
                for (let lon = 0; lon < longBands; lon++) {
                    let first = (lat * (longBands + 1)) + lon;
                    let second = first + longBands + 1;
                    
                    // Connettiamo i triangoli/quadrati a rete
                    edges.push([first, second]);
                    edges.push([first, first + 1]);
                    // edges.push([first, second + 1]); // uncomment for triangular diag
                }
            }
            return { v: vertices, e: edges };
        }
        
        let geom = generateSphereGeometry(subdivLevel);
        
        function draw3D() {
            ctx.clearRect(0, 0, width, height);

            // Backgorund glow effect for GPU feeling
            let grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 250);
            grad.addColorStop(0, "rgba(59, 130, 246, 0.2)");
            grad.addColorStop(1, "rgba(17, 24, 39, 1)");
            ctx.fillStyle = grad;
            ctx.fillRect(0,0,width,height);
            
            // Update Rotation Automatica
            rotationY += 0.015;
            rotationX += 0.005;
            
            let cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
            let cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
            
            // Project and draw edges
            ctx.strokeStyle = '#3B82F6';
            if (subdivLevel === 3) ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)'; // green when maxed
            ctx.lineWidth = subdivLevel === 3 ? 0.8 : 1.5;

            ctx.beginPath();
            geom.e.forEach(edge => {
                let p1 = geom.v[edge[0]];
                let p2 = geom.v[edge[1]];
                
                // Rot Y
                let p1x1 = cosY * p1.x - sinY * p1.z;
                let p1z1 = sinY * p1.x + cosY * p1.z;
                let p2x1 = cosY * p2.x - sinY * p2.z;
                let p2z1 = sinY * p2.x + cosY * p2.z;
                
                // Rot X
                let p1y1 = cosX * p1.y - sinX * p1z1;
                let z1Fn = sinX * p1.y + cosX * p1z1;
                let p2y1 = cosX * p2.y - sinX * p2z1;
                let z2Fn = sinX * p2.y + cosX * p2z1;
                
                // Perspective
                let fp = 300;
                let scale1 = fp / (fp + z1Fn);
                let scale2 = fp / (fp + z2Fn);
                
                // Backface culling rudimentale per pulizia visiva solo ai livelli spinti
                if (subdivLevel > 1 && (z1Fn > radius || z2Fn > radius)) return; 

                let px1 = cx + p1x1 * scale1;
                let py1 = cy + p1y1 * scale1;
                let px2 = cx + p2x1 * scale2;
                let py2 = cy + p2y1 * scale2;
                
                ctx.moveTo(px1, py1);
                ctx.lineTo(px2, py2);
            });
            ctx.stroke();
            
            // Info text
            ctx.fillStyle = '#fff';
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText("Densità Wireframe (Poligoni Base): Livello " + subdivLevel, 15, 30);
            if (subdivLevel === 0) ctx.fillText("Grezzo: Angoloso e poco credibile.", 15, 55);
            if (subdivLevel === 3) {
                ctx.fillStyle = '#10B981';
                ctx.fillText("Max-Poly: L'occhio umano lo scambia come una sfera curva super liquida!", 15, 55);
            }
            
            // Next frame
            requestAnimationFrame(draw3D);
        }
        
        let radius = 120; // local param
        requestAnimationFrame(draw3D);
        
        btnDetail.addEventListener('click', () => {
            if (subdivLevel < 3) {
                subdivLevel++;
                geom = generateSphereGeometry(subdivLevel);
            }
        });
        
        btnReset.addEventListener('click', () => {
            subdivLevel = 0;
            geom = generateSphereGeometry(subdivLevel);
        });
    }

    // === MULTI-QUESTION QUIZ ===
    const quizData = [
        {
            question: "1. Perché è fisicamente impossibile costruire un modello plastico con un asse a 4 Dimensioni esatte?",
            options: [
                "Perché in 3D mancano sufficienti colori spaziali differenzianti per la verniciatura.",
                "Perché lo spazio del nostro universo impedisce formalmente di tranciarvi un quarto segmento asse che riesca a sbattere e cadere 'Perpendicolarmente' a 90° esatti con tutte le altre X, Y e Z presistenti in modo silmultaneo. Non vi è più angolazione di libertà disponibile.",
                "Perché i raggi UV sciolgono la 4D"
            ], correct: 1
        },
        {
            question: "2. Una Piramide e un Parallelepipedo a scatola che detengono medesima altezza solare e base identica... in che proporzione di capacità liquidi si scontrano?",
            options: [
                "Sono esattemente equivalenti di misurazione idrica, 1 a 1.",
                "La Piramide, sputando sguinci al vertice mortale apicolare, racchiude precisamente Un Terzo (1/3) del volume immagazzinabile all'interno del fratellastro box Parallelepipedo.",
                "La Piramide disperde e possiede la meta (1/2) dell'acqua."
            ], correct: 1
        },
        {
            question: "3. Come truffano il nostro cervello i potentissimi videogiochi in 3D che simulano navicelle di pelle viva liscia e curva?",
            options: [
                "Costruiscono laser ottici curvi piegando i cristalli",
                "Non le curvano: incollano come mattonelle sfacciate centinaia di microscopici fogli rettilinei triangolari (I Poligoni Mesh). Densificandoli furiosamente ad alta risoluzione l'occhio nudo lo fonde assieme illudendosi di trovarsi innanzi ad una scocca morbidamente curvilinea, aggirando il titanico stress termico del chip grafico.",
                "Proiettano ologrammi alieni radioattivi."
            ], correct: 1
        },
        {
            question: "4. Cosa narra e sancisce indiscutibilmente la legge del Quoziente Isoperimetrico sulla Sfera corporea?",
            options: [
                "E' la forma peggiore, la usano solo pesci mutanti",
                "Riserva il miracolo energetico biologico per eccellenza: a prescindere dal litro insito di massa, la Sfera scavalca ed umilia qualsiasi forma terrena esistente proponendo alla temperatura esterna il 'Pochissimo Guscio d'Area esposta' per difendersi dal gelo mortale d'attrito.",
                "Aumenta la sua attrazione centripeta su altri atomi e respinge comete."
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
                            scoreEl.textContent = `Punteggio Tridimensionale Finale: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Il controllo dello Spazio Volumetrico fa ineccepibilmente parte di te.":"Bello, ma c'è ancora qualche vertice da sistemare!");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Sbagliata! Ricalcola gli assi.</strong>";
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
