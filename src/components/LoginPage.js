import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Store the name and redirect
      localStorage.setItem('bingoUserName', name.trim());
      navigate('/bingo');
    }
  };

  const game_live = true;

  return (
    <div className="login-container">
      <h1>Welcome to Onam Hitlist!</h1>

      { game_live && (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="start-btn btn btn-primary">Start Playing</button>
        </form>
        )
      }

      {
        !game_live && (
          <h5>The games have not begun yet!</h5>
        )
      }
    </div>
  );
}

export default LoginPage;