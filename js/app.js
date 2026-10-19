// UI event handlers and initial dashboard setup.
document.getElementById("runPipeline").addEventListener("click", runPipeline);
document.getElementById("headerRun").addEventListener("click", runPipeline);
document.querySelectorAll("[data-hotspot]").forEach(button => button.addEventListener("click", () => {
  const name = button.dataset.hotspot;
  hotspotState[name] = !hotspotState[name];
  button.classList.toggle("active", hotspotState[name]);
  drawPocket(candidateById(selectedId));
}));
renderCandidateTable();
createCharts();
selectCandidate(selectedId);
lucide.createIcons();
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawMolecule(candidateById(selectedId));
    drawPocket(candidateById(selectedId));
    bindingChart.resize();
    admetChart.resize();
  }, 100);
});
