/**
 * numeri-primi-goldbach.js
 * Interactivity for primes and the Goldbach solver.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- PRIME GRID (SIEVE) --- */
    const sieveDiv = document.getElementById('prime-sieve');
    
    function isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }

    if (sieveDiv) {
        for (let i = 1; i <= 120; i++) {
            const box = document.createElement('div');
            box.className = 'num-box';
            box.textContent = i;
            if (isPrime(i)) {
                box.classList.add('is-prime');
            }
            sieveDiv.appendChild(box);
        }
    }


    /* --- GOLDBACH CALCULATOR --- */
    const gbInput = document.getElementById('gb-input');
    const gbBtn = document.getElementById('btn-calculate-gb');
    const gbResult = document.getElementById('gb-result');

    if (gbBtn && gbInput && gbResult) {
        gbBtn.addEventListener('click', () => {
            const val = parseInt(gbInput.value);
            
            if (isNaN(val) || val <= 2 || val % 2 !== 0) {
                gbResult.textContent = "Inserisci un numero PARI maggiore di 2!";
                gbResult.style.color = "#EF4444";
                return;
            }

            // Simple Goldbach search
            let pairFound = false;
            for (let p = 2; p <= val / 2; p++) {
                if (isPrime(p) && isPrime(val - p)) {
                    gbResult.textContent = `${val} = ${p} + ${val - p}`;
                    gbResult.style.color = "#10B981";
                    pairFound = true;
                    break;
                }
            }

            if (!pairFound) {
                gbResult.textContent = "Incredibile! Hai smentito Goldbach?";
                gbResult.style.color = "#F59E0B";
            }
        });
    }

    /* --- PRIME FACTORIZATION --- */
    const factorInput = document.getElementById('factor-input');
    const factorBtn = document.getElementById('btn-factorize');
    const factorResult = document.getElementById('factor-result');

    if (factorBtn && factorInput && factorResult) {
        factorBtn.onclick = () => {
            let n = parseInt(factorInput.value);
            if (isNaN(n) || n < 2) {
                factorResult.textContent = "Inserisci un numero >= 2!";
                return;
            }

            const factors = [];
            let d = 2;
            let tempN = n;
            while (tempN > 1) {
                while (tempN % d === 0) {
                    factors.push(d);
                    tempN /= d;
                }
                d++;
                if (d * d > tempN && tempN > 1) {
                    factors.push(tempN);
                    break;
                }
            }
            factorResult.textContent = `${n} = ${factors.join(' × ')}`;
        };
    }

    /* --- QUIZ GENERATION --- */
    const quizData = [
        {
            question: "1. Qual è la scomposizione corretta di 12?",
            options: [
                "2 × 6",
                "2² × 3",
                "3 × 4"
            ],
            correct: 1
        },
        {
            question: "2. Cosa afferma la Congettura di Goldbach?",
            options: [
                "Che ogni numero primo è dispari.",
                "Che ogni numero pari > 2 è somma di due primi.",
                "Che i numeri primi sono infiniti."
            ],
            correct: 1
        },
        {
            question: "3. Il numero 1 è un numero primo?",
            options: [
                "Sì, è l'unico numero primo speciale.",
                "No, per definizione i numeri primi partono da 2 ed hanno esattamente due divisori.",
                "Solo se moltiplicato per se stesso."
            ],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.style.marginBottom = "2rem";
            
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = "1rem";
            qTitle.style.fontSize = "1.1rem";
            qDiv.appendChild(qTitle);

            const optsDiv = document.createElement('div');
            optsDiv.style.display = "flex";
            optsDiv.style.flexDirection = "column";
            optsDiv.style.gap = "0.5rem";

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.textContent = optText;
                
                btn.style.background = "rgba(255,255,255,0.05)";
                btn.style.border = "1px solid rgba(255,255,255,0.1)";
                btn.style.color = "var(--text-main)";
                btn.style.padding = "1rem";
                btn.style.borderRadius = "0.5rem";
                btn.style.cursor = "pointer";
                btn.style.textAlign = "left";
                btn.style.fontSize = "1rem";
                btn.style.fontFamily = "inherit";
                btn.style.transition = "all 0.2s";
                
                btn.onmouseenter = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.1)"; };
                btn.onmouseleave = () => { if(!btn.disabled) btn.style.background = "rgba(255,255,255,0.05)"; };

                btn.onclick = () => {
                    const allBtns = optsDiv.querySelectorAll('button');
                    allBtns.forEach(b => {
                        b.disabled = true;
                        b.style.cursor = "not-allowed";
                    });
                    
                    if (optIndex === q.correct) {
                        btn.style.background = "var(--math-color)";
                        btn.style.borderColor = "var(--math-color)";
                        btn.style.color = "#fff";
                        currentScore++;
                    } else {
                        btn.style.background = "#EF4444";
                        btn.style.borderColor = "#EF4444";
                        btn.style.color = "#fff";
                        allBtns[q.correct].style.background = "var(--math-color)";
                        allBtns[q.correct].style.borderColor = "var(--math-color)";
                        allBtns[q.correct].style.color = "#fff";
                    }
                    
                    questionsAnswered++;
                    if (questionsAnswered === quizData.length) {
                        const scoreEl = document.getElementById('quiz-score');
                        scoreEl.textContent = `Risultato: ${currentScore}/${quizData.length}. ${currentScore === quizData.length ? 'Ottimo lavoro!' : 'Ripassa la teoria e il Crivello.'}`;
                        scoreEl.style.color = currentScore === quizData.length ? "var(--math-color)" : "#F59E0B";
                    }
                };
                optsDiv.appendChild(btn);
            });

            qDiv.appendChild(optsDiv);
            quizArea.appendChild(qDiv);
        });
    }

});
