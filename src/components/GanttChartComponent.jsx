const GanttChartComponent = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  // Define consistent colors
  const colors = {
    idle: '#E5E7EB', // Light gray
    contextSwitch: '#9CA3AF', // Dark gray
    processes: {
      1: 'hsl(210, 70%, 60%)', // Blue
      2: 'hsl(120, 70%, 60%)', // Green
      3: 'hsl(300, 70%, 60%)', // Purple
      4: 'hsl(30, 70%, 60%)',  // Orange
      5: 'hsl(180, 70%, 60%)', // Teal
      6: 'hsl(330, 70%, 60%)', // Pink
      7: 'hsl(60, 70%, 60%)',  // Yellow
      8: 'hsl(270, 70%, 60%)', // Indigo
    }
  };

  
  // Group same PID blocks, add context switch
  const groupedSchedule = schedule.reduce((acc, step, index) => {
    if (index === 0) {
      acc.push({ ...step, count: 1, isContextSwitch: false });
      return acc;
    }

    const prevStep = acc[acc.length - 1];
    const isContextSwitch = step.runningPID !== prevStep.runningPID &&
                            step.runningPID !== null &&
                            prevStep.runningPID !== null;

    if (step.runningPID === prevStep.runningPID && !isContextSwitch) {
      prevStep.count++;
    } else {
      if (isContextSwitch) {
        acc.push({
          runningPID: null,
          count: 1,
          time: step.time - 1,
          isContextSwitch: true
        });
      }
      acc.push({ ...step, count: 1, isContextSwitch: false });
    }

    return acc;
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Gantt Chart</h2>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.idle }} />
          <span className="text-sm">Idle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.contextSwitch }} />
          <span className="text-sm">Context Switch</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="border rounded bg-white shadow-sm" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="overflow-x-auto gantt-scrollbar" style={{ width: '100%' }}>
          <div style={{ minWidth: 'max-content' }}>
            {/* Bars */}
            <div className="flex">
              {groupedSchedule.map((step, index) => {
                const color = step.isContextSwitch
                  ? colors.contextSwitch
                  : step.runningPID
                    ? colors.processes[step.runningPID] || colors.processes[1]
                    : colors.idle;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-center border text-sm"
                    style={{
                      backgroundColor: color,
                      width: `${step.count * 32}px`,
                      height: '48px',
                      flexShrink: 0
                    }}
                  >
                    {step.isContextSwitch
                      ? 'CS'
                      : step.runningPID
                        ? `P${step.runningPID}`
                        : 'IDLE'}
                  </div>
                );
              })}
            </div>

            {/* Time Labels */}
            <div className="flex">
              {schedule.map((step, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 text-center"
                  style={{ 
                    width: '32px',
                    flexShrink: 0
                  }}
                >
                  {step.time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChartComponent;
