const ResultsComponent = ({ results }) => {
  if (!results || results.length === 0) return null;

  const avgWaitingTime = results.reduce((sum, proc) => sum + proc.waitingTime, 0) / results.length;
  const avgTurnaroundTime = results.reduce((sum, proc) => sum + proc.turnaroundTime, 0) / results.length;

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
                <td className="p-3 border text-center">{result.turnaroundTime}</td>
                <td className="p-3 border text-center">{result.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsComponent; 