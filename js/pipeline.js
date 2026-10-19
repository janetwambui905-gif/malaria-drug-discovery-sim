// Simulated pipeline steps, progress updates, and run console.
function addLog(message, kind = "normal") {
  const log = document.getElementById("runLog");
  const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const color = kind === "success" ? "text-teal-300" : kind === "active" ? "text-blue-300" : "text-slate-400";
  const row = document.createElement("div");
  row.innerHTML = `<span class="text-slate-700">[${time}]</span> <span class="${color}">${message}</span>`;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function runPipeline() {
  if (activeRun) return;
  activeRun = true;
  const runButton = document.getElementById("runPipeline");
  runButton.disabled = true;
  runButton.classList.add("cursor-not-allowed", "opacity-60");
  document.getElementById("pipelineState").textContent = "SIMULATION RUNNING";
  document.getElementById("pipelineState").className = "text-[10px] font-semibold text-teal-300";
  document.getElementById("consoleStatus").textContent = "RUNNING";
  document.getElementById("consoleStatus").className = "mono text-[9px] text-teal-300";
  const cards = [...document.querySelectorAll(".pipeline-card")];
  cards.forEach(card => card.classList.remove("active", "complete"));
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("progressLabel").textContent = "0%";
  addLog("Starting simulated resistance-aware discovery workflow.", "active");
  try {
    for (let i = 0; i < pipelineMessages.length; i++) {
      cards.forEach((card, index) => {
        card.classList.toggle("active", index === i);
        if (index < i) card.classList.add("complete");
      });
      const [title, detail] = pipelineMessages[i];
      document.getElementById("pipelineState").textContent = `STEP ${String(i + 1).padStart(2, "0")} / 07`;
      addLog(title + "…", "active");
      await wait(720);
      addLog(detail, "normal");
      const progress = Math.round(((i + 1) / pipelineMessages.length) * 100);
      document.getElementById("progressBar").style.width = `${progress}%`;
      document.getElementById("progressLabel").textContent = `${progress}%`;
      cards[i].classList.remove("active");
      cards[i].classList.add("complete");
      await wait(180);
    }
    document.getElementById("pipelineState").textContent = "SIMULATION COMPLETE";
    document.getElementById("pipelineState").className = "text-[10px] font-semibold text-teal-300";
    document.getElementById("consoleStatus").textContent = "COMPLETE";
    addLog("Workflow complete. Demo metrics and candidate shortlist are ready for exploration.", "success");
    document.getElementById("statScreened").textContent = "1,248";
    document.getElementById("statHits").textContent = "12";
    document.getElementById("statEnergy").textContent = "−8.4";
    document.getElementById("statAdmet").textContent = "68%";
  } finally {
    activeRun = false;
    runButton.disabled = false;
    runButton.classList.remove("cursor-not-allowed", "opacity-60");
  }
}
