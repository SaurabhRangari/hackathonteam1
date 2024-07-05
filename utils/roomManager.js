// utils/roomManager.js
const rooms = {};
import questionsData from '../config/fastestFingerFirst.json'; // Adjust path as needed
const crypto = require("crypto");

function generateRoomId() {
  return crypto.randomBytes(4).toString('hex');
}

function createRoom() {
  const roomId = generateRoomId();
  const fastestFingerIndexes = generateRandomIndexes(questionsData.length);

  rooms[roomId] = {
    players: [],
    maxPlayers: 16,
    status: 'waiting',
    fastestFingerIndexes: fastestFingerIndexes,
    questions: questionsData, // Directly use questions data here
    playerAnswers: {},
    playerTimes: {},
    currentQuestionIndex: -1,
    // Add more game-specific fields here if needed
  };

  return roomId;
}

function generateRandomIndexes(length) {
  // Implement your logic to generate random indexes here
  // Example:
  const indexes = [];
  for (let i = 0; i < length; i++) {
    indexes.push(i);
  }
  return shuffleArray(indexes).slice(0, 4); // Adjust as per your game's requirements
}

function shuffleArray(array) {
  // Implement your shuffle logic here
  // Example:
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function answerQuestion(roomId, playerId, answer, timeTaken) {
  const room = rooms[roomId];
  const currentQuestion = room.questions[room.currentQuestionIndex];

  // Record player's answer and time taken
  if (!room.playerAnswers[playerId]) {
    room.playerAnswers[playerId] = [];
    room.playerTimes[playerId] = [];
  }
  room.playerAnswers[playerId].push(answer);
  room.playerTimes[playerId].push(timeTaken);

  const nextQuestion = getNextQuestion(roomId);
  return nextQuestion;
}

function getNextQuestion(roomId) {
  const room = rooms[roomId];
  const nextIndex = room.currentQuestionIndex + 1;
  if (nextIndex < room.questions.length) {
    room.currentQuestionIndex = nextIndex;
    return room.questions[nextIndex];
  }
  return null; // No more questions
}

function getRoomData(roomId) {
  return rooms[roomId];
}

function joinRoom(roomId, player) {
  if (
    rooms[roomId] &&
    rooms[roomId].players.length < rooms[roomId].maxPlayers
  ) {
    rooms[roomId].players.push(player);
    return true;
  }
  return false;
}

function leaveRoom(roomId, playerId) {
  if (rooms[roomId]) {
    rooms[roomId].players = rooms[roomId].players.filter(
      (p) => p.id !== playerId
    );
    if (rooms[roomId].players.length === 0) {
      delete rooms[roomId];
    }
  }
}

function getRoomStatus(roomId) {
  return rooms[roomId] ? rooms[roomId].status : null;
}

function setRoomStatus(roomId, status) {
  if (rooms[roomId]) {
    rooms[roomId].status = status;
  }
}

function getRooms() {
  return Object.entries(rooms).map(([id, room]) => ({
    id,
    name: id,
    players: room.players.length,
    maxPlayers: room.maxPlayers,
    status: room.status,
  }));
}

module.exports = {
  createRoom,
  answerQuestion,
  getNextQuestion,
  joinRoom,
  leaveRoom,
  getRoomStatus,
  setRoomStatus,
  getRooms,
  getRoomData,
  rooms,
};
