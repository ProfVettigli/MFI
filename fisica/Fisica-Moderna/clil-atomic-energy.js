// Atomic Energy - Interactive Components

const C = 3e8; // Speed of light (m/s)
const HBAR = 1.054571817e-34; // ℏ (J·s)

// ============================================================================
// BINDING ENERGY CURVE
// ============================================================================

function initBindingEnergy() {
    const aSlider = document.getElementById('mass-number');
    const aVal = document.getElementById('mass-val');
    const beResult = document.getElementById('binding-energy');
    const totalBEResult = document.getElementById('total-be');
    const canvas = document.getElementById('be-curve');
    const ctx = canvas.getContext('2d');

    // Semi-empirical mass formula (SEMF) - Weizsäcker formula
    function bindingEnergyPerNucleon(A) {
        const Z = Math.round(A / 2); // Approximation
        const N = A - Z;
        const a_v = 15.677; // Volume term
        const a_s = 18.56; // Surface term
        const a_c = 0.717; // Coulomb term
        const a_a = 28.1; // Asymmetry term
        const a_p = 11.18; // Pairing term

        const volume = a_v * A;
        const surface = -a_s * Math.pow(A, 2/3);
        const coulomb = -a_c * Math.pow(Z, 2) / Math.pow(A, 1/3);
        const asymmetry = -a_a * Math.pow(N - Z, 2) / A;
        const pairing = (A % 2 === 0) ? a_p / Math.pow(A, 0.5) : 0;

        const BE = (volume + surface + coulomb + asymmetry + pairing) / A;
        return Math.max(BE, 0); // MeV per nucleon
    }

    function getElementName(A) {
        const names = {
            4: 'He', 12: 'C', 16: 'O', 28: 'Ni', 56: 'Fe', 63: 'Cu', 100: 'Mo',
            118: 'Sn', 137: 'Ba', 197: 'Au', 208: 'Pb', 235: 'U', 238: 'U'
        };
        return names[A] || '';
    }

    function drawCurve() {
        const A = parseInt(aSlider.value);
        const name = getElementName(A);
        aVal.textContent = 'A = ' + A + (name ? ' (' + name + ')' : '');

        const bePerNucleon = bindingEnergyPerNucleon(A);
        const totalBE = bePerNucleon * A;

        beResult.textContent = bePerNucleon.toFixed(2) + ' MeV/nucleon';
        totalBEResult.textContent = totalBE.toFixed(0) + ' MeV';

        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;

        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, w, h);

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, h - padding);
        ctx.lineTo(w - padding, h - padding);
        ctx.moveTo(padding, h - padding);
        ctx.lineTo(padding, padding);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mass Number (A)', w / 2, h - 10);
        ctx.save();
        ctx.translate(10, h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Binding Energy / nucleon (MeV)');
        ctx.restore();

        // Plot curve
        ctx.strokeStyle = 'rgba(239,68,68,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        for (let testA = 4; testA <= 240; testA += 1) {
            const be = bindingEnergyPerNucleon(testA);
            const x = padding + ((testA - 4) / (240 - 4)) * (w - 2 * padding);
            const y = (h - padding) - (be / 8.8) * (h - 2 * padding);

            if (testA === 4) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Highlight current point
        const currentBE = bindingEnergyPerNucleon(A);
        const currentX = padding + ((A - 4) / (240 - 4)) * (w - 2 * padding);
        const currentY = (h - padding) - (currentBE / 8.8) * (h - 2 * padding);

        ctx.fillStyle = 'rgba(239,68,68,0.9)';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(239,68,68,0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX, h - padding);
        ctx.stroke();
        ctx.setLineDash([]);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * (w - 2 * padding);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, h - padding);
            ctx.stroke();
        }
    }

    aSlider.addEventListener('input', drawCurve);
    drawCurve();
}

// ============================================================================
// QUIZ
// ============================================================================

function initQuiz() {
    const quizData = [
        {
            q: "What is the mass defect in nuclear physics?",
            options: [
                "The difference between actual and ideal atomic mass",
                "The mass lost in radioactive decay",
                "The difference between the mass of nucleons and the mass of the nucleus",
                "The effect of relativistic mass increase"
            ],
            correct: 2
        },
        {
            q: "What does Einstein's E=mc² tell us about binding energy?",
            options: [
                "Energy and mass are interchangeable at nuclear scales",
                "Larger nuclei always have more energy",
                "Binding energy is mass converted to energy",
                "Both a and c"
            ],
            correct: 3
        },
        {
            q: "Which nucleus has the highest binding energy per nucleon?",
            options: [
                "Helium-4",
                "Iron-56",
                "Uranium-235",
                "Deuterium"
            ],
            correct: 1
        },
        {
            q: "What is nuclear fission?",
            options: [
                "Two nuclei merging into one heavier nucleus",
                "A heavy nucleus splitting into lighter nuclei after absorbing a neutron",
                "Radioactive decay of unstable isotopes",
                "The emission of gamma rays from excited nuclei"
            ],
            correct: 1
        },
        {
            q: "Why is controlled fusion difficult compared to fission?",
            options: [
                "Fusion doesn't release energy",
                "Nuclei repel each other electrically; extreme conditions needed to overcome Coulomb barrier",
                "Fusion requires more neutrons than fission",
                "Fusion releases too much energy to control"
            ],
            correct: 1
        },
        {
            q: "What was the Manhattan Project?",
            options: [
                "A building in New York",
                "WWII secret effort to develop the first atomic bomb",
                "A nuclear fusion experiment",
                "A Cold War spy network"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let correct = 0;

    quizArea.innerHTML = quizData.map((item, i) => {
        return `
            <div class="quiz-item" style="margin-bottom: 2rem;">
                <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">${i + 1}. ${item.q}</p>
                <div style="display: grid; gap: 0.8rem;">
                    ${item.options.map((opt, j) => `
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 0.8rem; background: rgba(0,0,0,0.2); border-radius: 8px; transition: all 0.3s;">
                            <input type="radio" name="q${i}" value="${j}" style="margin-right: 1rem; cursor: pointer;" onchange="checkQuizAnswer(${i}, ${j}, ${item.correct})">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    window.checkQuizAnswer = function(qIndex, ansIndex, correctIndex) {
        const isCorrect = ansIndex === correctIndex;
        if (isCorrect) correct++;
        if (correct === quizData.length) {
            quizScore.textContent = `✓ Excellent! You answered all ${quizData.length} questions correctly!`;
            quizScore.style.color = 'var(--physics-color)';
        }
    };
}

// ============================================================================
// INIT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('be-curve')) initBindingEnergy();
    if (document.getElementById('quiz-area')) initQuiz();
});
