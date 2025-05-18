# AlgoTracer - Operating System Algorithm Visualizer

AlgoTracer is an interactive web application built with React and Vite that visualizes various Operating System algorithms. The application provides a user-friendly interface to understand and experiment with different scheduling algorithms through real-time visualization.

## Features

- Interactive visualization of job scheduling algorithms
- Real-time process execution display
- Gantt chart visualization
- Performance metrics calculation
- Adjustable simulation speed
- Pause/Resume functionality
- Support for multiple scheduling algorithms

## Supported Algorithms

### Job Scheduling
- First Come First Serve (FCFS)
- Shortest Job First (SJF)
- Shortest Remaining Time First (SRTF)
- Longest Remaining Time First (LRTF)
- Round Robin (RR)
- Priority Scheduling (Non-preemptive)
- Priority Scheduling (Preemptive)

## Project Structure

```
src/
├── algorithms/
│   └── scheduling.js      # Implementation of scheduling algorithms
├── components/
│   ├── GanttChartComponent.jsx    # Gantt chart visualization
│   ├── LiveExecutionComponent.jsx # Real-time process execution display
│   ├── ProcessInputForm.jsx       # Process input and algorithm selection
│   ├── ResultsComponent.jsx       # Performance metrics display
│   └── SchedulerControls.jsx      # Simulation speed controls
├── pages/
│   ├── Home.jsx           # Main landing page
│   ├── JobScheduling.jsx  # Job scheduling visualization page
│   └── About.jsx          # About page
└── App.jsx               # Main application component
```


### Pages
- **JobScheduling.jsx**: Main page for job scheduling visualization

### Components

- **GanttChartComponent.jsx**
  - Displays the Gantt chart visualization
  - Shows process execution timeline
  - Includes context switch visualization
  - Color-coded process blocks

- **LiveExecutionComponent.jsx**
  - Real-time display of process execution
  - Shows current time and process states
  - Includes pause/resume functionality
  - Displays process table with status updates

- **ProcessInputForm.jsx**
  - Form for process input (PID, arrival time, burst time)
  - Algorithm selection
  - Time quantum input for Round Robin
  - Context switch time configuration

- **ResultsComponent.jsx**
  - Displays final performance metrics
  - Shows average waiting time
  - Shows average turnaround time
  - Detailed process statistics

- **SchedulerControls.jsx**
  - Controls simulation speed
  - Speed adjustment slider

### Algorithms

- **scheduling.js**
  - Implementation of all scheduling algorithms
  - Step-by-step execution generation
  - Process state management
  - Performance calculation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the landingpage.html file. (go live with server)
5. Now you can use the application.
## Technologies Used

- React
- Vite
- TailwindCSS
- Framer Motion

## Future Enhancements

- Memory Allocation visualization
- Paging algorithms
- Disk Scheduling algorithms
- More detailed statistics
- Export functionality for results
- Custom process arrival patterns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
