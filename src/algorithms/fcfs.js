// src/algorithms/fcfs.js

export function generateFCFSSteps(processes) {
  const steps = [];
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;

  for (let proc of sorted) {
    if (time < proc.arrivalTime) {
      // CPU is idle until process arrives
      while (time < proc.arrivalTime) {
        steps.push({
          time,
          runningPID: null,
          arrivalPIDs: [],
        });
        time++;
      }
    }
    // Process starts running
    for (let i = 0; i < proc.burstTime; i++) {
      steps.push({
        time,
        runningPID: proc.pid,
        arrivalPIDs: [],
      });
      time++;
    }
  }
  return steps;
}
