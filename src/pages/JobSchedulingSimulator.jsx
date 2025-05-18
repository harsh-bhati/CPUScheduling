/**
 * JobSchedulingSimulator Page
 * 
 * This is the main simulator component for the CPU scheduling visualization.
 * It manages the overall state and coordination between different components:
 * - Process input form
 * - Live execution display
 * - Gantt chart visualization
 * - Results display
 * 
 * The component handles:
 * - Process scheduling simulation
 * - Real-time updates of process states
 * - Simulation speed control
 * - Pause/resume functionality
 */

import { useState, useEffect, useRef } from 'react';
import ProcessInputForm from '../components/ProcessInputForm';
import LiveExecutionComponent from '../components/LiveExecutionComponent';
import GanttChartComponent from '../components/GanttChartComponent';
import ResultsComponent from '../components/ResultsComponent';

import {
  generateFCFSSteps,
  generateSJFSteps,
  generateSRTFSteps,
  generateRRSteps,
  generatePrioritySteps,
  generatePreemptivePrioritySteps
} from '../algorithms/scheduling';

const JobSchedulingSimulator = () => {
  // State management
  const [processes, setProcesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [liveProcesses, setLiveProcesses] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [contextSwitchTime, setContextSwitchTime] = useState(0.0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);  // Add ref to track current step

  // Start the scheduling simulation with given parameters
  const startSimulation = (processes, algorithm, quantum, contextSwitch) => {
    let steps;
    switch (algorithm) {
      case 'fcfs':
        steps = generateFCFSSteps(processes, contextSwitch);
        break;
      case 'sjf':
        steps = generateSJFSteps(processes, contextSwitch);
        break;
      case 'srtf':
        steps = generateSRTFSteps(processes, contextSwitch);
        break;
      case 'rr':
        steps = generateRRSteps(processes, quantum, contextSwitch);
        break;
      case 'priority':
        steps = generatePrioritySteps(processes, contextSwitch);
        break;
      case 'priority-preemptive':
        steps = generatePreemptivePrioritySteps(processes, contextSwitch);
        break;
      default:
        steps = generateFCFSSteps(processes, contextSwitch);
    }

    setEvents(steps);
    setCurrentTime(0);
    currentStepRef.current = 0;
    setFinalResults([]);
    setIsPaused(false);
    setLiveProcesses(
      processes.map(p => ({
        ...p,
        remainingBurstTime: p.burstTime,
        completed: false,
        started: false,
        startTime: null,
        endTime: null,
      }))
    );
  };

  // Main simulation loop
  useEffect(() => {
    if (events.length === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        // Only process if we haven't reached the end
        if (currentStepRef.current >= events.length) {
          clearInterval(intervalRef.current);
          return;
        }

        const step = events[currentStepRef.current];
        
        // Update process states based on current step
        setLiveProcesses(prevProcesses =>
          prevProcesses.map(p => {
            const updated = { ...p };

            // Check if this is a process step
            if (step.startsWith('p')) {
              const processId = parseInt(step.slice(1));
              if (p.pid === processId) {
                // Set start time when process first starts
                if (!updated.started) {
                  updated.started = true;
                  updated.startTime = currentStepRef.current-1;
                }
                updated.remainingBurstTime -= 1;

                if (updated.remainingBurstTime === 0) {
                  updated.completed = true;
                  updated.endTime = currentStepRef.current;
                }
              }
            }

            return updated;
          })
        );

        // Update current time and step
        setCurrentTime(currentStepRef.current);
        currentStepRef.current += 1;

        // If we've reached the end, calculate final statistics
        if (currentStepRef.current >= events.length) {
          setLiveProcesses(prevProcesses => {
            const results = prevProcesses.map(p => {
              const turnaroundTime = (p.endTime ?? currentStepRef.current - 1) - p.arrivalTime;
              const waitingTime = Math.max(0, turnaroundTime - p.burstTime);
              const responseTime = p.startTime === null ? 0 : p.startTime - p.arrivalTime;
              return {
                ...p,
                turnaroundTime,
                waitingTime,
                responseTime,
                startTime: p.startTime ?? 'Not Started',
                endTime: p.endTime ?? 'Not Completed'
              };
            });
            setFinalResults(results);
            return prevProcesses;
          });
        }
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events, speed, isPaused]);

  // Handle form submission from ProcessInputForm
  const handleFormSubmit = (processes, algorithm, quantum, contextSwitch) => {
    setProcesses(processes);
    setSelectedAlgorithm(algorithm);
    setTimeQuantum(quantum);
    setContextSwitchTime(contextSwitch);
    startSimulation(processes, algorithm, quantum, contextSwitch);
  };

  // Reset simulation state
  const handleClear = () => {
    setEvents([]);
    setCurrentTime(0);
    setLiveProcesses([]);
    setFinalResults([]);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Toggle simulation pause state
  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="space-y-8 p-8 max-w-full overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center">Job Scheduling Visualization</h1>

      {/* Process input form */}
      <ProcessInputForm 
        onSubmit={handleFormSubmit}
        onClear={handleClear}
      />

      {/* Live execution display */}
      {liveProcesses.length > 0 && (
        <LiveExecutionComponent
          liveProcesses={liveProcesses}
          onSpeedChange={setSpeed}
          currentTime={currentTime}
          isPaused={isPaused}
          onPauseToggle={handlePauseToggle}
        />
      )}

      {/* Gantt chart visualization */}
      {events.length > 0 && (
        <GanttChartComponent
          schedule={events.slice(0, currentTime + 1)}
        />
      )}

      {/* Final results display */}
      {finalResults.length > 0 && (
        <ResultsComponent
          results={finalResults}
        />
      )}
    </div>
  );
};

export default JobSchedulingSimulator;
 