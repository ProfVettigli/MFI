document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fibCanvas');
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const btnStep = document.getElementById('btnStep');
    const btnReset = document.getElementById('btnReset');
    const statusText = document.getElementById('fibStatus');

    let sequence = [1];
    
    const colors = ['rgba(245, 158, 11, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(168, 85, 247, 0.2)'];

    draw();

    btnStep.addEventListener('click', () => {
        if(sequence.length >= 15) {
            statusText.textContent = "Limite zoom raggiunto!";
            return;
        }

        let nextFib;
        if(sequence.length === 1) {
            nextFib = 1;
        } else {
            nextFib = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        }
        
        sequence.push(nextFib);
        statusText.textContent = "Valore attuale: " + nextFib;
        draw();
    });

    btnReset.addEventListener('click', () => {
        sequence = [1];
        statusText.textContent = "Valore attuale: 1";
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let rects = [];
        let dir = 0; // 0=Right, 1=Down, 2=Left, 3=Up
        let minX = 0, maxX = 1, minY = 0, maxY = 1;
        
        // Calcola in coordinate matematiche (es. 1 unità = 1 fibonacci)
        for(let i=0; i<sequence.length; i++) {
            let f = sequence[i];
            let rx, ry, arcX, arcY, startA, endA;
            
            if(i === 0) {
                rx = 0; ry = 0;
                arcX = 1; arcY = 1; 
                startA = Math.PI; endA = 1.5 * Math.PI;
            } else {
                let prev = rects[i-1];
                if(dir === 0) { // Right
                    rx = prev.x + prev.w;
                    ry = prev.y; 
                    arcX = rx; arcY = ry + f; 
                    startA = 1.5 * Math.PI; endA = 2 * Math.PI;
                } else if(dir === 1) { // Down
                    rx = prev.x + prev.w - f; 
                    ry = prev.y + prev.h;
                    arcX = rx; arcY = ry; 
                    startA = 0; endA = 0.5 * Math.PI;
                } else if(dir === 2) { // Left
                    rx = prev.x - f;
                    ry = prev.y + prev.h - f;
                    arcX = rx + f; arcY = ry; 
                    startA = 0.5 * Math.PI; endA = Math.PI;
                } else if(dir === 3) { // Up
                    rx = prev.x;
                    ry = prev.y - f;
                    arcX = rx + f; arcY = ry + f; 
                    startA = Math.PI; endA = 1.5 * Math.PI;
                }
                dir = (dir + 1) % 4;
            }
            rects.push({x: rx, y: ry, w: f, h: f, arcX: arcX, arcY: arcY, startA: startA, endA: endA});
            
            if(rx < minX) minX = rx;
            if(ry < minY) minY = ry;
            if(rx + f > maxX) maxX = rx + f;
            if(ry + f > maxY) maxY = ry + f;
        }

        let totalW = maxX - minX;
        let totalH = maxY - minY;
        
        let padding = 60;
        let scaleX = (canvas.width - padding) / totalW;
        let scaleY = (canvas.height - padding) / totalH;
        let scale = Math.min(scaleX, scaleY);
        if(sequence.length === 1) scale = 50; // default view per il primo cubo
        
        ctx.save();
        
        let cx = (minX + maxX) / 2;
        let cy = (minY + maxY) / 2;
        
        ctx.translate(canvas.width / 2 - cx * scale, canvas.height / 2 - cy * scale);
        
        for(let i=0; i<rects.length; i++) {
            let r = rects[i];
            
            // Draw Square
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 1;
            ctx.strokeRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);

            // Draw Arc
            ctx.beginPath();
            ctx.arc(r.arcX * scale, r.arcY * scale, r.w * scale, r.startA, r.endA, false);
            ctx.strokeStyle = '#F59E0B'; 
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        ctx.restore();
    }
});
