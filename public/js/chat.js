let socket = io();

function scrolltobuttom(){ // scrolla automatiskt.
  let messages = document.querySelector('#messages').lastElementChild;
  messages.scrollIntoView();
}



socket.on ('connect', function(){
  console.log('You are Connected');
  let querys = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(querys).replace(/&/g, '","').replace(/\+/g, ' '
  ).replace(/=/g,'":"') + '"}');


  socket.emit('join', params, function (error){
    if (error){
      alert('Room name empty');
      window.location.href = '/';
    }else{
      console.log('Room Created');

    }
  })
});

socket.on ('disconnect', function (){
  // console.log('Server Disconnected');
  // let user = users.removeUser(socket.id)
  // if (user){
  //   io.to(users.room).emit('updateUsersList', users.getUserList(user.room));
  //   io.to(users.room).emit('newMessage', generateMessage('Admin', `${user} has left ${user.room}`))

});

socket.on('updateRooms', function(users){
  console.log(users);
})

socket.on('updateUsersList', function (users){
  console.log(users)
  let ol = document.createElement('ol');
  users.forEach(function(user){
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  })
  let userlist = document.querySelector('#users');
  userlist.innerHTML = "";
  userlist.appendChild(ol)
})

socket.on('newMessage', function (message){
const format =  moment(message.createdArt).format('LT');
  console.log('newMessage', message);
  let li = document.createElement('li');
  li.innerText = `${message.from} ${format}: ${message.text}`

  document.querySelector('#messages').appendChild(li); // visas på server
  scrolltobuttom();




});

// Test för admin
// socket.emit('createMessage', {
//   from:'Philip',
//   text:'ola senior'
// }, function (message){
//   console.log('This is', message);
// });

// message event

document.querySelector('.submit-btn').addEventListener('click', function(e) {
  e.preventDefault();
  console.log(e);
  socket.emit("createMessage", {
    text: document.querySelector('input[name="message"]').value
  }, function() {
    document.querySelector('input[name="message"]').value = ''; // Fungearar inte? Kolla senare
  })
})
