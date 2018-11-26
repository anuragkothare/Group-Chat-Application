'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let chatRoomSchema = new Schema({
  chatRoomId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  chatRoomName: {
    type: String,
    default: ''
  },
  adminId: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  },
  
  createdOn :{
    type:Date,
    default:""
  },
})


mongoose.model('ChatRoom', chatRoomSchema);