import { useState, useEffect } from "react";

export default function FastestFingerFirst({
  questions,
  playerId,
  roomId,
  onComplete,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(10); // Initial timer value
  const [playerAnswers, setPlayerAnswers] = useState({}); // Track player's answers

  // Effect to handle timer countdown and question progression
  useEffect(() => {
    if (timer > 0) {
      // Countdown timer
      const timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timerId); // Cleanup interval on unmount or timer change
    } else {
      // When timer reaches zero
      if (currentQuestionIndex < questions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimer(10); // Reset timer for the next question
      } else {
        // When all questions are answered
        onComplete(); // Notify parent component/game logic
      }
    }
  }, [timer, currentQuestionIndex, questions.length, onComplete]);

  // Function to handle player's answer selection
  const handleAnswer = async (answer) => {
    const timeTaken = Date.now();  // Capture response time
    const answerData = {
      roomId,
      playerId,
      answer,
      timeTaken,  // Include timeTaken instead of questionIndex
    };
  
    // Send answer to the server
    try {
      const response = await fetch("/api/room/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit answer: ${response.statusText}`);
      }
  
      const { nextQuestion } = await response.json();
      if (nextQuestion) {
        // Handle navigating to next question or game progress
        console.log("Next question:", nextQuestion);
        // Optionally, update state or trigger logic for next question
      } else {
        // Handle end of game or other logic
        console.log("Game completed");
        // Optionally, update state or trigger end game logic
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };
  
  
  

  // Render the current question and options
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Fastest Finger First</h1>
      <p>
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <p>{currentQuestion.question}</p>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleAnswer(option)}>{option}</button>
          </li>
        ))}
      </ul>
      <p>Time left: {timer} seconds</p>
    </div>
  );
}
