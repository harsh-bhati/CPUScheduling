// src/components/SchedulerControls.jsx
import { useState } from 'react';

function SchedulerControls({ onSpeedChange }) {
  const [speed, setSpeed] = useState(1);

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold">Animation Speed:</label>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.1"
        value={speed}
        onChange={handleSpeedChange}
        className="w-full"
      />
      <div>Speed: {speed}x</div>
    </div>
  );
}

export default SchedulerControls;
