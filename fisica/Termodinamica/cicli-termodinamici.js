/**
 * Cicli Termodinamici Simulator
 * Piston Control and Gas Visualization
 */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('volume-slider');
    const pistonHead = document.getElementById('piston-head');
    const gasCloud = document.getElementById('gas-cloud');
    const valP = document.getElementById('val-p');
    const valV = document.getElementById('val-v');
    const valT = document.getElementById('val-t');
    const autoCycleBtn = document.getElementById('btn-auto-cycle');

    // Constants for simulation
    let isAutoCycling = false;
    let cycleInterval = null;
    let cyclePhase = 0; // 0-100 for a cycle

    // Base values (n=1, R=1 for simplicity in normalized units)
    let volume = parseFloat(slider.value) / 100; // in L
    let temperature = 300; // start at 300 K
    let pressure = 1.0;

    function updateSimulation(vInput) {
        // Normalize volume (0.5 to 2.5)
        volume = vInput / 100;
        
        // Simulating adiabatic compression/expansion: P * V^gamma = constant
        // (Simplified to PV = constant for isothermal visual, then add T effect)
        // Let's go with P = nRT/V. If we fix n and R, P = T / V
        // Actually, let's make it a bit more realistic:
        // As you compress (V down), T goes up slightly (Adiabatic-ish)
        
        // Base T + effect of compression
        // Let's use T = 300 * (1.8 / volume)^0.4 (Gamma approximated)
        temperature = 300 * Math.pow((1.8 / volume), 0.4);
        pressure = (temperature * 0.006) / volume; // Scaling factor for display

        // Update UI Text
        valV.innerText = volume.toFixed(2) + " L";
        valP.innerText = pressure.toFixed(2) + " atm";
        valT.innerText = Math.round(temperature) + " K";

        // Update Visuals
        const height = vInput;
        pistonHead.style.top = (300 - height - 40) + "px";
        gasCloud.style.height = height + "px";

        // Color gas based on temperature (Red for hot, blue for cold)
        // 300K = Blue (255), 600K = Red (255)
        const heatRatio = Math.min(Math.max((temperature - 250) / 400, 0), 1);
        const r = Math.floor(59 + (239 - 59) * heatRatio);
        const g = Math.floor(130 * (1 - heatRatio));
        const b = Math.floor(246 * (1 - heatRatio));
        gasCloud.style.background = `rgba(${r}, ${g}, ${b}, ${0.4 + heatRatio * 0.4})`;
    }

    slider.addEventListener('input', (e) => {
        if (isAutoCycling) toggleAutoCycle(); // Stop auto if user manual
        updateSimulation(parseFloat(e.target.value));
    });

    // Auto Cycle: Sinusoidal volume change
    function toggleAutoCycle() {
        isAutoCycling = !isAutoCycling;
        if (isAutoCycling) {
            autoCycleBtn.innerText = "Ferma Ciclo";
            autoCycleBtn.style.background = "#ef4444";
            let time = 0;
            cycleInterval = setInterval(() => {
                time += 0.05;
                // Volume oscillante tra 80 e 220
                const v = 150 + Math.sin(time) * 70;
                slider.value = v;
                updateSimulation(v);
            }, 50);
        } else {
            autoCycleBtn.innerText = "Avvia Ciclo Automatico";
            autoCycleBtn.style.background = "var(--physics-color)";
            clearInterval(cycleInterval);
        }
    }

    // Initial run
    updateSimulation(slider.value);
    window.toggleAutoCycle = toggleAutoCycle; // Export for HTML onclick
});

// --- SEZIONE 2.1: EQUIVALENTE MECCANICO DEL CALORE ---

const G_ACCEL = 9.81;
const J_PER_CAL = 4.186;
const CAL_PER_J = 1 / 4.186;

let jouleAnimRunning = false;
let jouleAnimFrame = null;

function updateJoule() {
    const m = parseFloat(document.getElementById('jm-slider').value);
    const h = parseFloat(document.getElementById('jh-slider').value) / 10;
    const n = parseInt(document.getElementById('jn-slider').value);

    document.getElementById('jm-val').textContent = m + ' kg';
    document.getElementById('jh-val').textContent = h.toFixed(1) + ' m';
    document.getElementById('jn-val').textContent = n;

    // Due pesi che cadono insieme per n cadute
    const work = 2 * m * G_ACCEL * h * n;
    const heatCal = work * CAL_PER_J;
    // 1 cal scalda 1 g di 1°C; con 1000 g (1 kg) d'acqua: ΔT = Q(cal)/1000
    const deltaT = heatCal / 1000;

    document.getElementById('j-work').textContent = work.toFixed(1) + ' J';
    document.getElementById('j-heat').textContent = heatCal.toFixed(2) + ' cal';
    document.getElementById('j-dt').textContent = '+' + deltaT.toFixed(4) + ' °C';

    const tempLabel = document.getElementById('joule-temp-label');
    if (tempLabel) tempLabel.textContent = '+' + deltaT.toFixed(4) + '°C';
}

function animateJoule() {
    if (jouleAnimRunning) return;
    jouleAnimRunning = true;

    const btn = document.getElementById('btn-joule');
    btn.textContent = '⏳ Esperimento in corso…';
    btn.disabled = true;

    const paddle   = document.getElementById('paddle-wheel');
    const wtLeft   = document.getElementById('wt-left');
    const wtRight  = document.getElementById('wt-right');
    const thermFill = document.getElementById('therm-fill');
    const waterBody = document.getElementById('water-body');
    const tempLabel = document.getElementById('joule-temp-label');

    const m = parseFloat(document.getElementById('jm-slider').value);
    const h = parseFloat(document.getElementById('jh-slider').value) / 10;
    const n = parseInt(document.getElementById('jn-slider').value);
    const work = 2 * m * G_ACCEL * h * n;
    const heatCal = work * CAL_PER_J;
    const deltaT = heatCal / 1000;

    // Mappa ΔT in pixel sul termometro (max 60 px per ΔT ≥ 0.05 °C)
    const maxThermPx = Math.min((deltaT / 0.05) * 60, 60);

    const duration = 3500;
    const start = performance.now();

    function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        // Rotazione pale attorno al centro (230, 210)
        if (paddle) {
            paddle.setAttribute('transform', `rotate(${ease * 720}, 230, 210)`);
        }

        // Pesi: cicli di caduta/risalita
        const cyclePos = (t * n) % 1;
        const dropY = cyclePos < 0.75
            ? (cyclePos / 0.75) * 45
            : 45 * (1 - (cyclePos - 0.75) / 0.25);
        if (wtLeft)  wtLeft.setAttribute('transform',  `translate(0, ${dropY})`);
        if (wtRight) wtRight.setAttribute('transform', `translate(0, ${dropY})`);

        // Termometro che sale
        const thermRise = ease * maxThermPx;
        if (thermFill) {
            thermFill.setAttribute('y', 241 - thermRise);
            thermFill.setAttribute('height', 10 + thermRise);
        }
        if (tempLabel) {
            tempLabel.textContent = '+' + (ease * deltaT).toFixed(4) + '°C';
        }

        // Acqua che si scalda leggermente (sfumatura verso il rosso)
        if (waterBody) {
            const ratio = Math.min(ease * deltaT / 0.05, 1);
            const r = Math.floor(59 + 90 * ratio);
            const g2 = Math.floor(130 - 60 * ratio);
            waterBody.setAttribute('fill', `rgba(${r},${g2},246,0.3)`);
        }

        if (t < 1) {
            jouleAnimFrame = requestAnimationFrame(frame);
        } else {
            if (wtLeft)  wtLeft.removeAttribute('transform');
            if (wtRight) wtRight.removeAttribute('transform');
            btn.textContent = '▶ Avvia Esperimento';
            btn.disabled = false;
            jouleAnimRunning = false;
        }
    }

    jouleAnimFrame = requestAnimationFrame(frame);
}

function convertFromCal(val) {
    const cal = parseFloat(val);
    const jInput = document.getElementById('conv-j');
    if (jInput) {
        jInput.value = (isNaN(cal) || val === '') ? '' : (cal * J_PER_CAL).toFixed(4);
    }
}

function convertFromJoule(val) {
    const j = parseFloat(val);
    const calInput = document.getElementById('conv-cal');
    if (calInput) {
        calInput.value = (isNaN(j) || val === '') ? '' : (j * CAL_PER_J).toFixed(4);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('jm-slider')) updateJoule();
});

// --- FUNZIONE PER IL QUIZ ---
function checkAnswer(buttonClicked, isCorrect) {
    if (buttonClicked.classList.contains('correct') || buttonClicked.classList.contains('wrong')) return;

    if (isCorrect) {
        buttonClicked.style.backgroundColor = "#2ecc71"; // Verde smeraldo morbido
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#27ae60";
        buttonClicked.classList.add('correct');
        if (!buttonClicked.innerHTML.includes("✓")) {
            buttonClicked.innerHTML += " <strong>✓ Esatto!</strong>";
        }
        
        // Disabilita e scurisci gli altri nello stesso blocco
        const parentBlock = buttonClicked.parentElement;
        const allButtons = parentBlock.querySelectorAll('.quiz-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = "default";
            if (!btn.classList.contains('correct')) btn.style.opacity = "0.7";
        });
    } else {
        buttonClicked.style.backgroundColor = "#e74c3c"; // Rosso alizarin
        buttonClicked.style.color = "white";
        buttonClicked.style.borderColor = "#c0392b";
        buttonClicked.classList.add('wrong');
        if (!buttonClicked.innerHTML.includes("✗")) {
            buttonClicked.innerHTML += " <strong>✗ Riprova!</strong>";
        }
        buttonClicked.disabled = true; // disabilita solo il pulsante errato per permettere altri tentativi
        buttonClicked.style.cursor = "not-allowed";
        buttonClicked.style.opacity = "0.7";
    }
}
