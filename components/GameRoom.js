// components/GameRoom.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GameRoom() {
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [players, setPlayers] = useState([]);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (roomId) {
      fetchRoomStatus();
      fetchPlayers();
      // Set up intervals to refresh room status and player list
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
    // Implement API call to fetch players in the room
    // Update the 'players' state
  };

  const startGame = async () => {
    await fetch('/api/room/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, status: 'playing' }),
    });
    setRoomStatus('playing');
  };

  const leaveRoom = async () => {
    await fetch('/api/room/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerId: 'uniquePlayerId' }),
    });
    router.push('/');
  };

  if (roomStatus === 'waiting') {
    return (
      <div>
        <h1>Waiting Room: {roomId}</h1>
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
  } else if (roomStatus === 'playing') {
    return <div>Game in progress...</div>;
  }

  return <div>Loading...</div>;
}