// Leggi di Ohm e Peltier - Calcolatore Interattivo

document.addEventListener('DOMContentLoaded', () => {
    initOhmCalculator();
    initMaterials();
    initQuiz();
});

// ===== OHM CALCULATOR =====
function initOhmCalculator() {
    const vInput = document.getElementById('ohm-v');
    const iInput = document.getElementById('ohm-i');
    const rInput = document.getElementById('ohm-r');
    const powerResult = document.getElementById('power-result');
    const energyResult = document.getElementById('energy-result');
    const powerBar = document.getElementById('power-bar');

    if (!vInput) return;

    function updateCalculations() {
        let v = parseFloat(vInput.value) || 0;
        let i = parseFloat(iInput.value) || 0;
        let r = parseFloat(rInput.value) || 0;

        // Se due valori sono presenti, calcola il terzo
        if (v > 0 && i > 0) {
            r = v / i;
            rInput.value = r.toFixed(2);
        } else if (v > 0 && r > 0) {
            i = v / r;
            iInput.value = i.toFixed(4);
        } else if (i > 0 && r > 0) {
            v = i * r;
            vInput.value = v.toFixed(2);
        }

        // Calcola potenza
        const power = v * i;
        powerResult.textContent = power.toFixed(2) + ' W';
        energyResult.textContent = power.toFixed(2) + ' Joule/s';

        // Aggiorna power bar (max 1000W)
        const barWidth = Math.min((power / 1000) * 100, 100);
        powerBar.style.width = barWidth + '%';

        // Colore della bar
        if (power < 100) {
            powerBar.style.background = 'linear-gradient(to right, #22c55e, #22c55e)';
        } else if (power < 500) {
            powerBar.style.background = 'linear-gradient(to right, #eab308, #eab308)';
        } else {
            powerBar.style.background = 'linear-gradient(to right, #ef4444, #ef4444)';
        }
    }

    vInput.addEventListener('input', updateCalculations);
    iInput.addEventListener('input', updateCalculations);
    rInput.addEventListener('input', updateCalculations);

    updateCalculations();
}

// ===== MATERIALS =====
function initMaterials() {
    const materialData = {
        'rame': {
            name: 'Rame (Cu)',
            resistivity: '1.68 × 10⁻⁸ Ω·m',
            info: 'Ottimo conduttore. Usato in cavi, trasformatori e circuiti. Leggermente più resistivo dell\'argento ma più economico.'
        },
        'alluminio': {
            name: 'Alluminio (Al)',
            resistivity: '2.65 × 10⁻⁸ Ω·m',
            info: 'Conduttore eccellente. Leggero e economico. Usato in linee di trasmissione ad alta tensione e dissipatori di calore.'
        },
        'nichrome': {
            name: 'Nichrome (NiCr)',
            resistivity: '1.1 × 10⁻⁶ Ω·m',
            info: 'Resistenza alta. Usato in riscaldatori, tostapane, fornelli elettrici. Resiste bene alle alte temperature.'
        },
        'carbonio': {
            name: 'Carbonio (C)',
            resistivity: '3.5 × 10⁻⁵ Ω·m',
            info: 'Semi-conduttore. Usato in resistori, matite, contatti elettrici. Conduttività varia con la temperatura.'
        },
        'vetro': {
            name: 'Vetro',
            resistivity: '>10¹⁶ Ω·m',
            info: 'Isolante praticamente perfetto. Non conduce corrente a temperature normali. Usato in isolamento e finestre.'
        }
    };

    const buttons = document.querySelectorAll('.mat-btn');
    const infoDiv = document.getElementById('material-info');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const material = btn.dataset.material;
            const data = materialData[material];
            if (data && infoDiv) {
                infoDiv.innerHTML = `
                    <div style="margin-bottom: 0.8rem;">
                        <strong style="color: var(--physics-color);">${data.name}</strong>
                    </div>
                    <div style="margin-bottom: 0.8rem;">
                        <strong>Resistività:</strong> ${data.resistivity}
                    </div>
                    <div>
                        ${data.info}
                    </div>
                `;
            }
        });
    });
}

// ===== QUIZ =====
function initQuiz() {
    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    if (!quizArea) return;

    const questions = [
        {
            q: "Quale è la formula della legge di Ohm?",
            options: ["V = I / R", "V = I × R", "V = I + R", "V = R / I"],
            correct: 1
        },
        {
            q: "Se una resistenza ha 10 Ohm e passa una corrente di 2 Ampere, quale è la tensione?",
            options: ["5 V", "12 V", "20 V", "0.2 V"],
            correct: 2
        },
        {
            q: "La potenza in un circuito si misura in:",
            options: ["Ampere", "Volt", "Watt", "Ohm"],
            correct: 2
        },
        {
            q: "Chi scoprì l'effetto Seebeck?",
            options: ["Georg Ohm", "Thomas Seebeck", "Jean Peltier", "Faraday"],
            correct: 1
        },
        {
            q: "L'effetto Peltier è:",
            options: ["Una legge della tensione", "L'inverso dell'effetto Seebeck", "Una forma di resistenza", "Un tipo di condensatore"],
            correct: 1
        },
        {
            q: "Quale materiale è il miglior conduttore tra questi?",
            options: ["Vetro", "Carbonio", "Rame", "Nichrome"],
            correct: 2
        },
        {
            q: "Un fusibile protegge il circuito:",
            options: ["Isolando da terra", "Fondendosi se la corrente è eccessiva", "Aumentando la resistenza", "Assorbendo tensione"],
            correct: 1
        },
        {
            q: "La formula P = I² × R significa che la potenza:",
            options: ["È inversamente proporzionale a R", "Aumenta con il quadrato della corrente", "Dipende linearmente da R", "È costante"],
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
