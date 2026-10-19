// Chart.js setup and selected-candidate ADMET updates.
const chartText = "#8293a6";
const chartGrid = "rgba(148, 163, 184, .11)";
function createCharts() {
  const bindingCtx = document.getElementById("bindingChart").getContext("2d");
  bindingChart = new Chart(bindingCtx, {
    type: "bar",
    data: {
      labels: candidates.map(candidate => candidate.name.replace("Candidate ", "")),
      datasets: [
        { label: "Wild type", data: candidates.map(candidate => candidate.wt), backgroundColor: "rgba(96, 165, 250, .75)", borderRadius: 4, maxBarThickness: 22 },
        { label: "Double mutant", data: candidates.map(candidate => candidate.mutant), backgroundColor: "rgba(94, 234, 212, .75)", borderRadius: 4, maxBarThickness: 22 },
        { label: "Triple mutant", data: [-4.7, -7.2, -8.0, -7.5, -6.8], backgroundColor: "rgba(192, 132, 252, .72)", borderRadius: 4, maxBarThickness: 22 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { color: chartText, usePointStyle: true, pointStyle: "circle", boxWidth: 7, boxHeight: 7, padding: 16, font: { size: 9, family: "Manrope" } } }, tooltip: { backgroundColor: "#101824", borderColor: "#293849", borderWidth: 1, titleColor: "#e5edf5", bodyColor: "#a8b7c7", callbacks: { label: context => ` ${context.dataset.label}: ${context.raw.toFixed(1)} kcal/mol` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: chartText, maxRotation: 0, minRotation: 0, font: { size: 9 } }, border: { display: false } },
        y: { min: -10, max: -3, ticks: { stepSize: 2, color: chartText, font: { size: 9 }, callback: value => `${value}` }, grid: { color: chartGrid }, border: { display: false } }
      }
    }
  });
  const admetCtx = document.getElementById("admetChart").getContext("2d");
  admetChart = new Chart(admetCtx, {
    type: "radar",
    data: { labels: ["Solubility", "Low toxicity", "Absorption", "Lipophilicity", "Metabolic stability"], datasets: [{ label: "Pyrimethamine", data: [74, 70, 78, 65, 72], fill: true, backgroundColor: "rgba(94, 234, 212, .14)", borderColor: "#5eead4", pointBackgroundColor: "#5eead4", pointBorderColor: "#0b121c", pointRadius: 3, borderWidth: 2 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "#101824", borderColor: "#293849", borderWidth: 1, titleColor: "#e5edf5", bodyColor: "#a8b7c7", callbacks: { label: context => ` Score: ${context.raw}/100` } } },
      scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 20 }, grid: { color: chartGrid }, angleLines: { color: chartGrid }, pointLabels: { color: chartText, font: { size: 9, family: "Manrope" } } } }
    }
  });
}
function updateAdmet(candidate) {
  admetChart.data.datasets[0].label = candidate.name;
  admetChart.data.datasets[0].data = [...candidate.admet, Math.min(96, Math.round((candidate.tolerance + candidate.admet[1]) / 2))];
  admetChart.data.datasets[0].borderColor = candidate.color;
  admetChart.data.datasets[0].pointBackgroundColor = candidate.color;
  admetChart.data.datasets[0].backgroundColor = `${candidate.color}25`;
  admetChart.update();
}
