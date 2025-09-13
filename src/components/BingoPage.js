import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import supabase client
import { bingoTasks } from '../tasks';
import BingoCell from './BingoCell';
import TaskModal from './TaskModal';

function BingoPage() {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const userName = localStorage.getItem('bingoUserName');

  // Fetch user's completed tasks from Firestore on load
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!userName) return;
      
      // Fetch data from the 'submissions' table
      const { data, error } = await supabase
        .from('submissions')
        .select('task_id')
        .eq('user_name', userName);

      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        const completed = new Set(data.map(item => item.task_id));
        setCompletedTasks(completed);
      }
    };
    fetchSubmissions();
  }, [userName]);

  const handleCellClick = (task) => {
    if (completedTasks.has(task.id)) {
      console.log("Already done!");
      return;
    }

    setSelectedTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = (isCompleted) => {
    setIsModalOpen(false);
    setSelectedTask(null);
    if(isCompleted) {
        // Optimistically update the UI
        setCompletedTasks(prev => new Set(prev).add(selectedTask.id));
    }
  };

  return (
    <div className="bingo-page">
      <h1>Onam Hitlist</h1>
      <h5>You have to finish all the tasks below to win a special prize. Once all the tasks are completed, a random person will be called onto the stage to claim the price</h5>
      <div className="bingo-grid">
        {bingoTasks.map(task => (
          <BingoCell
            key={task.id}
            task={task}
            isCompleted={completedTasks.has(task.id)}
            onClick={() => handleCellClick(task)}
          />
        ))}
      </div>
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          userName={userName}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default BingoPage;