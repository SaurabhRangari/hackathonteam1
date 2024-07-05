// pages/api/room/[action].js

import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomStatus,
  setRoomStatus,
  getRooms,
  getRoomData,
  answerQuestion,
} from "../../../utils/roomManager";

export default function handler(req, res) {
  const { action } = req.query;

  switch (action) {
    case "create":
      if (req.method === "POST") {
        const newRoomId = createRoom();
        const roomData = getRoomData(newRoomId); // Ensure getRoomData exists and retrieves necessary data
        res.status(200).json({
          roomId: newRoomId,
          fastestFingerIndexes: roomData.fastestFingerIndexes,
        });
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    case "join":
      if (req.method === "POST") {
        const { roomId, player } = req.body;
        const joined = joinRoom(roomId, player);
        res.status(joined ? 200 : 400).json({ success: joined });
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    case "leave":
      if (req.method === "POST") {
        const { roomId, playerId } = req.body;
        leaveRoom(roomId, playerId);
        res.status(200).json({ success: true });
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    case "data":
      if (req.method === "GET") {
        const { roomId } = req.query;
        if (!roomId) {
          return res.status(400).json({ error: "Room ID is required" });
        }
        const data = getRoomData(roomId);
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ error: "Room not found" });
        }
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    case "status":
      if (req.method === "GET") {
        const { roomId } = req.query;
        if (!roomId) {
          return res.status(400).json({ error: "Room ID is required" });
        }
        const status = getRoomStatus(roomId);
        if (status === null) {
          return res.status(404).json({ error: "Room not found" });
        }
        res.status(200).json({ status });
      } else if (req.method === "POST") {
        const { roomId, status } = req.body;
        if (!roomId) {
          return res.status(400).json({ error: "Room ID is required" });
        }
        setRoomStatus(roomId, status);
        res.status(200).json({ success: true });
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    case "answer":
      if (req.method === "POST") {
        const { roomId, playerId, answer, timeTaken } = req.body;
        if (
          !roomId ||
          !playerId ||
          answer === undefined ||
          timeTaken === undefined
        ) {
          return res.status(400).json({ error: "Missing required parameters" });
        }

        const nextQuestion = answerQuestion(
          roomId,
          playerId,
          answer,
          timeTaken
        );
        if (nextQuestion) {
          // Handle navigating to next question or game progress
          // You may redirect to a new API endpoint or handle this directly in your frontend
          res.status(200).json({ nextQuestion });
        } else {
          // Handle end of game or other logic
          res.status(200).json({ message: "Game completed" });
        }
      } else {
        res.status(405).json({ error: "Method not allowed" });
      }
      break;

    default:
      res.status(400).json({ error: "Invalid action" });
  }
}
