/**
 * notazione-esponenziale.js
 * Logica per il matching drag and drop.
 */

document.addEventListener('DOMContentLoaded', () => {

    const dragItems = document.querySelectorAll('.match-item');
    const dropTargets = document.querySelectorAll('.match-target');
    
    let activeDrag = null;
    let matchesMade = 0;

    dragItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            activeDrag = item;
            item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
            if(activeDrag) {
                activeDrag.style.opacity = '1';
                activeDrag = null;
            }
        });
    });

    dropTargets.forEach(target => {
        target.addEventListener('dragover', e => {
            e.preventDefault(); // Permette il drop
        });

        target.addEventListener('dragenter', e => {
            e.preventDefault();
            target.style.borderColor = "#FCD34D";
        });

        target.addEventListener('dragleave', () => {
            target.style.borderColor = "rgba(255,255,255,0.3)";
        });

        target.addEventListener('drop', e => {
            e.preventDefault();
            target.style.borderColor = "rgba(255,255,255,0.3)";
            
            if (activeDrag) {
                const targetMatch = target.dataset.match;
                const sourceMatch = activeDrag.dataset.val;

                if (targetMatch === sourceMatch) {
                    // Match Corretto
                    const slot = target.querySelector('.drop-slot');
                    slot.style.border = "none";
                    slot.innerHTML = "";
                    slot.appendChild(activeDrag);
                    activeDrag.setAttribute("draggable", "false");
                    activeDrag.style.background = "#10B981"; // success
                    activeDrag.style.border = "none";
                    
                    matchesMade++;
                    checkVictory();
                } else {
                    // Sbagliato: scuoti visivamente l'oggetto trascinato
                    document.getElementById('expo-feedback').textContent = "Errore: " + activeDrag.textContent + " non genera quel risultato! Rivedi le proprietà sopra.";
                    document.getElementById('expo-feedback').style.color = "#EF4444";
                }
            }
        });
    });

    function checkVictory() {
        if(matchesMade === 5) {
            document.getElementById('expo-feedback').innerHTML = "Fantastico! Hai applicato le 5 proprietà fondamentali degli esponenti perfettamente 🚀!";
            document.getElementById('expo-feedback').style.color = "#10B981";
        } else {
            document.getElementById('expo-feedback').textContent = "";
        }
    }
});
