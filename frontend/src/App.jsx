import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);

  const fetchNewQuestion = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/quiz");
      const data = await response.json();
      setQuizData(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleGuess = (clickedId) => {
    if (answer === true) return;

    if (lives === 0) {
      setIsGameOver(true);
    }
    if (clickedId === quizData.correctId) {
      setAnswer(true);
      incrementScore();
      setTimeout(() => {
        setAnswer("");
        fetchNewQuestion();
      }, 1200);
    } else {
      setAnswer(false);
      decrementLives(lives);
    }
  };

  const handleResult = () => {
    if (answer === true) {
      return <span className="result-text">Correct!</span>;
    }
    if (answer === false) {
      return <span className="result-text">Wrong!</span>;
    }
  };

  const incrementScore = () => {
    const newScore = score + 1;
    setScore(newScore);
  };

  const decrementLives = () => {
    setLives((prevLives) => prevLives - 1);
  };

  console.log("Current Quiz Data:", quizData);

  if (!quizData) {
    return (
      <div className="container">
        <h1>Loading pokemon...</h1>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="container">
        <h1>Game Over!</h1>
        <p>Final Score: {score}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Who's That Pokemon</h1>
      <img src={quizData.image} alt="" className="pokemon" />
      <div className="btn-group-selection">
        {quizData.options.map((options) => (
          <button
            key={options.id}
            className="btn-selection"
            onClick={() => handleGuess(options.id)}
            disabled={answer === true}
          >
            {options.name}
          </button>
        ))}
      </div>

      <div className="score">
        <div className="show-result">{handleResult()}</div>
        <div className="game-data">
          <span className="score-text">Score: {score}</span>
          <span className="score-text">Lives: {lives}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
