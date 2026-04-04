/**
 * sorting.js
 * Interactive lesson on Sorting Algorithms: Visualizer, Flowchart, Quiz.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. SORTING VISUALIZER LOGIC
       ======================================================== */
    const barsContainer = document.getElementById('bars-container');
    const btnShuffle = document.getElementById('btn-shuffle');
    const btnBubble = document.getElementById('btn-bubble');
    const btnQuick = document.getElementById('btn-quick');
    const speedRange = document.getElementById('speed-range');
    const statComparisons = document.getElementById('stat-comparisons');
    const statSwaps = document.getElementById('stat-swaps');
    const statTime = document.getElementById('stat-time');

    let array = [];
    let isSorting = false;
    let comparisons = 0;
    let swaps = 0;
    let startTime = 0;

    const ARRAY_SIZE = 25;
    const MIN_HEIGHT = 10;
    const MAX_HEIGHT = 200;

    function initArray() {
        if (isSorting) return;
        array = [];
        barsContainer.innerHTML = '';
        comparisons = 0;
        swaps = 0;
        statComparisons.innerText = '0';
        statSwaps.innerText = '0';
        statTime.innerText = '0 ms';

        for (let i = 0; i < ARRAY_SIZE; i++) {
            const h = Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT)) + MIN_HEIGHT;
            array.push(h);
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${h}px`;
            barsContainer.appendChild(bar);
        }
    }

    function updateStats() {
        statComparisons.innerText = comparisons;
        statSwaps.innerText = swaps;
        statTime.innerText = (performance.now() - startTime).toFixed(0) + ' ms';
    }

    async function sleep() {
        const speed = 101 - speedRange.value;
        return new Promise(resolve => setTimeout(resolve, speed));
    }

    async function bubbleSort() {
        if (isSorting) return;
        isSorting = true;
        startTime = performance.now();
        const bars = barsContainer.getElementsByClassName('bar');

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (!isSorting) return;
                
                bars[j].classList.add('comparing');
                bars[j + 1].classList.add('comparing');
                comparisons++;
                updateStats();
                await sleep();

                if (array[j] > array[j + 1]) {
                    bars[j].classList.add('swapping');
                    bars[j + 1].classList.add('swapping');
                    swaps++;
                    updateStats();
                    
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    
                    bars[j].style.height = `${array[j]}px`;
                    bars[j + 1].style.height = `${array[j + 1]}px`;
                    await sleep();
                }

                bars[j].classList.remove('comparing', 'swapping');
                bars[j + 1].classList.remove('comparing', 'swapping');
            }
            bars[array.length - i - 1].classList.add('sorted');
        }
        isSorting = false;
    }

    async function quickSort(start, end) {
        if (start >= end) return;
        
        let index = await partition(start, end);
        await quickSort(start, index - 1);
        await quickSort(index + 1, end);
    }

    async function partition(start, end) {
        const bars = barsContainer.getElementsByClassName('bar');
        let pivotValue = array[end];
        let pivotIndex = start;
        
        bars[end].classList.add('comparing'); // PIVOT

        for (let i = start; i < end; i++) {
            if (!isSorting) return;
            bars[i].classList.add('comparing');
            comparisons++;
            updateStats();
            await sleep();

            if (array[i] < pivotValue) {
                swaps++;
                updateStats();
                let temp = array[i];
                array[i] = array[pivotIndex];
                array[pivotIndex] = temp;
                bars[i].style.height = `${array[i]}px`;
                bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
                bars[i].classList.add('swapping');
                await sleep();
                bars[i].classList.remove('swapping');
                pivotIndex++;
            }
            bars[i].classList.remove('comparing');
        }

        swaps++;
        updateStats();
        let temp = array[pivotIndex];
        array[pivotIndex] = array[end];
        array[end] = temp;
        bars[pivotIndex].style.height = `${array[pivotIndex]}px`;
        bars[end].style.height = `${array[end]}px`;
        
        bars[end].classList.remove('comparing');
        bars[pivotIndex].classList.add('sorted');
        return pivotIndex;
    }

    btnShuffle.addEventListener('click', initArray);
    btnBubble.addEventListener('click', bubbleSort);
    btnQuick.addEventListener('click', async () => {
        if (isSorting) return;
        isSorting = true;
        startTime = performance.now();
        await quickSort(0, array.length - 1);
        const bars = barsContainer.getElementsByClassName('bar');
        for (let b of bars) b.classList.add('sorted');
        isSorting = false;
    });

    /* ========================================================
       2. BUBBLE FLOWCHART CANVAS (REDEEMED STYLE)
       ======================================================== */
    const canvas = document.getElementById('bubble-flowchart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = 600 * dpr;
        canvas.height = 750 * dpr;
        canvas.style.width = '600px';
        canvas.style.height = '750px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        function drawBubbleFlow() {
            const cx = 300;
            ctx.clearRect(0, 0, 600, 750);

            function roundRect(x, y, rw, rh, r, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + rw - r, y);
                ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
                ctx.lineTo(x + rw, y + rh - r);
                ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
                ctx.lineTo(x + r, y + rh);
                ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function diamond(cx, cy, dw, dh, fill, stroke) {
                ctx.beginPath();
                ctx.moveTo(cx, cy - dh / 2);
                ctx.lineTo(cx + dw / 2, cy);
                ctx.lineTo(cx, cy + dh / 2);
                ctx.lineTo(cx - dw / 2, cy);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function oval(cx, cy, rw, rh, fill, stroke) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            }

            function arrow(x1, y1, x2, y2, label = "", color = "#94A3B8") {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath(); ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 10 * Math.cos(angle - 0.5), y2 - 10 * Math.sin(angle - 0.5));
                ctx.lineTo(x2 - 10 * Math.cos(angle + 0.5), y2 - 10 * Math.sin(angle + 0.5));
                ctx.closePath(); ctx.fillStyle = color; ctx.fill();
                if (label) {
                    ctx.fillStyle = color === "#94A3B8" ? "#fff" : color;
                    ctx.font = "bold 12px Inter";
                    ctx.textAlign = "center";
                    ctx.fillText(label, (x1 + x2) / 2 + (x1 === x2 ? 15 : 0), (y1 + y2) / 2 - (x1 !== x2 ? 10 : 0));
                }
            }

            function text(str, x, y, color = "#fff", size = 13) {
                ctx.fillStyle = color; ctx.font = `${size}px Inter, sans-serif`;
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(str, x, y);
            }

            // Start
            oval(cx, 40, 50, 20, 'rgba(16,185,129,0.2)', '#10B981');
            text('INIZIO', cx, 40, '#10B981');
            arrow(cx, 60, cx, 90);

            // Input
            roundRect(cx - 75, 90, 150, 40, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('LEGGI Array A', cx, 110);
            arrow(cx, 130, cx, 160);

            // Init I
            roundRect(cx - 50, 160, 100, 40, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('i = 0', cx, 180);
            arrow(cx, 200, cx, 230);

            // Decision I
            diamond(cx, 280, 160, 100, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('i < N - 1 ?', cx, 280, '#F59E0B');
            
            // Loop I Body
            arrow(cx, 330, cx, 370, 'SÌ', '#10B981');
            roundRect(cx - 50, 370, 100, 40, 8, 'rgba(59,130,246,0.15)', '#3b82f6');
            text('j = 0', cx, 390);
            arrow(cx, 410, cx, 440);

            // Decision J
            diamond(cx, 490, 160, 100, 'rgba(245,158,11,0.15)', '#F59E0B');
            text('j < N - i - 1 ?', cx, 490, '#F59E0B');

            // Branch SI J
            arrow(cx, 540, cx, 580, 'SÌ', '#10B981');
            diamond(cx, 630, 180, 100, 'rgba(239,68,68,0.15)', '#EF4444');
            text('A[j] > A[j+1]?', cx, 630, '#EF4444');

            // Swap logic simplified
            arrow(cx + 90, 630, cx + 180, 630, 'SÌ', '#10B981');
            roundRect(cx + 180, 610, 100, 40, 8, 'rgba(239,68,68,0.15)', '#EF4444');
            text('SCAMBIA', cx + 230, 630);

            // Increment J and Back
            ctx.strokeStyle = "#94A3B8"; ctx.beginPath();
            ctx.moveTo(cx + 230, 650); ctx.lineTo(cx + 230, 700); ctx.lineTo(cx - 200, 700); ctx.lineTo(cx - 200, 490); ctx.lineTo(cx - 80, 490); ctx.stroke();
            arrow(cx - 80, 490, cx - 80, 490); // Simple hack for arrow head placement
            text('j++', cx - 180, 690);

            // NO Branch for J -> Increment I
            arrow(cx + 80, 490, cx + 280, 490, 'NO', '#EF4444');
            ctx.beginPath(); ctx.moveTo(cx + 280, 490); ctx.lineTo(cx + 280, 280); ctx.lineTo(cx + 80, 280); ctx.stroke();
            text('i++', cx + 250, 270);

            // NO Branch for I -> End
            ctx.beginPath(); ctx.moveTo(cx - 80, 280); ctx.lineTo(cx - 250, 280); ctx.lineTo(cx - 250, 730); ctx.lineTo(cx, 730); ctx.stroke();
            arrow(cx, 730, cx, 730);
            oval(cx, 730, 50, 20, 'rgba(16,185,129,0.2)', '#10B981');
            text('FINE', cx, 730, '#10B981');
        }
        drawBubbleFlow();
    }

    /* ========================================================
       3. QUIZ LOGIC
       ======================================================== */
    const quizData = [
        {
            q: "1. Qual è lo scopo principale dell'ordinamento (sorting)?",
            a: ["Colorare l'interfaccia.", "Organizzare i dati per migliorare ricerca e visualizzazione.", "Criptare file personali.", "Aumentare la velocità della CPU."],
            c: 1
        },
        {
            q: "2. Cosa si intende per 'Trade-off tempo-memoria'?",
            a: ["Che il tempo è uguale alla memoria.", "Che spesso per essere più veloci bisogna consumare più memoria.", "Che i computer moderni hanno memoria infinita.", "Nessuna delle precedenti."],
            c: 1
        },
        {
            q: "3. Qual è la complessità temporale del Bubble Sort nel caso peggiore?",
            a: ["O(1) - Costante", "O(n) - Lineare", "O(n²) - Quadratica", "O(log n) - Logaritmica"],
            c: 2
        },
        {
            q: "4. Perché il Quick Sort è generalmente preferito al Bubble Sort?",
            a: ["Perché è più facile da spiegare.", "Perché usa 'Divide et Impera' per essere molto più rapido su grandi moli di dati.", "Perché funziona anche senza un array.", "Perché è scritto in un linguaggio più moderno."],
            c: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    const quizScore = document.getElementById('quiz-score');
    let score = 0;
    let answered = 0;

    if (quizArea) {
        quizData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-question';
            card.style.marginBottom = "2rem"; card.style.padding = "1.5rem"; card.style.background = "rgba(255,255,255,0.03)"; card.style.border = "1px solid rgba(255,255,255,0.1)"; card.style.borderRadius = "12px";
            card.innerHTML = `<h3 style="margin-bottom:1.2rem; font-size:1.1rem; color:#fff;">${data.q}</h3>`;
            const optionsGroup = document.createElement('div');
            optionsGroup.style.display = "flex"; optionsGroup.style.flexDirection = "column"; optionsGroup.style.gap = "10px";

            data.a.forEach((option, oIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn'; btn.textContent = option; btn.style.textAlign = "left"; btn.style.padding = "1rem"; btn.style.background = "rgba(255,255,255,0.05)"; btn.style.border = "1px solid rgba(255,255,255,0.1)"; btn.style.color = "white"; btn.style.borderRadius = "8px"; btn.style.cursor = "pointer"; btn.style.transition = "0.3s";

                btn.onclick = () => {
                    if (btn.classList.contains('picked')) return;
                    if (oIdx === data.c) {
                        btn.style.background = "#10B981"; btn.style.borderColor = "#10B981";
                        if (!card.classList.contains('attempted')) score++;
                        answered++;
                        const btns = optionsGroup.querySelectorAll('button');
                        btns.forEach(b => b.style.pointerEvents = 'none');
                        if (answered === quizData.length) {
                            quizScore.textContent = `Punteggio Finale: ${score}/${quizData.length}`;
                            quizScore.style.color = "#10B981";
                        }
                    } else {
                        btn.style.background = "#EF4444"; btn.style.borderColor = "#EF4444";
                        btn.classList.add('picked'); card.classList.add('attempted');
                    }
                };
                optionsGroup.appendChild(btn);
            });
            card.appendChild(optionsGroup);
            quizArea.appendChild(card);
        });
    }

    initArray();
});
