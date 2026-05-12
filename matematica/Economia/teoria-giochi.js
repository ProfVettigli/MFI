document.addEventListener('DOMContentLoaded', () => {
    const payoffSlider = document.getElementById('payoff-slider');
    const payoffDisplay = document.getElementById('payoff-display');

    payoffSlider.addEventListener('input', () => {
        const newPayoff = parseFloat(payoffSlider.value);
        payoffDisplay.textContent = newPayoff.toFixed(1);

        // In a full implementation, would update the game matrix and Nash analysis
        // For now, just display the value
    });
});
