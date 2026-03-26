/**
 * insiemi-numerici.js
 * JS logic for the Numerical Sets drag & drop sorter.
 */

document.addEventListener('DOMContentLoaded', () => {

    const numItems = document.querySelectorAll('.num-item');
    const zones = document.querySelectorAll('.zone-box, #pool');
    
    let activeDrag = null;

    numItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            activeDrag = item;
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            setTimeout(() => {
                activeDrag.style.opacity = '1';
                activeDrag = null;
                checkStatus();
            }, 0);
        });
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        
        zone.addEventListener('dragenter', e => {
            e.preventDefault();
            if (zone.id !== 'pool') {
                zone.style.background = 'rgba(255,255,255,0.05)';
            }
        });
        
        zone.addEventListener('dragleave', () => {
             if (zone.id !== 'pool') {
                 zone.style.background = 'rgba(0,0,0,0.3)';
             }
        });
        
        zone.addEventListener('drop', () => {
             if (zone.id !== 'pool') {
                 zone.style.background = 'rgba(0,0,0,0.3)';
             }
             if (activeDrag) {
                zone.appendChild(activeDrag);
             }
        });
    });

    function checkStatus() {
        const pool = document.getElementById('pool');
        const feedback = document.getElementById('feedback');
        
        if (pool && pool.children.length === 0) {
            let isWin = true;
            
            const dropZones = document.querySelectorAll('.zone-box');
            dropZones.forEach(z => {
                 const targetType = z.dataset.target;
                 const itemsInZone = z.querySelectorAll('.num-item');
                 
                 itemsInZone.forEach(item => {
                      if (item.dataset.type !== targetType) {
                          isWin = false;
                      }
                 });
            });

            if (isWin) {
                feedback.textContent = "Bravissimo! Hai inserito ogni numero nella sua scatola primordiale corretta. Ottimo lavoro con N, Z, Q e R!";
                feedback.style.color = "#10B981";
            } else {
                feedback.textContent = "Ci sono degli errori di classificazione. Controlla bene: alcune costanti fisiche sono irrazionali (R), e ricorda che le frazioni e i decimali non interi vanno nei Razionali (Q)!";
                feedback.style.color = "#EF4444";
            }
        } else if (pool) {
            feedback.textContent = "";
        }
    }
});
