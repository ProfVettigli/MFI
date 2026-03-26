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

});
