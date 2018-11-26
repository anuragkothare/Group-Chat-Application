const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    messageId: {type: String, unique: true, required: true},
    senderName: { type: String, default: '' },
    text: {type: String, default: ''},
    roomId: {type: String, default: ''} 
});

mongoose.model('Message', messageSchema);