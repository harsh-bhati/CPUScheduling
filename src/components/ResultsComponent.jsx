const ResultsComponent = ({ results }) => {
  if (!results || results.length === 0) return null;

  const avgWaitingTime = results.reduce((sum, proc) => sum + proc.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((sum, proc) => sum + proc.turnaroundTime, 0) / results.length;
  const avgResponseTime = results.reduce((sum, proc) => sum + proc.responseTime, 0) / results.length;

  // Calculate CPU throughput (processes completed per time unit)
  const totalTime = Math.max(...results.map(proc => proc.endTime === 'Not Completed' ? 0 : proc.endTime));
  const cpuThroughput = totalTime > 0 ? (results.length / totalTime).toFixed(2) : 0;

  // Calculate CPU utilization
  const totalBurstTime = results.reduce((sum, proc) => sum + proc.burstTime, 0);
  const cpuUtilization = totalTime > 0 ? ((totalBurstTime / totalTime) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Process ID</th>
              <th className="p-3 border">Arrival Time</th>
              <th className="p-3 border">Burst Time</th>
              <th className="p-3 border">Start Time</th>
              <th className="p-3 border">Completion Time</th>
              <th className="p-3 border">Response Time</th>
              <th className="p-3 border">Turnaround Time</th>
              <th className="p-3 border">Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td className="p-3 border text-center">{result.pid}</td>
                <td className="p-3 border text-center">{result.arrivalTime}</td>
                <td className="p-3 border text-center">{result.burstTime}</td>
                <td className="p-3 border text-center">{result.startTime}</td>
                <td className="p-3 border text-center">{result.endTime}</td>
                <td className="p-3 border text-center">{result.responseTime}</td>
                <td className="p-3 border text-center">{result.turnaroundTime}</td>
                <td className="p-3 border text-center">{result.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Metrics Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Average Turnaround Time</p>
            <p className="text-lg font-semibold">{avgTurnaroundTime.toFixed(2)} units</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Average Response Time</p>
            <p className="text-lg font-semibold">{avgResponseTime.toFixed(2)} units</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Average Waiting Time</p>
            <p className="text-lg font-semibold">{avgWaitingTime.toFixed(2)} units</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">CPU Throughput</p>
            <p className="text-lg font-semibold">{cpuThroughput} processes/unit</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">CPU Utilization</p>
            <p className="text-lg font-semibold">{cpuUtilization}%</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Processes</p>
            <p className="text-lg font-semibold">{results.length}</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Time</p>
            <p className="text-lg font-semibold">{totalTime} units</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent; 