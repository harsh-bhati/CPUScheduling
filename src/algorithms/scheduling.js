/**
 * This file contains implementations of various CPU scheduling algorithms.
 * Each algorithm takes a list of processes and returns a sequence of steps
 * representing the execution order over time.
 * 
 * Process format: { pid: number, arrivalTime: number, burstTime: number, priority?: number }
 * Step format: 'p{pid}' for process execution, 'idle' for CPU idle time, 'cs' for context switch
 */

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

/**
 * First Come First Serve (FCFS) Algorithm
 * Processes are executed in order of their arrival time
 * Non-preemptive algorithm
 */
export const generateFCFSSteps = (processes, contextSwitchTime = 1) => {
  const sortedProcesses = sortByArrivalTime(processes);
  const steps = [];
  let currentTime = 0;
  let lastProcessId = null;

  for (const process of sortedProcesses) {
    // Handle idle time if there's a gap between processes
    while (currentTime < process.arrivalTime) {
      steps.push('idle');
      currentTime++;
    }

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== process.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    // Process execution
    for (let i = 0; i < process.burstTime; i++) {
      steps.push(`p${process.pid}`);
      currentTime++;
    }

    lastProcessId = process.pid;
  }

  return steps;
};

/**
 * Shortest Job First (SJF) Algorithm
 * Processes with shortest burst time are executed first
 * Non-preemptive algorithm
 */
export const generateSJFSteps = (processes, contextSwitchTime = 1) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let lastProcessId = null;

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push('idle');
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== nextProcess.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    steps.push(`p${nextProcess.pid}`);
    nextProcess.remainingTime--;
    currentTime++;
    lastProcessId = nextProcess.pid;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
};

/**
 * Shortest Remaining Time First (SRTF) Algorithm
 * Processes with shortest remaining time are executed first
 * Preemptive algorithm
 */
export const generateSRTFSteps = (processes, contextSwitchTime = 1) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let lastProcessId = null;

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push('idle');
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime)[0];

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== nextProcess.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    steps.push(`p${nextProcess.pid}`);
    nextProcess.remainingTime--;
    currentTime++;
    lastProcessId = nextProcess.pid;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
};

/**
 * Round Robin (RR) Algorithm
 * Each process gets a fixed time quantum to execute
 * Preemptive algorithm
 */
export const generateRRSteps = (processes, timeQuantum, contextSwitchTime = 1) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let readyQueue = [];
  let lastProcessId = null;

  while (completedProcesses.size < processes.length) {
    const newArrivals = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && 
           !readyQueue.some(q => q.pid === p.pid) && 
           p.arrivalTime <= currentTime
    );
    readyQueue.push(...newArrivals);

    if (readyQueue.length === 0) {
      steps.push('idle');
      currentTime++;
      continue;
    }

    const currentProcess = readyQueue.shift();

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== currentProcess.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);

    for (let i = 0; i < executionTime; i++) {
      steps.push(`p${currentProcess.pid}`);
      currentTime++;
    }

    currentProcess.remainingTime -= executionTime;
    lastProcessId = currentProcess.pid;

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

/**
 * Priority Scheduling (Non-preemptive) Algorithm
 * Processes with higher priority (lower number) are executed first
 * Non-preemptive algorithm
 */
export const generatePrioritySteps = (processes, contextSwitchTime = 1) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let lastProcessId = null;

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push('idle');
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.priority - b.priority)[0];

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== nextProcess.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    for (let i = 0; i < nextProcess.remainingTime; i++) {
      steps.push(`p${nextProcess.pid}`);
      currentTime++;
    }

    lastProcessId = nextProcess.pid;
    completedProcesses.add(nextProcess.pid);
  }

  return steps;
};

/**
 * Priority Scheduling (Preemptive) Algorithm
 * Processes with higher priority (lower number) are executed first
 * Preemptive algorithm - can interrupt running process if higher priority process arrives
 */
export const generatePreemptivePrioritySteps = (processes, contextSwitchTime = 1) => {
  const steps = [];
  let currentTime = 0;
  let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let completedProcesses = new Set();
  let lastProcessId = null;

  while (completedProcesses.size < processes.length) {
    const availableProcesses = remainingProcesses.filter(
      p => !completedProcesses.has(p.pid) && p.arrivalTime <= currentTime
    );

    if (availableProcesses.length === 0) {
      steps.push('idle');
      currentTime++;
      continue;
    }

    const nextProcess = availableProcesses.sort((a, b) => a.priority - b.priority)[0];

    // Add context switch if switching from a different process
    if (lastProcessId !== null && lastProcessId !== nextProcess.pid) {
      for (let i = 0; i < contextSwitchTime; i++) {
        steps.push('cs');
        currentTime++;
      }
    }

    steps.push(`p${nextProcess.pid}`);
    nextProcess.remainingTime--;
    currentTime++;
    lastProcessId = nextProcess.pid;

    if (nextProcess.remainingTime === 0) {
      completedProcesses.add(nextProcess.pid);
    }
  }

  return steps;
}; 