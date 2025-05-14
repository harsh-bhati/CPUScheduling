import { useState, useEffect, useRef } from 'react';
import ProcessInputForm from '../components/ProcessInputForm';
import LiveExecutionComponent from '../components/LiveExecutionComponent';
import GanttChartComponent from '../components/GanttChartComponent';
import ResultsComponent from '../components/ResultsComponent';
import SimulationControls from '../components/SimulationControls';
import {
  generateFCFSSteps,
  generateSJFSteps,
  generateSRTFSteps,
  generateLRTFSteps,
  generateRRSteps,
  generatePrioritySteps,
  generatePreemptivePrioritySteps
} from '../algorithms/scheduling';

const JobScheduling = () => {
  const [processes, setProcesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [liveProcesses, setLiveProcesses] = useState([]);
  const [finalResults, setFinalResults] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [contextSwitchTime, setContextSwitchTime] = useState(0.0);
  const [simulationStatus, setSimulationStatus] = useState('ready');
  const intervalRef = useRef(null);

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
      case 'lrtf':
        steps = generateLRTFSteps(processes, contextSwitch);
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
    setFinalResults([]);
    setLiveProcesses(
      processes.map(p => ({
        ...p,
        remainingBurstTime: p.burstTime,
        completed: false,
        started: false,
        endTime: null,
      }))
    );
    setSimulationStatus('ready');
  };

  const handleStart = () => {
    setSimulationStatus('running');
  };

  const handleStop = () => {
    setSimulationStatus('stopped');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleResume = () => {
    setSimulationStatus('running');
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentTime(0);
    setLiveProcesses(
      processes.map(p => ({
        ...p,
        remainingBurstTime: p.burstTime,
        completed: false,
        started: false,
        endTime: null,
      }))
    );
    setFinalResults([]);
    setSimulationStatus('ready');
  };

  useEffect(() => {
    if (events.length === 0 || simulationStatus !== 'running') return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentTime(prevTime => {
        const step = events[prevTime];

        if (!step) {
          clearInterval(intervalRef.current);
          setSimulationStatus('completed');
          // When simulation ends
          setLiveProcesses(prevProcesses => {
            const results = prevProcesses.map(p => {
              const turnaroundTime = (p.endTime ?? prevTime) - p.arrivalTime;
              const waitingTime = Math.max(0, turnaroundTime - p.burstTime);
              return {
                ...p,
                turnaroundTime,
                waitingTime,
              };
            });
            setFinalResults(results);
            return prevProcesses;
          });
          return prevTime;
        }

        setLiveProcesses(prevProcesses =>
          prevProcesses.map(p => {
            let updated = { ...p };

            if (step.arrivalPIDs.includes(p.pid)) {
              updated.started = true;
            }

            if (p.pid === step.runningPID && p.remainingBurstTime > 0) {
              updated.remainingBurstTime = p.remainingBurstTime - 1;

              if (updated.remainingBurstTime === 0) {
                updated.completed = true;
                updated.endTime = step.time + 1; // Finish at next time unit
              }
            }

            return updated;
          })
        );

        return prevTime + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(intervalRef.current);
  }, [events, speed, simulationStatus]);

  const handleFormSubmit = (processes, algorithm, quantum, contextSwitch) => {
    setProcesses(processes);
    setSelectedAlgorithm(algorithm);
    setTimeQuantum(quantum);
    setContextSwitchTime(contextSwitch);
    startSimulation(processes, algorithm, quantum, contextSwitch);
  };

  const handleClear = () => {
    setEvents([]);
    setCurrentTime(0);
    setLiveProcesses([]);
    setFinalResults([]);
    setSimulationStatus('ready');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-center">Job Scheduling Visualization</h1>

      <ProcessInputForm 
        onSubmit={handleFormSubmit}
        onClear={handleClear}
      />

      {liveProcesses.length > 0 && (
        <>
          <SimulationControls
            status={simulationStatus}
            onStart={handleStart}
            onStop={handleStop}
            onResume={handleResume}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
          />

          <LiveExecutionComponent
            liveProcesses={liveProcesses}
            currentTime={currentTime}
          />
        </>
      )}

      {events.length > 0 && (
        <GanttChartComponent
          schedule={events.slice(0, currentTime)}
        />
      )}

      {finalResults.length > 0 && (
        <ResultsComponent
          results={finalResults}
        />
      )}
    </div>
  );
};

export default JobScheduling;
