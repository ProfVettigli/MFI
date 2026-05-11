/**
 * paradossi-intuizione.js
 * Monty Hall Game & Paradox Statistics
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- MONTY HALL GAME LOGIC ---
    let carPos = 0;
    let userChoice = null;
    let montyOpen = null;
    let gameState = 'START'; // START, CHOICE, END

    const stats = {
        stay: { wins: 0, total: 0 },
        switch: { wins: 0, total: 0 }
    };

    const doors = document.querySelectorAll('.door-wrapper');
    const msg = document.getElementById('game-msg');
    const actionBtns = document.getElementById('action-btns');
    const btnStay = document.getElementById('btn-stay');
    const btnSwitch = document.getElementById('btn-switch');
    const btnReset = document.getElementById('btn-reset');

    const stayStatEl = document.getElementById('stats-stay');
    const switchStatEl = document.getElementById('stats-switch');

    function initGame() {
        carPos = Math.floor(Math.random() * 3);
        userChoice = null;
        montyOpen = null;
        gameState = 'START';
        
        msg.textContent = "Scegli una porta per iniziare!";
        msg.style.color = "var(--text-main)";
        actionBtns.style.display = "none";
        btnReset.style.display = "none";

        doors.forEach((d, idx) => {
            d.classList.remove('selected', 'opened');
            const doorInner = d.querySelector('.door');
            doorInner.classList.remove('open');
            const content = d.querySelector('.content-behind');
            content.textContent = (idx === carPos) ? "🏎️" : "🐐";
            d.style.pointerEvents = "auto";
            d.style.opacity = "1";
        });
    }

    function updateStats() {
        const stayPerc = stats.stay.total === 0 ? 0 : Math.round((stats.stay.wins / stats.stay.total) * 100);
        const switchPerc = stats.switch.total === 0 ? 0 : Math.round((stats.switch.wins / stats.switch.total) * 100);

        stayStatEl.textContent = `${stayPerc}%`;
        switchStatEl.textContent = `${switchPerc}%`;
        
        // Add color feedback
        stayStatEl.style.color = stayPerc > switchPerc ? "#10B981" : "#EF4444";
        switchStatEl.style.color = switchPerc > stayPerc ? "#10B981" : "#EF4444";
        
        if(stayPerc === switchPerc) {
            stayStatEl.style.color = "#8B5CF6";
            switchStatEl.style.color = "#8B5CF6";
        }
    }

    doors.forEach((doorWrapper, index) => {
        doorWrapper.addEventListener('click', () => {
            if (gameState !== 'START') return;

            userChoice = index;
            gameState = 'CHOICE';
            
            // Visual highlight
            doorWrapper.classList.add('selected');
            doors.forEach(d => d.style.pointerEvents = "none");

            // Monty opens a door
            // Monty will open a door that is not the car and not the userChoice
            let possibleMontyDoors = [0, 1, 2].filter(d => d !== carPos && d !== userChoice);
            montyOpen = possibleMontyDoors[Math.floor(Math.random() * possibleMontyDoors.length)];

            // Animation for Monty opening
            setTimeout(() => {
                const montyDoorEl = doors[montyOpen].querySelector('.door');
                montyDoorEl.classList.add('open');
                doors[montyOpen].style.opacity = "0.7";
                
                msg.textContent = `Hai scelto la porta ${userChoice + 1}. Monty ha aperto la porta ${montyOpen + 1} rivelando una capra 🐐. Cosa vuoi fare?`;
                actionBtns.style.display = "block";
            }, 500);
        });
    });

    btnStay.addEventListener('click', () => {
        if (gameState !== 'CHOICE') return;
        completeGame(false);
    });

    btnSwitch.addEventListener('click', () => {
        if (gameState !== 'CHOICE') return;
        completeGame(true);
    });

    function completeGame(didSwitch) {
        gameState = 'END';
        actionBtns.style.display = "none";
        
        let finalChoice = userChoice;
        if (didSwitch) {
            finalChoice = [0, 1, 2].find(d => d !== userChoice && d !== montyOpen);
            // Highlight the new selection
            doors[userChoice].classList.remove('selected');
            doors[finalChoice].classList.add('selected');
        }

        const isWin = (finalChoice === carPos);

        // Update technical stats
        if (didSwitch) {
            stats.switch.total++;
            if (isWin) stats.switch.wins++;
        } else {
            stats.stay.total++;
            if (isWin) stats.stay.wins++;
        }

        // Open ALL doors
        setTimeout(() => {
            doors.forEach(d => d.querySelector('.door').classList.add('open'));
            
            if (isWin) {
                msg.textContent = "CONGRATULAZIONI! Hai vinto l'auto sportiva! 🏎️✨";
                msg.style.color = "#10B981";
            } else {
                msg.textContent = "PECCATO... solo una capra per te questa volta. 🐐";
                msg.style.color = "#EF4444";
            }
            
            updateStats();
            btnReset.style.display = "inline-block";
        }, 500);
    }

    btnReset.addEventListener('click', initGame);
    initGame();

    // --- BIRTHDAY PARADOX LOGIC ---
    const bSlider = document.getElementById('birthday-slider');
    const pCountLabel = document.getElementById('people-count');
    const probLabel = document.getElementById('prob-display');
    const bCanvas = document.getElementById('birthday-chart');
    const bCtx = bCanvas.getContext('2d');

    function calculateBirthdayProb(n) {
        if (n <= 1) return 0;
        if (n > 365) return 1;
        
        let probNotShared = 1;
        for (let i = 0; i < n; i++) {
            probNotShared *= (365 - i) / 365;
        }
        return 1 - probNotShared;
    }

    function drawBirthdayChart() {
        const currentN = parseInt(bSlider.value);
        pCountLabel.textContent = `${currentN} persone`;
        probLabel.textContent = `${(calculateBirthdayProb(currentN) * 100).toFixed(1)}%`;

        const w = bCanvas.width;
        const h = bCanvas.height;
        const padding = 30;

        bCtx.clearRect(0, 0, w, h);

        // Draw Axes
        bCtx.strokeStyle = "rgba(255,255,255,0.1)";
        bCtx.lineWidth = 1;
        bCtx.beginPath();
        bCtx.moveTo(padding, padding);
        bCtx.lineTo(padding, h - padding);
        bCtx.lineTo(w - padding, h - padding);
        bCtx.stroke();

        // Draw Reference Line (50%)
        bCtx.strokeStyle = "rgba(255,255,255,0.05)";
        bCtx.setLineDash([5, 5]);
        bCtx.beginPath();
        bCtx.moveTo(padding, padding + (h - 2 * padding) / 2);
        bCtx.lineTo(w - padding, padding + (h - 2 * padding) / 2);
        bCtx.stroke();
        bCtx.setLineDash([]);

        // Draw Curve
        bCtx.beginPath();
        bCtx.strokeStyle = "#3B82F6";
        bCtx.lineWidth = 3;
        
        let points = [];
        for (let n = 0; n <= 100; n++) {
            const p = calculateBirthdayProb(n);
            const x = padding + (n / 100) * (w - 2 * padding);
            const y = h - padding - p * (h - 2 * padding);
            points.push({x, y, p, n});
            if (n === 0) bCtx.moveTo(x, y);
            else bCtx.lineTo(x, y);
        }
        bCtx.stroke();

        // Fill Area
        const gradient = bCtx.createLinearGradient(0, padding, 0, h - padding);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        bCtx.lineTo(padding + (w - 2 * padding), h - padding);
        bCtx.lineTo(padding, h - padding);
        bCtx.fillStyle = gradient;
        bCtx.fill();

        // Draw Current Point Marker
        const currentP = calculateBirthdayProb(currentN);
        const curX = padding + (currentN / 100) * (w - 2 * padding);
        const curY = h - padding - currentP * (h - 2 * padding);

        bCtx.beginPath();
        bCtx.fillStyle = "#3B82F6";
        bCtx.arc(curX, curY, 6, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.strokeStyle = "#fff";
        bCtx.lineWidth = 2;
        bCtx.stroke();

        // Label 50% threshold
        bCtx.fillStyle = "rgba(255,255,255,0.4)";
        bCtx.font = "10px Inter";
        bCtx.fillText("50%", 5, padding + (h - 2 * padding) / 2 + 3);
        bCtx.fillText("0", padding - 5, h - padding + 15);
        bCtx.fillText("100", w - padding - 5, h - padding + 15);
    }

    if(bSlider) {
        bSlider.oninput = drawBirthdayChart;
        drawBirthdayChart();
    }

});
