const GanttChartComponent = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  // Define static base colors for the first 8 processes
  const baseColors = {
    idle: '#E5E7EB', // Light gray
    cs: '#9CA3AF',   // Dark gray for context switch
    processes: {
      1: 'hsl(210, 70%, 60%)', // Blue
      2: 'hsl(120, 70%, 60%)', // Green
      3: 'hsl(300, 70%, 60%)', // Purple
      4: 'hsl(30, 70%, 60%)',  // Orange
      5: 'hsl(180, 70%, 60%)', // Teal
      6: 'hsl(330, 70%, 60%)', // Pink
      7: 'hsl(60, 70%, 60%)',  // Yellow
      8: 'hsl(270, 70%, 60%)'  // Indigo
    }
  };

  // Assign dynamic colors to any process ID not already defined
  const getColorForPid = (pid) => {
    if (!baseColors.processes[pid]) {
      const hue = (parseInt(pid) * 47) % 360;
      baseColors.processes[pid] = `hsl(${hue}, 70%, 60%)`;
    }
    return baseColors.processes[pid];
  };

  // Group consecutive states
  const groupedSchedule = [];
  schedule.forEach((state, index) => {
    if (index === 0 || state !== schedule[index - 1]) {
      groupedSchedule.push({ state, start: index, count: 1 });
    } else {
      groupedSchedule[groupedSchedule.length - 1].count++;
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Gantt Chart</h2>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: baseColors.idle }} />
          <span className="text-sm">Idle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: baseColors.cs }} />
          <span className="text-sm">Context Switch</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="border rounded bg-white shadow-sm" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="overflow-x-auto gantt-scrollbar" style={{ width: '100%' }}>
          <div style={{ minWidth: 'max-content' }}>
            
            {/* Bars */}
            <div className="flex">
              {groupedSchedule.map((group, index) => {
                const color = group.state === 'idle'
                  ? baseColors.idle
                  : group.state === 'cs'
                    ? baseColors.cs
                    : getColorForPid(group.state.slice(1));

                return (
                  <div
                    key={index}
                    className="flex items-center justify-center border text-sm"
                    style={{
                      backgroundColor: color,
                      width: `${group.count * 32}px`,
                      height: '48px',
                      flexShrink: 0
                    }}
                  >
                    {group.state === 'cs'
                      ? 'CS'
                      : group.state === 'idle'
                        ? 'IDLE'
                        : group.state.toUpperCase()}
                  </div>
                );
              })}
            </div>

            {/* Time Labels (at bar boundaries) */}
            <div className="flex">
              {groupedSchedule.map((group, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 text-left"
                  style={{
                    width: `${group.count * 32}px`,
                    flexShrink: 0
                  }}
                >
                  <div className="pl-1">{group.start}</div>
                </div>
              ))}
              {/* Add the last time tick */}
              <div className="text-xs text-gray-600 text-left" style={{ width: '32px' }}>
                {schedule.length}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChartComponent;
