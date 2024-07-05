// utils/roomManager.js
const rooms = {};

function createRoom(roomId) {
  rooms[roomId] = {
    players: [],
    maxPlayers: 16,
    status: 'waiting', // waiting, playing, finished
  };
  return rooms[roomId];
}

function joinRoom(roomId, player) {
  if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
    rooms[roomId].players.push(player);
    return true;
  }
  return false;
}

function leaveRoom(roomId, playerId) {
  if (rooms[roomId]) {
    rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== playerId);
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

module.exports = { createRoom, joinRoom, leaveRoom, getRoomStatus, setRoomStatus };