import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'https://wounder-why-solution-backend.onrender.com';

  const startGame = async (e) => {
    e.preventDefault();
    if (!player1Name.trim() || !player2Name.trim()) {
      alert('Please enter both player names');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/games`, {
        player1Name: player1Name.trim(),
        player2Name: player2Name.trim()
      });
      
      navigate(`/game/${response.data._id}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="text-center mb-0">Start New Game</h3>
          </div>
          <div className="card-body">
            <form onSubmit={startGame}>
              <div className="mb-3">
                <label className="form-label">Player 1 Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Enter Player 1 name"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Player 2 Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Enter Player 2 name"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Starting Game...' : 'Start Game'}
              </button>
            </form>
            
            <div className="mt-4">
              <h5>Game Rules:</h5>
              <ul>
                <li>✊ Stone beats ✌️ Scissors</li>
                <li>✌️ Scissors beats ✋ Paper</li>
                <li>✋ Paper beats ✊ Stone</li>
                <li>6 rounds will be played</li>
                <li>Winner will be announced after all rounds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;