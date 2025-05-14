import SchedulerControls from './SchedulerControls';

const LiveExecutionComponent = ({ liveProcesses, onSpeedChange, currentTime }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Execution</h2>
        <SchedulerControls onSpeedChange={onSpeedChange} />
      </div>

      {/* Time Counter */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-sm text-blue-600 mb-1">Current Time</div>
        <div className="text-4xl font-bold text-blue-700">{currentTime}</div>
      </div>

      {/* Process Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full border text-center">
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