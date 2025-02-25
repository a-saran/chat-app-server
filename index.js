const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const {
  addUser,
  removeUsers,
  getUser,
  getUsersInRoom
} = require('./users');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app  = express();
const server  = http.createServer(app);
const io = socketio(server);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

io.on('connection', (socket) => {
  console.log('new socket connected')

  socket.on('join', ({name, room}, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room }) 
    if (error) {
      callback(error)
    }
 

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`})

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

    callback();
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('message', {user: user.name, text: message });

    callback();
  })

  socket.on('disconnect', () => {
    const user = removeUsers(socket.id)

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left`});
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
})

app.use(router)

server.listen(PORT, () => console.log(`server is listening in PORT: ${PORT}`))