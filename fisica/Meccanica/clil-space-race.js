let rocketState = {
    velocity: 5,
    angle: 45,
    isLaunched: false,
    time: 0,
    maxAltitude: 0
};

let exhaustState = {
    exhaustVel: 4000,
    fuelRatio: 3
};

document.addEventListener('DOMContentLoaded', () => {
    initRocketControls();
    initExhaustControls();
    initLaunchButton();
    drawRocket();
    updateDeltaV();
    initQuiz();
});

function initRocketControls() {
    const velocitySlider = document.getElementById('velocity-slider');
    const angleSlider = document.getElementById('angle-slider');

    if (velocitySlider) {
        velocitySlider.addEventListener('input', (e) => {
            rocketState.velocity = parseFloat(e.target.value);
            document.getElementById('velocity-display').textContent = rocketState.velocity.toFixed(1);
            drawRocket();
        });
    }

    if (angleSlider) {
        angleSlider.addEventListener('input', (e) => {
            rocketState.angle = parseFloat(e.target.value);
            document.getElementById('angle-display').textContent = rocketState.angle;
            drawRocket();
        });
    }
}

function initExhaustControls() {
    const exhaustSlider = document.getElementById('exhaust-vel-slider');
    const fuelSlider = document.getElementById('fuel-ratio-slider');

    if (exhaustSlider) {
        exhaustSlider.addEventListener('input', (e) => {
            exhaustState.exhaustVel = parseFloat(e.target.value);
            document.getElementById('exhaust-vel-display').textContent = exhaustState.exhaustVel;
            updateDeltaV();
        });
    }

    if (fuelSlider) {
        fuelSlider.addEventListener('input', (e) => {
            exhaustState.fuelRatio = parseFloat(e.target.value);
            document.getElementById('fuel-ratio-display').textContent = exhaustState.fuelRatio.toFixed(1);
            updateDeltaV();
        });
    }
}

function updateDeltaV() {
    const lnRatio = Math.log(exhaustState.fuelRatio);
    const deltaV = exhaustState.exhaustVel * lnRatio;

    document.getElementById('ln-ratio').textContent = lnRatio.toFixed(2);
    document.getElementById('deltaV-result').textContent = Math.round(deltaV) + ' m/s';
}

function initLaunchButton() {
    const launchBtn = document.getElementById('launch-btn');
    if (launchBtn) {
        launchBtn.addEventListener('click', () => {
            rocketState.isLaunched = true;
            rocketState.time = 0;
            rocketState.maxAltitude = 0;
            launchBtn.disabled = true;

            // Simulate flight
            const flightDuration = 60; // seconds
            const interval = setInterval(() => {
                rocketState.time += 0.1;

                // Simulate projectile motion with drag
                const angleRad = (rocketState.angle * Math.PI) / 180;
                const vx = rocketState.velocity * 1000 * Math.cos(angleRad);
                const vy = rocketState.velocity * 1000 * Math.sin(angleRad) - 9.81 * rocketState.time;

                const altitude = (rocketState.velocity * 1000 * Math.sin(angleRad) * rocketState.time - 0.5 * 9.81 * rocketState.time * rocketState.time) / 1000;

                if (altitude > rocketState.maxAltitude) {
                    rocketState.maxAltitude = altitude;
                }

                drawRocket();

                if (altitude < 0 || rocketState.time > flightDuration) {
                    rocketState.isLaunched = false;
                    clearInterval(interval);
                    document.getElementById('altitude-readout').textContent = Math.max(0, rocketState.maxAltitude).toFixed(1) + ' km';
                    launchBtn.disabled = false;
                }
            }, 50);
        });
    }
}

function drawRocket() {
    const canvas = document.getElementById('rocket-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Draw Earth
    ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
    ctx.beginPath();
    ctx.arc(w / 2, h - 50, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw launch pad
    ctx.fillStyle = 'rgba(150, 100, 50, 0.7)';
    ctx.fillRect(w / 2 - 20, h - 150, 40, 100);

    if (rocketState.isLaunched) {
        // Calculate rocket position
        const angleRad = (rocketState.angle * Math.PI) / 180;
        const vx = rocketState.velocity * 1000 * Math.cos(angleRad);
        const vy = rocketState.velocity * 1000 * Math.sin(angleRad);

        const altitude = (rocketState.velocity * 1000 * Math.sin(angleRad) * rocketState.time - 0.5 * 9.81 * rocketState.time * rocketState.time);
        const range = rocketState.velocity * 1000 * Math.cos(angleRad) * rocketState.time;

        const screenAltitude = Math.max(0, altitude / 100000) * (h - 200);
        const screenRange = range / 100000;
        const rocketX = w / 2 + screenRange;
        const rocketY = h - 150 - screenAltitude;

        // Draw rocket
        ctx.save();
        ctx.translate(rocketX, rocketY);
        const flightAngle = Math.atan2(vy, vx);
        ctx.rotate(flightAngle);

        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(-5, -15, 10, 30);
        ctx.fillStyle = '#ffd93d';
        ctx.fillRect(-8, 15, 16, 10);

        ctx.restore();

        // Draw flame
        ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY + 10);
        ctx.lineTo(rocketX - 5, rocketY + 30 + Math.random() * 20);
        ctx.lineTo(rocketX + 5, rocketY + 30 + Math.random() * 20);
        ctx.fill();

        // Draw trajectory
        ctx.strokeStyle = 'rgba(200, 200, 50, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(w / 2, h - 150, (altitude + 9.81 * rocketState.time * rocketState.time) / 100000, 0, Math.PI, true);
        ctx.stroke();
        ctx.setLineDash([]);
    } else {
        // Draw stationary rocket on pad
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(w / 2 - 5, h - 150 - 30, 10, 30);
        ctx.fillStyle = '#ffd93d';
        ctx.fillRect(w / 2 - 8, h - 150, 16, 10);

        // Draw angle indicator
        const angleRad = (rocketState.angle * Math.PI) / 180;
        ctx.strokeStyle = 'rgba(100, 200, 100, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2, h - 150);
        ctx.lineTo(w / 2 + 50 * Math.cos(angleRad), h - 150 - 50 * Math.sin(angleRad));
        ctx.stroke();
    }

    // Draw info
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Velocity: ${rocketState.velocity.toFixed(1)} km/s`, 20, 30);
    ctx.fillText(`Angle: ${rocketState.angle}°`, 20, 55);
    ctx.fillText(`Escape Velocity: 11.2 km/s`, 20, 80);

    if (rocketState.isLaunched) {
        ctx.fillText(`Time: ${rocketState.time.toFixed(1)}s`, 20, 105);
        ctx.fillText(`Max Altitude: ${rocketState.maxAltitude.toFixed(1)} km`, 20, 130);
    }
}

function initQuiz() {
    const quizContainer = document.getElementById('quiz-area');
    if (!quizContainer) return;

    const quizData = [
        {
            question: "When was the PSSC (Physical Science Study Committee) founded?",
            options: ["1950", "1956", "1961", "1965"],
            correct: 1
        },
        {
            question: "What event triggered the urgent need for PSSC reform in education?",
            options: ["World War II", "Sputnik launch", "Cold War beginning", "Kennedy's Moon speech"],
            correct: 1
        },
        {
            question: "Who was the first human in space?",
            options: ["Alan Shepard", "Yuri Gagarin", "John Glenn", "Buzz Aldrin"],
            correct: 1
        },
        {
            question: "What is the escape velocity of Earth?",
            options: ["7.9 km/s", "11.2 km/s", "15.0 km/s", "20.0 km/s"],
            correct: 1
        },
        {
            question: "Which law governs rocket propulsion?",
            options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
            correct: 2
        },
        {
            question: "The Tsiolkovsky Rocket Equation depends on:",
            options: [
                "Only thrust",
                "Exhaust velocity and fuel-to-payload ratio",
                "Only mass",
                "Gravitational field"
            ],
            correct: 1
        },
        {
            question: "When did Apollo 11 land on the Moon?",
            options: ["1961", "1965", "1969", "1972"],
            correct: 2
        },
        {
            question: "What was revolutionary about PSSC curriculum?",
            options: [
                "It focused on memorization",
                "It emphasized experimental science and real-world applications",
                "It removed labs from education",
                "It ignored modern physics"
            ],
            correct: 1
        }
    ];

    let html = '';
    quizData.forEach((q, idx) => {
        html += `<div class="quiz-question">
            <div class="quiz-question-text">${idx + 1}. ${q.question}</div>
            <div class="quiz-options">`;
        q.options.forEach((opt, optIdx) => {
            html += `<label class="quiz-option">
                <input type="radio" name="q${idx}" value="${optIdx}"> ${opt}
            </label>`;
        });
        html += `</div></div>`;
    });

    quizContainer.innerHTML = html;

    const scoreDiv = document.getElementById('quiz-score');
    const radios = quizContainer.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            let score = 0;
            quizData.forEach((q, idx) => {
                const selected = quizContainer.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && parseInt(selected.value) === q.correct) score++;
            });
            scoreDiv.textContent = `Score: ${score}/${quizData.length}`;
            scoreDiv.style.color = score >= 6 ? '#10b981' : '#ef4444';
        });
    });
}
