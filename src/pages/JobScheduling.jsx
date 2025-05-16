import { useNavigate } from 'react-router-dom';

const JobScheduling = () => {
  const navigate = useNavigate();

  const algorithms = [
    {
      name: 'First Come First Serve (FCFS)',
      description: 'Processes are executed in the order they arrive. The process that arrives first gets executed first.',
      characteristics: ['Non-preemptive', 'Simple to implement', 'Fair in terms of waiting time', 'May lead to convoy effect']
    },
    {
      name: 'Shortest Job First (SJF)',
      description: 'Processes with the shortest burst time are executed first. This minimizes average waiting time.',
      characteristics: ['Non-preemptive', 'Optimal for minimizing waiting time', 'Requires knowledge of burst time', 'May lead to starvation']
    },
    {
      name: 'Shortest Remaining Time First (SRTF)',
      description: 'Preemptive version of SJF. The process with the shortest remaining burst time gets executed.',
      characteristics: ['Preemptive', 'Optimal for minimizing waiting time', 'Complex to implement', 'May lead to starvation']
    },
    {
      name: 'Round Robin (RR)',
      description: 'Each process gets a small unit of CPU time (time quantum) in a circular order.',
      characteristics: ['Preemptive', 'Fair to all processes', 'No starvation', 'Performance depends on time quantum']
    },
    {
      name: 'Priority Scheduling',
      description: 'Processes are executed based on their priority. Higher priority processes are executed first.',
      characteristics: ['Non-preemptive', 'Can be based on various factors', 'May lead to starvation', 'Requires priority assignment']
    },
    {
      name: 'Preemptive Priority Scheduling',
      description: 'Preemptive version of Priority Scheduling. A higher priority process can preempt a running process.',
      characteristics: ['Preemptive', 'More responsive to high priority processes', 'Complex to implement', 'May lead to starvation']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CPU Scheduling Algorithms</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CPU scheduling is a process that allows one process to use the CPU while the execution of another process is on hold.
            Explore different scheduling algorithms and their characteristics below.
          </p>
          <button
            onClick={() => navigate('/jobSchedulingSimulator')}
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Launch Simulator
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {algorithms.map((algo, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{algo.name}</h2>
              <p className="text-gray-600 mb-4">{algo.description}</p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Characteristics:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {algo.characteristics.map((char, idx) => (
                    <li key={idx} className="text-gray-600">{char}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobScheduling;