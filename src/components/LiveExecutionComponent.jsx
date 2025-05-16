/**
 * LiveExecutionComponent
 * 
 * This component displays the live execution state of the CPU scheduling simulation.
 * It shows:
 * - Current simulation time
 * - Live process table with remaining burst times
 * - Process status (Waiting/Running/Completed)
 * - Controls for simulation speed and pause/resume
 */

import SchedulerControls from './SchedulerControls';

const LiveExecutionComponent = ({ liveProcesses, onSpeedChange, currentTime, isPaused, onPauseToggle }) => {
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Execution</h2>
        <div className="flex items-center space-x-4">
          {/* Pause/Resume button */}
          <button
            onClick={onPauseToggle}
            className={`px-4 py-2 rounded-md font-medium ${
              isPaused
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isPaused ? 'Resume' : 'Stop'}
          </button>
          {/* Speed control */}
          <SchedulerControls onSpeedChange={onSpeedChange} />
        </div>
      </div>

      {/* Time counter display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-sm text-blue-600 mb-1">Current Time</div>
        <div className="text-4xl font-bold text-blue-700">{currentTime+1}</div>
      </div>

      {/* Process table showing current state of each process */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border font-semibold text-gray-700">PID</th>
                <th className="p-3 border font-semibold text-gray-700">Arrival</th>
                <th className="p-3 border font-semibold text-gray-700">Remaining Burst</th>
                <th className="p-3 border font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {liveProcesses.map((proc, idx) => (
                <tr
                  key={idx}
                  className={`${
                    proc.completed
                      ? 'bg-green-50'
                      : proc.started
                      ? 'bg-yellow-50'
                      : 'bg-white'
                  }`}
                >
                  <td className="p-3 border">{proc.pid}</td>
                  <td className="p-3 border">{proc.arrivalTime}</td>
                  <td className="p-3 border">{proc.remainingBurstTime}</td>
                  <td className="p-3 border">
                    {proc.completed
                      ? 'Completed'
                      : proc.started
                      ? 'Running'
                      : currentTime < proc.arrivalTime
                      ? 'Not Arrived'
                      : 'Waiting'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveExecutionComponent; 