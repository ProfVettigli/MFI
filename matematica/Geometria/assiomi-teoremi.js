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
});
