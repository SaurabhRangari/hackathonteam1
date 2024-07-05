// components/Lobby.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch available rooms
    fetchRooms();
    // Set up interval to refresh room list
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    // Implement API call to fetch available rooms
    // Update the 'rooms' state
  };

  const createRoom = async () => {
    const response = await fetch('/api/room/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: newRoomName }),
    });
    if (response.ok) {
      router.push(`/game/${newRoomName}`);
    }
  };

  const joinRoom = async (roomId) => {
    const response = await fetch('/api/room/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, player: { id: 'uniquePlayerId', name: 'PlayerName' } }),
    });
    if (response.ok) {
      router.push(`/game/${roomId}`);
    }
  };

  return (
    <div>
      <h1>Game Lobby</h1>
      <div>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} ({room.players}/{room.maxPlayers})
            <button onClick={() => joinRoom(room.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}