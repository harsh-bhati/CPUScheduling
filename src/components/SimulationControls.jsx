const SimulationControls = ({ 
  status, 
  onStart, 
  onStop, 
  onResume, 
  onReset,
  speed,
  onSpeedChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col space-y-4">
        {/* Status Display */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Simulation Status</div>
          <div className={`text-lg font-semibold ${
            status === 'running' ? 'text-green-600' :
            status === 'stopped' ? 'text-yellow-600' :
            status === 'completed' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {status === 'running' ? 'Running' :
             status === 'stopped' ? 'Paused' :
             status === 'completed' ? 'Completed' :
             'Ready'}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3">
          {status === 'ready' && (
            <button
              onClick={onStart}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Start
            </button>
          )}
          
          {status === 'running' && (
            <button
              onClick={onStop}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Pause
            </button>
          )}
          
          {status === 'stopped' && (
            <>
              <button
                onClick={onResume}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Resume
              </button>
              <button
                onClick={onReset}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Reset
              </button>
            </>
          )}
          
          {status === 'completed' && (
            <button
              onClick={onReset}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Run Again
            </button>
          )}
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-3">
          <span className="text-sm text-gray-600">Speed:</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">{speed}x</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls; 