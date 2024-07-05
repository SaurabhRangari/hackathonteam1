// components/GameRoom.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function GameRoom() {
  const [roomStatus, setRoomStatus] = useState("waiting");
  const [players, setPlayers] = useState([]);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (roomId) {
      fetchRoomStatus();
      fetchPlayers();
      const statusInterval = setInterval(fetchRoomStatus, 5000);
      const playersInterval = setInterval(fetchPlayers, 5000);
      return () => {
        clearInterval(statusInterval);
        clearInterval(playersInterval);
      };
    }
  }, [roomId]);

  const fetchRoomStatus = async () => {
    const response = await fetch(`/api/room/status?roomId=${roomId}`);
    if (response.ok) {
      const data = await response.json();
      setRoomStatus(data.status);
    }
  };

  const fetchPlayers = async () => {
    if (roomId) {
      const response = await fetch(`/api/room/players?roomId=${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      } else {
        console.error("Failed to fetch players");
        // Optionally, handle the error (e.g., show an error message to the user)
      }
    }
  };

  const startGame = async () => {
    await fetch("/api/room/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, status: "playing" }),
    });
    setRoomStatus("playing");
  };

  const leaveRoom = async () => {
    const playerId = localStorage.getItem("playerId"); // Assume we store playerId in localStorage when joining
    await fetch("/api/room/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, playerId }),
    });
    router.push("/");
  };

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
        {players.length >= 2 && <button onClick={startGame}>Start Game</button>}
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
    );
  } else if (roomStatus === "playing") {
    return <div>Game in progress...</div>;
  }

  return <div>Loading...</div>;
}
