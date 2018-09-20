// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkhHUG5HT2hTSyIsImlhdCI6MTUzNjE2NTE2MzU4MSwiZXhwIjoxNTM2MjUxNTYzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZHdpc29yQ2hhdCIsImRhdGEiOnsidXNlcklkIjoiRUpGRExvZmZiIiwibW9iaWxlTnVtYmVyIjo3ODk4OTk5OTksImVtYWlsIjoicmFtYW5AdGVzdC5jb20iLCJsYXN0TmFtZSI6Ikt1bWFyIiwiZmlyc3ROYW1lIjoiUmFtYW4ifX0.0DF2vCk7HuH6rkBhxpR_KP3h7ow2t-6mGkixsrS5Tzw"
const userId = ""

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'H1pOQGY9M',//putting user2's id here 
  receiverName: "Mr Xyz",
  senderId: userId,
  senderName: "Aditya Kumar"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

  });

  socket.emit('New-Message', {
    data: "Hi This is Evolution"
  })

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.on("user-typing", (data) => {
    console.log(data+" is typing")
    
  });

  socket.on('user-add', (data) => {
    console.log("user-add: " +data.text)
  })

  socket.emit('create-room', {
    roomName: 'swewe'
  })

  socket.emit('join-room', {
    roomId: 'eitFia579',
  })

  socket.emit('delete-room', {
    roomId: ''
  })

  socket.emit('join-room', {
    roomId: 'eitFia579',
    text: "Hi have joined suceessfully"
  })
  

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });

  socket.on("Send-Message", (message) => {
    console.log(message.data)
  })

  socket.on('notify', (data) => {
    console.log('You Joined')
    console.log(data.roomName + ' Room created')
  })

  socket.on('client-add', (data) => {
    console.log('data')
  })


  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing")

  })

  socket.on("user-typing", (data) => {
    console.log(data+" is typing")
  });



}// end chat socket function

chatSocket();
