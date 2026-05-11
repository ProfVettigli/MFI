document.addEventListener('DOMContentLoaded', () => {

    const GridSize = 25; // 25px = 1 unit

    function drawGrid(ctx, W, H, withNumbers = true) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        
        let cx = W/2, cy = H/2;
        
        for (let x = cx % GridSize; x < W; x += GridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = cy % GridSize; y < H; y += GridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        
        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '12px sans-serif';
        ctx.fillText('X', W - 15, cy - 5);
        ctx.fillText('Y', cx + 5, 15);
    }

    function toPixels(W, H, px, py) {
        return { x: W/2 + px * GridSize, y: H/2 - py * GridSize };
    }
    
    function toCoords(W, H, x, y) {
        return { px: (x - W/2)/GridSize, py: (H/2 - y)/GridSize };
    }

    // 1. POINT CANVAS
    const cPoint = document.getElementById('pointCanvas');
    let pt = { px: 3, py: 4 };
    function drawPoint() {
        if(!cPoint) return;
        const ctxP = cPoint.getContext('2d');
        ctxP.clearRect(0,0,cPoint.width, cPoint.height);
        drawGrid(ctxP, cPoint.width, cPoint.height);
        
        let pos = toPixels(cPoint.width, cPoint.height, pt.px, pt.py);
        
        ctxP.strokeStyle = '#fff'; ctxP.setLineDash([4, 4]); ctxP.beginPath();
        ctxP.moveTo(pos.x, cPoint.height/2); ctxP.lineTo(pos.x, pos.y); ctxP.lineTo(cPoint.width/2, pos.y); ctxP.stroke();
        ctxP.setLineDash([]);
        
        ctxP.fillStyle = '#fff'; ctxP.beginPath(); ctxP.arc(pos.x, pos.y, 6, 0, Math.PI*2); ctxP.fill();

        document.getElementById('point-coords').innerText = `(${pt.px.toFixed(1)}, ${pt.py.toFixed(1)})`;
    }
    if(cPoint) {
        drawPoint();
        function handleDragP(e) {
            if(e.buttons !== 1 && (!e.touches)) return;
            const r = cPoint.getBoundingClientRect();
            let cx = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);
            let cy = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
            if(!cx && !cy) return;
            let coords = toCoords(cPoint.width, cPoint.height, cx - r.left, cy - r.top);
            pt.px = Math.round(coords.px * 2) / 2; pt.py = Math.round(coords.py * 2) / 2;
            drawPoint();
            if(e.cancelable) e.preventDefault();
        }
        cPoint.addEventListener('mousedown', handleDragP); cPoint.addEventListener('mousemove', handleDragP);
        cPoint.addEventListener('touchmove', handleDragP, {passive: false}); cPoint.addEventListener('touchstart', handleDragP, {passive: false});
    }

    window.movePoint = function(dx, dy) { pt.px += dx; pt.py += dy; drawPoint(); };

    // 2. MID CANVAS
    const cMid = document.getElementById('midCanvas');
    let pA_m = { px: -4, py: -2 }, pB_m = { px: 4, py: 4 };
    let draggedM = null;
    function drawMid() {
        if(!cMid) return;
        const ctxM = cMid.getContext('2d');
        ctxM.clearRect(0,0,cMid.width, cMid.height);
        drawGrid(ctxM, cMid.width, cMid.height);
        
        let posA = toPixels(cMid.width, cMid.height, pA_m.px, pA_m.py);
        let posB = toPixels(cMid.width, cMid.height, pB_m.px, pB_m.py);
        let mPx = (pA_m.px + pB_m.px)/2, mPy = (pA_m.py + pB_m.py)/2;
        let posM = toPixels(cMid.width, cMid.height, mPx, mPy);

        ctxM.strokeStyle = 'rgba(255,255,255,0.4)'; ctxM.lineWidth = 2;
        ctxM.beginPath(); ctxM.moveTo(posA.x, posA.y); ctxM.lineTo(posB.x, posB.y); ctxM.stroke();

        ctxM.fillStyle = '#3b82f6'; ctxM.beginPath(); ctxM.arc(posA.x, posA.y, 8, 0, Math.PI*2); ctxM.fill();
        ctxM.fillStyle = '#ef4444'; ctxM.beginPath(); ctxM.arc(posB.x, posB.y, 8, 0, Math.PI*2); ctxM.fill();
        ctxM.fillStyle = '#10b981'; ctxM.beginPath(); ctxM.arc(posM.x, posM.y, 6, 0, Math.PI*2); ctxM.fill();

        document.getElementById('mid-a-coords').innerText = `(${pA_m.px.toFixed(1)}, ${pA_m.py.toFixed(1)})`;
        document.getElementById('mid-b-coords').innerText = `(${pB_m.px.toFixed(1)}, ${pB_m.py.toFixed(1)})`;
        document.getElementById('mid-m-coords').innerText = `(${mPx.toFixed(1)}, ${mPy.toFixed(1)})`;
    }
    if(cMid) {
        drawMid();
        function handleDragM(e) {
            const r = cMid.getBoundingClientRect();
            let cx = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);
            let cy = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
            if(!cx && !cy) return;
            if(e.type === 'mousedown' || e.type === 'touchstart') {
                let posA = toPixels(cMid.width, cMid.height, pA_m.px, pA_m.py);
                let posB = toPixels(cMid.width, cMid.height, pB_m.px, pB_m.py);
                let dx1 = cx - r.left - posA.x, dy1 = cy - r.top - posA.y;
                let dx2 = cx - r.left - posB.x, dy2 = cy - r.top - posB.y;
                if(dx1*dx1 + dy1*dy1 < 250) draggedM = pA_m;
                else if(dx2*dx2 + dy2*dy2 < 250) draggedM = pB_m;
                else draggedM = null;
            }
            if(draggedM && (e.buttons === 1 || e.touches)) {
                let coords = toCoords(cMid.width, cMid.height, cx - r.left, cy - r.top);
                draggedM.px = Math.round(coords.px * 2) / 2; draggedM.py = Math.round(coords.py * 2) / 2;
                drawMid();
                if(e.cancelable) e.preventDefault();
            }
        }
        cMid.addEventListener('mousedown', handleDragM); cMid.addEventListener('mousemove', handleDragM);
        cMid.addEventListener('touchmove', handleDragM, {passive: false}); cMid.addEventListener('touchstart', handleDragM, {passive: false});
        window.addEventListener('mouseup', () => draggedM = null); window.addEventListener('touchend', () => draggedM = null);
    }
    window.moveMidA = function(dx, dy) { pA_m.px += dx; pA_m.py += dy; drawMid(); };
    window.moveMidB = function(dx, dy) { pB_m.px += dx; pB_m.py += dy; drawMid(); };


    // 3. DISTANCE CANVAS
    const cDist = document.getElementById('distCanvas');
    let pA_d = { px: -5, py: -2 }, pB_d = { px: 3, py: 4 };
    let draggedD = null;
    function drawDist() {
        if(!cDist) return;
        const ctxD = cDist.getContext('2d');
        ctxD.clearRect(0,0,cDist.width, cDist.height);
        drawGrid(ctxD, cDist.width, cDist.height);
        
        let posA = toPixels(cDist.width, cDist.height, pA_d.px, pA_d.py);
        let posB = toPixels(cDist.width, cDist.height, pB_d.px, pB_d.py);
        let posC = toPixels(cDist.width, cDist.height, pB_d.px, pA_d.py);
        
        ctxD.strokeStyle = '#fbbf24'; ctxD.lineWidth = 3; ctxD.beginPath(); ctxD.moveTo(posA.x, posA.y); ctxD.lineTo(posB.x, posB.y); ctxD.stroke();
        ctxD.strokeStyle = 'rgba(255,255,255,0.4)'; ctxD.lineWidth = 2; ctxD.setLineDash([5,5]);
        ctxD.beginPath(); ctxD.moveTo(posA.x, posA.y); ctxD.lineTo(posC.x, posC.y); ctxD.lineTo(posB.x, posB.y); ctxD.stroke(); ctxD.setLineDash([]);

        ctxD.fillStyle = '#3b82f6'; ctxD.beginPath(); ctxD.arc(posA.x, posA.y, 8, 0, Math.PI*2); ctxD.fill();
        ctxD.fillStyle = '#ef4444'; ctxD.beginPath(); ctxD.arc(posB.x, posB.y, 8, 0, Math.PI*2); ctxD.fill();
        ctxD.fillStyle = 'rgba(255,255,255,0.5)'; ctxD.beginPath(); ctxD.arc(posC.x, posC.y, 4, 0, Math.PI*2); ctxD.fill();

        let dx = Math.abs(pB_d.px - pA_d.px), dy = Math.abs(pB_d.py - pA_d.py), d = Math.sqrt(dx*dx + dy*dy);
        document.getElementById('dist-dx').innerText = dx.toFixed(1);
        document.getElementById('dist-dy').innerText = dy.toFixed(1);
        document.getElementById('dist-val').innerText = d.toFixed(2);
    }
    if(cDist) {
        drawDist();
        function handleDragD(e) {
            const r = cDist.getBoundingClientRect();
            let cx = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);
            let cy = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
            if(!cx && !cy) return;
            if(e.type === 'mousedown' || e.type === 'touchstart') {
                let posA = toPixels(cDist.width, cDist.height, pA_d.px, pA_d.py);
                let posB = toPixels(cDist.width, cDist.height, pB_d.px, pB_d.py);
                let dx1 = cx - r.left - posA.x, dy1 = cy - r.top - posA.y;
                let dx2 = cx - r.left - posB.x, dy2 = cy - r.top - posB.y;
                if(dx1*dx1 + dy1*dy1 < 250) draggedD = pA_d;
                else if(dx2*dx2 + dy2*dy2 < 250) draggedD = pB_d;
                else draggedD = null;
            }
            if(draggedD && (e.buttons === 1 || e.touches)) {
                let coords = toCoords(cDist.width, cDist.height, cx - r.left, cy - r.top);
                draggedD.px = Math.round(coords.px * 2) / 2; draggedD.py = Math.round(coords.py * 2) / 2;
                drawDist();
                if(e.cancelable) e.preventDefault();
            }
        }
        cDist.addEventListener('mousedown', handleDragD); cDist.addEventListener('mousemove', handleDragD);
        cDist.addEventListener('touchmove', handleDragD, {passive: false}); cDist.addEventListener('touchstart', handleDragD, {passive: false});
        window.addEventListener('mouseup', () => draggedD = null); window.addEventListener('touchend', () => draggedD = null);
    }
    window.moveDistA = function(dx, dy) { pA_d.px += dx; pA_d.py += dy; drawDist(); };
    window.moveDistB = function(dx, dy) { pB_d.px += dx; pB_d.py += dy; drawDist(); };

    // 4. TRANSLATION CANVAS
    const cTrans = document.getElementById('transCanvas');
    let triangleBase = [ {px:-2, py:-1}, {px:-4, py:-4}, {px:-1, py:-5} ];
    let vx = 0, vy = 0;
    function drawTrans() {
        if(!cTrans) return;
        const ctxT = cTrans.getContext('2d');
        ctxT.clearRect(0,0,cTrans.width, cTrans.height);
        drawGrid(ctxT, cTrans.width, cTrans.height);

        function drawPoly(pts, color, fill, dashed=false) {
            ctxT.beginPath();
            let start = toPixels(cTrans.width, cTrans.height, pts[0].px, pts[0].py);
            ctxT.moveTo(start.x, start.y);
            for(let i=1; i<pts.length; i++) {
                let p = toPixels(cTrans.width, cTrans.height, pts[i].px, pts[i].py);
                ctxT.lineTo(p.x, p.y);
            }
            ctxT.closePath();
            ctxT.strokeStyle = color; ctxT.lineWidth = 2; 
            if(dashed) ctxT.setLineDash([5,5]); else ctxT.setLineDash([]);
            ctxT.stroke(); ctxT.fillStyle = fill; ctxT.fill();
        }

        drawPoly(triangleBase, 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', true);

        let translated = triangleBase.map(p => ({ px: p.px + vx, py: p.py + vy }));
        drawPoly(translated, '#3b82f6', 'rgba(59, 130, 246, 0.4)');
    }
    if(cTrans) drawTrans();

    window.updateTrans = function() {
        vx = parseInt(document.getElementById('vx-range').value);
        vy = parseInt(document.getElementById('vy-range').value);
        document.getElementById('vx-val').innerText = vx;
        document.getElementById('vy-val').innerText = vy;
        drawTrans();
    };

    // 5. ROTATION CANVAS
    const cRot = document.getElementById('rotCanvas');
    let rectBase = [ {px:2, py:1}, {px:5, py:1}, {px:5, py:3}, {px:2, py:3} ];
    let thetaGrad = 0;
    function drawRot() {
        if(!cRot) return;
        const ctxR = cRot.getContext('2d');
        ctxR.clearRect(0,0,cRot.width, cRot.height);
        drawGrid(ctxR, cRot.width, cRot.height);

        function drawPolyR(pts, color, fill, dashed=false) {
            ctxR.beginPath();
            let start = toPixels(cRot.width, cRot.height, pts[0].px, pts[0].py);
            ctxR.moveTo(start.x, start.y);
            for(let i=1; i<pts.length; i++) {
                let p = toPixels(cRot.width, cRot.height, pts[i].px, pts[i].py);
                ctxR.lineTo(p.x, p.y);
            }
            ctxR.closePath();
            ctxR.strokeStyle = color; ctxR.lineWidth = 2; 
            if(dashed) ctxR.setLineDash([5,5]); else ctxR.setLineDash([]);
            ctxR.stroke(); ctxR.fillStyle = fill; ctxR.fill();
        }

        drawPolyR(rectBase, 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', true);

        let rad = thetaGrad * Math.PI / 180;
        let rotated = rectBase.map(p => {
            let nX = p.px * Math.cos(rad) - p.py * Math.sin(rad);
            let nY = p.px * Math.sin(rad) + p.py * Math.cos(rad);
            return { px: nX, py: nY };
        });

        let origin = toPixels(cRot.width, cRot.height, 0, 0);
        let anchor = toPixels(cRot.width, cRot.height, rotated[0].px, rotated[0].py);
        ctxR.strokeStyle = '#fbbf24'; ctxR.lineWidth=1; ctxR.setLineDash([3,3]);
        ctxR.beginPath(); ctxR.moveTo(origin.x, origin.y); ctxR.lineTo(anchor.x, anchor.y); ctxR.stroke(); ctxR.setLineDash([]);

        drawPolyR(rotated, '#fbbf24', 'rgba(251, 191, 36, 0.4)');
    }
    if(cRot) drawRot();

    window.updateRot = function() {
        thetaGrad = parseInt(document.getElementById('rot-range').value);
        document.getElementById('rot-num').value = thetaGrad;
        drawRot();
    };
    window.updateRotNum = function() {
        let val = parseInt(document.getElementById('rot-num').value);
        if(isNaN(val)) val = 0;
        thetaGrad = val;
        document.getElementById('rot-range').value = thetaGrad;
        drawRot();
    };

    // 6. SYMMETRY CANVAS
    const cSym = document.getElementById('symCanvas');
    let currentSym = 'Y';
    let baseShape = [ {px:2, py:1}, {px:6, py:1}, {px:4, py:5} ];

    function drawSym() {
        if(!cSym) return;
        const ctxS = cSym.getContext('2d');
        ctxS.clearRect(0,0,cSym.width, cSym.height);
        drawGrid(ctxS, cSym.width, cSym.height);

        function drawPoly(pts, color, fill) {
            ctxS.beginPath();
            let start = toPixels(cSym.width, cSym.height, pts[0].px, pts[0].py);
            ctxS.moveTo(start.x, start.y);
            for(let i=1; i<pts.length; i++) {
                let p = toPixels(cSym.width, cSym.height, pts[i].px, pts[i].py);
                ctxS.lineTo(p.x, p.y);
            }
            ctxS.closePath();
            ctxS.strokeStyle = color; ctxS.lineWidth = 3; ctxS.stroke();
            ctxS.fillStyle = fill; ctxS.fill();
        }

        // Base Shape
        drawPoly(baseShape, '#3b82f6', 'rgba(59, 130, 246, 0.4)');

        let symShape = baseShape.map(p => {
            if(currentSym === 'Y') return {px: -p.px, py: p.py};
            if(currentSym === 'X') return {px: p.px, py: -p.py};
            return {px: -p.px, py: -p.py}; // Origin
        });

        // Reflected Shape
        drawPoly(symShape, '#ef4444', 'rgba(239, 68, 68, 0.4)');
    }
    if(cSym) drawSym();

    window.setSymmetry = function(type, btn) {
        currentSym = type;
        document.querySelectorAll('.btn-sym').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawSym();
    };

    // 7. MULTI-SHAPE CONTINUOUS ROTATION SYMMETRY LAB
    const cShapeSym = document.getElementById('shapeSymCanvas');
    let currentPoly = 'square';
    let polyRotGrad = 0;

    let polySquare = [ {px:-3, py:-3}, {px:3, py:-3}, {px:3, py:3}, {px:-3, py:3} ]; // Centered at origin
    let polyTriangle = [ {px:0, py:3.5}, {px:3.03, py:-1.75}, {px:-3.03, py:-1.75} ];
    
    function drawShapeSym() {
        if(!cShapeSym) return;
        const ctxSS = cShapeSym.getContext('2d');
        ctxSS.clearRect(0,0,cShapeSym.width, cShapeSym.height);
        drawGrid(ctxSS, cShapeSym.width, cShapeSym.height);

        let basePts = currentPoly === 'square' ? polySquare : polyTriangle;

        function drawShape(pts, color, fill, dashed=false) {
            ctxSS.beginPath();
            let start = toPixels(cShapeSym.width, cShapeSym.height, pts[0].px, pts[0].py);
            ctxSS.moveTo(start.x, start.y);
            for(let i=1; i<pts.length; i++) {
                let p = toPixels(cShapeSym.width, cShapeSym.height, pts[i].px, pts[i].py);
                ctxSS.lineTo(p.x, p.y);
            }
            ctxSS.closePath();
            ctxSS.strokeStyle = color; ctxSS.lineWidth = 3; 
            if(dashed) ctxSS.setLineDash([5,5]); else ctxSS.setLineDash([]);
            ctxSS.stroke(); ctxSS.fillStyle = fill; ctxSS.fill();
        }

        // Draw static base shape (ghost)
        drawShape(basePts, 'rgba(255,255,255,0.4)', 'transparent', true);

        // Rotation
        let rad = polyRotGrad * Math.PI / 180;
        let rotatedPts = basePts.map(p => {
            let nX = p.px * Math.cos(rad) - p.py * Math.sin(rad);
            let nY = p.px * Math.sin(rad) + p.py * Math.cos(rad);
            return { px: nX, py: nY };
        });

        // Highlight if symmetry is found
        let isSym = false;
        if(currentPoly === 'square' && polyRotGrad % 90 === 0 && polyRotGrad > 0) isSym = true;
        if(currentPoly === 'triangle' && polyRotGrad % 120 === 0 && polyRotGrad > 0) isSym = true;
        
        let statEl = document.getElementById('sym-status');
        if(isSym) {
            drawShape(rotatedPts, '#10b981', 'rgba(16, 185, 129, 0.4)');
            if(statEl) statEl.style.opacity = '1';
        } else {
            drawShape(rotatedPts, '#8B5CF6', 'rgba(139, 92, 246, 0.4)');
            if(statEl) statEl.style.opacity = '0';
        }
    }
    if(cShapeSym) drawShapeSym();

    window.updatePolyRot = function() {
        polyRotGrad = parseInt(document.getElementById('poly-rot-range').value);
        document.getElementById('poly-rot-num').value = polyRotGrad;
        drawShapeSym();
    };
    window.updatePolyRotNum = function() {
        let val = parseInt(document.getElementById('poly-rot-num').value);
        if(isNaN(val)) val = 0;
        polyRotGrad = val;
        document.getElementById('poly-rot-range').value = polyRotGrad;
        drawShapeSym();
    };

    window.setPolyObj = function(type, btn) {
        currentPoly = type;
        polyRotGrad = 0;
        document.getElementById('poly-rot-range').value = 0;
        document.getElementById('poly-rot-num').value = 0;
        if(document.getElementById('sym-status')) document.getElementById('sym-status').style.opacity = '0';
        
        let buttons = btn.parentElement.querySelectorAll('.btn-sym');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        drawShapeSym();
    };

    // 8. AMBULANCE MIRROR CANVAS
    const cAmb = document.getElementById('ambulanceCanvas');
    function drawAmbulance() {
        if(!cAmb) return;
        const ctx = cAmb.getContext('2d');
        const W = cAmb.width, H = cAmb.height;
        ctx.clearRect(0, 0, W, H);

        const text = (document.getElementById('mirror-input') || {}).value || 'AMBULANZA';
        const halfW = W / 2;
        const panelPad = 10;

        // --- Left Panel: "Scritta reale sull'ambulanza" (mirrored text, as printed on the vehicle) ---
        ctx.save();
        // Panel background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(panelPad, panelPad, halfW - panelPad * 2, H - panelPad * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelPad, panelPad, halfW - panelPad * 2, H - panelPad * 2);

        // Label
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCRITTA SULL\'AMBULANZA', halfW / 2, 30);

        // Mirrored text (as printed on the real ambulance)
        ctx.save();
        ctx.translate(halfW / 2, H / 2 + 5);
        ctx.scale(-1, 1);
        ctx.fillStyle = '#ef4444';
        ctx.font = '800 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Small ambulance icon cross
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(halfW / 2 - 10, H - 40, 20, 4);
        ctx.fillRect(halfW / 2 - 2, H - 48, 4, 20);

        ctx.restore();

        // --- Mirror divider ---
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(halfW, 5);
        ctx.lineTo(halfW, H - 5);
        ctx.stroke();
        ctx.setLineDash([]);

        // Mirror bar label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '600 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(halfW, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('🪞 SPECCHIO', 0, -8);
        ctx.restore();
        ctx.restore();

        // --- Right Panel: "Nello specchietto retrovisore" (normal, readable text) ---
        ctx.save();
        // Panel background - slight blue tint for "mirror"
        ctx.fillStyle = '#0c1425';
        ctx.fillRect(halfW + panelPad, panelPad, halfW - panelPad * 2, H - panelPad * 2);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(halfW + panelPad, panelPad, halfW - panelPad * 2, H - panelPad * 2);

        // Rounded mirror corners effect
        ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
        ctx.fillRect(halfW + panelPad + 2, panelPad + 2, halfW - panelPad * 2 - 4, H - panelPad * 2 - 4);

        // Label
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NELLO SPECCHIETTO RETROVISORE', halfW + halfW / 2, 30);

        // Normal text (as seen reflected in the rearview mirror)
        ctx.fillStyle = '#3b82f6';
        ctx.font = '800 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, halfW + halfW / 2, H / 2 + 5);

        // Checkmark
        ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillText('✓ Leggibile!', halfW + halfW / 2, H - 32);

        ctx.restore();
    }
    if(cAmb) drawAmbulance();
    window.drawAmbulance = drawAmbulance;

    // 9. GAUSS SHOELACE FORMULA CANVAS
    const cGauss = document.getElementById('gaussCanvas');
    let gaussPts = [ {px:-3,py:-2}, {px:4,py:-2}, {px:5,py:3}, {px:-1,py:4} ];
    let draggedGauss = null;

    function shoelaceArea(pts) {
        let sum = 0;
        for(let i = 0; i < pts.length; i++) {
            let j = (i+1) % pts.length;
            sum += pts[i].px * pts[j].py - pts[j].px * pts[i].py;
        }
        return Math.abs(sum) / 2;
    }

    function drawGauss() {
        if(!cGauss) return;
        const ctx = cGauss.getContext('2d');
        const W = cGauss.width, H = cGauss.height;
        ctx.clearRect(0,0,W,H);
        drawGrid(ctx, W, H);

        // Fill polygon
        ctx.beginPath();
        let first = toPixels(W, H, gaussPts[0].px, gaussPts[0].py);
        ctx.moveTo(first.x, first.y);
        for(let i=1; i<gaussPts.length; i++) {
            let p = toPixels(W, H, gaussPts[i].px, gaussPts[i].py);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw "shoelace" cross-lines (visual aid)
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        for(let i=0; i<gaussPts.length; i++) {
            let j = (i+1) % gaussPts.length;
            let pi = toPixels(W, H, gaussPts[i].px, gaussPts[i].py);
            let pj = toPixels(W, H, gaussPts[j].px, gaussPts[j].py);
            // x_i -> y_{i+1} diagonal
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
            ctx.beginPath(); ctx.moveTo(pi.x, pi.y); ctx.lineTo(pj.x, pj.y); ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw vertices
        const colors = ['#ef4444','#3b82f6','#10b981','#fbbf24','#ec4899'];
        for(let i=0; i<gaussPts.length; i++) {
            let p = toPixels(W, H, gaussPts[i].px, gaussPts[i].py);
            ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI*2);
            ctx.fillStyle = colors[i % colors.length]; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
            // Label
            ctx.fillStyle = '#fff'; ctx.font = '700 11px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(`P${i+1}(${gaussPts[i].px},${gaussPts[i].py})`, p.x, p.y - 14);
        }

        // Update displays
        let area = shoelaceArea(gaussPts);
        let areaEl = document.getElementById('gauss-area');
        let nEl = document.getElementById('gauss-n');
        if(areaEl) areaEl.textContent = area % 1 === 0 ? area.toFixed(0) : area.toFixed(1);
        if(nEl) nEl.textContent = gaussPts.length;
    }

    if(cGauss) {
        drawGauss();
        function handleDragGauss(e) {
            const r = cGauss.getBoundingClientRect();
            let ex = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);
            let ey = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
            if(!ex && !ey) return;
            let mx = (ex - r.left) * (cGauss.width / r.width);
            let my = (ey - r.top) * (cGauss.height / r.height);
            if(e.type === 'mousedown' || e.type === 'touchstart') {
                draggedGauss = null;
                for(let i=0; i<gaussPts.length; i++) {
                    let p = toPixels(cGauss.width, cGauss.height, gaussPts[i].px, gaussPts[i].py);
                    if((mx-p.x)**2 + (my-p.y)**2 < 400) { draggedGauss = i; break; }
                }
            }
            if(draggedGauss !== null && (e.buttons === 1 || e.touches)) {
                let c = toCoords(cGauss.width, cGauss.height, mx, my);
                gaussPts[draggedGauss].px = Math.round(c.px);
                gaussPts[draggedGauss].py = Math.round(c.py);
                drawGauss();
                if(e.cancelable) e.preventDefault();
            }
        }
        cGauss.addEventListener('mousedown', handleDragGauss); cGauss.addEventListener('mousemove', handleDragGauss);
        cGauss.addEventListener('touchstart', handleDragGauss, {passive:false}); cGauss.addEventListener('touchmove', handleDragGauss, {passive:false});
        window.addEventListener('mouseup', () => draggedGauss = null); window.addEventListener('touchend', () => draggedGauss = null);
    }

    window.setGaussShape = function(type) {
        if(type === 'triangle') gaussPts = [{px:-4,py:-3},{px:5,py:-2},{px:1,py:4}];
        else if(type === 'quad') gaussPts = [{px:-3,py:-2},{px:4,py:-2},{px:5,py:3},{px:-1,py:4}];
        else gaussPts = [{px:0,py:5},{px:5,py:2},{px:3,py:-4},{px:-3,py:-4},{px:-5,py:2}];
        document.querySelectorAll('#gauss-btn-tri,#gauss-btn-quad,#gauss-btn-penta').forEach(b => b.classList.remove('active'));
        let id = type === 'triangle' ? 'gauss-btn-tri' : type === 'quad' ? 'gauss-btn-quad' : 'gauss-btn-penta';
        document.getElementById(id).classList.add('active');
        drawGauss();
    };

    // 10. PICK'S THEOREM CANVAS
    const cPick = document.getElementById('pickCanvas');
    let pickPts = [{px:1,py:1},{px:7,py:1},{px:8,py:5},{px:2,py:6}];
    let draggedPick = null;

    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while(b){let t=b;b=a%b;a=t;} return a; }

    function countBoundary(pts) {
        let B = 0;
        for(let i = 0; i < pts.length; i++) {
            let j = (i+1) % pts.length;
            let dx = Math.abs(pts[j].px - pts[i].px);
            let dy = Math.abs(pts[j].py - pts[i].py);
            B += gcd(dx, dy);
        }
        return B;
    }

    function pointInPolygon(px, py, poly) {
        let inside = false;
        for(let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            let xi = poly[i].px, yi = poly[i].py;
            let xj = poly[j].px, yj = poly[j].py;
            if((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
                inside = !inside;
            }
        }
        return inside;
    }

    function pointOnSegment(px, py, x1, y1, x2, y2) {
        // Check if (px,py) is on segment (x1,y1)-(x2,y2)
        let cross = (px - x1) * (y2 - y1) - (py - y1) * (x2 - x1);
        if(Math.abs(cross) > 1e-9) return false;
        return Math.min(x1,x2) <= px && px <= Math.max(x1,x2) && Math.min(y1,y2) <= py && py <= Math.max(y1,y2);
    }

    function isOnBoundary(px, py, poly) {
        for(let i = 0; i < poly.length; i++) {
            let j = (i+1) % poly.length;
            if(pointOnSegment(px, py, poly[i].px, poly[i].py, poly[j].px, poly[j].py)) return true;
        }
        return false;
    }

    function drawPick() {
        if(!cPick) return;
        const ctx = cPick.getContext('2d');
        const W = cPick.width, H = cPick.height;
        ctx.clearRect(0,0,W,H);
        drawGrid(ctx, W, H);

        // Fill polygon
        ctx.beginPath();
        let first = toPixels(W, H, pickPts[0].px, pickPts[0].py);
        ctx.moveTo(first.x, first.y);
        for(let i=1; i<pickPts.length; i++) {
            let p = toPixels(W, H, pickPts[i].px, pickPts[i].py);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Find bounding box for lattice points
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pickPts.forEach(p => { minX = Math.min(minX, p.px); maxX = Math.max(maxX, p.px); minY = Math.min(minY, p.py); maxY = Math.max(maxY, p.py); });
        minX = Math.floor(minX) - 1; maxX = Math.ceil(maxX) + 1;
        minY = Math.floor(minY) - 1; maxY = Math.ceil(maxY) + 1;

        let I = 0, B = 0;
        // Draw and classify lattice points
        for(let x = minX; x <= maxX; x++) {
            for(let y = minY; y <= maxY; y++) {
                let onB = isOnBoundary(x, y, pickPts);
                let inP = !onB && pointInPolygon(x, y, pickPts);
                if(onB || inP) {
                    let pp = toPixels(W, H, x, y);
                    ctx.beginPath(); ctx.arc(pp.x, pp.y, onB ? 4.5 : 4, 0, Math.PI*2);
                    if(onB) { ctx.fillStyle = '#fbbf24'; B++; }
                    else { ctx.fillStyle = '#3b82f6'; I++; }
                    ctx.fill();
                }
            }
        }

        // Draw polygon vertices on top
        for(let i=0; i<pickPts.length; i++) {
            let p = toPixels(W, H, pickPts[i].px, pickPts[i].py);
            ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI*2);
            ctx.fillStyle = '#10b981'; ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        }

        let area = I + B / 2 - 1;
        let iEl = document.getElementById('pick-i');
        let bEl = document.getElementById('pick-b');
        let aEl = document.getElementById('pick-area');
        if(iEl) iEl.textContent = I;
        if(bEl) bEl.textContent = B;
        if(aEl) aEl.textContent = area % 1 === 0 ? area.toFixed(0) : area.toFixed(1);
    }

    if(cPick) {
        drawPick();
        function handleDragPick(e) {
            const r = cPick.getBoundingClientRect();
            let ex = e.clientX || (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);
            let ey = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
            if(!ex && !ey) return;
            let mx = (ex - r.left) * (cPick.width / r.width);
            let my = (ey - r.top) * (cPick.height / r.height);
            if(e.type === 'mousedown' || e.type === 'touchstart') {
                draggedPick = null;
                for(let i=0; i<pickPts.length; i++) {
                    let p = toPixels(cPick.width, cPick.height, pickPts[i].px, pickPts[i].py);
                    if((mx-p.x)**2 + (my-p.y)**2 < 400) { draggedPick = i; break; }
                }
            }
            if(draggedPick !== null && (e.buttons === 1 || e.touches)) {
                let c = toCoords(cPick.width, cPick.height, mx, my);
                pickPts[draggedPick].px = Math.round(c.px);
                pickPts[draggedPick].py = Math.round(c.py);
                drawPick();
                if(e.cancelable) e.preventDefault();
            }
        }
        cPick.addEventListener('mousedown', handleDragPick); cPick.addEventListener('mousemove', handleDragPick);
        cPick.addEventListener('touchstart', handleDragPick, {passive:false}); cPick.addEventListener('touchmove', handleDragPick, {passive:false});
        window.addEventListener('mouseup', () => draggedPick = null); window.addEventListener('touchend', () => draggedPick = null);
    }

    // QUIZ
    const quizData = [
        { question: "1. Come si trova il Punto Medio di un segmento AB?", options: ["Sommando le x e sottraendo le y", "Calcolando la radice quadrata tra x e y", "Facendo la media aritmetica delle coordinate x e y", "Dividendo la distanza per 3"], correct: 2 },
        { question: "2. Cosa si utilizza per calcolare la Distanza tra due punti nel piano?", options: ["Il Teorema di Pitagora, usando le differenze delle coordinate come cateti", "Il Teorema di Talete", "Le regole del cerchio"], correct: 0 },
        { question: "3. Cosa significa matematicamente applicare una trasformazione di Simmetria Assiale (Riflessione) sull'asse delle Y?", options: ["Capovolgere Y: (x, -y)", "Capovolgere X: (-x, y)", "Invertire X e Y: (y, x)"], correct: 1 },
        { question: "4. Sul piano, le coordinate P(0, 5) indicano che...", options: ["Il punto giace sull'asse Y", "Il punto giace sull'asse X", "Il punto coincide con l'Origine", "Il punto è nel terzo quadrante"], correct: 0 },
        { question: "5. Una Traslazione è un movimento che fa...", options: ["Girare la figura su se stessa", "Rimpicciolire o ingrandire la figura", "Specchiare la figura", "Scivolare rigidamente la figura senza inclinarla"], correct: 3 },
        { question: "6. A quanti gradi minimi si verifica una simmetria rotazionale di un triangolo equilatero?", options: ["60°", "90°", "120°", "180°"], correct: 2 }
    ];

    const quizArea = document.getElementById('quiz-area');
    let currentScore = 0; let questionsAnswered = 0;
    if (quizArea) {
        quizData.forEach((q, qIndex) => {
            const qDiv = document.createElement('div'); qDiv.className = 'quiz-question';
            const qTitle = document.createElement('h3'); qTitle.textContent = q.question; qDiv.appendChild(qTitle);
            const optionsDiv = document.createElement('div'); optionsDiv.className = 'quiz-options';

            q.options.forEach((optText, optIndex) => {
                const btn = document.createElement('button'); btn.className = 'quiz-btn'; btn.textContent = optText;
                btn.onclick = () => {
                    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
                    if (optIndex === q.correct) {
                        btn.classList.add('correct');
                        optionsDiv.querySelectorAll('.quiz-btn').forEach(b => { b.disabled = true; b.style.cursor='default'; });
                        if (!optionsDiv.querySelector('.wrong')) currentScore++;
                        questionsAnswered++;
                        if (questionsAnswered === quizData.length) {
                            const scoreEl = document.getElementById('quiz-score');
                            scoreEl.textContent = `Punteggio: ${currentScore} / ${quizData.length}. ` + (currentScore===quizData.length?"Bravissimo, coordinate perfette!":"Buono, ma puoi migliorare.");
                            scoreEl.style.color = currentScore===quizData.length?"#10B981":"#F59E0B";
                        }
                    } else { btn.classList.add('wrong'); btn.innerHTML += " <strong>✗ Riprova!</strong>"; btn.disabled = true; }
                };
                optionsDiv.appendChild(btn);
            });
            qDiv.appendChild(optionsDiv); quizArea.appendChild(qDiv);
        });
    }
});
