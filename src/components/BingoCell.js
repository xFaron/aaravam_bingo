import React from 'react';

function BingoCell({ task, isCompleted, onClick }) {
  return (
    <div 
      className={`bingo-cell ${isCompleted ? 'completed' : ''}`}
      onClick={onClick}
    >
      {isCompleted && <span className="checkmark">✔</span>}
      <p>{task.title}</p>
    </div>
  );
}

export default BingoCell;