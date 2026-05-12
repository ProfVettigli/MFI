document.addEventListener('DOMContentLoaded', () => {

    const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const inputEl = document.getElementById('caesar-input');
    const slider = document.getElementById('shift-slider');
    const shiftValue = document.getElementById('shift-value');
    const outputEl = document.getElementById('caesar-output');
    const alphaPlain = document.getElementById('alpha-plain');
    const alphaCipher = document.getElementById('alpha-cipher');

    function caesarShift(text, k) {
        return text.toUpperCase().split('').map(ch => {
            const idx = ALPHA.indexOf(ch);
            if (idx === -1) return ch;
            return ALPHA[(idx + k) % 26];
        }).join('');
    }

    function highlightLetter(text, letter, isCipher = false) {
        return text.split(' ').map(l => {
            return l === letter ? `<span class="highlight">${l}</span>` : l;
        }).join(' ');
    }

    function renderAlphabets(k) {
        const plain = ALPHA.split('').join(' ');
        const cipher = ALPHA.split('').map((_, i) => ALPHA[(i + k) % 26]).join(' ');
        alphaPlain.innerHTML = plain;
        alphaCipher.innerHTML = cipher;
    }

    function updateCipher() {
        const k = parseInt(slider.value, 10);
        shiftValue.textContent = k;
        const result = caesarShift(inputEl.value, k);
        outputEl.textContent = result || '(vuoto)';
        renderAlphabets(k);
    }

    if (slider && inputEl) {
        slider.addEventListener('input', updateCipher);
        inputEl.addEventListener('input', updateCipher);
        updateCipher();
    }

    function isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
    function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
    function modInverse(a, m) {
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return null;
    }
    function modPow(base, exp, mod) {
        let result = 1n;
        let b = BigInt(base) % BigInt(mod);
        let e = BigInt(exp);
        const m = BigInt(mod);
        while (e > 0n) {
            if (e & 1n) result = (result * b) % m;
            e >>= 1n;
            b = (b * b) % m;
        }
        return Number(result);
    }

    const primesSmall = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    let rsaState = { p: 11, q: 13, n: 143, phi: 120, e: 7, d: 103 };

    function generateRSA() {
        let attempts = 0;
        while (attempts < 50) {
            attempts++;
            const p = primesSmall[Math.floor(Math.random() * primesSmall.length)];
            let q = primesSmall[Math.floor(Math.random() * primesSmall.length)];
            while (q === p) q = primesSmall[Math.floor(Math.random() * primesSmall.length)];
            const n = p * q;
            const phi = (p - 1) * (q - 1);
            let e = 3;
            while (e < phi && gcd(e, phi) !== 1) e += 2;
            if (e >= phi) continue;
            const d = modInverse(e, phi);
            if (!d) continue;
            rsaState = { p, q, n, phi, e, d };
            return;
        }
    }

    function renderRSA() {
        document.getElementById('rsa-p').textContent = rsaState.p;
        document.getElementById('rsa-q').textContent = rsaState.q;
        document.getElementById('rsa-n').textContent = rsaState.n;
        document.getElementById('rsa-phi').textContent = rsaState.phi;
        document.getElementById('rsa-e').textContent = rsaState.e;
        document.getElementById('rsa-d').textContent = rsaState.d;
        const inputField = document.getElementById('rsa-input');
        if (inputField) inputField.max = rsaState.n - 1;
    }

    const rsaRegen = document.getElementById('rsa-regen');
    if (rsaRegen) {
        rsaRegen.addEventListener('click', () => {
            generateRSA();
            renderRSA();
            document.getElementById('rsa-cipher').textContent = '-';
            document.getElementById('rsa-decipher').textContent = '-';
        });
    }

    const rsaGo = document.getElementById('rsa-go');
    if (rsaGo) {
        rsaGo.addEventListener('click', () => {
            const m = parseInt(document.getElementById('rsa-input').value, 10);
            if (isNaN(m) || m < 2 || m >= rsaState.n) {
                document.getElementById('rsa-cipher').textContent = `Inserisci un numero tra 2 e ${rsaState.n - 1}`;
                document.getElementById('rsa-decipher').textContent = '-';
                return;
            }
            const cipher = modPow(m, rsaState.e, rsaState.n);
            const decipher = modPow(cipher, rsaState.d, rsaState.n);
            document.getElementById('rsa-cipher').textContent = `${m}^${rsaState.e} mod ${rsaState.n} = ${cipher}`;
            document.getElementById('rsa-decipher').textContent = `${cipher}^${rsaState.d} mod ${rsaState.n} = ${decipher}`;
        });
    }

    renderRSA();

    const quizData = [
        {
            question: "1. Quale imperatore romano e famoso per aver usato un cifrario a scorrimento per le sue comunicazioni militari?",
            options: ["Augusto", "Giulio Cesare", "Nerone"],
            correct: 1
        },
        {
            question: "2. Chi diresse il team che riusci a decifrare la macchina Enigma a Bletchley Park?",
            options: ["John von Neumann", "Alan Turing", "Claude Shannon"],
            correct: 1
        },
        {
            question: "3. Nel cifrario di Cesare con chiave k=3, in cosa si trasforma la lettera 'A'?",
            options: ["B", "C", "D"],
            correct: 2
        },
        {
            question: "4. Qual e la principale differenza tra crittografia simmetrica e asimmetrica?",
            options: [
                "La simmetrica usa una sola chiave, l'asimmetrica due (pubblica e privata)",
                "La simmetrica e piu sicura ma piu lenta",
                "Non c'e nessuna differenza pratica"
            ],
            correct: 0
        },
        {
            question: "5. A cosa serve la chiave pubblica in un sistema RSA?",
            options: [
                "A decifrare i messaggi ricevuti",
                "A cifrare i messaggi destinati a chi possiede la chiave privata",
                "A firmare i certificati TLS"
            ],
            correct: 1
        },
        {
            question: "6. La sicurezza di RSA si basa sulla difficolta di:",
            options: [
                "Sommare numeri molto grandi",
                "Fattorizzare in primi numeri molto grandi",
                "Calcolare il logaritmo"
            ],
            correct: 1
        },
        {
            question: "7. Cosa succede quando vedi il lucchetto verde nel browser e l'URL inizia con https://?",
            options: [
                "Il sito e stato verificato dalle autorita politiche",
                "Il traffico tra te e il sito viaggia cifrato con TLS",
                "Il sito non puo essere attaccato da hacker"
            ],
            correct: 1
        },
        {
            question: "8. Perche si parla di crittografia post-quantistica?",
            options: [
                "Per proteggere le particelle subatomiche",
                "Perche i computer quantistici potranno rompere algoritmi come RSA",
                "Perche la quantita di dati e troppo elevata"
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

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
                        btn.style.background = 'var(--physics-color)';
                        btn.style.borderColor = 'var(--physics-color)';
                        btn.style.color = '#fff';
                        btn.classList.add('correct');
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>X Riprova!</strong>';
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
        scoreEl.style.color = perfect ? 'var(--physics-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto per Bletchley Park!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa la storia e gli algoritmi.`;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
