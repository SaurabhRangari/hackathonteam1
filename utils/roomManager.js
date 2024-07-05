const crypto = require('crypto');

const rooms = {};

function generateRoomId() {
  return crypto.randomBytes(4).toString('hex');
}

function createRoom() {
    const roomId = generateRoomId();
    rooms[roomId] = {
      players: [],
      maxPlayers: 16,
      status: 'waiting',
    };
    return roomId;
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
    joinRoom, 
    leaveRoom, 
    getRoomStatus, 
    setRoomStatus,
    getRooms,
    rooms
  };