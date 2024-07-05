import { rooms } from '../../../utils/roomManager';

export default function handler(req, res) {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  const room = rooms[roomId];

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.status(200).json({ players: room.players });
}