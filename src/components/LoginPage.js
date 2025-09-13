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

  return (
    <div className="login-container">
      <h1>Welcome to Bingo!</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Start Playing</button>
      </form>
    </div>
  );
}

export default LoginPage;