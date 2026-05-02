document.addEventListener("DOMContentLoaded", () => {
    // --- SQL Simulator ---
    const runSqlBtn = document.getElementById("run-sql-btn");
    const sqlInput = document.getElementById("sql-input");
    const sqlOutput = document.getElementById("sql-output");

    const tableData = [
        { ID: 1, Nome: "Mario", Materia: "Informatica", Voto: 8 },
        { ID: 2, Nome: "Luigi", Materia: "Matematica", Voto: 6 },
        { ID: 3, Nome: "Anna", Materia: "Informatica", Voto: 9 },
        { ID: 4, Nome: "Giulia", Materia: "Fisica", Voto: 7 },
        { ID: 5, Nome: "Paolo", Materia: "Matematica", Voto: 4 }
    ];

    runSqlBtn.addEventListener("click", () => {
        let query = sqlInput.value.trim().replace(/;$/, "");
        
        // Very basic mock parser
        if (!query.toUpperCase().startsWith("SELECT * FROM STUDENTI")) {
            sqlOutput.innerHTML = `<span style="color: #ef4444;">Errore: Solo query 'SELECT * FROM Studenti' supportate in questo demo.</span>`;
            return;
        }

        let filteredData = [...tableData];
        
        const whereIndex = query.toUpperCase().indexOf("WHERE");
        if (whereIndex !== -1) {
            let condition = query.substring(whereIndex + 5).trim();
            try {
                // Parse simple conditions like "Voto >= 8" or "Materia = 'Informatica'"
                let matchNum = condition.match(/(\w+)\s*([<>=!]+)\s*(\d+)/);
                let matchStr = condition.match(/(\w+)\s*=\s*'([^']+)'/);
                let matchStrDouble = condition.match(/(\w+)\s*=\s*"([^"]+)"/);

                if (matchNum) {
                    let field = matchNum[1];
                    let op = matchNum[2];
                    let val = parseFloat(matchNum[3]);
                    filteredData = filteredData.filter(row => {
                        if (op === ">=") return row[field] >= val;
                        if (op === "<=") return row[field] <= val;
                        if (op === ">") return row[field] > val;
                        if (op === "<") return row[field] < val;
                        if (op === "=" || op === "==") return row[field] == val;
                        return true;
                    });
                } else if (matchStr || matchStrDouble) {
                    let match = matchStr || matchStrDouble;
                    let field = match[1];
                    let val = match[2];
                    filteredData = filteredData.filter(row => row[field] && row[field].toString().toLowerCase() === val.toLowerCase());
                } else {
                    throw new Error("Condizione non supportata");
                }
            } catch (e) {
                sqlOutput.innerHTML = `<span style="color: #ef4444;">Errore nella sintassi WHERE. Usa formati semplici come 'Voto >= 8' o 'Materia = "Informatica"'.</span>`;
                return;
            }
        }

        if (filteredData.length === 0) {
            sqlOutput.innerHTML = `<em>Nessun risultato trovato.</em>`;
            return;
        }

        let html = `<table class="sql-table" style="margin-top: 0;">`;
        html += `<tr><th>ID</th><th>Nome</th><th>Materia</th><th>Voto</th></tr>`;
        filteredData.forEach(row => {
            html += `<tr><td>${row.ID}</td><td>${row.Nome}</td><td>${row.Materia}</td><td>${row.Voto}</td></tr>`;
        });
        html += `</table>`;
        html += `<p style="color:#10b981; margin-top:0.5rem; font-size:0.85rem;">Trovati ${filteredData.length} risultati.</p>`;
        sqlOutput.innerHTML = html;
    });

    // --- Graph Simulator ---
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");
    const clearGraphBtn = document.getElementById("clearGraphBtn");
    const presetSocialBtn = document.getElementById("presetSocialBtn");
    const graphStatus = document.getElementById("graph-status");

    // Match CSS dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let nodes = [];
    let edges = [];
    let nodeIdCounter = 1;
    let selectedNodeForEdge = null;

    const NODE_RADIUS = 20;

    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw edges
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        edges.forEach(edge => {
            const n1 = nodes.find(n => n.id === edge.from);
            const n2 = nodes.find(n => n.id === edge.to);
            if (n1 && n2) {
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.stroke();
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = (node === selectedNodeForEdge) ? "#f59e0b" : "#10b981";
            ctx.fill();
            ctx.strokeStyle = "#059669";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.font = "bold 14px Inter";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.id, node.x, node.y);
        });
    }

    canvas.addEventListener("mousedown", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked on a node
        const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) <= NODE_RADIUS);

        if (clickedNode) {
            if (selectedNodeForEdge) {
                if (selectedNodeForEdge !== clickedNode) {
                    // Create edge
                    // Check if edge already exists
                    const exists = edges.some(edge => 
                        (edge.from === selectedNodeForEdge.id && edge.to === clickedNode.id) ||
                        (edge.to === selectedNodeForEdge.id && edge.from === clickedNode.id)
                    );
                    if (!exists) {
                        edges.push({ from: selectedNodeForEdge.id, to: clickedNode.id });
                        graphStatus.textContent = `Arco creato tra Nodo ${selectedNodeForEdge.id} e Nodo ${clickedNode.id}.`;
                    }
                }
                selectedNodeForEdge = null;
            } else {
                selectedNodeForEdge = clickedNode;
                graphStatus.textContent = `Nodo ${clickedNode.id} selezionato. Clicca su un altro nodo per creare un arco.`;
            }
        } else {
            // Clicked empty space
            nodes.push({ x, y, id: nodeIdCounter++ });
            selectedNodeForEdge = null;
            graphStatus.textContent = `Nodo ${nodeIdCounter - 1} aggiunto.`;
        }
        drawGraph();
    });

    canvas.addEventListener("dblclick", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedNodeIndex = nodes.findIndex(n => Math.hypot(n.x - x, n.y - y) <= NODE_RADIUS);
        
        if (clickedNodeIndex !== -1) {
            const nodeId = nodes[clickedNodeIndex].id;
            nodes.splice(clickedNodeIndex, 1);
            edges = edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);
            selectedNodeForEdge = null;
            graphStatus.textContent = `Nodo ${nodeId} eliminato.`;
            drawGraph();
        }
    });

    clearGraphBtn.addEventListener("click", () => {
        nodes = [];
        edges = [];
        nodeIdCounter = 1;
        selectedNodeForEdge = null;
        graphStatus.textContent = "Grafo pulito.";
        drawGraph();
    });

    presetSocialBtn.addEventListener("click", () => {
        nodes = [
            { x: canvas.width/2, y: canvas.height/2, id: 1 },
            { x: canvas.width/2 - 80, y: canvas.height/2 - 80, id: 2 },
            { x: canvas.width/2 + 80, y: canvas.height/2 - 80, id: 3 },
            { x: canvas.width/2 - 120, y: canvas.height/2 + 20, id: 4 },
            { x: canvas.width/2 + 120, y: canvas.height/2 + 20, id: 5 },
            { x: canvas.width/2, y: canvas.height/2 + 100, id: 6 }
        ];
        edges = [
            {from: 1, to: 2}, {from: 1, to: 3}, {from: 1, to: 4}, {from: 1, to: 5}, {from: 1, to: 6},
            {from: 2, to: 3}, {from: 4, to: 6}, {from: 5, to: 6}
        ];
        nodeIdCounter = 7;
        selectedNodeForEdge = null;
        graphStatus.textContent = "Grafo Esempio (Social Network) caricato.";
        drawGraph();
    });

    // Resize handler
    window.addEventListener("resize", () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        drawGraph();
    });

    // Initial draw
    presetSocialBtn.click();
});
