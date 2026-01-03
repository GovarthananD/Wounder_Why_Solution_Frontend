import { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://wounder-why-solution-backend.onrender.com';

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/games`);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getWinnerName = (game) => {
    if (game.winner === 'player1') return game.player1.name;
    if (game.winner === 'player2') return game.player2.name;
    return 'Tie';
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">Game History</h1>
      
      {games.length === 0 ? (
        <div className="alert alert-info">
          No games played yet. Start a new game!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Players</th>
                <th>Score</th>
                <th>Winner</th>
                <th>Rounds Played</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={game._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{game.player1.name}</strong> vs <strong>{game.player2.name}</strong>
                  </td>
                  <td>
                    {game.player1.score} - {game.player2.score}
                  </td>
                  <td>
                    <span className={`badge ${game.winner === 'tie' ? 'bg-secondary' : 'bg-success'}`}>
                      {getWinnerName(game)}
                    </span>
                  </td>
                  <td>{game.rounds.length}</td>
                  <td>{formatDate(game.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Game Details Modal */}
      <div className="row">
        {games.map((game) => (
          <div key={game._id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-header">
                {game.player1.name} vs {game.player2.name}
              </div>
              <div className="card-body">
                <p><strong>Final Score:</strong> {game.player1.score} - {game.player2.score}</p>
                <p><strong>Winner:</strong> {getWinnerName(game)}</p>
                <p><strong>Date:</strong> {formatDate(game.createdAt)}</p>
                
                <h6>Round Details:</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Round</th>
                        <th>{game.player1.name}</th>
                        <th>{game.player2.name}</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {game.rounds.map((round) => (
                        <tr key={round._id}>
                          <td>{round.roundNumber}</td>
                          <td>{round.player1Choice}</td>
                          <td>{round.player2Choice}</td>
                          <td>
                            {round.winner === 'tie' ? 'Tie' : 
                             round.winner === 'player1' ? game.player1.name : game.player2.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;