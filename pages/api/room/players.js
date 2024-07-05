// pages/api/room/players.js

import { rooms } from '../../../utils/roomManager';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Return the list of players in the room
  res.status(200).json({ players: room.players });
}