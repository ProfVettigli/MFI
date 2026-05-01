document.addEventListener("DOMContentLoaded", () => {
    initForestSimulation();
    initPacmanSimulation();
    initQuiz();
});

// --- FOREST SIMULATION ---
function initForestSimulation() {
    const canvas = document.getElementById("forest-canvas");
    const ctx = canvas.getContext("2d");
    
    // Set internal resolution
    canvas.width = 600;
    canvas.height = 400;

    const cellSize = 10;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    // 0 = empty, 1 = tree, 2 = burning, 3 = ash
    let grid = [];
    let animationId = null;
    let isBurning = false;

    const densitySlider = document.getElementById("density-slider");
    const densityVal = document.getElementById("density-val");
    const btnGenerate = document.getElementById("btn-generate-forest");
    const btnStartFire = document.getElementById("btn-start-fire");

    function createGrid(density) {
        grid = [];
        for (let y = 0; y < rows; y++) {
            let row = [];
            for (let x = 0; x < cols; x++) {
                row.push(Math.random() < density ? 1 : 0);
            }
            grid.push(row);
        }
        isBurning = false;
        drawGrid();
    }

    function drawGrid() {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let state = grid[y][x];
                if (state === 0) continue; // Empty
                
                if (state === 1) ctx.fillStyle = "#10b981"; // Tree
                else if (state === 2) ctx.fillStyle = "#ef4444"; // Burning
                else if (state === 3) ctx.fillStyle = "#475569"; // Ash
                
                // Draw rounded rectangle for slightly better look
                ctx.beginPath();
                ctx.roundRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2, 2);
                ctx.fill();
            }
        }
    }

    function startFire(cx, cy) {
        if (!isBurning) {
            isBurning = true;
            if (animationId) cancelAnimationFrame(animationId);
            
            // Ignight the specific cell if it's a tree, else find nearest tree
            if (grid[cy][cx] === 1) {
                grid[cy][cx] = 2;
            } else {
                // If clicked on empty space, ignite the center anyway to guarantee fire starts
                let started = false;
                // find a tree around center
                for(let r=0; r<rows; r++){
                    for(let c=0; c<cols; c++) {
                        if(grid[r][c] === 1) {
                            grid[r][c] = 2;
                            started = true;
                            break;
                        }
                    }
                    if(started) break;
                }
            }
            updateGrid();
        }
    }

    let frameCount = 0;
    function updateGrid() {
        if (!isBurning) return;
        
        frameCount++;
        if (frameCount % 4 !== 0) {
            // Slow down simulation
            animationId = requestAnimationFrame(updateGrid);
            return;
        }

        let nextGrid = [];
        let fireActive = false;

        for (let y = 0; y < rows; y++) {
            let nextRow = [];
            for (let x = 0; x < cols; x++) {
                let state = grid[y][x];
                if (state === 2) {
                    // Tree is burning, turns to ash
                    nextRow.push(3);
                    fireActive = true;
                } else if (state === 1) {
                    // Check neighbors (Pac-Man effect / Toroidal Grid)
                    let up = grid[(y - 1 + rows) % rows][x];
                    let down = grid[(y + 1) % rows][x];
                    let left = grid[y][(x - 1 + cols) % cols];
                    let right = grid[y][(x + 1) % cols];

                    if (up === 2 || down === 2 || left === 2 || right === 2) {
                        nextRow.push(2); // Catch fire
                        fireActive = true;
                    } else {
                        nextRow.push(1); // Stay tree
                    }
                } else {
                    nextRow.push(state); // Keep empty (0) or ash (3)
                }
            }
            nextGrid.push(nextRow);
        }

        grid = nextGrid;
        drawGrid();

        if (fireActive) {
            animationId = requestAnimationFrame(updateGrid);
        } else {
            isBurning = false;
        }
    }

    // Event Listeners
    densitySlider.addEventListener("input", (e) => {
        densityVal.textContent = e.target.value + "%";
        if (!isBurning) {
            createGrid(e.target.value / 100);
        }
    });

    btnGenerate.addEventListener("click", () => {
        if (animationId) cancelAnimationFrame(animationId);
        createGrid(densitySlider.value / 100);
    });

    btnStartFire.addEventListener("click", () => {
        startFire(Math.floor(cols / 2), Math.floor(rows / 2));
    });

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize);
        const y = Math.floor(((e.clientY - rect.top) * scaleY) / cellSize);
        if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] === 1) {
            startFire(x, y);
        }
    });

    // Initialize
    createGrid(densitySlider.value / 100);
}

// --- PACMAN SIMULATION ---
function initPacmanSimulation() {
    const canvas = document.getElementById("pacman-canvas");
    const ctx = canvas.getContext("2d");
    const btnMove = document.getElementById("btn-pacman-move");

    let pacman = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        speed: 3,
        dirX: 1,
        dirY: 0,
        mouthOpen: 0,
        mouthDir: 1, // 1 for opening, -1 for closing
        moving: false
    };

    let animId = null;

    function drawPacman() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dotted line to show path
        ctx.beginPath();
        ctx.setLineDash([5, 10]);
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.save();
        ctx.translate(pacman.x, pacman.y);
        
        // Rotation based on direction
        if (pacman.dirX === 1) ctx.rotate(0);
        else if (pacman.dirX === -1) ctx.rotate(Math.PI);
        else if (pacman.dirY === 1) ctx.rotate(Math.PI / 2);
        else if (pacman.dirY === -1) ctx.rotate(-Math.PI / 2);

        // Draw Pac-Man
        ctx.beginPath();
        let angle = pacman.mouthOpen * Math.PI / 4; // Max opening is PI/4
        ctx.arc(0, 0, pacman.radius, angle, 2 * Math.PI - angle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        
        // Draw Eye
        ctx.beginPath();
        ctx.arc(0, -pacman.radius / 2, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        ctx.restore();
        
        // Draw phantom Pac-Man when wrapping around to illustrate the effect
        if (pacman.x > canvas.width - pacman.radius) {
            drawPhantom(pacman.x - canvas.width, pacman.y);
        } else if (pacman.x < pacman.radius) {
            drawPhantom(pacman.x + canvas.width, pacman.y);
        }
    }

    function drawPhantom(px, py) {
        ctx.save();
        ctx.globalAlpha = 0.5; // Make phantom semi-transparent
        ctx.translate(px, py);
        
        if (pacman.dirX === 1) ctx.rotate(0);
        else if (pacman.dirX === -1) ctx.rotate(Math.PI);
        
        ctx.beginPath();
        let angle = pacman.mouthOpen * Math.PI / 4;
        ctx.arc(0, 0, pacman.radius, angle, 2 * Math.PI - angle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();
    }

    function update() {
        if (pacman.moving) {
            pacman.x += pacman.speed * pacman.dirX;
            pacman.y += pacman.speed * pacman.dirY;

            // PAC-MAN EFFECT (Wrap around)
            if (pacman.x > canvas.width + pacman.radius) {
                pacman.x = -pacman.radius;
            } else if (pacman.x < -pacman.radius) {
                pacman.x = canvas.width + pacman.radius;
            }

            if (pacman.y > canvas.height + pacman.radius) {
                pacman.y = -pacman.radius;
            } else if (pacman.y < -pacman.radius) {
                pacman.y = canvas.height + pacman.radius;
            }

            // Animate mouth
            pacman.mouthOpen += 0.1 * pacman.mouthDir;
            if (pacman.mouthOpen >= 1 || pacman.mouthOpen <= 0) {
                pacman.mouthDir *= -1;
            }
        }

        drawPacman();
        animId = requestAnimationFrame(update);
    }

    btnMove.addEventListener("click", () => {
        pacman.moving = !pacman.moving;
        if (pacman.moving) {
            btnMove.textContent = "Ferma Pac-Man";
            btnMove.style.background = "#ef4444";
            btnMove.style.color = "white";
        } else {
            btnMove.textContent = "Muovi Pac-Man";
            btnMove.style.background = "#eab308";
            btnMove.style.color = "black";
            pacman.mouthOpen = 0; // Reset mouth
        }
    });

    drawPacman(); // Initial draw without moving
    update(); // Start loop
}

// --- QUIZ PERCOLAZIONE ---
function initQuiz() {
    const quizData = [
        {
            q: "1. Cos'è la percolazione in fisica e matematica?",
            a: ["Il movimento rapido dei gas nel vuoto.", "Il movimento e il filtraggio di fluidi attraverso materiali porosi.", "La trasmissione del calore per irraggiamento."],
            c: 1
        },
        {
            q: "2. Cosa rappresenta un 'cluster percolativo' nel caso della macchinetta del caffè?",
            a: ["Un chicco di caffè isolato.", "L'acqua che evapora.", "Un percorso continuo di vuoti interconnessi dall'alto verso il basso."],
            c: 2
        },
        {
            q: "3. Nella propagazione di un incendio in una foresta, la probabilità che il fuoco si trasmetta dipende:",
            a: ["Esclusivamente dal colore degli alberi.", "Fortemente dalla distanza tra gli alberi (densità della foresta).", "Dall'ora del giorno."],
            c: 1
        },
        {
            q: "4. Cos'è la soglia critica (p_c) nella percolazione?",
            a: ["La temperatura a cui l'acqua bolle.", "Il numero massimo di alberi in una foresta.", "La probabilità esatta al di sopra della quale si forma un cluster infinito."],
            c: 2
        },
        {
            q: "5. Cosa succede in una foresta se la densità (probabilità) è nettamente INFERIORE alla soglia critica?",
            a: ["L'incendio si propaga all'infinito.", "L'incendio rimane confinato a un'area finita.", "Gli alberi crescono più velocemente."],
            c: 1
        },
        {
            q: "6. Perché si usano le condizioni periodiche al contorno (Effetto Pac-Man) nelle simulazioni?",
            a: ["Per simulare sistemi infiniti usando computer con memoria finita.", "Per rendere la simulazione più colorata.", "Per impedire agli alberi di bruciare."],
            c: 0
        },
        {
            q: "7. Topologicamente, a quale forma corrisponde l'uso di condizioni periodiche su entrambi gli assi (x e y)?",
            a: ["Una sfera.", "Un piano infinito.", "Un toro (ciambella)."],
            c: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2.5rem";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "12px";
            card.style.background = "rgba(255,255,255,0.02)";
            card.style.border = "1px solid rgba(255,255,255,0.05)";

            card.innerHTML = `<h3 style="margin-bottom:1rem; color: #fff;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex";
            optionsGroup.style.flexDirection = "column";
            optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = option;
                btn.style.textAlign = "left";
                btn.style.padding = "1rem";
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "white";
                btn.style.borderRadius = "8px";
                btn.style.cursor = "pointer";
                btn.style.transition = "0.3s";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    
                    const sibs = optionsGroup.children;
                    for (let s of sibs) s.disabled = true;

                    if (oIdx === data.c) {
                        btn.style.background = "#10B981";
                        btn.innerHTML += " <strong>✓ Esatto!</strong>";
                        score++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.innerHTML += " <strong>✗ Sbagliato</strong>";
                        sibs[data.c].style.background = "#10B981";
                        sibs[data.c].style.opacity = "1";
                    }
                    
                    btn.classList.add('picked');
                    answered++;
                    if (answered === quizData.length) {
                        quizScore.innerHTML = `Punteggio Finale: ${score}/${quizData.length}`;
                        quizScore.style.color = score > Math.floor(quizData.length * 0.7) ? "#10B981" : "#F59E0B";
                    }
                };

                optionsGroup.appendChild(btn);
            });

            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }
}
