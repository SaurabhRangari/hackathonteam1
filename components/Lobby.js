import { useState } from "react";
import { useRouter } from "next/router";

export default function Lobby() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    if (!playerName) {
      alert("Please enter your name");
      return;
    }

    try {
      const createResponse = await fetch("/api/room/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (createResponse.ok) {
        const { roomId, fastestFingerIndexes } = await createResponse.json();
        localStorage.setItem(
          `room_${roomId}_indexes`,
          JSON.stringify(fastestFingerIndexes)
        );
        joinRoom(roomId); // Directly join the room after creation
      } else {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create a room: ${errorText}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create a room. Please try again.");
    }
  };

  const joinRoom = async (id) => {
    if (!playerName) {
      alert("Please enter your name before joining a room");
      return;
    }
    if (!id) {
      alert("Please enter a room ID");
      return;
    }

    try {
      const playerId = Date.now().toString();
      const response = await fetch("/api/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: id,
          player: { id: playerId, name: playerName },
        }),
      });

      if (response.ok) {
        localStorage.setItem("playerId", playerId);
        router.push(`/game/${id}`); // Navigate to the game room upon successful join
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to join the room: ${errorText}`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert(
        "Failed to join the room. It might be full or no longer available."
      );
    }
  };

  // Function to answer a question
  const answerQuestion = async (answer) => {
    try {
      const response = await fetch("/api/room/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          playerId: playerName, // Assuming playerName can serve as unique playerId here
          answer,
          timeTaken: Date.now(), // Capture response time
        }),
      });

      if (response.ok) {
        const { nextQuestion } = await response.json();
        if (nextQuestion) {
          // Handle navigating to next question or game progress
          // You may redirect to a new API endpoint or handle this directly in your frontend
          console.log("Next question:", nextQuestion);
        } else {
          // Handle end of game or other logic
          console.log("Game completed");
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to submit answer: ${errorText}`);
      }
    } catch (error) {
      console.error("Error answering question:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  return (
    <div>
      <h1>Game Lobby</h1>
      <div>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <button onClick={createRoom}>Create New Room</button>
      </div>
      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
        />
        <button onClick={() => joinRoom(roomId)}>Join Room</button>
      </div>
    </div>
  );
}
