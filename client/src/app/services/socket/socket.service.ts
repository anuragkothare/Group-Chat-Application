import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatRoom } from '../../Models/Chat-Room'



@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private server_url = 'http://localhost:3000';
  private socket;
  private allRooms: ChatRoom[];

  constructor(private route: Router) {
      this.socket = io(this.server_url)
   }

   public verifyUser = () => {
      this.socket.on('verifyUser', (data) => {
        let authToken = localStorage.getItem('authToken')
        this.socket.emit('set-user', authToken);

        // Check for authentication error and route to login page if authentication fails
        this.socket.on('auth-error', (data)=>{
          console.log(data);
          // Clear auth token from local storage
          localStorage.removeItem('authToken')
          // route to login page
          this.route.navigate(['/login'])

        });
      })
   }

   // Get all Active Rooms
   public getAllRooms(): Observable<ChatRoom[]> {
      return new Observable<ChatRoom[]>(observer => {
        this.socket.on('active-rooms', (chatRoomArray: ChatRoom[]) => {
            // for(var room of data) {
            //   observer.next(room);
            // }
            observer.next(chatRoomArray);
        })
      })
   }

   // Create chat-room
   public createRoom(roomName: String) {
     var roomObject = {};
     roomObject['roomName'] = roomName;
     this.socket.emit('create-room', roomObject);
   }

   // Join Room
   public joinRoom(roomId: String, callback: Function) {
     var roomObject = {};
     roomObject['roomId'] = roomId;
     this.socket.emit('join-room', roomObject, callback);
   }



}
