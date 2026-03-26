/**
 * cardinalita-infinito.js
 * Visualizzazioni 1-to-1 per N=Z e Cantor's zig zag per N=Q.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- N = Z BIJECTION --- */
    const numZ = 0; // next n index
    let currentN = 0;
    
    // N: 0, 1, 2,  3,  4,  5,  6
    // Z: 0, 1, -1, 2, -2, 3, -3
    
    const maxNRows = 8;
    const zContainer = document.getElementById('z-bijection-container');
    const zBtn = document.getElementById('btn-next-z');

    function getZ(n) {
        if (n === 0) return 0;
        if (n % 2 !== 0) return Math.ceil(n / 2);      // Dispari -> Positivi
        return -(n / 2);                               // Pari   -> Negativi
    }

    if (zBtn && zContainer) {
        zBtn.addEventListener('click', () => {
            if (currentN >= maxNRows) {
                zBtn.textContent = "L'elenco prosegue all'infinito...";
                zBtn.disabled = true;
                zBtn.style.opacity = "0.5";
                zBtn.style.cursor = "not-allowed";
                return;
            }

            const row = document.createElement('div');
            row.className = 'bijection-row';
            
            const zVal = getZ(currentN);
            row.innerHTML = `<span class="set-n" style="width:40px;text-align:right;">${currentN}</span> 
                             <span class="arrow">&harr;</span> 
                             <span class="set-z" style="width:40px;text-align:left;">${zVal}</span>`;
            
            zContainer.appendChild(row);
            currentN++;
        });
        
        // Clicca automaticamente il primo(0)
        zBtn.click();
    }


    /* --- CANTOR ZIG ZAG N = Q --- */
    const cantorGrid = document.getElementById('cantor-grid');
    const cantorBtn = document.getElementById('btn-cantor-step');
    
    // Costruiamo una griglia 5x5
    const SIZE = 5;
    
    // Generiamo l'HTML della griglia
    if (cantorGrid) {
        for(let r=1; r<=SIZE; r++) {
            for(let c=1; c<=SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = 'cantor-cell cantor-path';
                cell.id = `cantor-${r}-${c}`;
                cell.textContent = `${r}/${c}`;
                cantorGrid.appendChild(cell);
            }
        }
    }

    // Sequenza diagonale standard (ignorando riduzioni per semplicità visiva,
    // di solito 1/1, 1/2, 2/1, 3/1, 2/2X, 1/3, 1/4...
    // Qui mostriamo fisicamente il percorso sul 5x5 a zig zag:
    // (r, c) => (row y, col x)
    const zigzagPath = [
        [1,1], 
        [1,2], [2,1], 
        [3,1], [2,2], [1,3],
        [1,4], [2,3], [3,2], [4,1],
        [5,1], [4,2], [3,3], [2,4], [1,5]
    ];
    let cantorStep = 0;

    if (cantorBtn) {
        cantorBtn.addEventListener('click', () => {
            if (cantorStep >= zigzagPath.length) {
                cantorBtn.textContent = "Va avanti per tutti i Razionali!";
                cantorBtn.disabled = true;
                cantorBtn.style.opacity = "0.5";
                cantorBtn.style.cursor = "not-allowed";
                return;
            }

            const [r, c] = zigzagPath[cantorStep];
            const activeCell = document.getElementById(`cantor-${r}-${c}`);
            
            if (activeCell) {
                activeCell.classList.add('active-path');
                // Sovrascrive il testo mostrando il conteggio ("X. r/c")
                activeCell.innerHTML = `<span style="font-size:0.8rem;color:black;">N.${cantorStep}</span><br>${r}/${c}`;
            }

            cantorStep++;
        });
    }

});
