document.addEventListener('DOMContentLoaded', () => {
    const GridSize = 25; // 25px = 1 unit

    function drawGrid(ctx, W, H) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        let cx = W/2, cy = H/2;
        
        for (let x = cx % GridSize; x < W; x += GridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = cy % GridSize; y < H; y += GridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '12px sans-serif';
        ctx.fillText('X', W - 15, cy - 5);
        ctx.fillText('Y', cx + 5, 15);
    }

    function toPx(W, H, px, py) {
        return { x: W/2 + px * GridSize, y: H/2 - py * GridSize };
    }

    // 1. Proportionality Canvas
    const cProp = document.getElementById('propCanvas');
    let propM = 2;
    let propPoints = []; 
    let propAnimId;

    function drawProp() {
        if(!cProp) return;
        const ctx = cProp.getContext('2d');
        ctx.clearRect(0,0,cProp.width, cProp.height);
        drawGrid(ctx, cProp.width, cProp.height);

        const tbody = document.getElementById('prop-table-body');
        if(tbody) tbody.innerHTML = ''; // clear previous rows

        ctx.fillStyle = '#EC4899';
        for(let pt of propPoints) {
            let pY = pt.x * propM;
            let p = toPx(cProp.width, cProp.height, pt.x, pY);
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();

            // Populate table with some points (step 2) to avoid making it too long
            if(tbody && (pt.x % 2 === 0)) {
                let row = document.createElement('tr');
                row.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                let tdX = document.createElement('td'); tdX.style.padding = '0.3rem'; tdX.textContent = pt.x;
                let tdY = document.createElement('td'); tdY.style.padding = '0.3rem'; tdY.style.color = '#EC4899'; tdY.style.fontWeight = 'bold'; tdY.textContent = pY.toFixed(1);
                row.appendChild(tdX); row.appendChild(tdY);
                tbody.appendChild(row);
            }
        }
    }
    if(cProp) drawProp();

    window.updateProp = function() {
        if(propAnimId) { clearInterval(propAnimId); propAnimId = null; }
        propM = parseFloat(document.getElementById('prop-m').value);
        document.getElementById('prop-m-val').innerText = propM.toFixed(1);
        propPoints = []; // reset
        drawProp();
    };

    window.animateProp = function() {
        propPoints = [];
        let currentX = -10;
        if(propAnimId) clearInterval(propAnimId);
        propAnimId = setInterval(() => {
            propPoints.push({x: currentX});
            drawProp();
            currentX += 0.5;
            if(currentX > 10) clearInterval(propAnimId);
        }, 30);
    };

    // 2. M and Q Canvas
    const cMq = document.getElementById('mqCanvas');
    let mqM = 1, mqQ = 2;
    
    function drawMQ() {
        if(!cMq) return;
        const ctx = cMq.getContext('2d');
        ctx.clearRect(0,0,cMq.width, cMq.height);
        drawGrid(ctx, cMq.width, cMq.height);

        // Draw Line
        ctx.strokeStyle = '#EC4899'; ctx.lineWidth = 3; 
        ctx.beginPath();
        let p1 = toPx(cMq.width, cMq.height, -12, mqM * -12 + mqQ);
        let p2 = toPx(cMq.width, cMq.height, 12, mqM * 12 + mqQ);
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        
        // Emphasize the Y intercept (q)
        let pQ = toPx(cMq.width, cMq.height, 0, mqQ);
        ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(pQ.x, pQ.y, 7, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth=2; ctx.stroke();
        
        // Show Coordinates of Intercept
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.fillText(`(0, ${mqQ})`, pQ.x + 10, pQ.y - 10);
    }
    if(cMq) drawMQ();

    window.updateMQ = function() {
        mqM = parseFloat(document.getElementById('mq-m').value);
        mqQ = parseFloat(document.getElementById('mq-q').value);
        let signQ = mqQ >= 0 ? '+ ' + mqQ : '- ' + Math.abs(mqQ);
        document.getElementById('mq-eq-display').innerText = `y = ${mqM}x ${signQ}`;
        drawMQ();
    };

    // MULTI-QUESTION QUIZ
    const quizData = [
        {
            question: "1. Nella proporzionalità diretta (y = mx), se x raddoppia, cosa fa la y?",
            options: ["Triplica", "Rimane ferma", "Raddoppia anche lei", "Diventa zero"], correct: 2
        },
        {
            question: "2. Che influenza ha 'q' nell'equazione della retta y = mx + q?",
            options: ["Decide la pendenza", "Decide dove la retta taglia l'asse Y (Verticale)", "Decide l'angolazione in gradi"], correct: 1
        },
        {
            question: "3. Qual è l'equazione tipica purissima di una retta passante per l'Origine (0,0)?",
            options: ["y = mx + q", "x = y + 1", "y = mx (cioè con q = 0)", "q = mx"], correct: 2
        },
        {
            question: "4. Affinché due rette formino una Croce perfetta (Siano Perpendicolari), come devono essere le loro pendenze 'm'?",
            options: ["Identiche", "La somma deve fare zero", "Una opposta e capovolta all'altra (es. 2 e -1/2)", "A caso"], correct: 2
        },
        {
            question: "5. Se tracciassi due rette con equazioni: 'y = 3x + 1' e 'y = 3x - 4', esse come risulterebbero posizionate tra di loro?",
            options: ["Perpendicolari", "Parallele, perché hanno lo stesso m=3", "Incidenti, si scontrerebbero", "Curve convergenti"], correct: 1
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
                            scoreEl.textContent = `Punteggio: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Risposte rette al 100%!":"Buono, ma puoi allinearti meglio.");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else { btn.classList.add('wrong'); btn.innerHTML += " <strong>✗ Riprova!</strong>"; btn.disabled = true; }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv); quizArea.appendChild(qDiv);
        });
    }
});
