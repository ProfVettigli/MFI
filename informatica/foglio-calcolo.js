document.addEventListener('DOMContentLoaded', () => {

    const COLS = ['A', 'B', 'C', 'D'];
    const ROWS = 4;
    const data = {};
    COLS.forEach(c => { for (let r = 1; r <= ROWS; r++) data[c + r] = ''; });

    const grid = document.getElementById('spreadsheet');
    const status = document.getElementById('ss-status');

    function buildGrid() {
        if (!grid) return;
        for (let r = 1; r <= ROWS; r++) {
            const rh = document.createElement('div');
            rh.className = 'ss-rowhead';
            rh.textContent = r;
            grid.appendChild(rh);
            COLS.forEach(c => {
                const cellId = c + r;
                const cell = document.createElement('div');
                cell.className = 'ss-cell';
                cell.dataset.cell = cellId;
                const input = document.createElement('input');
                input.type = 'text';
                input.dataset.cell = cellId;
                input.addEventListener('focus', () => {
                    input.value = data[cellId] || '';
                });
                input.addEventListener('blur', () => {
                    data[cellId] = input.value;
                    recompute();
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') input.blur();
                });
                cell.appendChild(input);
                grid.appendChild(cell);
            });
        }
    }

    function parseRange(rangeStr) {
        const m = rangeStr.match(/^([A-D])(\d+):([A-D])(\d+)$/i);
        if (!m) return null;
        const [, c1, r1, c2, r2] = m;
        const cells = [];
        const cStart = COLS.indexOf(c1.toUpperCase());
        const cEnd = COLS.indexOf(c2.toUpperCase());
        const rStart = parseInt(r1, 10);
        const rEnd = parseInt(r2, 10);
        for (let r = rStart; r <= rEnd; r++) {
            for (let c = cStart; c <= cEnd; c++) {
                cells.push(COLS[c] + r);
            }
        }
        return cells;
    }

    function evaluateCell(cellId, visited = new Set()) {
        if (visited.has(cellId)) return { value: '#CYCLE', error: true };
        visited.add(cellId);
        const raw = (data[cellId] || '').toString().trim();
        if (raw === '') return { value: '', error: false };
        if (!raw.startsWith('=')) {
            const num = parseFloat(raw);
            return { value: isNaN(num) ? raw : num, error: false, isNumber: !isNaN(num) };
        }
        let expr = raw.slice(1).toUpperCase();

        const funcRegex = /(SUM|AVERAGE|MAX|MIN|COUNT)\(([A-D]\d+:[A-D]\d+)\)/g;
        expr = expr.replace(funcRegex, (_, fn, range) => {
            const cells = parseRange(range);
            if (!cells) return 'NaN';
            const vals = cells.map(c => {
                const v = evaluateCell(c, new Set(visited));
                return typeof v.value === 'number' ? v.value : NaN;
            }).filter(v => !isNaN(v));
            if (vals.length === 0) return '0';
            if (fn === 'SUM') return vals.reduce((s, x) => s + x, 0);
            if (fn === 'AVERAGE') return vals.reduce((s, x) => s + x, 0) / vals.length;
            if (fn === 'MAX') return Math.max(...vals);
            if (fn === 'MIN') return Math.min(...vals);
            if (fn === 'COUNT') return vals.length;
            return 'NaN';
        });

        expr = expr.replace(/([A-D])(\d+)/g, (_, c, r) => {
            const v = evaluateCell(c + r, new Set(visited));
            return typeof v.value === 'number' ? v.value : 0;
        });

        if (!/^[\d+\-*/().\s]+$/.test(expr)) return { value: '#ERR', error: true };
        try {
            const result = Function('"use strict"; return (' + expr + ')')();
            if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) return { value: '#ERR', error: true };
            return { value: Math.round(result * 100) / 100, error: false, isNumber: true };
        } catch (e) {
            return { value: '#ERR', error: true };
        }
    }

    function recompute() {
        let errors = 0;
        COLS.forEach(c => {
            for (let r = 1; r <= ROWS; r++) {
                const cellId = c + r;
                const cellDiv = grid.querySelector(`.ss-cell[data-cell="${cellId}"]`);
                const input = cellDiv ? cellDiv.querySelector('input') : null;
                if (!input || document.activeElement === input) continue;
                const result = evaluateCell(cellId);
                if ((data[cellId] || '').toString().startsWith('=')) {
                    input.value = result.error ? result.value : (result.value === '' ? '' : result.value);
                    cellDiv.classList.add('computed');
                    cellDiv.classList.toggle('error', result.error);
                } else {
                    input.value = data[cellId] || '';
                    cellDiv.classList.remove('computed', 'error');
                }
                if (result.error) errors++;
            }
        });
        if (status) status.textContent = errors > 0 ? `${errors} formula con errori` : 'OK';
    }

    function loadDemo() {
        data['A1'] = '10'; data['B1'] = '20'; data['C1'] = '=A1+B1'; data['D1'] = '=C1*2';
        data['A2'] = '5'; data['B2'] = '15'; data['C2'] = '=A2+B2'; data['D2'] = '=C2*2';
        data['A3'] = '8'; data['B3'] = '12'; data['C3'] = '=A3+B3'; data['D3'] = '=C3*2';
        data['A4'] = '=SUM(A1:A3)'; data['B4'] = '=SUM(B1:B3)'; data['C4'] = '=SUM(C1:C3)'; data['D4'] = '=MAX(D1:D3)';
        recompute();
    }

    function clearAll() {
        COLS.forEach(c => { for (let r = 1; r <= ROWS; r++) data[c + r] = ''; });
        recompute();
    }

    const loadBtn = document.getElementById('ss-load-demo');
    const clearBtn = document.getElementById('ss-clear');
    if (loadBtn) loadBtn.addEventListener('click', loadDemo);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    buildGrid();
    loadDemo();

    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let chartType = 'bar';
    const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899'];
    const labels = ['A', 'B', 'C', 'D'];

    function getValues() {
        return ['a', 'b', 'c', 'd'].map(l => {
            const v = parseFloat(document.getElementById('chart-' + l).value);
            return isNaN(v) ? 0 : v;
        });
    }

    function drawBar(values) {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const maxVal = Math.max(...values, 1);
        const padding = 50;
        const barW = (W - 2 * padding) / values.length * 0.6;
        const gap = (W - 2 * padding) / values.length * 0.4;
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (H - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(W - padding, y);
            ctx.stroke();
        }
        values.forEach((v, i) => {
            const x = padding + i * (barW + gap) + gap / 2;
            const h = (v / maxVal) * (H - 2 * padding);
            const y = H - padding - h;
            ctx.fillStyle = colors[i];
            ctx.fillRect(x, y, barW, h);
            ctx.fillStyle = '#F8FAFC';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(v.toString(), x + barW / 2, y - 8);
            ctx.fillStyle = '#94A3B8';
            ctx.fillText(labels[i], x + barW / 2, H - padding + 22);
        });
    }

    function drawPie(values) {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const cx = W / 2 - 60, cy = H / 2, r = Math.min(W, H) / 2 - 60;
        const total = values.reduce((s, x) => s + x, 0);
        if (total === 0) {
            ctx.fillStyle = '#94A3B8';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Tutti i valori sono zero', W / 2, H / 2);
            return;
        }
        let start = -Math.PI / 2;
        values.forEach((v, i) => {
            const angle = (v / total) * Math.PI * 2;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, start + angle);
            ctx.closePath();
            ctx.fill();
            const midAngle = start + angle / 2;
            const lx = cx + Math.cos(midAngle) * r * 0.65;
            const ly = cy + Math.sin(midAngle) * r * 0.65;
            const pct = Math.round((v / total) * 100);
            if (pct > 4) {
                ctx.fillStyle = '#0B0E14';
                ctx.font = 'bold 13px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(pct + '%', lx, ly);
            }
            start += angle;
        });
        const lx = W - 130;
        let ly = 50;
        labels.forEach((lbl, i) => {
            ctx.fillStyle = colors[i];
            ctx.fillRect(lx, ly, 20, 20);
            ctx.fillStyle = '#F8FAFC';
            ctx.font = '13px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(`${lbl}: ${values[i]}`, lx + 28, ly + 15);
            ly += 30;
        });
    }

    function updateChart() {
        if (!ctx) return;
        const values = getValues();
        if (chartType === 'bar') drawBar(values);
        else drawPie(values);
    }

    ['chart-a', 'chart-b', 'chart-c', 'chart-d'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateChart);
    });
    const barBtn = document.getElementById('chart-bar');
    const pieBtn = document.getElementById('chart-pie');
    if (barBtn) barBtn.addEventListener('click', () => { chartType = 'bar'; updateChart(); });
    if (pieBtn) pieBtn.addEventListener('click', () => { chartType = 'pie'; updateChart(); });
    updateChart();

    const quizData = [
        {
            question: "1. Quale fu il primo foglio di calcolo, lanciato nel 1979 sull'Apple II?",
            options: ["Lotus 1-2-3", "VisiCalc", "Excel"],
            correct: 1
        },
        {
            question: "2. Cosa indica il riferimento di cella 'B3' in un foglio di calcolo?",
            options: [
                "Seconda colonna, terza riga",
                "Terza colonna, seconda riga",
                "Riga B, colonna 3"
            ],
            correct: 0
        },
        {
            question: "3. Per scrivere una formula in una cella, da quale simbolo deve cominciare?",
            options: ["#", "=", "$"],
            correct: 1
        },
        {
            question: "4. Cosa calcola la formula =SUM(A1:A4)?",
            options: [
                "Solo il valore di A1",
                "La somma dei valori delle celle da A1 a A4",
                "La media delle celle"
            ],
            correct: 1
        },
        {
            question: "5. La funzione IF serve per:",
            options: [
                "Sommare numeri",
                "Decidere quale valore restituire in base a una condizione",
                "Cercare un valore in una tabella"
            ],
            correct: 1
        },
        {
            question: "6. Per contare quante celle in B1:B30 contengono un voto sufficiente (>=6), quale funzione usi?",
            options: ["SUM", "COUNTIF", "VLOOKUP"],
            correct: 1
        },
        {
            question: "7. Quale tipo di grafico e migliore per mostrare le percentuali di parti di un tutto?",
            options: ["Linee", "Barre", "Torta"],
            correct: 2
        },
        {
            question: "8. Quale prodotto introdusse la modifica simultanea online di fogli di calcolo?",
            options: ["Excel 2003", "Google Sheets (2006)", "Lotus 1-2-3"],
            correct: 1
        }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0;
    let questionsAnswered = 0;

    function renderQuiz() {
        if (!quizArea) return;
        quizArea.innerHTML = '';
        currentScore = 0;
        questionsAnswered = 0;
        const scoreEl = document.getElementById('quiz-score');
        if (scoreEl) scoreEl.textContent = '';

        quizData.forEach((q) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            qDiv.style.marginBottom = '2rem';
            const qTitle = document.createElement('h3');
            qTitle.textContent = q.question;
            qTitle.style.marginBottom = '1rem';
            qTitle.style.fontWeight = '600';
            qDiv.appendChild(qTitle);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            optionsDiv.style.cssText = 'display:flex; flex-direction:column; gap:0.8rem;';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-btn';
                btn.textContent = optText;
                btn.style.cssText = 'background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-main); padding:1rem; border-radius:0.5rem; cursor:pointer; text-align:left; font-size:1rem; font-family:inherit; transition:all 0.2s;';

                btn.onmouseenter = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.1)'; };
                btn.onmouseleave = () => { if (!btn.disabled) btn.style.background = 'rgba(255,255,255,0.05)'; };

                btn.onclick = () => {
                    if (btn.disabled) return;
                    if (optIndex === q.correct) {
                        btn.style.background = 'var(--physics-color)';
                        btn.style.borderColor = 'var(--physics-color)';
                        btn.style.color = '#fff';
                        btn.classList.add('correct');
                        const allBtns = optionsDiv.querySelectorAll('.quiz-btn');
                        allBtns.forEach(b => {
                            b.disabled = true;
                            b.style.cursor = 'not-allowed';
                            if (!b.classList.contains('correct')) b.style.opacity = '0.7';
                        });
                        const alreadyWrong = optionsDiv.querySelectorAll('.wrong').length > 0;
                        if (!alreadyWrong) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) showScore();
                    } else {
                        btn.classList.add('wrong');
                        btn.style.background = '#EF4444';
                        btn.style.borderColor = '#EF4444';
                        btn.style.color = '#fff';
                        btn.innerHTML += ' <strong>X Riprova!</strong>';
                        btn.disabled = true;
                        btn.style.opacity = '0.7';
                    }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv);
            quizArea.appendChild(qDiv);
        });
    }

    function showScore() {
        const scoreEl = document.getElementById('quiz-score');
        if (!scoreEl) return;
        const perfect = currentScore === quizData.length;
        scoreEl.style.color = perfect ? 'var(--physics-color)' : 'var(--chem-color)';
        scoreEl.innerHTML = perfect
            ? `PERFETTO! Punteggio pieno (${currentScore}/${quizData.length}). Sei pronto a sostituire un contabile!`
            : `Punteggio finale: ${currentScore}/${quizData.length}. Ripassa formule e funzioni.`;
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Riprova il Quiz';
        resetBtn.className = 'btn-gen';
        resetBtn.style.cssText = 'margin-top:1.5rem; background:var(--chem-color); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius:8px; cursor:pointer; font-weight:700;';
        resetBtn.onclick = renderQuiz;
        scoreEl.appendChild(resetBtn);
    }

    renderQuiz();
});
