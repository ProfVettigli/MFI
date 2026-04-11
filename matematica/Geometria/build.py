import os
import json

base_dir = r"c:\Users\vetti\OneDrive\Desktop\MFI\matematica\Geometria"

lessons = [
    {
        "id": "assiomi-teoremi",
        "title": "Assiomi e Teoremi",
        "subtitle": "L'eredità di Euclide: scopri i postulati e la struttura logica che regge la geometria classica.",
        "icon": "🏛️",
        "color": "#3B82F6",
        "sections": [
            {"title": "1. I Cinque Postulati di Euclide", "content": "Nel 300 a.C. Euclide mise in ordine tutta la matematica nel suo libro 'Elementi'. Decise di partire da 5 affermazioni talmente logiche ed evidenti da non poter essere dimostrate (gli Assiomi). Da questi cinque pilastri, costruì l'intero universo geometrico."},
            {"title": "2. Teoremi e Dimostrazioni", "content": "Se un Assioma è una verità auto-evidente, un 'Teorema' è una verità che DEVE essere dimostrata concatenando logicamente passaggi derivati dagli assiomi. La dimostrazione è l'anima stessa della matematica!"}
        ],
        "canvas_title": "Costruisci il Quinto Postulato",
        "quiz": {"q": "Quanti sono i postulati fondamentali di Euclide?", "o1": "Tre", "o2": "Dieci", "o3": "Cinque", "o4": "Infiniti", "correct": 2}
    },
    {
        "id": "geometria-piana",
        "title": "Geometria Piana",
        "subtitle": "Il Teorema di Pitagora, la perfezione delle figure e il mistero dell'irrazionalità.",
        "icon": "📐",
        "color": "#10B981",
        "sections": [
            {"title": "1. Triangoli e Pitagora", "content": "La geometria del piano (2D) si basa sullo studio dei poligoni. Il triangolo rettangolo è la figura regina, legata dall'indistruttibile Teorema di Pitagora: in un triangolo rettangolo, l'area del quadrato costruito sull'ipotenusa è uguale alla somma delle aree dei quadrati costruiti sui cateti."},
            {"title": "2. Il Mistero di Radice di 2", "content": "I pitagorici credevano che tutto fosse numero razionale (frazioni). Ma calcolando la diagonale di un quadrato di lato 1, scoprirono \\(\\sqrt{2}\\). Essendo un numero infinito che non si ripete mai (irrazionale), vennero gettati nel panico e tentarono di mantenere segreta la scoperta!"}
        ],
        "canvas_title": "Dimostrazione Visiva di Pitagora",
        "quiz": {"q": "Quale concetto ha messo in crisi la scuola Pitagorica?", "o1": "I numeri Primi", "o2": "I logaritmi", "o3": "I numeri Irrazionali", "o4": "Il Pi Greco", "correct": 2}
    },
    {
        "id": "geometria-solida",
        "title": "Geometria Solida",
        "subtitle": "Esplora la terza dimensione: volumi, superfici e i solidi platonici.",
        "icon": "🧊",
        "color": "#F59E0B",
        "sections": [
            {"title": "1. La Terza Dimensione", "content": "Aggiungendo l'asse Z profondità al piano, otteniamo la Geometria Solida (3D). Le figure non hanno più solo un'area, ma guadagnano un Volume, ovvero la quantità di spazio racchiusa al loro interno."},
            {"title": "2. I Solidi Platonici", "content": "Esistono solo 5 poliedri regolari, ovvero solidi composti da facce tutte identiche tra di loro e angoli uguali. Sono il Tetraedro, l'Esaedro (Cubo), l'Ottaedro, il Dodecaedro e l'Icosaedro. Platone li associò agli elementi fondamentali dell'universo (Fuoco, Terra, Aria, Universo, Acqua)!"}
        ],
        "canvas_title": "Esplora i Solidi (Proiezioni)",
        "quiz": {"q": "Quanti sono in totale i Solidi Platonici (poliedri regolari)?", "o1": "Cinque", "o2": "Sei", "o3": "Infiniti", "o4": "Tre", "correct": 0}
    },
    {
        "id": "clil-flatlandia",
        "title": "CLIL: Flatland",
        "subtitle": "A romance of many dimensions. Un viaggio letterario tra i mondi 2D e 3D.",
        "icon": "📖",
        "color": "#EF4444",
        "sections": [
            {"title": "1. Welcome to Flatland", "content": "<em>Flatland: A Romance of Many Dimensions</em> is a satirical novel written by Edwin A. Abbott in 1884. The protagonist is A Square, living in a purely 2D world. Women are straight lines, workers are triangles, and the ruling class are circles."},
            {"title": "2. The Sphere's Revelation", "content": "On New Year's Eve, A Square is visited by a 3-Dimensional Sphere. The Sphere passes through the 2D plane, appearing to the Square as a circle that magically grows and shrinks. This novel perfectly explains how a 4th-dimensional object would strangely appear to our 3D human eyes!"}
        ],
        "canvas_title": "Sphere passing through Flatland",
        "quiz": {"q": "In the novel Flatland, what does the Sphere look like when passing through the 2D world?", "o1": "A line", "o2": "A growing/shrinking circle", "o3": "A square", "o4": "An explosion", "correct": 1}
    },
    {
        "id": "piano-cartesiano",
        "title": "Il Piano Cartesiano",
        "subtitle": "Il ponte tra l'algebra e la geometria inventato da Cartesio.",
        "icon": "🌐",
        "color": "#8B5CF6",
        "sections": [
            {"title": "1. Il Matrimonio tra Equazioni e Forme", "content": "Prima del 1600, l'Algebra (le formule) e la Geometria (i disegni) erano campi separati. Il filosofo Descartes cambiò il mondo tracciando due rette incrociate (assi X e Y). Ogni punto è identificato da una coordinata (x, y)."},
            {"title": "2. Il Potere delle Funzioni", "content": "Grazie al piano cartesiano, un'equazione come y = 2x non è più solo una formula, ma diventa una linea solida tracciata sul piano. L'umanità ha potuto finalmente 'vedere' l'algebra e risolvere problemi geometrici manipolando astrattamente i numeri!"}
        ],
        "canvas_title": "Plotting: (x, y)",
        "quiz": {"q": "Quale problema storico ha risolto il Piano Cartesiano?", "o1": "Ha unito Algebra e Geometria", "o2": "Ha dimostrato che Pi Greco è irrazionale", "o3": "Ha semplificato le divisioni", "o4": "Tutte le precedenti", "correct": 0}
    },
    {
        "id": "retta",
        "title": "La Retta",
        "subtitle": "Equazioni, coefficienti angolari e l'oggetto più base dello spazio.",
        "icon": "📏",
        "color": "#EC4899",
        "sections": [
            {"title": "1. L'equazione Fondamentale", "content": "La retta è la via più breve tra due punti. Nel piano cartesiano si esprime in forma esplicita come \\(y = mx + q\\). Le rette sono gli unici enti geometrici a 1 sola dimensione che si estendono all'infinito."},
            {"title": "2. Coefficiente Angolare (m)", "content": "La lettera 'm' è il coefficiente angolare: determina la pendenza della salita o discesa della retta. Se \\(m > 0\\) la retta sale verso destra, se \\(m < 0\\) scende. La lettera 'q' è invece l'intercetta (dove buca l'asse Y). due rette con lo stesso 'm' sono sempre parallele!"}
        ],
        "canvas_title": "Esplora y = mx + q",
        "quiz": {"q": "Se due rette hanno lo stesso coefficiente angolare (m), come sono posizionate?", "o1": "Perpendicolari", "o2": "Secanti", "o3": "Parallele", "o4": "Coincidenti di sicuro", "correct": 2}
    },
    {
        "id": "coniche",
        "title": "Le Coniche",
        "subtitle": "Circonferenze, ellissi, parabole e le curve estratte dai coni.",
        "icon": "⭕",
        "color": "#14B8A6",
        "sections": [
            {"title": "1. Affettare un Cono", "content": "Perché si chiamano 'Coniche'? Perché nell'antica Grecia i matematici scoprirono che tagliando (sezionando) un finto cono 3D con un foglio piatto a diverse inclinazioni, potevano generare tutte le curve fondamentali del cielo."},
            {"title": "2. Le Quattro Figure Famigliari", "content": "Se tagli orizzontalmente ottieni una <strong>Circonferenza</strong>. Inclinando un po' ottieni l'<strong>Ellisse</strong> (la forma delle orbite planetarie). Inclinando parallelamente al lato ottieni una <strong>Parabola</strong>. Tagliando in verticale ottieni l'<strong>Iperbole</strong>. Magia pura!"}
        ],
        "canvas_title": "Il Piano Secante sul Cono",
        "quiz": {"q": "Tagliando un cono orizzontalmente, parallelo alla sua base, che figura piana si ottiene?", "o1": "Ellisse", "o2": "Parabola", "o3": "Iperbole", "o4": "Circonferenza", "correct": 3}
    },
    {
        "id": "clil-architettura",
        "title": "CLIL: Architecture",
        "subtitle": "Geometrical structures in architecture. Dallo stile classico ai moderni algoritmi.",
        "icon": "🏛️",
        "color": "#3B82F6",
        "sections": [
            {"title": "1. The Golden Ratio in Antiquity", "content": "Since ancient times, human architecture has relied on geometry. The Greeks used the <em>Golden Ratio</em> (\\(\\Phi \approx 1.618\\)) to design the Parthenon perfectly. Renaissance masters like Brunelleschi utilized precise linear perspective to trick the human eye in the Florence Cathedral."},
            {"title": "2. Modern Parametric Design", "content": "Today, architects like Zaha Hadid don't draw with rulers. They use algorithms applied to Non-Euclidean geometry and fractals. <em>Parametric Architecture</em> uses computer scripts to alter formulas, instantly regenerating complex curved buildings without ever touching a pencil."}
        ],
        "canvas_title": "Parametric Form Builder",
        "quiz": {"q": "Which modern tech allowed architects to easily draw advanced curved non-Euclidean buildings?", "o1": "The Pantheon", "o2": "Parametric computer algorithms", "o3": "Manual slide rulers", "o4": "The Golden Ratio", "correct": 1}
    },
    {
        "id": "geometrie-non-euclidee",
        "title": "Geometrie Non Euclidee",
        "subtitle": "Quando le rette parallele si incontrano e l'universo si incurva.",
        "icon": "🌀",
        "color": "#6366F1",
        "sections": [
            {"title": "1. Il Fallimento del Quinto Postulato", "content": "Il 5° postulato di Euclide sulle rette parallele ha sempre turbato i matematici perché difficile da dimostrare. Nell'800, Gauss, Bolyai e Lobačevskij ebbero un'idea folle: cosa succede se fingiamo che il postulato sia FALSO? La matematica esplode? No, si creano nuove validissime geometrie!"},
            {"title": "2. Sferica e Iperbolica", "content": "Nella geometria 'Ellittica' (sulla superficie di una Sfera), NON esistono rette parallele, i meridiani si toccano ai poli! Nel triangolo sferico, la somma degli angoli interni supera i $180°$. Nella geometria 'Iperbolica' (forma di sella), esistono INIFINITE parallele che non si toccheranno mai, e la somma è minore di $180°$! Einstein usò le non-euclidee per la gravità!"}
        ],
        "canvas_title": "Il Triangolo su una Sfera",
        "quiz": {"q": "In geometria Ellittica (superficie sferica), quanto fa la somma degli angoli interni di un triangolo?", "o1": "Esattamente 180 gradi", "o2": "Più di 180 gradi", "o3": "Meno di 180 gradi", "o4": "Sempre 360", "correct": 1}
    },
    {
        "id": "frattali",
        "title": "Frattali",
        "subtitle": "La geometria dell'infinito e la natura autoreplicante.",
        "icon": "❄️",
        "color": "#06B6D4",
        "sections": [
            {"title": "1. Cosa sono i Frattali?", "content": "I frattali sono figure geometriche maledettamente affascinanti. Hanno una proprietà unica chiamata <strong>Autosimilarità</strong>: se ingrandisci un dettaglio microscopico di un frattale all'infinito, rivedrai sempre la figura intera che si ripete su scale più piccole! Sono ovunque in natura: i bordi delle coste, i fiocchi di neve, i bronchi polmonari e le foglie di felce."},
            {"title": "2. L'Insieme di Mandelbrot", "content": "Negli anni '80 il matematico Benoit Mandelbrot coniò il termine esplorando un set mostruoso al computer. Si basa sui Numeri Complessi e l'iterazione della funzione \\(Z = Z^2 + C\\). L'immagine generata (the Mandelbrot Set) ha un perimetro teoricamente infinito ma rinchiuso in un'area finita!"}
        ],
        "canvas_title": "Generatore Albero Frattale",
        "quiz": {"q": "Come si chiama la caratteristica che fa ripetere il frattale uguale a se stesso rimpicciolendolo?", "o1": "Traslazione", "o2": "Romboidale", "o3": "Autosimilarità", "o4": "Assioma di Peano", "correct": 2}
    }
]

html_template = """<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Geometria MFI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/style.css">
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        .back-button {{
            display: inline-flex;
            align-items: center;
            color: var(--text-muted);
            text-decoration: none;
            margin-bottom: 2rem;
            font-weight: 600;
            transition: color 0.3s ease, transform 0.3s ease;
        }}
        .back-button:hover {{
            color: var(--text-main);
            transform: translateX(-5px);
        }}
        .sub-hero {{
            padding: 4rem 0 2rem;
            text-align: left;
        }}
        .interactive-container {{
            background: rgba(0,0,0,0.15);
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }}
        canvas {{
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            max-width: 100%;
        }}
        .controls {{
            margin-top: 1.5rem;
            display: flex;
            gap: 1rem;
        }}
        .control-btn {{
            background: {color};
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
        }}
        .control-btn:hover {{ opacity: 0.8; }}
    </style>
</head>
<body>
    <header class="sub-hero">
        <div class="container">
            <div style="text-align: center; margin-bottom: 2.5rem;">
                <a href="geometria.html" class="back-button" style="margin-bottom: 0;">
                    <span style="margin-right:0.5rem;font-size:1.2rem;">&larr;</span> Torna a Geometria
                </a>
            </div>
            <h1 class="sub-hero-title" style="color: {color};"> {icon} {title} </h1>
            <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 800px; font-weight: 300;">
                {subtitle}
            </p>
        </div>
    </header>

    <main class="container">
        
        <section class="lesson-section">
            <h2 class="lesson-title" style="color: {color};">{p1_title}</h2>
            <p class="lesson-text">{p1_content}</p>
        </section>

        <section class="lesson-section">
            <h2 class="lesson-title" style="color: {color};">{p2_title}</h2>
            <p class="lesson-text">{p2_content}</p>
            
            <div class="interactive-container">
                <h3 style="color: {color}; margin-bottom: 1rem;">Linguaggio Interattivo: {canvas_title}</h3>
                <canvas id="mainCanvas" width="600" height="400"></canvas>
                <div class="controls">
                    <button class="control-btn" id="btnInteract">Attiva/Interagisci</button>
                    <button class="control-btn" id="btnReset" style="background:#64748b;">Reset</button>
                </div>
            </div>
        </section>

        <section id="quiz-finale" class="lesson-section quiz-container">
            <h2 class="lesson-title" style="color: {color}; text-align: center;">Verifica Cognitiva</h2>
            <div class="quiz-card">
                <p class="quiz-question">{quiz_q}</p>
                <div class="quiz-options">
                    <button class="quiz-option" data-correct="{is_correct_0}">{o1}</button>
                    <button class="quiz-option" data-correct="{is_correct_1}">{o2}</button>
                    <button class="quiz-option" data-correct="{is_correct_2}">{o3}</button>
                    <button class="quiz-option" data-correct="{is_correct_3}">{o4}</button>
                </div>
                <div class="quiz-feedback" style="display: none; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: center; font-weight: bold;"></div>
            </div>
        </section>
        
    </main>

    <footer>
        <p>&copy; 2026 MFI - Matematica MFI.</p>
    </footer>

    <script src="{id}.js"></script>
    <script src="../../js/main.js"></script>
    <script>
        document.querySelectorAll('.quiz-option').forEach(button => {{
            button.addEventListener('click', () => {{
                const feedback = button.parentElement.nextElementSibling;
                feedback.style.display = 'block';
                if(button.getAttribute('data-correct') === 'true') {{
                    feedback.style.background = 'rgba(16,185,129,0.1)';
                    feedback.style.color = '#10B981';
                    feedback.textContent = 'Risposta Corretta! Eccellente deduzione.';
                }} else {{
                    feedback.style.background = 'rgba(239,68,68,0.1)';
                    feedback.style.color = '#EF4444';
                    feedback.textContent = 'Errore! Rifletti meglio sul passaggio logico e riprova.';
                }}
            }});
        }});
    </script>
</body>
</html>
"""

js_template = """document.addEventListener('DOMContentLoaded', () => {{
    const canvas = document.getElementById('mainCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const btnInteract = document.getElementById('btnInteract');
    const btnReset = document.getElementById('btnReset');

    let state = 0;
    
    function draw() {{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '{color}';
        
        // Un placeholder interattivo standard geniale
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        
        let size = 50 + state * 30;
        ctx.rotate(state * 0.5);
        ctx.fillRect(-size/2, -size/2, size, size);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
        ctx.restore();
        
        ctx.fillStyle = '#333';
        ctx.font = '20px Inter, sans-serif';
        ctx.fillText("Animazione step: " + state, 20, 40);
    }}

    draw();

    btnInteract.addEventListener('click', () => {{
        state = (state + 1) % 5;
        draw();
    }});

    btnReset.addEventListener('click', () => {{
        state = 0;
        draw();
    }});
}});
"""

for l in lessons:
    html_content = html_template.format(
        id=l['id'],
        title=l['title'],
        subtitle=l['subtitle'],
        icon=l['icon'],
        color=l['color'],
        p1_title=l['sections'][0]['title'],
        p1_content=l['sections'][0]['content'],
        p2_title=l['sections'][1]['title'],
        p2_content=l['sections'][1]['content'],
        canvas_title=l['canvas_title'],
        quiz_q=l['quiz']['q'],
        o1=l['quiz']['o1'],
        o2=l['quiz']['o2'],
        o3=l['quiz']['o3'],
        o4=l['quiz']['o4'],
        is_correct_0="true" if l['quiz']['correct'] == 0 else "false",
        is_correct_1="true" if l['quiz']['correct'] == 1 else "false",
        is_correct_2="true" if l['quiz']['correct'] == 2 else "false",
        is_correct_3="true" if l['quiz']['correct'] == 3 else "false"
    )
    
    js_content = js_template.format(color=l['color'])
    
    html_path = os.path.join(base_dir, f"{l['id']}.html")
    js_path = os.path.join(base_dir, f"{l['id']}.js")
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

print(f"Generated {len(lessons)*2} files successfully.")
