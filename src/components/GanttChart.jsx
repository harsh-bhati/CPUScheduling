// src/components/GanttChart.jsx

function GanttChart({ schedule }) {
  return (
    <div className="flex flex-col items-center mt-4">
      {/* Gantt Chart Blocks */}
      <div className="flex">
        {schedule.map((step, idx) => (
          <div
            key={idx}
            className={`border w-16 h-16 flex items-center justify-center ${
              step.runningPID ? 'bg-blue-400' : 'bg-gray-300'
            }`}
            style={{ width: '48px' }}  // Ensure consistent width for all blocks
          >
            {step.runningPID ? `P${step.runningPID}` : 'Idle'}
          </div>
        ))}
      </div>

      {/* Time Labels Underneath */}
      <div className="flex">
        {schedule.map((step, idx) => (
          <div key={idx} className="w-16 text-center text-sm" style={{ width: '48px' }}>
            {step.time}
          </div>
        ))}
        {/* Last time unit */}
        <div className="w-16 text-center text-sm" style={{ width: '48px' }}>
          {schedule.length > 0 ? schedule[schedule.length - 1].time + 1 : ''}
        </div>
      </div>
    </div>
  );
}

export default GanttChart;
