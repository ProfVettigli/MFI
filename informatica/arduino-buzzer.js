document.addEventListener('DOMContentLoaded', () => {

    const notes = [
        { name: 'DO', freq: 262 },
        { name: 'RE', freq: 294 },
        { name: 'MI', freq: 330 },
        { name: 'FA', freq: 349 },
        { name: 'SOL', freq: 392 },
        { name: 'LA', freq: 440 },
        { name: 'SI', freq: 494 },
        { name: "DO'", freq: 523 }
    ];

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentOscillator = null;
    let currentGain = null;

    function playNote(freq, duration) {
        if (currentOscillator) {
            currentOscillator.stop();
        }

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);

        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + duration);

        currentOscillator = osc;
        currentGain = gain;
    }

    function stopNote() {
        if (currentOscillator) {
            currentOscillator.stop();
            currentOscillator = null;
        }
    }

    const pianoKeysDiv = document.getElementById('piano-keys');
    const freqDisplay = document.getElementById('freq-display');

    notes.forEach(note => {
        const btn = document.createElement('button');
        btn.className = 'piano-key';
        btn.textContent = note.name;
        btn.addEventListener('click', () => {
            playNote(note.freq, 0.3);
            freqDisplay.textContent = `${note.name} = ${note.freq} Hz`;
        });
        pianoKeysDiv.appendChild(btn);
    });

    const melodies = {
        jingle: [
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 330, dur: 0.375 },
            { freq: 392, dur: 0.5 },
            { freq: 262, dur: 0.25 },
            { freq: 294, dur: 0.25 },
            { freq: 330, dur: 0.5 }
        ],
        tetris: [
            { freq: 329.63, dur: 0.3 },
            { freq: 493.88, dur: 0.3 },
            { freq: 392, dur: 0.3 },
            { freq: 349.23, dur: 0.3 },
            { freq: 329.63, dur: 0.3 },
            { freq: 493.88, dur: 0.3 },
            { freq: 392, dur: 0.3 },
            { freq: 349.23, dur: 0.3 },
            { freq: 329.63, dur: 0.6 }
        ],
        starwars: [
            { freq: 392, dur: 0.4 },
            { freq: 392, dur: 0.4 },
            { freq: 392, dur: 0.4 },
            { freq: 311.13, dur: 0.3 },
            { freq: 466.16, dur: 0.1 },
            { freq: 392, dur: 0.4 },
            { freq: 311.13, dur: 0.3 },
            { freq: 466.16, dur: 0.1 },
            { freq: 392, dur: 0.8 }
        ]
    };

    let isPlaying = false;

    async function playMelody(melody) {
        isPlaying = true;
        for (let note of melody) {
            playNote(note.freq, note.dur);
            await new Promise(r => setTimeout(r, note.dur * 1000 + 50));
        }
        stopNote();
        isPlaying = false;
    }

    document.getElementById('jingle-btn').addEventListener('click', () => {
        if (!isPlaying) playMelody(melodies.jingle);
    });

    document.getElementById('tetris-btn').addEventListener('click', () => {
        if (!isPlaying) playMelody(melodies.tetris);
    });

    document.getElementById('starwars-btn').addEventListener('click', () => {
        if (!isPlaying) playMelody(melodies.starwars);
    });

    document.getElementById('stop-btn').addEventListener('click', () => {
        stopNote();
        isPlaying = false;
    });

    const quizData = [
        { question: "1. Un buzzer piezoelettrico funziona sfruttando:", options: ["L'effetto magnetico", "L'effetto piezoelettrico", "L'effetto fotovoltaico"], correct: 1 },
        { question: "2. La frequenza del LA (La4) e:", options: ["392 Hz", "440 Hz", "494 Hz"], correct: 1 },
        { question: "3. Quale funzione Arduino ferma il suono sul pin 9?", options: ["tone(9, 0)", "noTone(9)", "silence(9)"], correct: 1 },
        { question: "4. Un'ottava rappresenta:", options: ["Il doppio della frequenza", "La meta della frequenza", "Un terzo della frequenza"], correct: 0 },
        { question: "5. Cosa succede se chiami tone(pin, freq) senza duration?", options: ["Il suono dura 1 secondo", "Il suono continua finche non chiami noTone", "Arduino da errore"], correct: 1 },
        { question: "6. Quale nota ha frequenza 262 Hz?", options: ["RE", "DO", "MI"], correct: 1 },
        { question: "7. Per suonare una melodia, occorre:", options: ["Un unico comando tone()", "Una sequenza di tone() e delay()", "Un modulo MIDI"], correct: 1 }
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
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a comporre melodie!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa le frequenze per perfezionarti!`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.style.cssText = 'display:block; margin-top:1.5rem; background:var(--chem-color); color:white; border:none; padding:0.8rem 1.5rem; border-radius:8px; font-weight:600; cursor:pointer;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
