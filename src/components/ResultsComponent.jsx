const ResultsComponent = ({ results }) => {
  if (!results || results.length === 0) return null;

  const avgWaitingTime = results.reduce((sum, proc) => sum + proc.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((sum, proc) => sum + proc.turnaroundTime, 0) / results.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Final Results</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Average Waiting Time</h3>
          <p className="text-2xl font-bold text-blue-600">{avgWaitingTime.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Average Turnaround Time</h3>
          <p className="text-2xl font-bold text-green-600">{avgTurnaroundTime.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">PID</th>
              <th className="p-2 border">Arrival</th>
              <th className="p-2 border">Burst</th>
              <th className="p-2 border">Turnaround</th>
              <th className="p-2 border">Waiting</th>
            </tr>
          </thead>
          <tbody>
            {results.map((proc, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{proc.pid}</td>
                <td className="p-2 border">{proc.arrivalTime}</td>
                <td className="p-2 border">{proc.burstTime}</td>
                <td className="p-2 border">{proc.turnaroundTime}</td>
                <td className="p-2 border">{proc.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsComponent; 