import React, { useState, useEffect } from "react";

const RANDOM_API = "https://poker-trivia-api.onrender.com/trivia/random";
const SEARCH_API = "https://poker-trivia-api.onrender.com/trivia/search";

export default function PokerTriviaUI() {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchRandomQuestion = async () => {
    try {
      const res = await fetch(RANDOM_API);
      const data = await res.json();
      setQuestionData(data);
      setSelectedAnswer("");
      setShowExplanation(false);
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to fetch random question:", err);
    }
  };

  const fetchSearchResults = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
  };

  const handleNext = () => {
    fetchRandomQuestion();
  };

  const handleSearchSelect = (q) => {
    setQuestionData(q);
    setSelectedAnswer("");
    setShowExplanation(false);
    setSearchResults([]);
    setQuery("");
  };

  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🃏 Poker Trivia</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "60%" }}
        />
        <button onClick={fetchSearchResults} style={{ marginLeft: "0.5rem" }}>
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: "2rem" }}>
          {searchResults.map((q) => (
            <li key={q.id} style={{ marginBottom: "0.5rem" }}>
              <button onClick={() => handleSearchSelect(q)}>{q.question}</button>
            </li>
          ))}
        </ul>
      )}

      {questionData && (
        <>
          <p>{questionData.question}</p>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {questionData.options.map((option) => (
              <li key={option} style={{ marginBottom: "0.5rem" }}>
                <button
                  onClick={() => handleAnswer(option)}
                  disabled={showExplanation}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor:
                      showExplanation && option === questionData.correct_answer
                        ? "#c8e6c9"
                        : showExplanation && option === selectedAnswer
                        ? "#ffcdd2"
                        : "#f0f0f0",
                    border: "1px solid #ccc",
                    cursor: showExplanation ? "default" : "pointer",
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          {showExplanation && (
            <div style={{ marginTop: "1rem" }}>
              <strong>
                {selectedAnswer === questionData.correct_answer
                  ? "✅ Correct!"
                  : "❌ Incorrect"}
              </strong>
              <p>
                <strong>Explanation:</strong> {questionData.explanation}
              </p>
              <button onClick={handleNext}>Next Question</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
