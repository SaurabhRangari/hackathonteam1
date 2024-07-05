// components/Lobby.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Lobby() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = async () => {
    if (!playerName) {
      alert('Please enter your name');
      return;
    }
    const createResponse = await fetch('/api/room/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (createResponse.ok) {
      const { roomId } = await createResponse.json();
      joinRoom(roomId);
    } else {
      alert('Failed to create a room. Please try again.');
    }
  };

  const joinRoom = async (id) => {
    if (!playerName) {
      alert('Please enter your name before joining a room');
      return;
    }
    if (!id) {
      alert('Please enter a room ID');
      return;
    }
    const response = await fetch('/api/room/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: id, player: { id: Date.now().toString(), name: playerName } }),
    });
    if (response.ok) {
      router.push(`/game/${id}`);
    } else {
      alert('Failed to join the room. It might be full or no longer available.');
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