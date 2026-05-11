// --- Global Utility ---
function toggleSolution(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// --- 0. Unit Conversion Logic ---
const inputMs = document.getElementById('input-ms');
const inputKmh = document.getElementById('input-kmh');

if (inputMs && inputKmh) {
    inputMs.addEventListener('input', () => {
        const val = parseFloat(inputMs.value);
        if (!isNaN(val)) {
            inputKmh.value = (val * 3.6).toFixed(2).replace(/\.00$/, '');
        } else {
            inputKmh.value = "";
        }
    });
    inputKmh.addEventListener('input', () => {
        const val = parseFloat(inputKmh.value);
        if (!isNaN(val)) {
            inputMs.value = (val / 3.6).toFixed(2).replace(/\.00$/, '');
        } else {
            inputMs.value = "";
        }
    });
}

// --- 1. MRU Simulation ---
let mruTimer = null;
let mruStartTime = 0;
const mruObject = document.getElementById('mru-object');
const mruVSlider = document.getElementById('mru-v-slider');
const mruVVal = document.getElementById('mru-v-val');

if (mruVSlider) {
    mruVSlider.addEventListener('input', () => { mruVVal.innerText = mruVSlider.value; });
}

function runMRU() {
    if (mruTimer) clearInterval(mruTimer);
    mruObject.style.left = '0%';
    mruStartTime = performance.now();
    const v = parseFloat(mruVSlider.value);
    
    mruTimer = setInterval(() => {
        const currentTime = (performance.now() - mruStartTime) / 1000;
        const s = v * currentTime;
        const progress = (s / 100) * 90;
        
        document.getElementById('mru-t-data').innerText = currentTime.toFixed(2) + ' s';
        document.getElementById('mru-s-data').innerText = s.toFixed(2) + ' m';
        document.getElementById('mru-v-data').innerText = v.toFixed(2) + ' m/s';

        if (progress >= 90) { clearInterval(mruTimer); mruObject.style.left = '90%'; return; }
        mruObject.style.left = progress + '%';
    }, 50);
}

function stopMRU() { clearInterval(mruTimer); }


// --- 2. MRUA Simulation ---
let mruaTimer = null;
let mruaStartTime = 0;
const mruaObject = document.getElementById('mrua-object');
const mruaASlider = document.getElementById('mrua-a-slider');
const mruaAVal = document.getElementById('mrua-a-val');

if (mruaASlider) {
    mruaASlider.addEventListener('input', () => { mruaAVal.innerText = mruaASlider.value; });
}

function runMRUA() {
    if (mruaTimer) clearInterval(mruaTimer);
    mruaObject.style.left = '0%';
    mruaStartTime = performance.now();
    const a = parseFloat(mruaASlider.value);
    
    mruaTimer = setInterval(() => {
        const currentTime = (performance.now() - mruaStartTime) / 1000;
        const v = a * currentTime;
        const s = 0.5 * a * currentTime * currentTime;
        const progress = (s / 100) * 90;
        
        document.getElementById('mrua-t-data').innerText = currentTime.toFixed(2) + ' s';
        document.getElementById('mrua-v-data').innerText = v.toFixed(2) + ' m/s';
        document.getElementById('mrua-s-data').innerText = s.toFixed(2) + ' m';

        if (progress >= 90) { clearInterval(mruaTimer); mruaObject.style.left = '90%'; return; }
        mruaObject.style.left = progress + '%';
    }, 50);
}

function stopMRUA() { clearInterval(mruaTimer); }


// --- 3. Dynamic Graphs (Independent Controls) ---
const gMruVSlider = document.getElementById('g-mru-v-slider');
const gMruS0Slider = document.getElementById('g-mru-s0-slider');
const gMruaASlider = document.getElementById('g-mrua-a-slider');
const gMruaV0Slider = document.getElementById('g-mrua-v0-slider');

function setupGraphListeners() {
    const sliders = [gMruVSlider, gMruS0Slider, gMruaASlider, gMruaV0Slider];
    sliders.forEach(s => {
        s?.addEventListener('input', () => {
            const valSpan = document.getElementById(s.id.replace('-slider', '-val'));
            if (valSpan) valSpan.innerText = s.value;
            updateGraphs();
        });
    });
}

function updateGraphs() {
    // Independent Parameters
    const v_mru = parseFloat(gMruVSlider?.value || 10);
    const s0_mru = parseFloat(gMruS0Slider?.value || 0);
    const a_mrua = parseFloat(gMruaASlider?.value || 2);
    const v0_mrua = parseFloat(gMruaV0Slider?.value || 0);
    
    const mruPath = document.getElementById('mru-path');
    if (mruPath) {
        let pts = `M 30 ${170 - (s0_mru / 100 * 150)}`;
        const xEnd = 30 + 250;
        const yEnd = 170 - ((s0_mru + v_mru * 10) / 100 * 150);
        mruPath.setAttribute('d', pts + ` L ${xEnd} ${yEnd}`);
    }
    
    const mruaPath = document.getElementById('mrua-path');
    if (mruaPath) {
        let points = "";
        for (let t = 0; t <= 10; t += 0.2) {
            const s = (v0_mrua * t) + (0.5 * a_mrua * t * t);
            const px = 30 + (t / 10) * 250;
            const py = 170 - (s / 100) * 150;
            
            if (t === 0) points = `M ${px} ${py}`;
            else points += ` L ${px} ${py}`;
        }
        mruaPath.setAttribute('d', points);
    }
}


// --- 4. Pursuit Simulation (Thousand Sunny) ---
let pursuitTimer = null;
const pirateShip = document.getElementById('pirate-ship');
const marineShip = document.getElementById('marine-ship');
const aMarineSlider = document.getElementById('a-marine-slider');
const vPirateSlider = document.getElementById('v-pirate-slider');
const pursuitFeedback = document.getElementById('pursuit-feedback');

if (aMarineSlider) {
    aMarineSlider.addEventListener('input', () => document.getElementById('a-marine-val').innerText = aMarineSlider.value);
}
if (vPirateSlider) {
    vPirateSlider.addEventListener('input', () => document.getElementById('v-pirate-val').innerText = vPirateSlider.value);
}

function startPursuit() {
    if (pursuitTimer) clearInterval(pursuitTimer);
    const vP = parseFloat(vPirateSlider.value);
    const aM = parseFloat(aMarineSlider.value);
    const startDist = 150;
    const totalDist = 2000;
    let time = 0;
    pursuitFeedback.innerText = "Scontro a Fuoco! La Marina sta caricando!";
    pursuitFeedback.style.color = "#fbbf24";

    pursuitTimer = setInterval(() => {
        time += 0.2;
        const sP = startDist + vP * time;
        const sM = 0.5 * aM * time * time;
        const posP = (sP / totalDist) * 90;
        const posM = (sM / totalDist) * 90;
        pirateShip.style.left = Math.min(posP, 90) + '%';
        marineShip.style.left = Math.min(posM, 90) + '%';
        if (sM >= sP) {
            clearInterval(pursuitTimer);
            pursuitFeedback.innerText = `CATTURATI! La Marina ha raggiunto la Sunny dopo ${time.toFixed(2)} secondi.`;
            pursuitFeedback.style.color = "#10B981";
        } else if (sP >= totalDist) {
            clearInterval(pursuitTimer);
            pursuitFeedback.innerText = "FUGA RIUSCITA! I Mugiwara entrano nelle nebbie della Grand Line!";
            pursuitFeedback.style.color = "#ef4444";
        }
    }, 50);
}

function stopPursuit() { clearInterval(pursuitTimer); pursuitFeedback.innerText = "Interrotto."; }


// --- 5. Zeno Logic (High Precision) ---
let zenoStep = 0;
let zenoTotalT = 0;
let hStart = 100;

function nextZenoStep() {
    if (zenoStep >= 5) { showZenoSolution(); return; }
    zenoStep++;
    const achille = document.getElementById('zeno-achille');
    const tortoise = document.getElementById('zeno-tortoise');
    const table = document.getElementById('zeno-table-body');
    const stepT = hStart / 10;
    zenoTotalT += stepT;
    
    // Position Visuals
    const achilleX = 60 * zenoStep;
    achille.style.left = achilleX + 'px';
    tortoise.style.left = (achilleX + 100/Math.pow(2, zenoStep)) + 'px';
    
    // Precision tracking
    table.innerHTML += `<tr>
        <td>#${zenoStep}</td>
        <td>${hStart.toFixed(8)} m</td>
        <td>${stepT.toFixed(10)} s</td>
        <td>${zenoTotalT.toFixed(10)} s</td>
    </tr>`;
    
    hStart = 0.1 * stepT; // Tortoise moves during that time
    document.getElementById('zeno-counter').innerText = `Step: ${zenoStep}/5`;
    if (zenoStep === 5) document.getElementById('zeno-btn').innerText = "Vedi Convergenza";
}

function showZenoSolution() {
    const res = document.getElementById('zeno-result');
    const exact = 100 / (10 - 0.1);
    res.innerHTML = `La somma degli infiniti termini converge esattamente a: <b>${exact.toFixed(12)} s</b>. <br>Nota come ogni step aggiunge cifre decimali sempre più piccole!`;
    document.getElementById('zeno-btn').disabled = true;
}


// --- 6. Quiz Logic ---
let qScore = 0;
let qAnswered = new Set();
function checkQuizAnswer(btn, correct) {
    const qDiv = btn.closest('.quiz-question');
    const group = qDiv.querySelectorAll('.quiz-btn');
    const qIdx = Array.from(document.querySelectorAll('.quiz-question')).indexOf(qDiv);
    if (correct) {
        btn.style.background = "#10B981";
        btn.style.color = "white";
        group.forEach(b => b.disabled = true);
        if (!qAnswered.has(qIdx)) { qScore++; qAnswered.add(qIdx); }
    } else {
        btn.style.background = "#ef4444";
        btn.style.color = "white";
        btn.disabled = true;
    }
    if (qAnswered.size === 5) {
        document.getElementById('quiz-feedback').innerText = `Punteggio finale: ${qScore}/5. Ben fatto!`;
    }
}

// Global Initialization
window.onload = () => {
    setupGraphListeners();
    updateGraphs();
};
