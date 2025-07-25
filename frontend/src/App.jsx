import { useEffect, useState } from "react";

function App() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const fetchQuestion = async () => {
    setShowAnswer(false);
    setSelectedOption("");
    setIsCorrect(null);
    try {
      const res = await fetch("https://trivia-poker-api.onrender.com/trivia/random");
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      console.error("Failed to fetch question", err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
    setIsCorrect(option === question.correct_answer);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>♠️ Poker Trivia</h1>
      {question ? (
        <div>
          <p><strong>Question:</strong> {question.question}</p>
          <div>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={showAnswer}
                style={{
                  display: "block",
                  margin: "0.5rem 0",
                  padding: "0.5rem",
                  width: "100%",
                  backgroundColor: showAnswer
                    ? option === question.correct_answer
                      ? "#4caf50"
                      : option === selectedOption
                      ? "#f44336"
                      : "#eee"
                    : "#fff",
                  border: "1px solid #ccc",
                  cursor: "pointer"
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {showAnswer && (
            <div style={{ marginTop: "1rem" }}>
              <p><strong>{isCorrect ? "✅ Correct!" : "❌ Incorrect."}</strong></p>
              <p><em>{question.explanation}</em></p>
              <button onClick={fetchQuestion} style={{ marginTop: "1rem" }}>
                Next Question 🔁
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
}

export default App;
