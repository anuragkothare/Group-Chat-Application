// connecting with sockets.
const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkY5b1MtMS1jMSIsImlhdCI6MTUzNjE2NDYzMTg1OSwiZXhwIjoxNTM2MjUxMDMxLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZHdpc29yQ2hhdCIsImRhdGEiOnsibW9iaWxlTnVtYmVyIjo4MzU5OTkwOTAxLCJlbWFpbCI6ImFudXJhZ0B0ZXN0LmNvbSIsImxhc3ROYW1lIjoiS290aGFyZSIsImZpcnN0TmFtZSI6IkFudXJhZyJ9fQ.QbwvGD3zy2qauwKyKxUo4ELSbXn2qHQLKcQj6Cl91oM"
const userId = ""

let chatMessage = {
  createdOn: Date.now(),
  receiverId: 'SJ-iectqM',//putting user2's id here 
  receiverName: "Aditya Kumar",
  senderId: userId,
  senderName: "Mr Xyz"
}

let chatSocket = () => {

  socket.on('verifyUser', (data) => {

    console.log("socket trying to verify user");

    socket.emit("set-user", authToken);

    socket.emit('New-Message', {
      data: "Hi This is Evolution"
    })

  });

  socket.on(userId, (data) => {

    console.log("you received a message from "+data.senderName)
    console.log(data.message)

  });

  socket.emit('chat-msg', {
    text: "I am a wierdo"
  })

  socket.emit('create-room', {
    roomName: 'Dante',
    roomTitle: ''
  })

  socket.emit('join-room', {
    roomId: 'eitFia579',
    text: "Hi have joined suceessfully"
  }, function (error,data) {
    for(var i of data) {
      console.log(i.message)
    }
  })
 

  socket.emit('disable-room', {
    roomId:'pp',
    admin: ''
  })

  socket.emit('enable-room', {
    roomId:'',
    admin: ''
  })

  socket.emit('change-title', {
    roomId: '',
    title: ''
  })

  socket.on('user-add', (data) => {
    console.log(data.text)
  })

  socket.on('get-chat-msg', (data) => {
    console.log(data.text)
  })

  socket.emit('delete-room', {
    roomId: '',
  })



  

  socket.on("online-user-list", (data) => {

    console.log("Online user list is updated. some user can online or went offline")
    console.log(data)

  });

  socket.on("user-typing", (data) => {

    console.log(data+" is typing")
    
    
  });

  socket.on('active-rooms', (data) => {
    for(var room of data) {
      console.log(room.roomName)
    }
  })


  socket.on("Send-Message", (message) => {
    console.log(message.data)
  })

  $("#send").on('click', function () {

    let messageText = $("#messageToSend").val()
    chatMessage.message = messageText;
    socket.emit("chat-msg",chatMessage)

  })

  $("#messageToSend").on('keypress', function () {

    socket.emit("typing")

  })

}// end chat socket function

chatSocket();
