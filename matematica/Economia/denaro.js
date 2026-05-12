document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount-input');
    const exchangeRateInput = document.getElementById('exchange-rate');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const conversionResult = document.getElementById('conversion-result');

    function updateConversion() {
        const amount = parseFloat(amountInput.value) || 0;
        const rate = parseFloat(exchangeRateInput.value) || 1;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        let result = amount * rate;

        // Basic conversion logic (would be dynamic in real app)
        if (from === to) {
            result = amount;
        }

        // Preset rates (simplified)
        const rates = {
            'EUR_USD': 1.10,
            'EUR_GBP': 0.86,
            'EUR_JPY': 160,
            'EUR_CHF': 0.95,
            'USD_EUR': 0.91,
            'USD_GBP': 0.78,
            'USD_JPY': 145,
            'USD_CHF': 0.86,
            'GBP_EUR': 1.16,
            'GBP_USD': 1.28,
            'GBP_JPY': 186,
            'GBP_CHF': 1.10,
            'JPY_EUR': 0.0063,
            'JPY_USD': 0.0069,
            'JPY_GBP': 0.0054,
            'JPY_CHF': 0.0059,
            'CHF_EUR': 1.05,
            'CHF_USD': 1.16,
            'CHF_GBP': 0.91,
            'CHF_JPY': 169
        };

        const key = `${from}_${to}`;
        if (key in rates && from !== to) {
            result = amount * rates[key];
        }

        // Format result
        let resultText = result.toFixed(2) + ' ' + to;

        // Add exchange rate info
        const rateInfo = (from === to) ? 'stesso' : (from !== to ? (rates[key] || rate).toFixed(2) : '1.00');

        conversionResult.textContent = resultText;
    }

    amountInput.addEventListener('input', updateConversion);
    exchangeRateInput.addEventListener('input', updateConversion);
    fromCurrency.addEventListener('change', updateConversion);
    toCurrency.addEventListener('change', updateConversion);

    // Initial calculation
    updateConversion();
});
