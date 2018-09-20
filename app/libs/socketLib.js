/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
const ChatModel = mongoose.model('Chat');
const ChatRoom = mongoose.model('ChatRoom');

let setServer = (server) => {

    let allOnlineUsers = []
    let allRooms = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection',(socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");  

        // code to verify the user and make him online
        socket.on('set-user',(authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else{

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    console.log("Token Decoded: "+ JSON.stringify(currentUser))
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    socket.userName = currentUser.firstName
                    // Save socket.name TODO
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);


                    let userObj = {userId:currentUser.userId,fullName:fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)

                    // setting room name
                    socket.room = 'edChat'
                    // joining chat-group room.
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
                }
            })
          
        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
            socket.leave(socket.room)

        }) // end of on disconnect

        // Listeneing Event New-Messsage after checking the the roomId is present in the allRoooms array
        socket.on('New-Message', (message) => {
            if(socket.roomId && allRooms.inculdes(socketId.roomId)) {
                // var index = this.allRooms.indexOf(socketId.roomId)
                // if(index !== -1) array.splice(index, 1)
                io.in(socket.roomId).emit('Send-Message', {
                    data: message.data
                })
            }
              
        })

        
        // Deleting room event listener
        socket.on('delete-room', (data) => {
            var roomList = allRooms.map((room) => {return room.roomId})
            if(roomList.includes(data.roomId)) {
                var roomIndex = roomList.indexOf(data.roomId)
                var roomDel = allRooms[roomIndex]
                if(socket.userId === roomDel.admin) {
                    allRooms.splice(roomIndex,1)
                }
            }
            socket.emit('active-rooms', allRooms)
        })
        
        // Joining the room
       socket.on('join-room', (data, callback) => {  

        let activeRooms = allRooms.map(function(room) { return room.roomId; });
        if(activeRooms.includes(data.roomId)) {
            // Checking that user is present already in other room.
            if(socket.currentRoom) {
                socket.leave(socket.currentRoom)
            }

            socket.currentRoom=data.roomId;
            socket.join(socket.currentRoom,()=>{
                console.log('Joining Room.......')  
                console.log('joined room ' + socket.currentRoom);
                console.log(data.text)
                console.log(socket.currentRoom)
                //console.log(myIo.rooms)
                let rooms = Object.keys(socket.rooms);
                // console.log(rooms); // [ <socket.id>, 'room 237' ]
                var chatMessages = []
                ChatModel.find({ 'chatRoom': socket.currentRoom }, (err,messages) => {
                    if(err) {
                        callback(err,null)
                    }
                    callback(null,messages)
                }) 
                
                io.to(socket.currentRoom).emit('user-add', data);
            });
        }        
    });//end join a room

        // Leaving Room Event
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId)
            delete socket.roomId
        })

        // disable room by only Room Admin
        socket.on('disable-room', (data) => {
            var roomIds = allRooms.map((room) => {return room.roomId})
            var index = roomIds.indexOf(data.roomId)
            if(index>=0) {
                var roomSelect = allRooms[index]
                if(socket.userId === roomSelect.admin) {
                    roomSelect.isActive = false
                }
                console.log('Room Disabled by Admin')
            }
        })

        // enable room by only Room Admin
        socket.on('enable-room', (data) => {
            var roomIds = allRooms.map((room) => {return room.roomId})
            var index = roomIds.indexOf(data.roomId)
            if(index>=0) {
                var roomSelect = allRooms[index]
                if(socket.userId === roomSelect.admin) {
                    roomSelect.isActive = true
                }
                console.log('Room Enabled by Admin')
            } 
        })

        socket.on('change-title', (data) => {
            var roomIds = allRooms.map((room) => {return room.roomId})
            var index = roomIds.indexOf(data.roomId)
            if(index>=0) {
                var roomSelect = allRooms[index]
                roomSelect.title = data.title
                console.log('Room Title changed')
            }
        })


        socket.on('create-room', (data) => {
            
            let listOfRoomNames = allRooms.map(function(room) { return room.roomName; });
            if(!listOfRoomNames.includes(data.roomName) ) {

                data['roomId'] = shortid.generate()
                if(socket.currentRoom) {
                    socket.leave(socket.currentRoom)
                }
                socket.currentRoom = data.roomId
                socket.join(socket.currentRoom)

                let roomObj = {
                    roomId: socket.currentRoom,
                    title: data.roomTitle,
                    roomName: data.roomName,
                    admin: socket.userId,
                    isActive: true
                }
                allRooms.push(roomObj)
                console.log('Room created with admin  ' + roomObj.admin)

                myIo.emit('active-rooms', allRooms)

                console.log(allRooms)

                // 
                // raise event to save to backend db 
                eventEmitter.emit('save-room', data)  
                
            }
        } 
        )

        socket.emit('active-rooms', allRooms)

        socket.on('chat-msg', (data) => {
            // TODO Check Room Valid
            if(socket.currentRoom) {
                var chatRooms = allRooms.map((room => {return room.roomId}))
                var ind = chatRooms.indexOf(socket.currentRoom)
                if(ind>=0 && allRooms[ind].isActive===true && data.text !== null) {
                    console.log("socket chat-msg called")
                    data['chatId'] = shortid.generate()
                    data['roomId'] = socket.currentRoom 
                    data['userId'] = socket.userId
                    data['userName'] = socket.userName
                    console.log(data.text);

                    setTimeout(function(){
                        eventEmitter.emit('save-chat', data);
                    },2000)
                    myIo.to(socket.currentRoom).emit('get-chat-msg',data)
                }
            }
            // event to save chat.
            

        });

        socket.on('typing', () => {
            if(socket.currentRoom) {
                socket.to(socket.currentRoom).emit('user-typing',socket.userName);
            }
           

        });
    });

}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {

    // let today = Date.now();

    let newChat = new ChatModel({

        chatId: data.chatId,
        senderName: data.userName,
        senderId: data.userId,
        message: data.text,
        chatRoom: data.roomId || ''

    });

    newChat.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.

module.exports = {
    setServer: setServer
}
