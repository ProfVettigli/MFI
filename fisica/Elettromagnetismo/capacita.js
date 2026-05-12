// Capacità e Condensatori - Visualizzatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initCapacitorVisualizer();
    initEnergyCalculator();
    initQuiz();
});

// ===== CAPACITOR VISUALIZER =====
function initCapacitorVisualizer() {
    const areaSlider = document.getElementById('area-slider');
    const distanceSlider = document.getElementById('distance-slider');
    const epsilonSlider = document.getElementById('epsilon-slider');

    const areaValue = document.getElementById('area-value');
    const distanceValue = document.getElementById('distance-value');
    const epsilonValue = document.getElementById('epsilon-value');
    const capacityResult = document.getElementById('capacity-result');

    if (!areaSlider) return;

    function updateCapacity() {
        const A = parseFloat(areaSlider.value);
        const d = parseFloat(distanceSlider.value);
        const epsilon = parseFloat(epsilonSlider.value);

        areaValue.textContent = A.toFixed(0);
        distanceValue.textContent = d.toFixed(1);
        epsilonValue.textContent = epsilon.toFixed(1);

        // C = ε₀ · ε_r · A / d
        // ε₀ = 8.85 × 10⁻¹² F/m
        // A in cm² = 10⁻⁴ m²
        // d in mm = 10⁻³ m
        const epsilon0 = 8.85e-12;
        const A_m2 = (A * 1e-4); // convert cm² to m²
        const d_m = (d * 1e-3); // convert mm to m

        const C = epsilon0 * epsilon * A_m2 / d_m;

        // Display in pF
        const C_pF = C * 1e12;

        if (C_pF < 1) {
            capacityResult.textContent = (C_pF).toFixed(1) + ' pF';
        } else if (C_pF < 1000) {
            capacityResult.textContent = (C_pF).toFixed(0) + ' pF';
        } else if (C_pF < 1e6) {
            capacityResult.textContent = (C_pF / 1000).toFixed(1) + ' nF';
        } else {
            capacityResult.textContent = (C_pF / 1e6).toFixed(2) + ' μF';
        }
    }

    areaSlider.addEventListener('input', updateCapacity);
    distanceSlider.addEventListener('input', updateCapacity);
    epsilonSlider.addEventListener('input', updateCapacity);

    updateCapacity();
}

// ===== ENERGY CALCULATOR =====
function initEnergyCalculator() {
    const cInput = document.getElementById('energy-c');
    const vInput = document.getElementById('energy-v');
    const energyResult = document.getElementById('energy-result');

    if (!cInput) return;

    function updateEnergy() {
        const C = parseFloat(cInput.value) || 0; // in μF
        const V = parseFloat(vInput.value) || 0; // in Volts

        // E = ½ · C · V²
        // C in μF = C × 10⁻⁶ F
        const C_F = C * 1e-6;
        const E = 0.5 * C_F * V * V;

        // Display in μJ or mJ
        const E_microJ = E * 1e6;

        if (E_microJ < 1000) {
            energyResult.textContent = E_microJ.toFixed(1) + ' μJ';
        } else {
            energyResult.textContent = (E_microJ / 1000).toFixed(2) + ' mJ';
        }
    }

    cInput.addEventListener('input', updateEnergy);
    vInput.addEventListener('input', updateEnergy);

    updateEnergy();
}

// ===== QUIZ =====
function initQuiz() {
    const quizData = [
        {
            question: "Quale formula descrive la capacità?",
            options: ["C = Q/V", "C = V/Q", "C = R×I", "C = E/B"],
            correct: 0
        },
        {
            question: "Se aumenti l'area dei piatti di un condensatore, cosa accade?",
            options: ["La capacità diminuisce", "La capacità aumenta", "La capacità non cambia", "La tensione aumenta"],
            correct: 1
        },
        {
            question: "Se avvicini i piatti di un condensatore, cosa accade?",
            options: ["La capacità diminuisce", "La carica diminuisce", "La capacità aumenta", "La tensione dimezza"],
            correct: 2
        },
        {
            question: "L'energia in un condensatore è data da:",
            options: ["E = C × V", "E = ½ C × V²", "E = C / V", "E = Q × R"],
            correct: 1
        },
        {
            question: "Qual è l'unità di misura della capacità?",
            options: ["Volt", "Coulomb", "Farad", "Joule"],
            correct: 2
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');

    if (!quizArea) return;

    let score = 0;

    quizData.forEach((q, idx) => {
        const div = document.createElement('div');
        div.style.marginBottom = '2rem';

        const questionTitle = document.createElement('h4');
        questionTitle.textContent = `${idx + 1}. ${q.question}`;
        questionTitle.style.marginBottom = '1rem';
        questionTitle.style.color = 'var(--text-main)';
        div.appendChild(questionTitle);

        q.options.forEach((opt, optIdx) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '0.5rem';
            label.style.cursor = 'pointer';
            label.style.padding = '0.7rem';
            label.style.borderRadius = '6px';
            label.style.transition = 'background 0.2s';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `q${idx}`;
            input.value = optIdx;

            input.addEventListener('change', () => {
                if (optIdx === q.correct) {
                    score++;
                    label.style.background = 'rgba(34,197,94,0.2)';
                    label.style.borderLeft = '3px solid #22c55e';
                } else {
                    label.style.background = 'rgba(239,68,68,0.2)';
                    label.style.borderLeft = '3px solid #ef4444';
                }
                updateScore();
            });

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opt));
            div.appendChild(label);
        });

        quizArea.appendChild(div);
    });

    function updateScore() {
        quizScore.textContent = `Risposte corrette: ${score} / ${quizData.length}`;
        if (score === quizData.length) {
            quizScore.style.color = '#22c55e';
        } else if (score >= quizData.length / 2) {
            quizScore.style.color = '#eab308';
        } else {
            quizScore.style.color = '#ef4444';
        }
    }
}
