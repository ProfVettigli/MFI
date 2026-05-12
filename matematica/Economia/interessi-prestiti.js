// Interessi e Prestiti - Interactive Calculator

// Interesse Semplice
const simpleCapitalInput = document.getElementById('simple-capital');
const simpleCapitalDisplay = document.getElementById('simple-capital-display');
const simpleRateSlider = document.getElementById('simple-rate');
const simpleRateDisplay = document.getElementById('simple-rate-display');
const simpleTimeSlider = document.getElementById('simple-time');
const simpleTimeDisplay = document.getElementById('simple-time-display');
const simpleInterestResult = document.getElementById('simple-interest');
const simpleAmountResult = document.getElementById('simple-amount');

function calculateSimple() {
    const C = parseFloat(simpleCapitalInput.value);
    const i = parseFloat(simpleRateSlider.value) / 100;
    const t = parseFloat(simpleTimeSlider.value);

    simpleCapitalDisplay.textContent = C.toLocaleString('it-IT');
    simpleRateDisplay.textContent = simpleRateSlider.value + '%';
    simpleTimeDisplay.textContent = t;

    const interest = C * i * t;
    const amount = C + interest;

    simpleInterestResult.textContent = interest.toFixed(2) + ' €';
    simpleAmountResult.textContent = amount.toFixed(2) + ' €';
}

simpleCapitalInput.addEventListener('input', calculateSimple);
simpleRateSlider.addEventListener('input', calculateSimple);
simpleTimeSlider.addEventListener('input', calculateSimple);
calculateSimple();

// Interesse Composto
const compoundCapitalInput = document.getElementById('compound-capital');
const compoundCapitalDisplay = document.getElementById('compound-capital-display');
const compoundRateSlider = document.getElementById('compound-rate');
const compoundRateDisplay = document.getElementById('compound-rate-display');
const compoundTimeSlider = document.getElementById('compound-time');
const compoundTimeDisplay = document.getElementById('compound-time-display');
const compoundFreqSelect = document.getElementById('compound-freq');
const compoundInterestResult = document.getElementById('compound-interest');
const compoundAmountResult = document.getElementById('compound-amount');

function calculateCompound() {
    const C = parseFloat(compoundCapitalInput.value);
    const i = parseFloat(compoundRateSlider.value) / 100;
    const t = parseFloat(compoundTimeSlider.value);
    const n = parseInt(compoundFreqSelect.value);

    compoundCapitalDisplay.textContent = C.toLocaleString('it-IT');
    compoundRateDisplay.textContent = compoundRateSlider.value + '%';
    compoundTimeDisplay.textContent = t;

    // M = C * (1 + i/n)^(n*t)
    const amount = C * Math.pow(1 + i / n, n * t);
    const interest = amount - C;

    compoundInterestResult.textContent = interest.toFixed(2) + ' €';
    compoundAmountResult.textContent = amount.toFixed(2) + ' €';
}

compoundCapitalInput.addEventListener('input', calculateCompound);
compoundRateSlider.addEventListener('input', calculateCompound);
compoundTimeSlider.addEventListener('input', calculateCompound);
compoundFreqSelect.addEventListener('change', calculateCompound);
calculateCompound();
