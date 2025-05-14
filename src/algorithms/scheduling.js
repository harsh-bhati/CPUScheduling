// Helper function to sort processes by arrival time
const sortByArrivalTime = (processes) => {
  return [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
};

// Helper function to sort processes by burst time
const sortByBurstTime = (processes) => {
  return [...processes].sort((a, b) => a.burstTime - b.burstTime);
};

// Helper function to sort processes by priority (lower number = higher priority)
const sortByPriority = (processes) => {
  return [...processes].sort((a, b) => a.priority - b.priority);
};

// First Come First Serve (FCFS)
export const generateFCFSSteps = (processes) => {
  const sortedProcesses = sortByArrivalTime(processes);
  const steps = [];
  let currentTime = 0;

  for (const process of sortedProcesses) {
    // Handle idle time if there's a gap between processes
    while (currentTime < process.arrivalTime) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
    }

    // Process execution
    for (let i = 0; i < process.burstTime; i++) {
      steps.push({
        time: currentTime,
        runningPID: process.pid,
        arrivalPIDs: []
      });
      currentTime++;
    }
  }

  return steps;
};

// Shortest Job First (SJF)
export const generateSJFSteps = (processes) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();

  while (completedProcesses.size < processes.length) {
    // Find available processes at current time
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      // No process available, increment time
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    // Sort available processes by remaining time
    const nextProcess = availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];

    // Execute process
    steps.push({
      time: currentTime,
      runningPID: nextProcess.pid,
      arrivalPIDs: []
    });

    nextProcess.remainingTime--;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
};

// Shortest Remaining Time First (SRTF)
export const generateSRTFSteps = (processes) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();

  while (completedProcesses.size < processes.length) {
    // Find available processes at current time
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    // Sort by remaining time
    const nextProcess = availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];

    // Check for new arrivals
    const newArrivals = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime === currentTime
    );

    steps.push({
      time: currentTime,
      runningPID: nextProcess.pid,
      arrivalPIDs: newArrivals.map(p => p.pid)
    });

    nextProcess.remainingTime--;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
};

// Longest Remaining Time First (LRTF)
export const generateLRTFSteps = (processes) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => b.remainingTime - a.remainingTime)[0];
    const newArrivals = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime === currentTime
    );

    steps.push({
      time: currentTime,
      runningPID: nextProcess.pid,
      arrivalPIDs: newArrivals.map(p => p.pid)
    });

    nextProcess.remainingTime--;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
};

// Round Robin (RR)
export const generateRRSteps = (processes, timeQuantum) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let readyQueue = [];

  while (completedProcesses.size < processes.length) {
    // Add newly arrived processes to ready queue
    const newArrivals = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && 
           !readyQueue.some(q => q.pid === p.pid) && 
           p.arrivalTime <= currentTime
    );
    readyQueue.push(...newArrivals);

    if (readyQueue.length === 0) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    const currentProcess = readyQueue.shift();
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);

    for (let i = 0; i < executionTime; i++) {
      steps.push({
        time: currentTime,
        runningPID: currentProcess.pid,
        arrivalPIDs: []
      });
      currentTime++;
    }

    currentProcess.remainingTime -= executionTime;

    // Add newly arrived processes during execution
    const arrivalsDuringExecution = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && 
           !readyQueue.some(q => q.pid === p.pid) && 
           p.arrivalTime < currentTime
    );
    readyQueue.push(...arrivalsDuringExecution);

    if (currentProcess.remainingTime > 0) {
      readyQueue.push(currentProcess);
    } else {
      completedProcesses.add(currentProcess.pid);
    }
  }

  return steps;
};

// Priority Scheduling (Non-preemptive)
export const generatePrioritySteps = (processes) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.priority - b.priority)[0];

    for (let i = 0; i < nextProcess.remainingTime; i++) {
      steps.push({
        time: currentTime,
        runningPID: nextProcess.pid,
        arrivalPIDs: []
      });
      currentTime++;
    }

    completedProcesses.add(nextProcess.pid);
  }

  return steps;
};

// Priority Scheduling (Preemptive)
export const generatePreemptivePrioritySteps = (processes) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push({
        time: currentTime,
        runningPID: null,
        arrivalPIDs: []
      });
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.priority - b.priority)[0];
    const newArrivals = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime === currentTime
    );

    steps.push({
      time: currentTime,
      runningPID: nextProcess.pid,
      arrivalPIDs: newArrivals.map(p => p.pid)
    });

    nextProcess.remainingTime--;
    currentTime++;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
}; 