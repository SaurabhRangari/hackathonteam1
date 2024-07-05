// pages/api/room/[action].js
import { createRoom, joinRoom, leaveRoom, getRoomStatus, setRoomStatus, getRooms } from '../../../utils/roomManager';


export default function handler(req, res) {
    const { action } = req.query;
    const { roomId, player, playerId, status } = req.body;
  switch (action) {
    case 'create':
        const newRoomId = createRoom();
        res.status(200).json({ roomId: newRoomId });
        break;
    case "join":
      const joined = joinRoom(roomId, player);
      res.status(joined ? 200 : 400).json({ success: joined });
      break;
    case "leave":
      leaveRoom(roomId, playerId);
      res.status(200).json({ success: true });
      break;
    case "list":
      const roomList = getRooms();
      res.status(200).json(roomList);
      break;
    case "status":
      if (req.method === "GET") {
        const status = getRoomStatus(roomId);
        res.status(200).json({ status });
      } else if (req.method === "POST") {
        setRoomStatus(roomId, status);
        res.status(200).json({ success: true });
      }
      break;
    default:
      res.status(400).json({ error: "Invalid action" });
  }
}
