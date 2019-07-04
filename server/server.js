const path = require('path');
const express = require('express');
const http = require('http');  // server Socketio
const socketIO = require('socket.io');
const {realString} = require('./utils/realString');
const {Users} = require('./utils/users');
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000
const datajson = require('../data.json')
const fs = require('fs');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();


// read fs file









app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log(" a new user connected ")

  let data = fs.readFileSync('./data.json')
  let parseIt = JSON.parse(data);
  console.log(parseIt);

  // kallar på params i chat.js om den är en string eller inte en string.
  socket.on('join', (params, callback) =>{
    if (!realString(params.name) || !realString(params.room)){
    return callback('name is requierd.')

    }

    // console.log(socket.id);
    socket.join(params.room);
      users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
          io.to(params.room).emit('updateUsersList', users.getUserList(params.room))
            let user = users.getUser(socket.id);

              socket.emit('newMessage', generateMessage('Admin', `Welcome to Room ${params.room}`));
                io.to(users.room).emit('newMessage', generateMessage('Admin', `${users.name}`));


            callback();
  })


    socket.on('createMessage', (message, ) =>{
      let user = users.getUser(socket.id);
      let room = parseIt.rooms.filter(msg => msg === message)
      let newFile = room.push(message)
      fs.writeFile('data.json', JSON.stringify(newFile), (err) => {
        if (err) throw err;
        console.log("worked");
      })

      // console.log(room);
      // fs.writeFile('data.json', JSON.stringify(newFile))
      if(user && realString(message.text)){
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        console.log(room);
    }
  })

  app.get('/getallrooms', (req, res) => {
      let allRooms = [];
      data.Chatrooms.map(room => {
          let roomInfo = {
              id: room.id,
              roomName: room.roomName
          }
          allRooms.push(roomInfo)
      })
      return res.json(allRooms)
  })

  app.get('/chatroom/:id', (req, res) => {
      const id = req.params.id;
      console.log(data.Chatrooms)
      const singleRoom = data.Chatrooms.find(room => room.id === id)
      return res.json(singleRoom)
  })



  socket.on ('disconnect', () => {
    console.log('User Was Disconnected');
    let user = users.removeUser(socket.id)
    if (user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room}`))

    }



  })
})



server.listen(port, ()=>{
  console.log(`Server is up ${port}`);
})













console.log(__dirname + "/../public");
