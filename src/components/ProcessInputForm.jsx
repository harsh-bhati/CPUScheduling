// src/components/ProcessInputForm.jsx
import { useState } from 'react';

const algorithms = [
  { id: 'fcfs', name: 'First Come First Serve (FCFS)', preemptive: false },
  { id: 'sjf', name: 'Shortest Job First (SJF)', preemptive: false },
  { id: 'srtf', name: 'Shortest Remaining Time First (SRTF)', preemptive: true },
  { id: 'lrtf', name: 'Longest Remaining Time First (LRTF)', preemptive: true },
  { id: 'rr', name: 'Round Robin (RR)', preemptive: true },
  { id: 'priority', name: 'Priority Scheduling', preemptive: false },
  { id: 'priority-preemptive', name: 'Priority Scheduling (Preemptive)', preemptive: true }
];

const ProcessInputForm = ({ onSubmit, onClear }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [contextSwitchTime, setContextSwitchTime] = useState(0.0);
  const [processes, setProcesses] = useState([
    { pid: 1, arrivalTime: 0, burstTime: 4, priority: 1 }
  ]);

  const handleAddProcess = () => {
    setProcesses([
      ...processes,
      {
        pid: processes.length + 1,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1
      }
    ]);
  };

  const handleRemoveProcess = (index) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...processes];
    let parsedValue = parseInt(value) || 0;

    // Apply validation rules
    if (field === 'arrivalTime') {
      parsedValue = Math.max(0, parsedValue); // Cannot be negative
    } else if (field === 'burstTime') {
      parsedValue = Math.max(1, parsedValue); // Must be at least 1
    } else if (field === 'priority') {
      parsedValue = Math.max(1, parsedValue); // Priority must be at least 1
    }

    newProcesses[index] = {
      ...newProcesses[index],
      [field]: parsedValue
    };
    setProcesses(newProcesses);
  };

  const handleClear = () => {
    setProcesses([{ pid: 1, arrivalTime: 0, burstTime: 1, priority: 1 }]);
    setSelectedAlgorithm('fcfs');
    setTimeQuantum(2);
    setContextSwitchTime(0.0);
    onClear();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (processes.length === 0) return;
    onSubmit(processes, selectedAlgorithm, timeQuantum, contextSwitchTime);
  };

  const showPriorityField = selectedAlgorithm.includes('priority');
  const showTimeQuantumField = selectedAlgorithm === 'rr';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Algorithm</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        {selectedAlgorithm === 'rr' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Quantum</label>
            <input
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Context Switch Time</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={contextSwitchTime}
            onChange={(e) => setContextSwitchTime(Math.max(0, parseFloat(e.target.value) || 0))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Processes</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleAddProcess}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Process
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Process ID</th>
                <th className="p-2 border">Arrival Time</th>
                <th className="p-2 border">Burst Time</th>
                {showPriorityField && <th className="p-2 border">Priority</th>}
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td className="p-2 border">{process.pid}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      value={process.arrivalTime}
                      onChange={(e) => handleProcessChange(index, 'arrivalTime', e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="1"
                      value={process.burstTime}
                      onChange={(e) => handleProcessChange(index, 'burstTime', e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  {showPriorityField && (
                    <td className="p-2 border">
                      <input
                        type="number"
                        min="1"
                        value={process.priority}
                        onChange={(e) => handleProcessChange(index, 'priority', e.target.value)}
                        className="w-20 p-1 border rounded"
                      />
                    </td>
                  )}
                  <td className="p-2 border">
                    <button
                      type="button"
                      onClick={() => handleRemoveProcess(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={processes.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Start Simulation
        </button>
      </div>
    </form>
  );
};

export default ProcessInputForm;
