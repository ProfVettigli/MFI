document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mainCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let state = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
            ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 1;
            let freq = 0.05 + state * 0.03;
            ctx.beginPath();
            for(let i=0; i<Math.PI*2; i+=0.1) {
                let r = 100 * (1 + Math.sin(3*i + state));
                let x = r * Math.cos(i); let y = r * Math.sin(i);
                if(i==0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.closePath(); ctx.stroke();
            ctx.restore();
            
            ctx.fillStyle = '#333'; ctx.font = '16px sans-serif';
            ctx.fillText("Modificatore di Equazione Algoritmico su forma dinamica", 20, 30);
        }
        draw();
        document.getElementById('btnInteract').addEventListener('click', () => { state = (state + 1) % 5; draw(); });
        document.getElementById('btnReset').addEventListener('click', () => { state=0; draw(); });
    }

    // MULTI-QUESTION QUIZ
    const quizData = [
        {
            question: "1. Come progettavano gli antichi Greci le proporzioni dei loro mastodontici templi come il Partenone?",
            options: ["Affidandosi alla Sezione Aurea e rigidi calcoli geometrici", "Facevano 'ad occhio'", "Prendevano i materiali grezzi e misuravano le pietre a caso"], correct: 0
        },
        {
            question: "2. Che cosa s'intende ad oggi per Design Architettonico 'Parametrico'?",
            options: ["Costruire palazzi in legno senza chiodi in modo parametrico manuale", "L'utilizzo massiccio di software e algoritmi al computer in cui spostando le costanti matematiche (parametri) il modello architettonico ri-genera da solo e si torce in strutture non euclidee super organiche.", "Uno stile barocco superato a fine 1700"], correct: 1
        },
        {
            question: "3. La cupola della Cattedrale di Firenze come trionfò visivamente usando le regole geometriche?",
            options: ["Usando pitture colorate speciali", "Attraverso l'uso attento della Prospettiva Lineare e finti calcoli basati sulla convergenza verso un punto focale per dare una fortissima illusione ottica di falsa profondità", "Non vi è alcuna connessione matematica"], correct: 1
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
                            scoreEl.textContent = `Punteggio: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Ottimo Architetto!":"Niente male!");
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
