import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa';

function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const API_URL = 'http://localhost:5000';
  const choices = ['stone', 'paper', 'scissors'];

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API_URL}/games/${gameId}`);
      setGame(response.data);
      setCurrentRound(response.data.rounds.length + 1);
      setGameFinished(response.data.rounds.length >= 6);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  const determineWinner = (p1, p2) => {
    if (p1 === p2) return 'tie';
    if (
      (p1 === 'stone' && p2 === 'scissors') ||
      (p1 === 'scissors' && p2 === 'paper') ||
      (p1 === 'paper' && p2 === 'stone')
    ) {
      return 'player1';
    }
    return 'player2';
  };

  const playRound = async () => {
    if (!player1Choice || !player2Choice) {
      alert('Both players must make a choice!');
      return;
    }

    setSubmitting(true);
    try {
      const winner = determineWinner(player1Choice, player2Choice);
      
      const response = await axios.put(`${API_URL}/games/${gameId}`, {
        roundNumber: currentRound,
        player1Choice,
        player2Choice,
        winner
      });

      setGame(response.data);
      setCurrentRound(currentRound + 1);
      setPlayer1Choice(null);
      setPlayer2Choice(null);

      if (currentRound >= 6) {
        setGameFinished(true);
      }
    } catch (error) {
      console.error('Error saving round:', error);
      alert('Failed to save round. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getChoiceIcon = (choice) => {
    switch (choice) {
      case 'stone': return <FaHandRock size={30} />;
      case 'paper': return <FaHandPaper size={30} />;
      case 'scissors': return <FaHandScissors size={30} />;
      default: return null;
    }
  };

  const getWinnerText = () => {
    if (!gameFinished || !game) return '';
    
    if (game.winner === 'player1') return `${game.player1.name} Wins! 🎉`;
    if (game.winner === 'player2') return `${game.player2.name} Wins! 🎉`;
    return "It's a Tie! 🤝";
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

  if (!game) {
    return (
      <div className="alert alert-danger">
        Game not found. <button className="btn btn-link" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div>
      {/* Game Header */}
      <div className="text-center mb-4">
        <h1>Stone Paper Scissors</h1>
        <h3>{game.player1.name} vs {game.player2.name}</h3>
        <h5>Round {currentRound > 6 ? 6 : currentRound} of 6</h5>
      </div>

      {/* Score Display */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-header bg-info text-white">
              <h5>{game.player1.name}</h5>
            </div>
            <div className="card-body">
              <h2>{game.player1.score}</h2>
              <div className="mt-2">
                {player1Choice && (
                  <>
                    {getChoiceIcon(player1Choice)}
                    <div className="text-muted">{player1Choice}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-header bg-warning text-white">
              <h5>{game.player2.name}</h5>
            </div>
            <div className="card-body">
              <h2>{game.player2.score}</h2>
              <div className="mt-2">
                {player2Choice && (
                  <>
                    {getChoiceIcon(player2Choice)}
                    <div className="text-muted">{player2Choice}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Finished Message */}
      {gameFinished && (
        <div className="alert alert-success text-center">
          <h3>{getWinnerText()}</h3>
          <p>Final Score: {game.player1.name} {game.player1.score} - {game.player2.name} {game.player2.score}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Play Again
          </button>
        </div>
      )}

      {/* Game Controls */}
      {!gameFinished && (
        <div className="row">
          {/* Player 1 Choices */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>{game.player1.name}'s Choice</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-around">
                  {choices.map(choice => (
                    <button
                      key={choice}
                      className={`btn btn-outline-primary ${player1Choice === choice ? 'active' : ''}`}
                      onClick={() => setPlayer1Choice(choice)}
                      disabled={submitting}
                    >
                      {getChoiceIcon(choice)}
                      <div className="mt-2">{choice}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player 2 Choices */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>{game.player2.name}'s Choice</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-around">
                  {choices.map(choice => (
                    <button
                      key={choice}
                      className={`btn btn-outline-warning ${player2Choice === choice ? 'active' : ''}`}
                      onClick={() => setPlayer2Choice(choice)}
                      disabled={submitting}
                    >
                      {getChoiceIcon(choice)}
                      <div className="mt-2">{choice}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="col-12 mt-4 text-center">
            <button
              className="btn btn-success btn-lg"
              onClick={playRound}
              disabled={!player1Choice || !player2Choice || submitting}
            >
              {submitting ? 'Playing Round...' : 'Play Round'}
            </button>
          </div>
        </div>
      )}

      {/* Rounds History */}
      <div className="mt-5">
        <h3>Round History</h3>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Round</th>
                <th>{game.player1.name}</th>
                <th>{game.player2.name}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {game.rounds.map((round, index) => (
                <tr key={index}>
                  <td>{round.roundNumber}</td>
                  <td>
                    {getChoiceIcon(round.player1Choice)}
                    <span className="ms-2">{round.player1Choice}</span>
                  </td>
                  <td>
                    {getChoiceIcon(round.player2Choice)}
                    <span className="ms-2">{round.player2Choice}</span>
                  </td>
                  <td>
                    {round.winner === 'tie' ? 'Tie' : 
                     round.winner === 'player1' ? game.player1.name : game.player2.name}
                  </td>
                </tr>
              ))}
              {game.rounds.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No rounds played yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Game;