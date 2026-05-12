document.addEventListener('DOMContentLoaded', () => {

    const voltageSlider = document.getElementById('voltage-slider');
    const voltageDisplay = document.getElementById('voltage-display');
    const adcDisplay = document.getElementById('adc-display');
    const percentDisplay = document.getElementById('percent-display');

    function updateADC() {
        const voltage = parseFloat(voltageSlider.value);
        const adcValue = Math.round((voltage / 5.0) * 1023);
        const percent = Math.round((adcValue / 1023) * 100);

        voltageDisplay.textContent = voltage.toFixed(2);
        adcDisplay.textContent = adcValue;
        percentDisplay.textContent = percent + '%';
    }

    voltageSlider.addEventListener('input', updateADC);
    updateADC();

    const tempSlider = document.getElementById('temp-slider');
    const thermometerFill = document.getElementById('thermometer-fill');
    const tempValue = document.getElementById('temp-value');

    function updateThermometer() {
        const temp = parseInt(tempSlider.value);
        const minTemp = -20;
        const maxTemp = 50;
        const range = maxTemp - minTemp;
        const percent = ((temp - minTemp) / range) * 100;

        thermometerFill.style.height = percent + '%';
        tempValue.textContent = (temp >= 0 ? '+' : '') + temp + '°C';

        if (temp < 0) {
            tempValue.style.color = '#0000FF';
        } else if (temp < 15) {
            tempValue.style.color = '#00AAFF';
        } else if (temp < 25) {
            tempValue.style.color = '#00FF00';
        } else if (temp < 35) {
            tempValue.style.color = '#FF6600';
        } else {
            tempValue.style.color = '#FF0000';
        }
    }

    tempSlider.addEventListener('input', updateThermometer);
    updateThermometer();

    const quizData = [
        { question: "1. Un ADC a 10 bit puo distinguere quanti livelli diversi?", options: ["10", "100", "1024"], correct: 2 },
        { question: "2. Quale sensore misura la temperatura?", options: ["LDR", "LM35", "Accelerometro"], correct: 1 },
        { question: "3. Se un sensore fornisce 3.5V e l'ADC e a 10 bit, quale valore legge Arduino?", options: ["357", "710", "715"], correct: 2 },
        { question: "4. Un sensore LM35 produce 10mV per ogni grado. Quale tensione per 25°C?", options: ["0.25V", "2.5V", "25V"], correct: 1 },
        { question: "5. Quale funzione inizializza la comunicazione seriale in Arduino?", options: ["Serial.start()", "Serial.begin()", "Serial.init()"], correct: 1 },
        { question: "6. La formula di conversione da ADC a tensione e: V = (ADC / 1023) × ?", options: ["3.3", "5", "255"], correct: 1 },
        { question: "7. Quale funzione stampa una variabile e va a capo?", options: ["Serial.print()", "Serial.println()", "Serial.write()"], correct: 1 },
        { question: "8. Un sensore di luce analogico e:", options: ["Un LDR (fotoresistenza)", "Un DHT22", "Un servomotore"], correct: 0 }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0, questionsAnswered = 0;

    function renderQuiz() {
        if (!quizArea) return;
        quizArea.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = '';

        quizData.forEach((q) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = '1rem';
            qTitle.style.fontWeight = '600';
            qDiv.appendChild(qTitle);
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.cssText = 'display:flex; flex-direction:column; gap:0.8rem;';
            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                btn.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-main); padding:1rem; border-radius:0.5rem; cursor:pointer; text-align:left; font-size:1rem; font-family:inherit; transition:all 0.2s;';
                btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.1)'; };
                btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.05)'; };
                btn.onclick = () => {
                    if (btn.disabled) return;
                    if (optIndex === q.correct) {
                        btn.style.background = 'var(--chem-color)';
                        btn.style.borderColor = 'var(--chem-color)';
                        btn.style.color = '#fff';
                        btn.classList.add('correct');
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        if (optionsDiv.querySelectorAll('.wrong').length === 0) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>Riprova!</strong>';
                        btn.disabled = true;
                        btn.style.opacity = '0.7';
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showScore() {
        const scoreEl = document.getElementById('quiz-score');
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--chem-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a costruire meteo-stazioni!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa i sensori e l'ADC per migliorare!`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.style.cssText = 'display:block; margin-top:1.5rem; background:var(--chem-color); color:white; border:none; padding:0.8rem 1.5rem; border-radius:8px; font-weight:600; cursor:pointer;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
