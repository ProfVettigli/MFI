document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       CANVAS: INTERSECTION SPHERE IN FLATLAND
       ========================= */
    const canvas = document.getElementById('flatlandCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const btnDrop = document.getElementById('btnDrop');
        const btnReset = document.getElementById('btnFlatReset');

        let isAnimating = false;
        
        // Sphere properties
        const R = 80;
        let startY = 30;                 // Sfera alta (high up in Spaceland)
        let endY = 270;                  // Sfera caduta fino alla roccia in giu. (fallen down to the bottom)
        let sphereY = startY;
        let fallSpeed = 1.2;             // Pixel per frame
        
        function drawFlatlandDemo() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const planeY = canvas.height / 2; // Flatland Universe "floor" (or plane)
            
            // --- LEFT VIEW: SPACELAND VISION ---
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, 300, 300);
            ctx.clip();
            
            ctx.fillStyle = '#fff'; ctx.font = '14px Inter, sans-serif'; ctx.fillText("1. Eye of a Divine 3D Being", 15, 25);
            ctx.fillStyle = '#94a3b8'; ctx.font = '12px Inter'; ctx.fillText("(The Sphere falls through the paper plane)", 15, 45);

            // Draw "Flatland" as a bright thin horizontal line on the side-view
            ctx.beginPath();
            ctx.moveTo(10, planeY);
            ctx.lineTo(290, planeY);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#38bdf8'; // light blue
            ctx.stroke();
            ctx.fillStyle = '#38bdf8'; ctx.fillText("The 'Flatland' Sheet ->", 30, planeY - 10);
            
            // Draw Sphere
            const cxLeft = 150;
            ctx.beginPath();
            ctx.arc(cxLeft, sphereY, R, 0, Math.PI * 2);
            // Gradient for 3D effect
            let gradSphere = ctx.createRadialGradient(cxLeft - 20, sphereY - 20, 10, cxLeft, sphereY, R);
            gradSphere.addColorStop(0, '#fcd34d');
            gradSphere.addColorStop(1, '#ea580c');
            ctx.fillStyle = gradSphere;
            ctx.globalAlpha = 0.8; // Slight transparency
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.restore();

            // Divider in the middle
            ctx.beginPath();
            ctx.moveTo(300, 0); ctx.lineTo(300, 300);
            ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.stroke();

            // --- RIGHT VIEW: FLATLAND VISION ---
            ctx.save();
            ctx.beginPath();
            ctx.rect(300, 0, 300, 300);
            ctx.clip();
            
            ctx.fillStyle = '#fff'; ctx.font = '14px Inter, sans-serif'; ctx.fillText("2. Eye of 'A Square' from below", 315, 25);
            ctx.fillStyle = '#94a3b8'; ctx.font = '12px Inter'; ctx.fillText("(He sees miraculous flat circles appear)", 315, 45);
            
            const cxRight = 450;
            const cyRight = 150; // Central anchor
            
            // Intersection math
            const deltaY = Math.abs(sphereY - planeY);
            let rFlat = 0;
            let intersectionActive = false;
            
            if (deltaY < R) {
                // Pythagoras for spherical sections: 
                // r^2 = R^2 - deltaY^2
                rFlat = Math.sqrt(R*R - deltaY*deltaY);
                intersectionActive = true;
            }

            // Draw Flatland inhabitant's view (A colored circle expanding and contracting)
            if (intersectionActive) {
                ctx.beginPath();
                ctx.arc(cxRight, cyRight, rFlat, 0, Math.PI * 2);
                ctx.fillStyle = '#ea580c'; // Pure solid flat orange.
                ctx.fill();
                
                // Ring effect
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#fcd34d';
                ctx.stroke();

                ctx.fillStyle = '#fff'; ctx.font = '13px Inter'; 
                ctx.textAlign = 'center';
                if(rFlat < 10) ctx.fillText("It's Birthing/Collapsing", cxRight, cyRight + 40);
                else if (rFlat > R - 5) ctx.fillText("Phase: Giant Equator!", cxRight, cyRight + R + 30);
                else ctx.fillText("The Circle is moving...", cxRight, cyRight + rFlat + 20);

            } else {
                ctx.fillStyle = '#ef4444'; ctx.font = '14px Inter'; ctx.textAlign = 'center';
                ctx.fillText("Pitch Black. There is absolutely Nothing.", cxRight, cyRight);
                if (sphereY < planeY) ctx.fillText("(The sphere is still high in the air)", cxRight, cyRight + 20);
                else ctx.fillText("(Sphere already swallowed into the Spaceland abyss)", cxRight, cyRight + 20);
            }
            
            ctx.restore();
        }

        drawFlatlandDemo(); // static at first
        
        function loopAnimation() {
            if (!isAnimating) return;
            sphereY += fallSpeed;
            if (sphereY > endY) {
                isAnimating = false; // Stop at bottom
            }
            drawFlatlandDemo();
            if (isAnimating) requestAnimationFrame(loopAnimation);
        }

        btnDrop.addEventListener('click', () => {
            if (!isAnimating && sphereY >= endY) { 
                // If it already fell, restart dynamically
                sphereY = startY; 
            }
            if(!isAnimating) {
                isAnimating = true;
                loopAnimation();
            }
        });

        btnReset.addEventListener('click', () => {
            isAnimating = false;
            sphereY = startY;
            drawFlatlandDemo();
        });
    }

    /* =========================
       MULTIPLE QUESTION QUIZ LOGIC
       ========================= */
    const quizData = [
        {
            question: "1. Who composed the novel in the year 1884, and for what sublime ulterior motive aside from shaping minds on three-dimensional gaps?",
            options: [
                "The Grimm brothers to teach dimensional zeros to the king of the woods.",
                "Edwin A. Abbott; The novel concealed and delivered a ferocious anti-classist satire against the oppressive and closed elitist, respectable frameworks prevailing in the suffocating bureaucratic society of the Victorian era in London.",
                "H.P. Lovecraft, to narrate the fear of spherical monsters descending from the empty intergalactic space."
            ], correct: 1
        },
        {
            question: "2. How does an educated square scientist instantaneously perceive, before his two actual wide-open eyes, the sudden solemn crossing and orthogonal breaching executed in his geometric plane by the falling sphere?",
            options: [
                "He feels one of his sides explode, becoming pentagonal upon touch, then dissolving into thin air through radial combustion.",
                "He observes a bubble being born that collapses as a circle and then bounces and rolls away, revealing itself as a dark round shadow cast by the sun's lights projected on the wall.",
                "From senseless nothingness, a microscopic material Dot bursts in, which magically explodes, growing fat into the shape of a massive Circle, reaching an apocalyptic expansion size at its equatorial radius, and magically disappearing immediately after, swallowed into the ether in a declining retrograde phase. The inimitable trick of the mobile plane slice intersection."
            ], correct: 2
        },
        {
            question: "3. By pure geometric rule of speculative induction, what spectral apparition would we 3D citizens glimpse in our living room if a gigantic mass of HYPERSPHERE (a Sphere transiting the ruthless and invisible 4th spatial orthogonal axis) penetrated from above, piercing our universe and falling down into the abyss?",
            options: [
                "A tesseract deformation that slithers away like bluish light.",
                "It is biologically and analytically impossible to encircle shapes at such a superior level, being unable to form radii and diagonals without catching fire.",
                "Absolutely the same analogous spell cast upon the Flat scientist: we would discern elevating from nothingness in the center of the room a tiny incandescent plasma spheroid igniting, expanding its volume until it becomes a massive, absolutely perfect 3D Sphere filled with air... only to re-suicide, slowly dimming in scale and vanishing into the darkness leaving nothing done!"
            ], correct: 2
        },
        {
            question: "4. Upon his exhausting but enlightened return to the obtuse Lineland, how was our intrepid narrator 'A Square' ill-treated and punished by the proud elite ruling Circles, owing to his blasphemous and infectious truth?",
            options: [
                "He was divinely elevated to a split three-dimensional Sphere for his services.",
                "He was believed by no one due to the religious dogma of volumetric impossibility, deemed an ignorant subversive scum pushing blatantly idiotic ideas, and irremediably thrown into tomb-like isolation in the village's infamous local lunatic asylum.",
                "He lost contact, the sphere died in Spaceland's linear time tunnel, and he fell exiled into an abysmal one-dimensional point."
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
                            scoreEl.textContent = `Inherited Interspatial Score: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Flawless! You can already biologically perceive the fourth spectral tesseractal axis!":"You're still somewhat flattened in two-dimensional mediocrity. Retry the spherical calculation!");
                            scoreEl.style.color = currentScore===quizData.length?"#8B5CF6":"#ea580c";
                        }
                    } else {
                        btn.classList.add('wrong');
                        btn.innerHTML += " <strong>✗ Absolutely False, Flatlander.</strong>";
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
