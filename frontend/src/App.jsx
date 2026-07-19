import pika from "./assets/pika.png";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

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
    if (clickedId === quizData.correctId) {
      setAnswer(true);
      incrementScore();
      setTimeout(() => {
        setAnswer(""); // FIX: Resets text back to blank for the next question
        fetchNewQuestion();
      }, 1200);
    } else {
      setAnswer(false);
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

  console.log("Current Quiz Data:", quizData);

  if (!quizData) {
    return (
      <div className="container">
        <h1>Loading pokemon...</h1>
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

        <span className="score-text">Score: {score}</span>
      </div>
    </div>
  );
}

export default App;
