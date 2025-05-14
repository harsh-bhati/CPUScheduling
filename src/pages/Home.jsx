import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const algorithmCategories = [
  {
    id: 'job-scheduling',
    name: 'Job Scheduling',
    description: 'Visualize various job scheduling algorithms like FCFS, SJF, Priority Scheduling, and Round Robin',
    enabled: true,
    path: '/job-scheduling'
  },
  {
    id: 'memory-allocation',
    name: 'Memory Allocation',
    description: 'Explore memory allocation strategies including First Fit, Best Fit, and Worst Fit',
    enabled: false
  },
  {
    id: 'paging',
    name: 'Paging',
    description: 'Understand paging algorithms like FIFO, LRU, and Optimal Page Replacement',
    enabled: false
  },
  {
    id: 'disk-scheduling',
    name: 'Disk Scheduling',
    description: 'Learn about disk scheduling algorithms including FCFS, SCAN, and C-SCAN',
    enabled: false
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category.enabled && category.path) {
      navigate(category.path);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Operating System Algorithm Visualizer</h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Select an algorithm category to visualize and understand different OS algorithms
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {algorithmCategories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={category.enabled ? { scale: 1.02 } : {}}
            className={`p-6 rounded-lg shadow-lg ${
              category.enabled
                ? 'bg-white cursor-pointer hover:shadow-xl'
                : 'bg-gray-100 cursor-not-allowed'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <h2 className={`text-2xl font-semibold mb-3 ${
              category.enabled ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {category.name}
            </h2>
            <p className={`${
              category.enabled ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {category.description}
            </p>
            {!category.enabled && (
              <p className="text-sm text-gray-500 mt-2">
                Coming soon...
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
