import { getRoomStatus } from '../../../utils/roomManager';

export default function handler(req, res) {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  const status = getRoomStatus(roomId);

  if (status === null) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.status(200).json({ status });
}