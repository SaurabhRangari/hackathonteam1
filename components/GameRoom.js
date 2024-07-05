// components/GameRoom.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function GameRoom() {
  const [roomStatus, setRoomStatus] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    console.log("roomId:", roomId);
    if (roomId) {
      fetchRoomData();
      const interval = setInterval(fetchRoomData, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    console.log("Fetching room data for roomId:", roomId);
    if (roomId) {
      try {
        const [statusResponse, playersResponse] = await Promise.all([
          fetch(`/api/room/status?roomId=${roomId}`),
          fetch(`/api/room/players?roomId=${roomId}`)
        ]);
        console.log("Status response:", statusResponse);
        console.log("Players response:", playersResponse);

        if (statusResponse.ok && playersResponse.ok) {
          const statusData = await statusResponse.json();
          const playersData = await playersResponse.json();
          console.log("Status data:", statusData);
          console.log("Players data:", playersData);

          setRoomStatus(statusData.status);
          setPlayers(playersData.players);
          setError(null);
        } else {
          console.error("Failed to fetch room data");
          setError("Failed to fetch room data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("An error occurred while fetching room data. Please try again.");
      } finally {
        setLoading(false);
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
    const playerId = localStorage.getItem("playerId");
    await fetch("/api/room/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, playerId }),
    });
    router.push("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
        {players.length >= 2 && <button onClick={startGame}>Start Game</button>}
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
    );
  } else if (roomStatus === "playing") {
    return <div>Game in progress...</div>;
  }

  return <div>Error: Invalid room status (Status: {roomStatus})</div>;
}