import React, { useEffect, useState } from "react";

function DailyQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  const fetchQuestion = async () => {
    try {
      const res = await fetch("https://poker-trivia-api.onrender.com/trivia/random");
      const data = await res.json();

      // avoid repeat
      if (data.id === questionId) {
        return fetchQuestion();
      }

      setQuestion(data);
      setQuestionId(data.id);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (err) {
      console.error("Failed to fetch trivia question:", err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <p>Loading...</p>;

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🃏 Poker Trivia</h1>
      <p><strong>{question.question}</strong></p>
      <div>
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            style={{
              display: "block",
              margin: "0.5rem 0",
              padding: "0.5rem 1rem",
              backgroundColor:
                selectedAnswer === option
                  ? option === question.correct_answer
                    ? "green"
                    : "red"
                  : "#eee",
              color: selectedAnswer === option ? "white" : "black",
              border: "none",
              cursor: "pointer"
            }}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Explanation:</strong> {question.explanation}
        </p>
      )}
      <button
        onClick={fetchQuestion}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        New Random Question
      </button>
    </div>
  );
}

export default DailyQuestion;
