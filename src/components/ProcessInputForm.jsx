/**
 * ProcessInputForm
 * 
 * This component provides a form for users to:
 * - Select a scheduling algorithm
 * - Configure algorithm parameters (time quantum, context switch time)
 * - Add/remove processes
 * - Set process properties (arrival time, burst time, priority)
 * 
 * The form includes validation and error handling for process inputs.
 */

import { useState } from 'react';

// Available scheduling algorithms with their properties
const algorithms = [
  { id: 'fcfs', name: 'First Come First Serve (FCFS)', preemptive: false },
  { id: 'sjf', name: 'Shortest Job First (SJF)', preemptive: false },
  { id: 'srtf', name: 'Shortest Remaining Time First (SRTF)', preemptive: true },
  { id: 'rr', name: 'Round Robin (RR)', preemptive: true },
  { id: 'priority', name: 'Priority Scheduling', preemptive: false },
  { id: 'priority-preemptive', name: 'Priority Scheduling (Preemptive)', preemptive: true }
];

const ProcessInputForm = ({ onSubmit, onClear }) => {
  // State management for form inputs
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [contextSwitchTime, setContextSwitchTime] = useState(0.0);
  const [processes, setProcesses] = useState([
    { pid: 1, arrivalTime: 0, burstTime: 1, priority: 1 }
  ]);
  const [errors, setErrors] = useState([{}]);

  // Add a new process to the list
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
    setErrors([...errors, {}]);
  };

  // Remove a process from the list
  const handleRemoveProcess = (index) => {
    const updatedProcesses = processes.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setProcesses(updatedProcesses);
    setErrors(updatedErrors);
  };

  // Update process properties
  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index] = {
      ...newProcesses[index],
      [field]: value
    };
    setProcesses(newProcesses);
  };

  // Validate process inputs
  const validateProcesses = () => {
    const newErrors = processes.map(p => {
      const err = {};
      if (p.arrivalTime === '' || parseInt(p.arrivalTime) < 0) err.arrivalTime = 'Arrival time must be ≥ 0';
      if (p.burstTime === '' || parseInt(p.burstTime) < 1) err.burstTime = 'Burst time must be ≥ 1';
      if (selectedAlgorithm.includes('priority') && (p.priority === '' || parseInt(p.priority) < 1)) {
        err.priority = 'Priority must be ≥ 1';
      }
      return err;
    });
    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  // Reset form to initial state
  const handleClear = () => {
    setProcesses([{ pid: 1, arrivalTime: 0, burstTime: 1, priority: 1 }]);
    setErrors([{}]);
    setSelectedAlgorithm('fcfs');
    setTimeQuantum(2);
    setContextSwitchTime(0.0);
    onClear();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateProcesses()) return;

    // Convert values to numbers before submission
    const sanitizedProcesses = processes.map(p => ({
      pid: p.pid,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      priority: parseInt(p.priority)
    }));

    onSubmit(sanitizedProcesses, selectedAlgorithm, timeQuantum, contextSwitchTime);
  };

  // Determine which fields to show based on selected algorithm
  const showPriorityField = selectedAlgorithm.includes('priority');
  const showTimeQuantumField = selectedAlgorithm === 'rr';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Algorithm selection and parameters */}
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

        {/* Time quantum input for Round Robin */}
        {showTimeQuantumField && (
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

        {/* Context switch time input */}
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

      {/* Process list management */}
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

        {/* Process table */}
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
                  <td className="p-2 border text-center">{process.pid}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      value={process.arrivalTime}
                      onChange={(e) => handleProcessChange(index, 'arrivalTime', e.target.value)}
                      onBlur={validateProcesses}
                      className="w-20 p-1 border rounded"
                    />
                    {errors[index]?.arrivalTime && (
                      <p className="text-red-500 text-xs">{errors[index].arrivalTime}</p>
                    )}
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="1"
                      value={process.burstTime}
                      onChange={(e) => handleProcessChange(index, 'burstTime', e.target.value)}
                      onBlur={validateProcesses}
                      className="w-20 p-1 border rounded"
                    />
                    {errors[index]?.burstTime && (
                      <p className="text-red-500 text-xs">{errors[index].burstTime}</p>
                    )}
                  </td>
                  {showPriorityField && (
                    <td className="p-2 border">
                      <input
                        type="number"
                        min="1"
                        value={process.priority}
                        onChange={(e) => handleProcessChange(index, 'priority', e.target.value)}
                        onBlur={validateProcesses}
                        className="w-20 p-1 border rounded"
                      />
                      {errors[index]?.priority && (
                        <p className="text-red-500 text-xs">{errors[index].priority}</p>
                      )}
                    </td>
                  )}
                  <td className="p-2 border text-center">
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

      {/* Submit button */}
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
