/**
 * fuzzy.js - MFI Logica
 * Gestione della simulazione interattiva della Logica Fuzzy.
 */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('temp-slider');
    const label = document.getElementById('temp-label');
    const classVal = document.getElementById('class-val');
    const fuzzyVal = document.getElementById('fuzzy-val');

    function updateLogic() {
        const t = parseInt(slider.value);
        label.textContent = `Temperatura: ${t}°C`;
        
        // --- 1. Logica Classica (Aristotelica) ---
        // Soglia netta a 40 gradi
        if (t >= 40) {
            classVal.textContent = "VERO";
            classVal.style.color = "#10B981"; 
        } else {
            classVal.textContent = "FALSO";
            classVal.style.color = "#EF4444";
        }
        
        // --- 2. Logica Fuzzy (Zadeh) ---
        // Definiamo una funzione di appartenenza (Membership Function)
        // per il concetto di "Acqua Calda".
        // Sotto i 20° è fredda (0), sopra gli 80° è sicuramente calda (1).
        // Tra 20 e 80 gradi il grado di verità cresce linearmente.
        let f;
        if (t <= 20) {
            f = 0;
        } else if (t >= 80) {
            f = 1;
        } else {
            f = (t - 20) / 60;
        }
        
        fuzzyVal.textContent = f.toFixed(2);
        
        // Feedback visivo: dal blu ardesia al viola/rosso
        // Usiamo HSL per una transizione fluida
        const hue = 230 - (f * 230); // Da 230 (Blu) a 0 (Rosso)
        fuzzyVal.style.color = `hsl(${hue}, 70%, 60%)`;
        fuzzyVal.style.textShadow = `0 0 15px hsl(${hue}, 70%, 30%)`;
    }

    slider.addEventListener('input', updateLogic);
    
    // Inizializzazione simulazione
    updateLogic();
});
