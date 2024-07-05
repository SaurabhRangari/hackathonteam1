// components/GameRoom.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import questionsData from '../config/fastestFingerFirst.json';
import FastestFingerFirst from './FastestFingerFirst';

export default function GameRoom() {
  const [roomStatus, setRoomStatus] = useState(null);
  const [players, setPlayers] = useState([]);
  const [fastestFingerQuestions, setFastestFingerQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState();
  const router = useRouter();
  const { roomId } = router.query;

  console.log(currentPlayerId)

  useEffect(() => {
  setCurrentPlayerId(localStorage.getItem("playerId"))

    if (roomId) {
      fetchRoomData();
      const interval = setInterval(fetchRoomData, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    if (roomId) {
      try {
        const response = await fetch(`/api/room/data?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setRoomStatus(data.status);
          setPlayers(data.players);
          // Assuming the current player's ID is provided in the response
          const playerId = currentPlayerId;
          console.log(playerId)

          if (data.players[0].id === playerId) {
            setIsRoomCreator(true);
          }

          // Fetch fastest finger questions
          const indexes = JSON.parse(localStorage.getItem(`room_${roomId}_indexes`)) || data.fastestFingerIndexes;
          const questions = indexes.map(index => questionsData[index]);
          setFastestFingerQuestions(questions);
        } else {
          console.error("Failed to fetch room data");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const startGame = async () => {
    // if (!isRoomCreator) return;
console.log(roomId)
    try {
      const response = await fetch(`/api/room/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, status: "playing" }),
      });

      setRoomStatus("playing");
      if (response.ok) {
      } else {
        console.error("Failed to start game");
      }
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const leaveRoom = async () => {
    try {
      await fetch("/api/room/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerId: currentPlayerId }),
      });
      router.push("/");
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (roomStatus === "waiting") {
    return (
      <div>
        <h1>Room: {roomId}</h1>
        <p>Share this Room ID with your friends: {roomId}</p>
        <p>Players: {players.length}/16</p>
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        {(
          <button onClick={startGame}>Start Game</button>
        )}
        <button onClick={leaveRoom}>Leave Room</button>
        <p>Fastest Finger Questions: {fastestFingerQuestions.length}</p>
      </div>
    );
  } else if (roomStatus === "playing") {
    return (
      <FastestFingerFirst 
        questions={fastestFingerQuestions} 
        playerId={currentPlayerId}
        roomId={roomId} 
        onComplete={() => setRoomStatus('completed')}
      />
    );
  }

  return <div>Error: Invalid room status (Status: {roomStatus})</div>;
}
