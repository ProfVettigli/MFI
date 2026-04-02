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
