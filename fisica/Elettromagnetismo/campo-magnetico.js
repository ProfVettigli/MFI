// Campo Magnetico - Visualizzatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initMagnetCanvas();
    initQuiz();
});

// ===== CANVAS MAGNETICO =====
function initMagnetCanvas() {
    const canvas = document.getElementById('magnet-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let magnets = [];
    let mode = 'dipole';

    const modeButtons = {
        'dipole': document.getElementById('mode-dipole'),
        'ns': document.getElementById('mode-ns'),
        'clear': document.getElementById('mode-clear')
    };

    // Event listeners per buttons
    if (modeButtons.dipole) {
        modeButtons.dipole.addEventListener('click', () => {
            mode = 'dipole';
            Object.values(modeButtons).forEach(btn => btn?.classList.remove('active'));
            modeButtons.dipole.classList.add('active');
        });
    }
    if (modeButtons.ns) {
        modeButtons.ns.addEventListener('click', () => {
            mode = 'ns';
            Object.values(modeButtons).forEach(btn => btn?.classList.remove('active'));
            modeButtons.ns.classList.add('active');
        });
    }
    if (modeButtons.clear) {
        modeButtons.clear.addEventListener('click', () => {
            magnets = [];
            draw();
        });
    }

    // Click per aggiungere magneti
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === 'dipole') {
            magnets.push({ x, y, type: 'dipole', strength: 30 });
        } else if (mode === 'ns') {
            magnets.push({ x, y, type: 'north', strength: 30 });
            magnets.push({ x: x + 50, y, type: 'south', strength: 30 });
        }
        draw();
    });

    function drawFieldLine(startX, startY, stepSize = 2) {
        const path = [];
        let x = startX, y = startY;
        const maxSteps = 200;
        let steps = 0;

        while (steps < maxSteps && x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
            path.push({ x, y });

            // Calcola gradiente del campo
            let bx = 0, by = 0;
            for (const magnet of magnets) {
                const dx = x - magnet.x;
                const dy = y - magnet.y;
                const r2 = dx * dx + dy * dy + 1;
                const r = Math.sqrt(r2);

                if (magnet.type === 'dipole' || magnet.type === 'north') {
                    const factor = magnet.strength / r2;
                    bx += (dx / r) * factor;
                    by += (dy / r) * factor;
                }
                if (magnet.type === 'dipole' || magnet.type === 'south') {
                    const factor = -magnet.strength / r2;
                    bx += (dx / r) * factor;
                    by += (dy / r) * factor;
                }
            }

            const mag = Math.sqrt(bx * bx + by * by) + 1;
            x += (bx / mag) * stepSize;
            y += (by / mag) * stepSize;
            steps++;
        }

        return path;
    }

    function draw() {
        ctx.fillStyle = '#050810';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Linee di campo
        const gridSize = 30;
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const path = drawFieldLine(x, y, 3);

                if (path.length > 1) {
                    // Determina colore (Nord = verde, Sud = rosso)
                    let isNorth = false;
                    const lastMagnet = magnets[magnets.length - 1];
                    if (lastMagnet &&
                        ((lastMagnet.type === 'north') ||
                         (lastMagnet.type === 'dipole' && path[path.length-1].y < lastMagnet.y))) {
                        isNorth = true;
                    }

                    ctx.strokeStyle = isNorth ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(path[0].x, path[0].y);
                    for (let i = 1; i < path.length; i++) {
                        ctx.lineTo(path[i].x, path[i].y);
                    }
                    ctx.stroke();

                    // Freccia finale
                    if (path.length > 2) {
                        const dx = path[path.length-1].x - path[path.length-2].x;
                        const dy = path[path.length-1].y - path[path.length-2].y;
                        const angle = Math.atan2(dy, dx);
                        const len = 5;
                        ctx.fillStyle = isNorth ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)';
                        ctx.save();
                        ctx.translate(path[path.length-1].x, path[path.length-1].y);
                        ctx.rotate(angle);
                        ctx.fillRect(0, -2, len, 4);
                        ctx.restore();
                    }
                }
            }
        }

        // Disegna magneti
        magnets.forEach(magnet => {
            if (magnet.type === 'dipole') {
                // Nord (alto)
                ctx.fillStyle = 'rgba(34,197,94,0.8)';
                ctx.fillRect(magnet.x - 15, magnet.y - 25, 30, 20);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('N', magnet.x, magnet.y - 15);

                // Sud (basso)
                ctx.fillStyle = 'rgba(239,68,68,0.8)';
                ctx.fillRect(magnet.x - 15, magnet.y + 5, 30, 20);
                ctx.fillStyle = '#fff';
                ctx.fillText('S', magnet.x, magnet.y + 15);
            } else if (magnet.type === 'north') {
                ctx.fillStyle = 'rgba(34,197,94,0.8)';
                ctx.beginPath();
                ctx.arc(magnet.x, magnet.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('N', magnet.x, magnet.y);
            } else if (magnet.type === 'south') {
                ctx.fillStyle = 'rgba(239,68,68,0.8)';
                ctx.beginPath();
                ctx.arc(magnet.x, magnet.y, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('S', magnet.x, magnet.y);
            }
        });
    }

    draw();
}

// ===== QUIZ =====
function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    const questions = [
        {
            q: "Quale è l'unità di misura del campo magnetico nel SI?",
            options: ["Newton (N)", "Tesla (T)", "Ohm (Ω)", "Joule (J)"],
            correct: 1
        },
        {
            q: "Chi scoprì che la corrente elettrica genera un campo magnetico?",
            options: ["Coulomb", "Faraday", "Ørsted", "Lorentz"],
            correct: 2
        },
        {
            q: "La forza di Lorentz agisce:",
            options: ["Parallela al campo", "Parallela alla velocità", "Perpendicolare a entrambi", "Opposta alla carica"],
            correct: 2
        },
        {
            q: "Un magnete possiede:",
            options: ["Solo un polo Nord", "Solo un polo Sud", "Sempre entrambi i poli", "Nessun polo definito"],
            correct: 2
        },
        {
            q: "Il ciclotrone sfrutta quale effetto?",
            options: ["La forza di Coulomb", "La forza di Lorentz", "L'induzione magnetica", "L'effetto tunnel"],
            correct: 1
        }
    ];

    let score = 0;
    let answered = 0;

    questions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '1.5rem';
        div.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 0.8rem;">${idx + 1}. ${q.q}</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${q.options.map((opt, i) => `
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="radio" name="q${idx}" value="${i}" style="margin-right: 0.8rem;">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        `;
        quizArea.appendChild(div);

        const radios = div.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                answered++;
                if (parseInt(radio.value) === q.correct) {
                    score++;
                }
                if (answered === questions.length) {
                    const pct = Math.round((score / questions.length) * 100);
                    quizScore.textContent = `Risultato: ${score}/${questions.length} (${pct}%)`;
                    quizScore.style.color = pct >= 70 ? 'var(--physics-color)' : '#ef4444';
                }
            });
        });
    });
}
