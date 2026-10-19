// Candidate selection and canvas-based 2D / pocket drawings.
function candidateById(id) { return candidates.find(candidate => candidate.id === id); }
function renderCandidateTable() {
  const table = document.getElementById("candidateTable");
  table.innerHTML = candidates.map(candidate => `
    <tr class="candidate-row ${candidate.id === selectedId ? "selected" : ""}" data-candidate="${candidate.id}" tabindex="0" aria-selected="${candidate.id === selectedId}">
      <td class="px-3 py-3"><div class="flex items-center gap-2"><span class="h-2 w-2 shrink-0 rounded-full" style="background:${candidate.color}"></span><div><div class="whitespace-nowrap font-bold text-slate-200">${candidate.name}</div><div class="mt-0.5 text-[8px] font-bold tracking-wider text-slate-500">${candidate.tag}</div></div></div></td>
      <td class="px-3 py-3 mono text-slate-300">${candidate.wt.toFixed(1)}</td>
      <td class="px-3 py-3 mono ${candidate.tolerance >= 88 ? "text-teal-200" : "text-slate-300"}">${candidate.mutant.toFixed(1)}</td>
      <td class="px-3 py-3"><div class="flex items-center gap-2"><div class="h-1 w-12 overflow-hidden rounded-full bg-slate-800"><div class="h-full rounded-full" style="width:${candidate.tolerance}%;background:${candidate.color}"></div></div><span class="mono text-slate-300">${candidate.tolerance}%</span></div></td>
      <td class="px-3 py-3"><span class="rounded px-1.5 py-1 ${candidate.violations === 0 ? "bg-emerald-400/[.08] text-emerald-300" : "bg-amber-400/[.08] text-amber-300"}">${candidate.violations}</span></td>
      <td class="px-3 py-3 mono text-slate-400">${candidate.mw.toFixed(1)}</td>
    </tr>`).join("");
  table.querySelectorAll("[data-candidate]").forEach(row => {
    row.addEventListener("click", () => selectCandidate(row.dataset.candidate));
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCandidate(row.dataset.candidate);
      }
    });
  });
}

function selectCandidate(id) {
  const candidate = candidateById(id);
  if (!candidate) return;
  selectedId = id;
  renderCandidateTable();
  document.getElementById("smiles").textContent = candidate.smiles;
  document.getElementById("selectedBadge").textContent = candidate.name.toUpperCase();
  document.getElementById("structureCaption").textContent = `${candidate.name} · 2D schematic`;
  drawMolecule(candidate);
  drawPocket(candidate);
  updateAdmet(candidate);
}

function fitCanvas(canvas, height) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height };
}

function drawMolecule(candidate) {
  const canvas = document.getElementById("moleculeCanvas");
  const { ctx, width, height } = fitCanvas(canvas, 212);
  ctx.clearRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2 + 1;
  const bond = "#8998a9";
  const nitrogen = "#a78bfa";
  const oxygen = "#fb7185";
  const carbon = "#9fc4e6";
  const size = Math.min(1, width / 480);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(size, size);
  const drawHex = (cx, cy, radius, rotation, labels) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i + rotation;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    ctx.strokeStyle = bond;
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
    ctx.stroke();
    [[0, 2], [3, 5]].forEach(([a, b]) => {
      const p1 = points[a], p2 = points[b];
      const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
      const ix = (cx - mx) * .08, iy = (cy - my) * .08;
      ctx.beginPath(); ctx.moveTo(p1[0] + ix, p1[1] + iy); ctx.lineTo(p2[0] + ix, p2[1] + iy); ctx.stroke();
    });
    labels.forEach(([index, text, color]) => {
      const [x, y] = points[index];
      ctx.fillStyle = "#0c1520";
      ctx.fillRect(x - 11, y - 9, 22, 18);
      ctx.font = "500 12px 'DM Mono'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    });
  };
  const line = (x1, y1, x2, y2, color = bond, widthLine = 2) => {
    ctx.strokeStyle = color; ctx.lineWidth = widthLine; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };
  drawHex(-84, 0, 37, -Math.PI / 6, [[1, "N", nitrogen], [3, "N", nitrogen], [5, "N", nitrogen]]);
  drawHex(2, 0, 37, -Math.PI / 6, [[2, "N", nitrogen], [4, "N", nitrogen]]);
  line(-47, 0, -35, 0);
  line(39, 0, 72, 0);
  drawHex(108, 0, 37, -Math.PI / 6, candidate.id === "cadd12" ? [[2, "O", oxygen]] : [[2, "N", nitrogen]]);
  line(-121, -18, -154, -39);
  line(-121, 18, -154, 39);
  line(145, 0, 174, 0);
  ctx.font = "500 12px 'DM Mono'";
  ctx.fillStyle = candidate.id === "cadd04" ? oxygen : "#b7c6d6";
  ctx.textAlign = "left";
  ctx.fillText(candidate.id === "cadd04" ? "OCH₃" : candidate.id === "pyrimethamine" ? "Cl" : "R", 176, 4);
  ctx.fillStyle = carbon; ctx.fillText("NH₂", -190, -39);
  ctx.fillStyle = candidate.id === "cadd12" ? oxygen : nitrogen; ctx.fillText(candidate.id === "cadd12" ? "OH" : "NH", -190, 44);
  ctx.fillStyle = "#62768a";
  ctx.font = "10px 'DM Mono'";
  ctx.textAlign = "center";
  ctx.fillText(`SCHEMATIC SCAFFOLD · ${candidate.atomCount} HEAVY ATOMS`, 0, 82);
  ctx.restore();
}

function drawPocket(candidate) {
  const canvas = document.getElementById("pocketCanvas");
  const { ctx, width, height } = fitCanvas(canvas, 240);
  ctx.clearRect(0, 0, width, height);
  const sx = width / 620, sy = height / 300, scale = Math.min(sx, sy);
  ctx.save();
  ctx.translate((width - 620 * scale) / 2, (height - 300 * scale) / 2);
  ctx.scale(scale, scale);
  const gradient = ctx.createRadialGradient(308, 153, 22, 310, 150, 200);
  gradient.addColorStop(0, "rgba(45, 88, 100, .24)");
  gradient.addColorStop(1, "rgba(10, 19, 29, 0)");
  ctx.fillStyle = gradient; ctx.fillRect(65, 8, 490, 280);
  ctx.strokeStyle = "rgba(94, 234, 212, .14)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(310, 155, 198, 110, -.08, .1, Math.PI * 1.86); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(310, 155, 173, 86, .11, Math.PI * 1.05, Math.PI * 2.02); ctx.stroke();
  const gridPoints = [];
  for (let i = 0; i < 48; i++) {
    const angle = i * 2.399;
    const radius = 35 + (i % 9) * 14;
    const x = 310 + Math.cos(angle) * radius * 1.35;
    const y = 150 + Math.sin(angle) * radius * .64;
    gridPoints.push([x, y]);
  }
  ctx.fillStyle = "rgba(124, 167, 184, .28)";
  gridPoints.forEach(([x, y], i) => {
    if (i % 3 === 0) {
      ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  });
  ctx.strokeStyle = "rgba(94, 234, 212, .19)";
  [[208, 132, 260, 142], [260, 142, 314, 126], [314, 126, 370, 143], [236, 178, 286, 164], [286, 164, 337, 177], [337, 177, 389, 157], [260, 142, 286, 164], [314, 126, 337, 177], [370, 143, 389, 157]].forEach(([x1,y1,x2,y2]) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
  const ligandColor = candidate.color;
  ctx.strokeStyle = ligandColor; ctx.lineWidth = 4; ctx.lineCap = "round";
  const ligandPoints = [[254,155],[280,136],[309,146],[333,126],[361,139],[378,166],[350,182],[321,168],[294,184],[270,174]];
  ctx.beginPath(); ligandPoints.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); ctx.stroke();
  ligandPoints.forEach(([x,y], i) => {
    ctx.fillStyle = i % 3 === 0 ? "#b9a1ff" : ligandColor;
    ctx.beginPath(); ctx.arc(x, y, i % 3 === 0 ? 4 : 3, 0, Math.PI * 2); ctx.fill();
  });
  ctx.font = "11px 'DM Mono'";
  const hotspots = [
    { name: "S108N", x: 197, y: 104, color: "#fb7185", ax: 235, ay: 139 },
    { name: "C59R", x: 414, y: 102, color: "#fda4af", ax: 370, ay: 140 },
    { name: "I164L", x: 425, y: 210, color: "#fb7185", ax: 379, ay: 172 }
  ];
  hotspots.forEach(h => {
    if (!hotspotState[h.name]) return;
    ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(251, 113, 133, .45)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(h.ax, h.ay); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(251, 113, 133, .1)"; ctx.beginPath(); ctx.arc(h.x, h.y, 22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(251, 113, 133, .4)"; ctx.beginPath(); ctx.arc(h.x, h.y, 22, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = h.color; ctx.beginPath(); ctx.arc(h.x, h.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fda4af"; ctx.textAlign = "center"; ctx.fillText(h.name, h.x, h.y - 30);
  });
  ctx.fillStyle = "#7f94a9"; ctx.textAlign = "left"; ctx.font = "10px 'DM Mono'";
  ctx.fillText("BINDING SITE GRID", 32, 27);
  ctx.fillStyle = ligandColor; ctx.fillText(candidate.name.toUpperCase(), 32, 45);
  ctx.restore();
}
