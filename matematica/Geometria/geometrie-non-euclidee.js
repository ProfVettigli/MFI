document.addEventListener('DOMContentLoaded', () => {
    
    // --- GIRARD SPHERE CANVAS ---
    const cGirard = document.getElementById('girardCanvas');
    let aA = 90, aB = 90, aC = 90;

    function drawGirard() {
        if(!cGirard) return;
        const ctx = cGirard.getContext('2d');
        const W = cGirard.width, H = cGirard.height;
        ctx.clearRect(0,0,W,H);
        
        let cx = W/2, cy = H/2 + 10;
        let R = 130; // sphere radius

        // Draw background grid lightly
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        for(let x=0; x<W; x+=20) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
        for(let y=0; y<H; y+=20) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

        // Draw Sphere Base
        ctx.beginPath();
        let grad = ctx.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, R);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        grad.addColorStop(1, 'rgba(17, 24, 39, 0.9)');
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, R, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.stroke();

        // Draw 3D longitude/latitude lines
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath();
        ctx.ellipse(cx, cy, R, R/3, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, R/3, R, 0, 0, Math.PI*2); ctx.stroke();

        let sumDeg = aA + aB + aC;
        let sumDisp = document.getElementById('sum-disp');
        let areaDisp = document.getElementById('area-disp');

        if(sumDeg <= 180) {
            sumDisp.innerText = `Somma Angoli: ${sumDeg}°`; sumDisp.style.color = '#ef4444';
            areaDisp.innerText = `⚠ IMPOSSIBILE SULLA SFERA (Collassato e Piatto)`; areaDisp.style.color = '#ef4444';
            // Draw a tiny flat dot at pole
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy - R, 4, 0, Math.PI*2); ctx.fill();
        } else {
            sumDisp.innerText = `Somma Angoli: ${sumDeg}°`; sumDisp.style.color = '#10b981';
            let excess = sumDeg - 180;
            // Max excess conceptually here is 450 - 180 = 270 (which maps to hemisphere basically)
            let ratio = excess / 270.0; 
            areaDisp.innerText = `Area Coperta (Eccesso Sferico): ${(ratio * 100).toFixed(0)}% dell'Emisfero!`; 
            areaDisp.style.color = '#ec4899';

            // Draw the fat triangle
            // We use Bezier curves pushing OUTWARDS. 
            // The three vertices: North pole, Bottom Left, Bottom Right
            
            // Base vertices: North pole (cx, cy-R), BottomLeft (cx - R*0.6, cy + R*0.2), BottomRight (cx + R*0.6, cy + R*0.2)
            let v1 = {x: cx, y: cy - R};
            // They spread downwards as area gets huge
            let spreadY = cy + (R*0.2) + (ratio * R * 0.5); 
            let spreadX = R * 0.5 + (ratio * R * 0.5);
            
            let v2 = {x: cx - spreadX, y: spreadY};
            let v3 = {x: cx + spreadX, y: spreadY};

            // To make it look "spherical", the curves swell OUT
            // Control points pull the lines outwards
            let swell = 50 + (ratio * 120);

            ctx.fillStyle = 'rgba(236, 72, 153, 0.6)';
            ctx.strokeStyle = '#ec4899';
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            // Curve from North to BottomLeft
            ctx.quadraticCurveTo(cx - swell, cy - swell/2, v2.x, v2.y);
            // Curve from BottomLeft to BottomRight (the equator belly)
            ctx.quadraticCurveTo(cx, cy + swell*0.8, v3.x, v3.y);
            // Curve from BottomRight back to North
            ctx.quadraticCurveTo(cx + swell, cy - swell/2, v1.x, v1.y);
            
            ctx.fill(); ctx.stroke();

            // Draw vertices
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(v1.x, v1.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(v2.x, v2.y, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(v3.x, v3.y, 5, 0, Math.PI*2); ctx.fill();
        }
    }

    window.updateGirard = function() {
        aA = parseInt(document.getElementById('ang-a').value);
        aB = parseInt(document.getElementById('ang-b').value);
        aC = parseInt(document.getElementById('ang-c').value);

        document.getElementById('ang-a-disp').innerText = `${aA}°`;
        document.getElementById('ang-b-disp').innerText = `${aB}°`;
        document.getElementById('ang-c-disp').innerText = `${aC}°`;
        
        drawGirard();
    };

    if(cGirard) {
        // Init slightly to 270 manually
        window.updateGirard();
    }

    // --- QUIZ DATA ---
    const quizData = [
        { 
            question: "1. Quale potente strumento logico usarono i matematici nel tentativo ossessivo di dimostrare il Quinto Postulato di Euclide?", 
            options: [
                "L'addizione ripetuta all'infinito.", 
                "La 'Dimostrazione per Assurdo', affermando che il Postulato fosse falso per scatenare una contraddizione (che invece non arrivò mai!).", 
                "Il Teorema di Pitagora applicato sui Quadrati."
            ], 
            correct: 1 
        },
        { 
            question: "2. Com'è fatto geometricamente il mondo della Geometria Iperbolica (Lobachevskij)?", 
            options: [
                "Ha la forma incurvata di una 'Sella da Cavallo', dove da un punto passano INFINITE parallele e i triangoli sommano sempre MENO di 180 gradi.", 
                "È la Geometria Piatta, la solita che facciamo sui banchi di scuola.", 
                "È il mappamondo sferico, in cui la somma dei triangoli esplode."
            ], 
            correct: 0 
        },
        { 
            question: "3. Camminando sulla Terra (Sfera/Ellittica), cosa succede a due Meridiani (Rette Geodetiche) che partono 90° dritti e paralleli dall'Equatore?", 
            options: [
                "Corrono vicini e dritti senza scontrarsi, all'infinito.", 
                "Esplodono fondendosi al centro dell'Oceano.", 
                "Sono destinati per la curvatura intrinseca della sfera a collidere ed intrecciarsi violentemente incontrandosi al Polo Nord!"
            ], 
            correct: 2 
        },
        { 
            question: "4. Il Teorema di Girard decifra l'Eccesso Sferico in modo definitivo. Se gli angoli interni del tuo grande triangolo sul pianeta superano esageratamente i 180°, cosa significa fisicamente?", 
            options: [
                "Che il triangolo sta deformandosi in un cerchio perfetto.", 
                "Che il triangolo sta divorando e coprendo una massiccia percentuale e scala di metri quadrati dell'Area dell'intera superficie mondiale!", 
                "Niente, è un banale errore di calcolo del goniometro."
            ], 
            correct: 1 
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
                            scoreEl.textContent = `Punteggio Pioniere dello Spazio: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Perfetto! Einstein sarebbe fiero!":"Rivedi le regole degli Universi Curvi!");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else { btn.classList.add('wrong'); btn.innerHTML += " <strong>✗ Falso!</strong>"; btn.disabled = true; }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv); quizArea.appendChild(qDiv);
        });
    }
});
